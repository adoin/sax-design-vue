import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import puppeteer from 'puppeteer'

const base = process.env.TABLE_AUDIT_BASE_URL ?? 'http://localhost:8080'
const url = `${base}/@fs/${process.cwd().replaceAll('\\', '/')}/play/table-overlay-audit/index.html?grid`
const browser = await puppeteer.launch({ headless: true })
const report = []
const pause = () => new Promise((resolve) => setTimeout(resolve, 350))
const selector = {
  header: '.s-table__header-action',
  filter: '.s-table__filter-panel',
  query: '.s-table-grid__query-actions button:first-child',
  disabled:
    '.s-table-grid__query input,.s-table-grid__query-actions button,.s-table-grid__tools button',
}
try {
  for (const width of [1100, 375]) {
    for (const dark of [false, true]) {
      for (const shape of ['square', 'rounded']) {
        const page = await browser.newPage()
        const errors = []
        page.on('pageerror', (error) => errors.push(error.message))
        await page.setViewport({ width, height: 850 })
        await page.goto(url, { waitUntil: 'networkidle2' })
        await page.waitForFunction(() => window.tableOverlayAudit)
        const configure = (loading = false) =>
          page.evaluate(
            (options) => window.tableOverlayAudit.configure(options),
            { shape, dark, loading },
          )
        await configure()
        await pause()
        const surface = async (target) => {
          await page.waitForSelector(target, { visible: true })
          await pause()
          return page.$eval(target, (el) => {
            const rect = el.getBoundingClientRect()
            const css = getComputedStyle(el)
            return {
              radius: css.borderRadius,
              color: css.color,
              background: css.backgroundColor,
              shadow: css.boxShadow,
              clipped: Boolean(el.closest('#clip')),
              x: rect.x,
              right: rect.right,
              height: rect.height,
            }
          })
        }
        const events = () =>
          page.evaluate(() => window.tableOverlayAudit.gridEvents())
        const disabled = () =>
          page.$$eval(
            selector.disabled,
            (els) => els.length > 0 && els.every((el) => el.disabled),
          )
        assert.deepEqual(await events(), { queries: 0, actions: 0 })
        await page.click(selector.header)
        const filter = await surface(selector.filter)
        await page.screenshot({
          path: join(tmpdir(), `sax-grid-filter-${width}-${dark}-${shape}.png`),
        })
        assert.equal(filter.clipped, false)
        assert(
          filter.x >= 0 && filter.right <= width + 1,
          'filter fits viewport',
        )
        assert.equal(
          filter.radius === '0px',
          shape === 'square',
          'filter follows global shape',
        )
        assert(
          await page.$eval(
            '.s-table__filter-options .s-checkbox:last-child input',
            (el) => el.disabled,
          ),
        )
        await page.keyboard.press('Escape')
        await pause()
        assert(
          await page.$eval(
            selector.header,
            (el) => el === document.activeElement,
          ),
          'Escape restores filter trigger focus',
        )

        await page.click('.s-table-grid__query .s-select')
        const select = await surface('.s-select__content')
        assert.equal(select.clipped, false)
        assert.equal(select.radius === '0px', shape === 'square')
        await page.keyboard.press('Escape')
        await pause()
        const controls = await page.$$eval(
          '.s-table-grid__query .s-input__original,.s-table-grid__query .s-select__input,.s-table-grid__tools button',
          (els) =>
            els.map((el) => {
              const css = getComputedStyle(el),
                rect = el.getBoundingClientRect()
              return {
                radius: css.borderRadius,
                x: rect.x,
                right: rect.right,
                disabled: el.disabled,
              }
            }),
        )
        for (const control of controls) {
          assert.equal(control.radius === '0px', shape === 'square')
          assert(
            control.x >= 0 && control.right <= width + 1,
            'Grid control fits viewport',
          )
        }
        await page.click('.s-table-grid__tools button:first-child')
        await page.waitForFunction(
          () => window.tableOverlayAudit.gridEvents().actions === 1,
        )
        assert(
          await page.$eval(
            '.s-table-grid__tools button:nth-child(2)',
            (el) => el.disabled,
          ),
        )

        await page.click(selector.header)
        await surface(selector.filter)
        await configure(true)
        await pause()
        assert.equal(
          await page.$(selector.filter),
          null,
          'loading closes existing filter',
        )
        assert(
          await page.$eval(selector.header, (el) => el.disabled),
          'loading disables header filter',
        )
        assert(
          await page.$$eval('.s-table__sort-button', (els) =>
            els.every((el) => el.disabled),
          ),
        )
        assert(await disabled(), 'loading disables query and toolbar controls')
        await configure()
        await page.click(selector.query)
        await page.waitForFunction(
          () => window.tableOverlayAudit.gridEvents().queries === 1,
        )
        assert(await disabled(), 'pending proxy query disables controls')
        await page.evaluate(() => window.tableOverlayAudit.finishQuery())
        await page.waitForFunction(
          () =>
            !document.querySelector('.s-table-grid__query-actions button')
              .disabled,
        )
        assert.equal((await events()).queries, 1)
        await page.screenshot({
          path: join(tmpdir(), `sax-grid-ui-${width}-${dark}-${shape}.png`),
        })
        await page.evaluate(() => window.tableOverlayAudit.unmount())
        assert.deepEqual(errors, [])
        report.push({
          width,
          dark,
          shape,
          filter,
          select,
          controls,
          disabled: true,
          requestCycle: true,
        })
        process.stdout.write(
          `${width} ${dark ? 'dark' : 'light'} ${shape}: checked\n`,
        )
        await page.close()
      }
    }
  }
  await writeFile(
    process.argv[2] ?? 'reports/table-grid-ui-browser.json',
    `${JSON.stringify(report, null, 2)}\n`,
  )
} finally {
  await browser.close()
}
