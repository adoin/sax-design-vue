import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'
import puppeteer from 'puppeteer'
import matter from 'gray-matter'
const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const baseUrl = process.env.DOCS_URL || 'http://localhost:8080'
const browser = await puppeteer.launch({ headless: true })
const results = []
try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1500, height: 1050 })
  for (const locale of ['en', 'zh'])
    for (const component of ['table', 'table-grid', 'table-select']) {
      const path = `${locale === 'zh' ? 'zh/' : ''}components/${component}`
      const metadata = matter(
        readFileSync(`${root}/docs/${path}.md`, 'utf8'),
      ).data
      await page.goto(`${baseUrl}/${path}.html`, {
        waitUntil: 'domcontentloaded',
        timeout: 45000,
      })
      await page.waitForSelector('#api-exposes + .api-table, #api-exposes', {
        timeout: 45000,
      })
      await new Promise((r) => setTimeout(r, 1500))
      await page.waitForFunction(
        () =>
          document.querySelector('#s-api .api-type-trigger')
            ?.__vueParentComponent,
        { timeout: 30000 },
      )
      const result = await page.evaluate((metadata) => {
        const sections = {}
        const missingLinks = []
        const ids = [...document.querySelectorAll('#s-api [id]')].map(
          (element) => element.id,
        )
        const duplicateIds = ids.filter(
          (id, index) => ids.indexOf(id) !== index,
        )
        for (const section of [
          'PROPS',
          'CHILD_PROPS',
          'EVENTS',
          'SLOTS',
          'EXPOSES',
        ]) {
          if (!metadata[section]) continue
          const block = document.querySelector(
            `#s-api #api-${section.toLowerCase().replaceAll('_', '-')}`,
          )?.parentElement
          const names = [
            ...block.querySelectorAll(
              '.s-table__data-cell[data-column-index="0"]',
            ),
          ].map((n) => n.textContent.trim())
          sections[section] = {
            rows: names.length,
            missing: metadata[section]
              .map((r) => r.name)
              .filter((name) => !names.includes(name)),
          }
          for (const row of metadata[section])
            if (
              row.usage?.startsWith('#') &&
              !document.querySelector(
                `#${CSS.escape(decodeURIComponent(row.usage.slice(1)))}`,
              )
            )
              missingLinks.push({ section, name: row.name, usage: row.usage })
        }
        return { sections, missingLinks, duplicateIds }
      }, metadata)
      const type =
        component === 'table'
          ? 'TableCellRenderer'
          : component === 'table-select'
            ? 'TableSelectPopupConfig'
            : 'TableGridProxyConfig'
      await page.evaluate((type) => {
        const button = [
          ...document.querySelectorAll('#s-api .api-type-trigger'),
        ].find((el) => el.textContent.includes(type))
        if (!button) throw new Error(`Missing type trigger ${type}`)
        button.scrollIntoView({ block: 'center', behavior: 'instant' })
      }, type)
      await new Promise((r) => setTimeout(r, 800))
      const handle = await page.evaluateHandle(
        (type) =>
          [...document.querySelectorAll('#s-api .api-type-trigger')].find(
            (el) => el.textContent.trim() === type,
          ) ||
          [...document.querySelectorAll('#s-api .api-type-trigger')].find(
            (el) => el.textContent.includes(type),
          ),
        type,
      )
      await handle.asElement().click()
      await new Promise((r) => setTimeout(r, 500))
      await page.waitForFunction(
        (type) =>
          [...document.querySelectorAll('.api-type-definition')].some((el) =>
            el.textContent.includes(type),
          ),
        { timeout: 10000 },
        type,
      )
      result.type = type
      result.typeOpened = true
      result.locale = locale
      result.component = component
      results.push(result)
      process.stdout.write(`${JSON.stringify(result)}\n`)
      for (const section of Object.values(result.sections))
        assert.equal(section.missing.length, 0)
      assert.deepEqual(
        result.duplicateIds,
        [],
        'API section and row anchors must be unique',
      )
    }
  writeFileSync(
    process.argv[2] || `${root}/reports/table-api-browser.json`,
    `${JSON.stringify(results, null, 2)}\n`,
  )
  assert(
    results.every((r) => r.missingLinks.length === 0),
    'API usage links must resolve',
  )
} finally {
  await browser.close()
}
