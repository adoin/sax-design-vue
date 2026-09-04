import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import puppeteer from 'puppeteer'

const base = process.env.TABLE_AUDIT_BASE_URL ?? 'http://localhost:8080'
const url = `${base}/@fs/${process.cwd().replaceAll('\\', '/')}/play/table-audit/index.html`
const browser = await puppeteer.launch({ headless: true })
const report = { timestamp: new Date().toISOString(), scenarios: [] }
try {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.setViewport({ width: 1400, height: 800 })
  await page.goto(url, { waitUntil: 'networkidle2' })
  await page.waitForFunction(() => window.tableAudit)
  for (const generated of [false, true]) {
    const settings = {
      rows: generated ? 1_000_000 : 1000,
      columns: generated ? 100_000 : 30,
      generated,
      dynamic: true,
    }
    const last = settings.rows - 1
    const longColumn = settings.columns - 2
    const stages = []
    const sample = async (name) => {
      // Let ResizeObserver, Vue updates, and scroll anchoring settle together.
      await new Promise((resolve) => setTimeout(resolve, 180))
      const snapshot = await page.evaluate(() => window.tableAudit.inspect())
      assert(snapshot.rows > 0 && snapshot.rows < 40, `${name}: bounded rows`)
      assert(snapshot.headers < 16, `${name}: bounded columns`)
      assert(snapshot.caches.measuredElements < 40)
      assert(snapshot.caches.refCallbacks < 40)
      for (const row of snapshot.renderedRows) {
        for (const cell of row.cells) {
          assert(Math.abs(cell.top - row.top) < 1, `${name}: shared row top`)
          assert(
            Math.abs(cell.height - row.height) < 1,
            `${name}: shared row height`,
          )
        }
      }
      const row = snapshot.renderedRows.find((row) => row.index === last)
      assert(row, `${name}: target row remains rendered`)
      const result = {
        name,
        height: row.height,
        rows: snapshot.rows,
        headers: snapshot.headers,
        columns: row.cells.map((cell) => cell.column),
        sourceColumns: row.cells.map((cell) => cell.sourceColumn),
        maxCellTopError: Math.max(
          ...snapshot.renderedRows.flatMap((row) =>
            row.cells.map((cell) => Math.abs(cell.top - row.top)),
          ),
        ),
        maxCellHeightError: Math.max(
          ...snapshot.renderedRows.flatMap((row) =>
            row.cells.map((cell) => Math.abs(cell.height - row.height)),
          ),
        ),
        caches: snapshot.caches,
      }
      stages.push(result)
      return result
    }
    await page.evaluate((s) => window.tableAudit.mount(s), settings)
    await page.evaluate(
      ([row, col]) => window.tableAudit.jump(row, col),
      [last, longColumn],
    )
    const initial = await sample('initial')
    await page.evaluate(() => window.tableAudit.content(true))
    const grown = await sample('data-reference-growth')
    assert(grown.height > initial.height + 100)
    await page.evaluate((row) => window.tableAudit.jump(row, 1), last)
    const retained = await sample('horizontal-window-retains-maximum')
    assert(retained.height >= grown.height - 1)
    assert(
      !retained.columns.includes(longColumn),
      'long content really left the horizontal window',
    )
    await page.evaluate(
      ([row, col]) => window.tableAudit.jump(row, col),
      [last, longColumn],
    )
    await page.evaluate(
      (col) => window.tableAudit.layout({ [col]: 560 }),
      String(longColumn),
    )
    const widened = await sample('wider-column-remeasures')
    assert(widened.height < grown.height - 100)
    await page.evaluate(() => window.tableAudit.layout())
    const restored = await sample('width-restored')
    assert(restored.height >= grown.height - 1)
    await page.evaluate(
      (col) => window.tableAudit.layout({}, [{ key: col, hidden: true }]),
      String(longColumn),
    )
    const hidden = await sample('hidden-column-remeasures')
    assert(hidden.height < grown.height - 100)
    await page.evaluate(() => window.tableAudit.layout())
    await page.evaluate(
      ([row, col]) => window.tableAudit.jump(row, col),
      [last, longColumn],
    )
    const visible = await sample('shown-column-grows')
    assert(visible.height >= grown.height - 1)
    await page.evaluate(
      (col) => window.tableAudit.layout({}, [{ key: col, order: 1 }]),
      String(longColumn),
    )
    const reordered = await sample('reordered-column-invalidates-maximum')
    assert(!reordered.sourceColumns.includes(longColumn))
    assert(reordered.height < grown.height - 100)
    await page.evaluate(
      ([row, col]) => window.tableAudit.jump(row, col),
      [last, generated ? longColumn : String(longColumn)],
    )
    const relocated = await sample('reordered-column-grows-at-new-position')
    assert(relocated.height >= grown.height - 1)
    await page.evaluate(() => window.tableAudit.layout())
    await page.evaluate(
      ([row, col]) => window.tableAudit.jump(row, col),
      [last, longColumn],
    )
    await sample('order-restored')
    await page.evaluate(() => window.tableAudit.liveContent(false))
    const stale = await sample('in-place-shrink-retains-until-measure')
    assert(stale.height >= grown.height - 1)
    await page.evaluate(() => window.tableAudit.measure())
    const measured = await sample('explicit-measure-shrinks')
    assert(measured.height < grown.height - 100)
    await page.evaluate(() => window.tableAudit.liveContent(undefined))
    const liveGrowth = await sample('in-place-growth-observed')
    assert(liveGrowth.height >= grown.height - 1)
    await page.evaluate(() => window.tableAudit.content(false))
    const replaced = await sample('data-reference-shrink')
    assert(replaced.height < grown.height - 100)
    await page.evaluate(() => window.tableAudit.content(true))
    await sample('before-container-change')
    await page.evaluate((row) => window.tableAudit.jump(row, 1), last)
    await page.evaluate(() => window.tableAudit.viewport(720))
    const resized = await sample('container-width-invalidates-hidden-maximum')
    assert(resized.height < grown.height - 100)
    await page.evaluate(() => window.tableAudit.viewport(960))
    await page.evaluate(
      ([row, col]) => window.tableAudit.jump(row, col),
      [last, longColumn],
    )
    const revisited = await sample('revisit-long-column')
    assert(revisited.height >= grown.height - 1)
    await page.evaluate(() => window.tableAudit.unmount())
    assert.equal(await page.$$eval('#fixture *', (els) => els.length), 0)
    report.scenarios.push({ settings, stages })
    process.stdout.write(
      `${JSON.stringify({ generated, stages: stages.map(({ name, height }) => ({ name, height })) })}\n`,
    )
  }
  assert.deepEqual(errors, [])
  await writeFile(
    process.argv[2] ?? 'reports/table-measurements-browser.json',
    `${JSON.stringify(report, null, 2)}\n`,
  )
} finally {
  await browser.close()
}
