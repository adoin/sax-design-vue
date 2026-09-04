import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import puppeteer from 'puppeteer'

const base = process.env.TABLE_AUDIT_BASE_URL ?? 'http://localhost:8080'
const url = `${base}/@fs/${process.cwd().replaceAll('\\', '/')}/play/table-overlay-audit/index.html`
const output = process.argv[2] ?? 'reports/table-overlays-browser.json'
const browser = await puppeteer.launch({ headless: true })
const report = []
const pause = () => new Promise((resolve) => setTimeout(resolve, 350))
try {
  for (const width of [1100, 375]) {
    for (const dark of [false, true]) {
      for (const shape of ['rounded', 'square']) {
        const page = await browser.newPage()
        const errors = []
        page.on('pageerror', (error) => errors.push(error.message))
        await page.setViewport({ width, height: 800 })
        await page.emulateMediaFeatures([
          { name: 'prefers-reduced-motion', value: 'reduce' },
        ])
        await page.goto(url, { waitUntil: 'networkidle2' })
        await page.waitForFunction(() => window.tableOverlayAudit)
        await page.evaluate(
          (options) => window.tableOverlayAudit.configure(options),
          { shape, dark },
        )
        await pause()
        const surface = async (selector) => {
          await page.waitForSelector(selector, { visible: true })
          await pause()
          return page.$eval(selector, (el) => {
            const rect = el.getBoundingClientRect()
            const css = getComputedStyle(el)
            return {
              radius: css.borderRadius,
              color: css.color,
              background: css.backgroundColor,
              shadow: css.boxShadow,
              border: css.borderWidth,
              clippedAncestor: Boolean(el.closest('#clip')),
              rect: {
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height,
              },
            }
          })
        }
        await page.click('.s-table__column-manager button')
        const manager = await surface('.s-table__column-panel')
        assert.equal(manager.clippedAncestor, false)
        await page.focus('.s-table__column-panel-actions button:last-child')
        await page.keyboard.press('Tab')
        assert(
          await page.$eval('.s-table__column-panel', (el) =>
            el.contains(document.activeElement),
          ),
          'Tab stays in the column panel',
        )
        assert(
          manager.rect.x >= 0 &&
            manager.rect.x + manager.rect.width <= width + 1,
        )
        await page.click('.s-table__column-panel .s-select')
        const nested = await surface('.s-select__content')
        if (width === 375 && shape === 'square')
          await page.screenshot({
            path: join(
              tmpdir(),
              `sax-table-overlay-${dark ? 'dark' : 'light'}.png`,
            ),
          })
        assert.equal(nested.clippedAncestor, false)
        await page.keyboard.press('Escape')
        await pause()
        assert(
          await page.$('.s-table__column-panel'),
          'nested Escape must preserve column panel',
        )
        await page.keyboard.press('Escape')
        await pause()
        assert(
          await page.$eval(
            '.s-table__column-manager button',
            (el) => el === document.activeElement,
          ),
        )
        await page.evaluate(() => window.tableOverlayAudit.openFind())
        const find = await surface('.s-table__find-panel')
        await page.evaluate(() => window.tableOverlayAudit.closeFind())
        await page.click('.s-table__data-cell', { button: 'right' })
        const menu = await surface('.s-context-menu__panel')
        assert.equal(menu.clippedAncestor, false)
        assert(
          await page.$eval(
            '.s-context-menu__item:last-child',
            (el) => el.disabled,
          ),
        )
        await page.keyboard.press('Escape')
        await pause()
        assert.equal(
          (await page.evaluate(() => window.tableOverlayAudit.openChart()))
            .success,
          true,
        )
        const chart = await surface('.s-dialog-original')
        for (const panel of [manager, nested, find, menu, chart]) {
          if (shape === 'square') assert.equal(panel.radius, '0px')
          else assert.notEqual(panel.radius, '0px')
        }
        assert(
          chart.rect.x >= 0 && chart.rect.x + chart.rect.width <= width + 1,
          'chart fits viewport',
        )
        await page.keyboard.press('Escape')
        await pause()
        assert.equal(
          await page.evaluate(() => window.tableOverlayAudit.edit()),
          true,
        )
        await page.click('.s-table__cell-editor .s-select')
        const editor = await surface('.s-select__content')
        assert.equal(editor.clippedAncestor, false)
        assert.equal(editor.radius, shape === 'square' ? '0px' : nested.radius)
        await page.keyboard.press('Escape')
        await pause()
        assert(
          await page.$('.s-table__cell-editor'),
          'closing dropdown preserves row editing',
        )
        await page.evaluate(() => window.tableOverlayAudit.cancelEdit())
        await page.click('.s-table__column-manager button')
        await pause()
        await page.click('#outside')
        await pause()
        assert.equal(await page.$('.s-table__column-panel'), null)
        assert(
          await page.$eval('#outside', (el) => el === document.activeElement),
          'outside close must preserve outside focus',
        )
        await page.click('.s-table__column-manager button')
        await pause()
        await page.evaluate(
          (options) => window.tableOverlayAudit.configure(options),
          { shape, dark, loading: true },
        )
        await pause()
        assert.equal(await page.$('.s-table__column-panel'), null)
        assert(
          await page.$eval(
            '.s-table__column-manager button',
            (el) => el.disabled,
          ),
        )
        await page.evaluate(() => window.tableOverlayAudit.unmount())
        await pause()
        assert.equal(
          await page.$('.s-table__column-panel,.s-context-menu,.s-dialog'),
          null,
        )
        assert.deepEqual(errors, [])
        report.push({
          width,
          dark,
          shape,
          manager,
          nested,
          find,
          menu,
          chart,
          editor,
          disabled: true,
          unmount: true,
        })
        process.stdout.write(
          `${width} ${dark ? 'dark' : 'light'} ${shape}: checked\n`,
        )
        await page.close()
      }
    }
  }
  await writeFile(output, `${JSON.stringify(report, null, 2)}\n`)
} finally {
  await browser.close()
}
