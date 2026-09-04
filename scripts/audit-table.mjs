import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import puppeteer from 'puppeteer'

// Run against the existing dev server, without the documentation's other demos.
const base = process.env.TABLE_AUDIT_BASE_URL ?? 'http://localhost:8080'
const fixture = `${base}/@fs/${process.cwd().replaceAll('\\', '/')}/play/table-audit/index.html`
const output = process.argv[2] ?? 'reports/table-runtime-audit.json'
const compact = ({ renderedRows, ...metrics }) => ({
  ...metrics,
  firstRow: renderedRows[0].index,
  lastRow: renderedRows.at(-1).index,
  lastRowHeight: renderedRows.at(-1).height,
  lastRowBottom: renderedRows.at(-1).top + renderedRows.at(-1).height,
  columns: renderedRows[0].cells.map(({ column }) => column),
  maxCellTopError: Math.max(
    ...renderedRows.flatMap((row) =>
      row.cells.map((cell) => Math.abs(cell.top - row.top)),
    ),
  ),
  maxCellHeightError: Math.max(
    ...renderedRows.flatMap((row) =>
      row.cells.map((cell) => Math.abs(cell.height - row.height)),
    ),
  ),
})
const browser = await puppeteer.launch({ headless: true })
const report = {
  timestamp: new Date().toISOString(),
  browser: await browser.version(),
  mode: 'VuePress dev, headless, 1100x800, one table',
  scenarios: [],
}
try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1100, height: 800 })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto(fixture, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => window.tableAudit, { timeout: 60000 })
  // Leave the first Vite transform/HMR cycle behind; font and dev connections
  // need not become globally idle to exercise the component.
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const cdp = await page.createCDPSession()
  const heap = async () => {
    await cdp.send('HeapProfiler.collectGarbage')
    return cdp.send('Runtime.getHeapUsage')
  }
  const checkWindow = (snapshot) => {
    assert(
      snapshot.rows > 0 && snapshot.rows <= 40,
      `row window: ${snapshot.rows}`,
    )
    assert(snapshot.headers <= 14, `column window: ${snapshot.headers}`)
    assert(snapshot.caches.measuredElements <= 40)
    assert(snapshot.caches.refCallbacks <= 40)
    for (const row of snapshot.renderedRows) {
      for (const cell of row.cells) {
        assert(Math.abs(cell.top - row.top) < 1, 'fixed/body row top')
        assert(Math.abs(cell.height - row.height) < 1, 'fixed/body row height')
      }
    }
  }
  await page.evaluate(() =>
    window.tableAudit.mount({
      rows: 30,
      columns: 10,
      dynamic: true,
      generated: true,
    }),
  )
  await page.evaluate(() => window.tableAudit.unmount())
  for (const settings of [
    { rows: 1000, columns: 30, dynamic: true, generated: false },
    { rows: 1_000_000, columns: 100_000, dynamic: false, generated: true },
    { rows: 1_000_000, columns: 100_000, dynamic: true, generated: true },
  ]) {
    const before = await heap()
    const initial = await page.evaluate(
      (s) => window.tableAudit.mount(s),
      settings,
    )
    checkWindow(initial)
    const mounted = await heap()
    const wheel = []
    await page.mouse.move(initial.scroll.x + 400, initial.scroll.top + 150)
    for (let index = 0; index < 30; index++) {
      const start = performance.now()
      await page.mouse.wheel({ deltaY: 160 })
      const snapshot = await page.evaluate(() =>
        window.tableAudit.settle().then(() => window.tableAudit.inspect()),
      )
      checkWindow(snapshot)
      wheel.push({ elapsedMs: performance.now() - start, ...snapshot })
    }
    assert(
      wheel.at(-1).renderedRows[0].index > initial.renderedRows[0].index,
      'wheel advances rows',
    )
    const last = await page.evaluate(
      (s) => window.tableAudit.jump(s.rows - 1, s.columns - 2),
      settings,
    )
    checkWindow(last)
    assert(
      last.renderedRows.some((row) => row.index === settings.rows - 1),
      'last row is mounted',
    )
    assert(
      last.renderedRows
        .at(-1)
        .cells.some((cell) => cell.column === settings.columns - 2),
      'last center column is mounted',
    )
    let content
    if (settings.generated && settings.dynamic) {
      const grow = await page.evaluate(() => window.tableAudit.content(true))
      const retained = await page.evaluate(
        (s) => window.tableAudit.jump(s.rows - 1, 1),
        settings,
      )
      const shrink = await page.evaluate(() => window.tableAudit.content(false))
      checkWindow(grow)
      checkWindow(retained)
      checkWindow(shrink)
      assert(
        grow.renderedRows.at(-1).height > last.renderedRows.at(-1).height,
        'content growth remeasures',
      )
      assert(
        shrink.renderedRows.at(-1).height < grow.renderedRows.at(-1).height,
        'content replacement invalidates maximum',
      )
      assert(
        retained.renderedRows.at(-1).height >= grow.renderedRows.at(-1).height,
        'horizontal window retains maximum height',
      )
      content = {
        grow: compact(grow),
        retained: compact(retained),
        shrink: compact(shrink),
      }
    }
    const visited = await heap()
    await page.evaluate(() => window.tableAudit.unmount())
    const after = await heap()
    report.scenarios.push({
      settings,
      before,
      mounted,
      visited,
      after,
      initial: compact(initial),
      wheel: wheel.map(compact),
      last: compact(last),
      content,
    })
    process.stdout.write(
      `${JSON.stringify({
        settings,
        mountMs: initial.mountMs,
        jumpMs: last.jumpMs,
        rows: last.rows,
        caches: last.caches,
        before,
        mounted,
        after,
      })}\n`,
    )
  }
  report.remounts = []
  for (let cycle = 0; cycle < 5; cycle++) {
    await page.evaluate(() =>
      window.tableAudit.mount({
        rows: 1_000_000,
        columns: 100_000,
        generated: true,
        dynamic: true,
      }),
    )
    await page.evaluate(() => window.tableAudit.jump(999_999, 99_998))
    await page.evaluate(() => window.tableAudit.unmount())
    assert.equal(
      await page.$$eval('#fixture *', (nodes) => nodes.length),
      0,
      'unmount removes rendered nodes',
    )
    report.remounts.push(await heap())
  }
  assert(
    report.remounts.at(-1).backingStorageSize -
      report.remounts[0].backingStorageSize <
      100_000,
    'height buffers do not accumulate across remounts',
  )
  assert(
    report.remounts.at(-1).usedSize - report.remounts[0].usedSize < 1_000_000,
    'table heaps do not accumulate across remounts',
  )
  assert.deepEqual(errors, [], 'browser errors')
  await mkdir(path.dirname(output), { recursive: true })
  await writeFile(output, `${JSON.stringify(report, null, 2)}\n`)
  process.stdout.write(`Saved ${output}\n`)
} finally {
  await browser.close()
}
