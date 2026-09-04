import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({ headless: true })
const results = []
const pause = () => new Promise((resolve) => setTimeout(resolve, 500))
try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 1000 })
  for (const zh of [false, true]) {
    await page.goto(
      `${process.env.TABLE_AUDIT_BASE_URL ?? 'http://localhost:8080'}/${zh ? 'zh/' : ''}components/table.html`,
      { waitUntil: 'domcontentloaded' },
    )
    await page.waitForSelector('.grouping-source-demo .s-table', {
      timeout: 60000,
    })
    for (const [selector, token, buttonIndex] of [
      ['.footer-source-demo', 'Number(row.id) + index', 0],
      ['.merging-source-demo', 'rowIndexOf: Number', 1],
      ['.grouping-source-demo', 'rowIndexOf: Number', 0],
    ]) {
      const exercise = async (scope) => {
        await page.waitForSelector(`${scope} .s-table`, { timeout: 60000 })
        await pause()
        await page.$$eval(
          `${scope} .s-button`,
          (buttons, index) => buttons[index].click(),
          buttonIndex,
        )
        await pause()
        await page.waitForFunction(
          (scope) => {
            const el = document.querySelector(scope)
            return (
              el &&
              (el.innerText.includes('999999') ||
                el.innerText.includes('999996'))
            )
          },
          { timeout: 60000 },
          scope,
        )
        assert.equal(await page.$('.live-example-preview__error'), null)
        return page.$eval(scope, (el) => ({
          rows: el.querySelectorAll('.s-table__data-row').length,
          subtotals: el.querySelectorAll('.s-table__group-subtotal').length,
        }))
      }
      const rendered = await exercise(selector)
      await page.$$eval(
        `.card:has(${selector}) .example-actions button`,
        (buttons) => buttons[2].click(),
      )
      await page.waitForSelector('.code-dialog', { visible: true })
      await page.$$eval(
        '.code-dialog__tabs button',
        (buttons, label) =>
          buttons.find((button) => button.textContent.trim() === label).click(),
        zh ? '全部' : 'All',
      )
      const source = await page.$eval(
        '.code-dialog__body',
        (el) => el.textContent,
      )
      for (const marker of [
        '<template>',
        '<script setup lang="ts">',
        '<style scoped>',
        token,
      ])
        assert(source.includes(marker), `${selector}: ${marker}`)
      await page.$eval('.code-dialog__footer button', (el) => el.click())
      const playground = await exercise(`.live-example-preview ${selector}`)
      assert(playground.rows < 60)
      await page.$eval('.example-playground-dialog__close', (el) => el.click())
      await page.waitForSelector('.example-playground-dialog', { hidden: true })
      const result = {
        locale: zh ? 'zh' : 'en',
        selector,
        sourceLength: source.length,
        rendered,
        playground,
      }
      results.push(result)
      process.stdout.write(`${JSON.stringify(result)}\n`)
    }
  }
  await writeFile(
    'reports/table-layout-docs-browser.json',
    `${JSON.stringify(results, null, 2)}\n`,
  )
} finally {
  await browser.close()
}
