import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({ headless: true })
const page = await browser.newPage()
const pause = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))
const errors = []
const results = []
page.on('pageerror', (error) => errors.push(error.message))
await page.setViewport({ width: 1440, height: 1000 })

const exercise = async (scope) => {
  await page.waitForSelector(`${scope} .column-order-demo__controls button`)
  await pause(500)
  const read = () =>
    page.$eval(scope, (table) => ({
      headers: [...table.querySelectorAll('[role="columnheader"]')].map(
        (cell) => cell.textContent.trim(),
      ),
      rows: [...table.querySelectorAll('.s-table__data-row')].map((row) =>
        [...row.querySelectorAll('[role="cell"]')].map((cell) =>
          cell.textContent.trim(),
        ),
      ),
      tags: table.querySelectorAll('.s-tag').length,
    }))
  const before = await read()
  assert.equal(before.tags, 3)
  await page.$eval(`${scope} .column-order-demo__controls button`, (button) =>
    button.click(),
  )
  await pause()
  const reordered = await read()
  assert.deepEqual(reordered.headers, [
    before.headers[0],
    before.headers[2],
    before.headers[1],
    before.headers[3],
  ])
  assert.deepEqual(
    reordered.rows,
    before.rows.map((row) => [row[0], row[2], row[1], row[3]]),
  )
  await page.$eval(`${scope} input[type="checkbox"]`, (input) => input.click())
  await pause()
  const plain = await read()
  assert.equal(plain.tags, 0)
  assert.deepEqual(plain.rows, reordered.rows)
  await page.$eval(`${scope} input[type="checkbox"]`, (input) => input.click())
  await page.$eval(`${scope} .column-order-demo__controls button`, (button) =>
    button.click(),
  )
  await pause()
  assert.deepEqual(await read(), before)
  return {
    headers: before.headers,
    rows: before.rows.length,
    reordered: true,
    slotRestored: true,
  }
}

const openAction = async (index) => {
  await page.$eval(
    '.card:has(.column-order-demo) .example-actions',
    (actions, index) => {
      const button = actions.querySelectorAll('button')[index]
      button.scrollIntoView({ block: 'center', behavior: 'instant' })
      button.click()
    },
    index,
  )
}

try {
  for (const locale of ['en', 'zh']) {
    await page.goto(
      `http://localhost:8080/${locale === 'zh' ? 'zh/' : ''}components/table.html`,
      { waitUntil: 'domcontentloaded', timeout: 45000 },
    )
    await page.waitForFunction(
      () => document.querySelector('.column-order-demo')?.__vueParentComponent,
    )
    const rendered = await exercise('.column-order-demo')
    await page.$eval('.theme-toggle', (button) => button.click())
    const alternateTheme = await exercise('.column-order-demo')
    await page.$eval('.theme-toggle', (button) => button.click())
    await openAction(2)
    await page.waitForSelector('.code-dialog')
    await page.$$eval(
      '.code-dialog__tabs button',
      (buttons, label) =>
        buttons.find((button) => button.textContent.trim() === label).click(),
      locale === 'zh' ? '全部' : 'All',
    )
    const code = await page.$eval(
      '.code-dialog__body',
      (element) => element.textContent,
    )
    for (const token of [
      '<script setup lang="ts">',
      '<template>',
      '<style scoped>',
      'customStatus',
      'column.field',
    ])
      assert(code.includes(token), token)
    await page.$eval('.code-dialog__footer button', (button) => button.click())
    const fromCode = await exercise('.live-example-preview .column-order-demo')
    await page.$eval('.example-playground-dialog__close', (button) =>
      button.click(),
    )
    await pause()
    await openAction(0)
    const direct = await exercise('.live-example-preview .column-order-demo')
    await page.$eval('.example-playground-dialog__close', (button) =>
      button.click(),
    )
    await pause()
    const result = {
      locale,
      rendered,
      alternateTheme,
      fromCode,
      direct,
      codeLength: code.length,
    }
    results.push(result)
    process.stdout.write(`${JSON.stringify(result)}\n`)
  }
  assert.deepEqual(errors, [])
  await writeFile(
    'reports/table-columns-browser.json',
    `${JSON.stringify(results, null, 2)}\n`,
  )
} finally {
  await browser.close()
}
