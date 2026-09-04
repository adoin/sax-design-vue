import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({ headless: true })
const page = await browser.newPage()
const errors = []
const results = []
const pause = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))
page.on('pageerror', (error) => errors.push(error.message))
await page.setViewport({ width: 1500, height: 1050 })
const checkGenerated = async (scope) => {
  await page.waitForSelector(`${scope} .s-table`)
  await pause(700)
  await page.$eval(`${scope} .resize-controls`, (controls) => {
    const input = controls.querySelectorAll('input[type=checkbox]')[2]
    if (!input.checked) input.click()
  })
  await pause()
  await page.$eval(`${scope} .s-table`, (element) => {
    let component = element.__vueParentComponent
    while (component && !component.exposed?.scrollToRow)
      component = component.parent
    if (!component) throw new Error('Table methods unavailable')
    component.exposed.scrollToRow(999_999, 'end')
    component.exposed.scrollToColumn(99_998, 'end')
  })
  await page.waitForFunction(
    (selector) =>
      document.querySelector(`${selector} [data-table-row-index="999999"]`),
    {},
    scope,
  )
  await pause(700)
  const geometry = await page.$eval(`${scope} .s-table`, (element) => {
    const rows = [...element.querySelectorAll('[data-table-row-index]')]
    const cells = [
      ...element
        .querySelector('[data-table-row-index="999999"]')
        .querySelectorAll('.s-table__data-cell'),
    ]
    const row = element
      .querySelector('[data-table-row-index="999999"]')
      .getBoundingClientRect()
    const viewport = element.querySelector('.s-vl__window')
    return {
      rows: rows.length,
      columns: cells.map((cell) => Number(cell.dataset.columnIndex)),
      height: viewport.scrollHeight,
      bottomError: Math.abs(
        row.bottom -
          viewport.getBoundingClientRect().top -
          viewport.clientHeight,
      ),
      maxCellError: Math.max(
        ...cells.map((cell) =>
          Math.abs(cell.getBoundingClientRect().top - row.top),
        ),
      ),
    }
  })
  assert(geometry.rows < 35)
  assert(geometry.columns.includes(99_998))
  assert(geometry.columns.includes(0) && geometry.columns.includes(99_999))
  assert.equal(geometry.height, 8_000_000)
  assert(geometry.bottomError < 2)
  assert(geometry.maxCellError < 1)
  assert.equal(await page.$('.live-example-preview__error'), null)
  return geometry
}
const openAction = async (index) => {
  const card = await page.$('.card:has(.resize-demo)')
  const actions = await card.$$('.example-actions button')
  await actions[index].evaluate((element) => {
    element.scrollIntoView({ block: 'center', behavior: 'instant' })
    element.click()
  })
  await pause()
}
try {
  for (const zh of [false, true]) {
    await page.goto(
      `${process.env.TABLE_AUDIT_BASE_URL ?? 'http://localhost:8080'}/${zh ? 'zh/' : ''}components/table.html`,
      { waitUntil: 'domcontentloaded', timeout: 60000 },
    )
    await page.waitForSelector('.resize-demo .s-table', { timeout: 60000 })
    await pause(1800)
    assert(
      await page.$eval('.resize-demo', (element) =>
        Boolean(
          element.querySelector('.s-table__tree-toggle[aria-expanded="true"]'),
        ),
      ),
    )
    // Load the actual lazy-tree example, independently of the generated source.
    await page.evaluate(() => {
      const table = [...document.querySelectorAll('.s-table')].find(
        (element) =>
          element.querySelector('.tree-name') &&
          element.textContent.includes('main.ts'),
      )
      const row = [...table.querySelectorAll('[data-table-row-index]')].find(
        (element) => element.textContent.includes('components'),
      )
      row.querySelector('.s-table__tree-toggle').click()
    })
    await page.waitForFunction(() =>
      [...document.querySelectorAll('.tree-name')].some((element) =>
        element.textContent.includes('table.vue'),
      ),
    )
    const rendered = await checkGenerated('.resize-demo')
    await page.$eval('.theme-toggle', (element) => element.click())
    const alternateTheme = await checkGenerated('.resize-demo')
    await page.$eval('.theme-toggle', (element) => element.click())
    await openAction(2)
    await page.waitForSelector('.code-dialog')
    await page.$$eval(
      '.code-dialog__tabs button',
      (buttons, label) =>
        buttons.find((button) => button.textContent.trim() === label).click(),
      zh ? '全部' : 'All',
    )
    const code = await page.$eval(
      '.code-dialog__body',
      (element) => element.textContent,
    )
    for (const token of [
      '<template>',
      '<script setup lang="ts">',
      '<style scoped>',
      '1_000_000',
      '100_000',
    ])
      assert(code.includes(token), token)
    await page.$eval('.code-dialog__footer button', (element) =>
      element.click(),
    )
    const fromCode = await checkGenerated('.live-example-preview .resize-demo')
    await page.$eval('.example-playground-dialog__close', (element) =>
      element.click(),
    )
    await pause()
    await openAction(0)
    const direct = await checkGenerated('.live-example-preview .resize-demo')
    await page.$eval('.example-playground-dialog__close', (element) =>
      element.click(),
    )
    await pause()
    const result = {
      locale: zh ? 'zh' : 'en',
      treeExpansion: true,
      lazyTree: true,
      codeLength: code.length,
      rendered,
      alternateTheme,
      fromCode,
      direct,
    }
    results.push(result)
    process.stdout.write(`${JSON.stringify(result)}\n`)
  }
  assert.deepEqual(errors, [])
  await mkdir('reports', { recursive: true })
  await writeFile(
    'reports/table-docs-runtime.json',
    `${JSON.stringify({ timestamp: new Date().toISOString(), browser: await browser.version(), results }, null, 2)}\n`,
  )
} finally {
  await browser.close()
}
