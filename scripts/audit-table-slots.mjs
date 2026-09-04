import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({ headless: true })
const cases = []
try {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  const base = process.env.TABLE_AUDIT_BASE_URL ?? 'http://localhost:8080'
  await page.goto(
    `${base}/@fs/${process.cwd().replaceAll('\\', '/')}/play/table-audit/slots.html`,
    { waitUntil: 'networkidle2' },
  )
  await page.waitForFunction(() => window.tableSlotAudit)
  for (const mode of ['select', 'grid'])
    for (const width of [1440, 390])
      for (const dark of [false, true]) {
        await page.setViewport({ width, height: 900 })
        await page.evaluate(
          ({ mode, dark }) => window.tableSlotAudit.mount(mode, dark),
          { mode, dark },
        )
        await page.waitForSelector('.s-table__data-row')
        await page.$eval('.s-table .s-vl__window', (el) => {
          el.scrollTop = 500
        })
        await page.evaluate(() => window.tableSlotAudit.change(0))
        const scrollTop = await page.$eval('.s-table .s-vl__window', (el) => {
          el.dataset.auditWindow = 'original'
          return el.scrollTop
        })
        assert(scrollTop > 0)
        const initial = await page.$eval('.s-table', (el) => {
          el.dataset.auditInstance = 'original'
          return el.querySelectorAll('.s-table__data-row').length
        })
        assert(initial > 0 && initial < 40)
        const stages = []
        for (const stage of [1, 2, 3]) {
          await page.evaluate(
            (stage) => window.tableSlotAudit.change(stage),
            stage,
          )
          const state = await page.evaluate(() => {
            const table = document.querySelector('.s-table')
            return {
              rows: table.querySelectorAll('.s-table__data-row').length,
              original: table.dataset.auditInstance,
              window: table.querySelector('.s-vl__window').dataset.auditWindow,
              scrollTop: table.querySelector('.s-vl__window').scrollTop,
              cells: [...table.querySelectorAll('.audit-cell')].map((el) => ({
                tag: el.tagName,
                text: el.textContent,
                row: el.dataset.row,
                column: el.dataset.column,
              })),
              heading: table.querySelector('.audit-heading')?.textContent,
              prefix: document.querySelector('.s-table-select__prefix')
                ?.textContent,
              suffix: document.querySelector('.s-table-select__suffix')
                ?.textContent,
              icons: document.querySelectorAll(
                '.s-table-select__prefix svg,.s-table-select__suffix svg',
              ).length,
              query: document.querySelector('.audit-query')?.textContent,
              queryActions: document.querySelector('.audit-query-actions')
                ?.textContent,
              fallbackActions: document.querySelectorAll(
                '.s-table-grid__query-actions button',
              ).length,
              clear: !!document.querySelector('.s-table-select__clear'),
              arrow: !!document.querySelector('.s-table-select__action'),
            }
          })
          assert.equal(state.original, 'original', 'table was not remounted')
          assert.equal(
            state.window,
            'original',
            'scroll viewport was not remounted',
          )
          assert(
            Math.abs(state.scrollTop - scrollTop) < 1,
            'slot update retained scroll position',
          )
          assert(state.rows > 0 && state.rows < 40)
          if (stage < 3) {
            assert.equal(state.cells.length, state.rows)
            for (const cell of state.cells) {
              assert.equal(cell.text, `${stage}:Person ${cell.row}`)
              assert.equal(cell.column, '0')
              assert.equal(cell.tag, stage === 1 ? 'B' : 'I')
            }
          } else assert.equal(state.cells.length, 0)
          assert.equal(state.heading, stage === 1 ? 'Person:0' : undefined)
          if (mode === 'select') {
            assert(state.clear && state.arrow)
            if (stage === 1) {
              assert.equal(state.prefix, 'P')
              assert.equal(state.suffix, 'true:0')
            }
            if (stage === 2) {
              assert.equal(state.prefix, undefined)
              assert.equal(state.suffix, undefined)
            }
            if (stage === 3) assert.equal(state.icons, 2)
          } else {
            assert.equal(state.query, stage === 1 ? 'initial' : undefined)
            assert.equal(state.queryActions, stage === 1 ? 'false' : undefined)
            if (stage > 1) assert.equal(state.fallbackActions, 2)
          }
          stages.push({ stage, ...state })
        }
        await page.evaluate(() => window.tableSlotAudit.unmount())
        await page.waitForFunction(() => !document.querySelector('.s-table'))
        cases.push({ mode, width, dark, initial, stages })
        process.stdout.write(`${mode} ${width} ${dark}: passed\n`)
      }
  assert.deepEqual(errors, [])
  await writeFile(
    'reports/table-slots-browser.json',
    `${JSON.stringify({ timestamp: new Date().toISOString(), browser: await browser.version(), cases }, null, 2)}\n`,
  )
} finally {
  await browser.close()
}
