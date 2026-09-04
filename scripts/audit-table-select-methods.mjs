import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({ headless: true })
const results = []
const panel = '.s-table-select__panel'
try {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.setViewport({ width: 1440, height: 1000 })
  for (const locale of ['en', 'zh']) {
    await page.goto(
      `${process.env.TABLE_AUDIT_BASE_URL ?? 'http://localhost:8080'}/${locale === 'zh' ? 'zh/' : ''}components/table-select.html`,
      { waitUntil: 'networkidle2' },
    )
    await page.waitForSelector('.table-select-demo .s-table-select')
    await page.$eval('.table-select-demo', (element) =>
      element.scrollIntoView({ block: 'center', behavior: 'instant' }),
    )
    await new Promise((resolve) => setTimeout(resolve, 500))
    const before = await page.$eval(
      '.table-select-demo .s-table-select',
      (element) => {
        let component = element.__vueParentComponent
        while (component && !component.exposed?.open)
          component = component.parent
        assertComponent(component)
        function assertComponent(value) {
          if (!value) throw new Error('Missing TableSelect API')
        }
        window.selectMethodAudit = {
          api: component.exposed,
          row: component.props.data[0],
        }
        return {
          measure: component.exposed.measure() === undefined,
          expand:
            component.exposed.toggleRowExpand(component.props.data[0], true) ===
            undefined,
        }
      },
    )
    assert.deepEqual(before, { measure: true, expand: true })
    await page.evaluate(() => window.selectMethodAudit.api.open())
    await page.waitForSelector(`${panel} .s-table__data-row`, { visible: true })
    const waitRows = (count) =>
      page.waitForFunction(
        (selector, expected) =>
          document.querySelectorAll(`${selector} .s-table__data-row`).length ===
          expected,
        {},
        panel,
        count,
      )
    await waitRows(3)
    await page.evaluate(() => window.selectMethodAudit.api.setExpandedKeys([]))
    await waitRows(1)
    const expanded = await page.evaluate(async () => {
      const pending = window.selectMethodAudit.api.toggleRowExpand(
        window.selectMethodAudit.row,
        true,
      )
      const promised = pending instanceof Promise
      await pending
      return promised
    })
    assert(expanded)
    await waitRows(3)
    const measured = await page.evaluate(async () => {
      window.selectMethodAudit.api.scrollToRow('docs', 'center')
      const pending = window.selectMethodAudit.api.measure()
      const promised = pending instanceof Promise
      await pending
      return promised
    })
    assert(measured)
    const labels = await page.$$eval(
      `${panel} .s-table__data-row`,
      (elements) => elements.map((element) => element.textContent.trim()),
    )
    assert(labels.includes(locale === 'zh' ? '文档' : 'Documentation'))
    await page.evaluate(() => window.selectMethodAudit.api.close())
    await page.waitForFunction(
      (selector) => {
        const element = document.querySelector(selector)
        return !element || !element.getClientRects().length
      },
      {},
      panel,
    )
    results.push({
      locale,
      before,
      collapsedRows: 1,
      expandedRows: 3,
      expanded,
      measured,
      labels,
      closed: true,
    })
  }
  assert.deepEqual(errors, [])
  await writeFile(
    'reports/table-select-methods-browser.json',
    `${JSON.stringify(results, null, 2)}\n`,
  )
  process.stdout.write(`${JSON.stringify(results)}\n`)
} finally {
  await browser.close()
}
