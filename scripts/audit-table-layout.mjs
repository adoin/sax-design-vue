import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import puppeteer from 'puppeteer'

const base = process.env.TABLE_AUDIT_BASE_URL ?? 'http://localhost:8080'
const url = `${base}/@fs/${process.cwd().replaceAll('\\', '/')}/play/table-audit/layout.html`
const browser = await puppeteer.launch({ headless: true })
const report = {
  timestamp: new Date().toISOString(),
  browser: await browser.version(),
  cases: [],
}
const pause = () => new Promise((resolve) => setTimeout(resolve, 350))
try {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.setViewport({ width: 1100, height: 1000 })
  await page.goto(url, { waitUntil: 'networkidle2' })
  await page.waitForFunction(() => window.tableLayoutAudit)
  const checkbox = async (index) => {
    await page.$$eval(
      '#fixture > div > * input[type=checkbox]',
      (inputs, index) => inputs[index].click(),
      index,
    )
    await pause()
  }
  const button = async (index) => {
    await page.$$eval(
      '#fixture .s-button',
      (buttons, index) => buttons[index].click(),
      index,
    )
    await pause()
  }
  const inspect = async (label) => {
    await pause()
    const state = await page.evaluate(() => {
      const root = document.querySelector('#fixture .s-table')
      const own = (selector) =>
        [...root.querySelectorAll(selector)].filter(
          (el) => el.closest('.s-table') === root,
        )
      const window = root.querySelector('.s-vl__window') ?? root
      const wr = window.getBoundingClientRect()
      const viewport = {
        left: wr.left,
        right: wr.left + window.clientWidth,
        top: wr.top,
        bottom: wr.top + window.clientHeight,
      }
      const rows = own('.s-table__data-row').filter(
        (el) => !el.closest('[data-merge-primary]'),
      )
      const cells = rows.flatMap((row) =>
        [...row.children].filter((el) => el.matches('.s-table__data-cell')),
      )
      const alignment = cells.map((cell) => {
        const rect = cell.getBoundingClientRect(),
          row = cell.parentElement.getBoundingClientRect()
        return {
          top: Math.abs(rect.top - row.top),
          height: Math.abs(rect.height - row.height),
        }
      })
      const fixed = cells
        .filter((cell) => cell.classList.contains('is-fixed-column'))
        .map((cell) => {
          const r = cell.getBoundingClientRect(),
            css = getComputedStyle(cell)
          const top = Math.max(r.top, viewport.top),
            bottom = Math.min(r.bottom, viewport.bottom)
          const x = (r.left + r.right) / 2,
            y = (top + bottom) / 2
          const hit =
            bottom - top > 2 && x >= viewport.left && x < viewport.right
              ? cell.contains(document.elementFromPoint(x, y))
              : null
          return {
            side: cell.classList.contains('is-fixed-left') ? 'left' : 'right',
            error: cell.classList.contains('is-fixed-left')
              ? Math.abs(r.left - viewport.left)
              : Math.abs(r.right - viewport.right),
            background: css.backgroundColor,
            hit,
          }
        })
      const fragments = own('.s-table__merge-fragment').map((el) => {
        const r = el.getBoundingClientRect()
        return {
          key: el.dataset.mergeRegion,
          primary: Object.hasOwn(el.dataset, 'mergePrimary'),
          left: r.left,
          right: r.right,
          top: r.top,
          bottom: r.bottom,
        }
      })
      const footer = own('.s-table__footer-cell').map((cell) => {
        const index = cell.dataset.columnIndex
        const header = own(
          '.s-table__data-head-cell:not(.is-group-header)',
        ).find((el) => el.dataset.columnIndex === index)
        const body = cells.find((el) => el.dataset.columnIndex === index)
        const r = cell.getBoundingClientRect(),
          hr = header?.getBoundingClientRect(),
          br = body?.getBoundingClientRect()
        return {
          index,
          headerError: hr ? Math.abs(r.left - hr.left) : null,
          bodyError: br ? Math.abs(r.left - br.left) : null,
        }
      })
      const activeCell = own('.is-active-cell')[0]
      const active = activeCell?.getBoundingClientRect()
      return {
        viewport,
        rows: rows.length,
        rowIndices: rows.map((el) => Number(el.dataset.tableRowIndex)),
        rowKeys: rows.map((el) => el.dataset.rowKey),
        activeVisible: active
          ? active.height > viewport.bottom - viewport.top
            ? active.top <= viewport.top + 1 &&
              active.bottom >= viewport.bottom - 1
            : active.top >= viewport.top - 1 &&
              active.bottom <= viewport.bottom + 1
          : null,
        activeFocused: Boolean(
          activeCell && document.activeElement === activeCell,
        ),
        activeBounds: active
          ? { top: active.top, bottom: active.bottom }
          : null,
        headers: own('.s-table__data-head-cell').length,
        alignment,
        fixed,
        fragments,
        footer,
        details: own('.s-table__detail-cell').map((el) => {
          const r = el.getBoundingClientRect()
          return { left: r.left, right: r.right, height: r.height }
        }),
        groups: own('[data-table-group-band]').length,
      }
    })
    assert(state.rows < 40, `${label}: row window`)
    assert(state.headers < 45, `${label}: column window`)
    for (const a of state.alignment)
      assert(
        a.top < 1 && a.height < 1,
        `${label}: shared row geometry ${JSON.stringify(a)}`,
      )
    for (const fixed of state.fixed) {
      assert(fixed.error < 2, `${label}: fixed edge ${JSON.stringify(fixed)}`)
      assert.notEqual(fixed.hit, false, `${label}: fixed cell hit testing`)
    }
    for (const cell of state.footer) {
      assert(
        cell.headerError != null && cell.headerError < 2,
        `${label}: footer/header alignment ${JSON.stringify(cell)}`,
      )
      assert(
        cell.bodyError == null || cell.bodyError < 2,
        `${label}: footer/body alignment ${JSON.stringify(cell)}`,
      )
    }
    for (const fragment of state.fragments)
      assert(
        fragment.left >= state.viewport.left - 1 &&
          fragment.right <= state.viewport.right + 1,
        `${label}: merge clipping`,
      )
    const owners = state.fragments.filter((fragment) => fragment.primary)
    assert.equal(
      new Set(owners.map((fragment) => fragment.key)).size,
      owners.length,
      `${label}: one owner per merge region`,
    )
    return { label, ...state }
  }
  for (const width of [960, 480])
    for (const dark of [false, true]) {
      for (const name of [
        'details',
        'details-source',
        'footer-data',
        'footer-source',
        'merging-source',
        'grouping-source',
        'grouping',
        'grouped-source',
      ]) {
        await page.evaluate(
          ({ name, dark, width }) =>
            window.tableLayoutAudit.mount(name, dark, width),
          { name, dark, width },
        )
        await pause()
        const stages = []
        if (name === 'details') await checkbox(0)
        if (name === 'footer-data') await checkbox(1)
        stages.push(await inspect('initial'))
        if (name === 'grouping') {
          await checkbox(0)
          stages.push(await inspect('virtual-groups'))
          await button(0)
          stages.push(await inspect('expanded-groups'))
          await page.evaluate(() =>
            window.tableLayoutAudit.table().scrollToColumn(3, 'end'),
          )
          stages.push(await inspect('group-horizontal-end'))
        }
        if (name.endsWith('-source')) {
          await button(name === 'merging-source' ? 1 : 0)
          stages.push(await inspect('last-region'))
          if (name !== 'merging-source')
            assert(
              stages
                .at(-1)
                .rowKeys.includes(
                  name === 'details-source' ? 'row-999999' : '999999',
                ),
              `${name}: last row`,
            )
          if (name === 'grouping-source') {
            assert.equal(
              stages.at(-1).activeVisible,
              true,
              'initial measured target visible',
            )
            assert.equal(
              stages.at(-1).activeFocused,
              true,
              'initial measured target focused',
            )
            // Exercise distant jumps in both directions with the same measured cache.
            for (const row of [875_000, 937_500, 999_999]) {
              assert.equal(
                await page.evaluate(
                  (row) =>
                    window.tableLayoutAudit.table().setActiveCell(row, 99_998),
                  row,
                ),
                true,
              )
              stages.push(await inspect(`active-row-${row}`))
              assert.equal(
                stages.at(-1).activeVisible,
                true,
                `active row ${row} visible`,
              )
              assert.equal(
                stages.at(-1).activeFocused,
                true,
                `active row ${row} focused`,
              )
            }
          }
        }
        await page.evaluate(() =>
          window.tableLayoutAudit.table().scrollToColumn(1, 'start'),
        )
        stages.push(await inspect('horizontal-start'))
        if (name === 'details-source') {
          await checkbox(0)
          stages.push(await inspect('shorter-details'))
          await button(1)
          stages.push(await inspect('closed-details'))
        }
        if (name === 'details') {
          await checkbox(1)
          stages.push(await inspect('removed-nested-table'))
        }
        if (name === 'footer-source') {
          await checkbox(0)
          stages.push(await inspect('empty-body-footer'))
          assert.equal(stages.at(-1).rows, 0)
          assert(stages.at(-1).footer.length > 0)
        }
        if (name === 'merging-source') {
          await checkbox(1)
          stages.push(await inspect('multiline-merged-content'))
          assert(stages.at(-1).fragments.length > 0)
          await checkbox(0)
          stages.push(await inspect('merges-disabled'))
          assert.equal(stages.at(-1).fragments.length, 0)
        }
        if (name === 'grouping-source') {
          await button(1)
          stages.push(await inspect('collapsed-groups'))
          assert.equal(stages.at(-1).rows, 0)
        }
        await page.screenshot({
          path: join(tmpdir(), `sax-layout-${name}-${width}-${dark}.png`),
        })
        await page.evaluate(() => window.tableLayoutAudit.unmount())
        assert.equal(await page.$$eval('#fixture *', (els) => els.length), 0)
        report.cases.push({ name, width, dark, stages })
        process.stdout.write(`${name} ${width} ${dark}: passed\n`)
      }
    }
  assert.deepEqual(errors, [])
  await writeFile(
    process.argv[2] ?? 'reports/table-layout-browser.json',
    `${JSON.stringify(report, null, 2)}\n`,
  )
} finally {
  await browser.close()
}
