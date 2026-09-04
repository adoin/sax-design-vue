import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import puppeteer from 'puppeteer'

const base = process.env.TABLE_AUDIT_BASE_URL ?? 'http://localhost:8080'
const browser = await puppeteer.launch({ headless: true })
const results = []
const errors = []
const pause = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

const pages = [
  {
    path: 'components/table.html',
    features: [
      ['grouping', 2],
      ['merge', 3],
      ['virtual-merge', 5],
      ['context-menu', 7],
      ['cell-range', 9],
      ['clipboard', 11],
      ['chart', 13],
      ['find', 15],
      ['keyboard', 17],
      ['row-drag', 20],
      ['history', 21],
      ['changes', 24],
      ['validation', 27],
      ['editing', 31],
      ['edit-lifecycle', 29],
      ['details', 34],
      ['resize', 35],
      ['column-manager', 36],
      ['grouped-header', 40],
      ['footer', 43],
    ],
  },
  {
    path: 'components/table-grid.html',
    features: [
      ['grid', 2],
      ['query-toolbar', 0],
      ['request-proxy', 3],
    ],
  },
]

const cardSnapshot = (page, indices) =>
  page.$$eval(
    '.card',
    (cards, indices) =>
      indices.map((index) => {
        const card = cards[index]
        const table = card?.querySelector('.s-table')
        const cell = table?.querySelector(
          '.s-table__data-cell,.s-table__empty,.s-table__data-head-cell',
        )
        return {
          heading: card?.querySelector('h2')?.textContent?.trim() ?? '',
          color: cell ? getComputedStyle(cell).backgroundColor : '',
          tables: card?.querySelectorAll('.s-table').length ?? 0,
          fixed:
            card?.querySelectorAll('.s-table .is-fixed-column').length ?? 0,
          virtual: card?.querySelectorAll('.s-table .s-vl__window').length ?? 0,
        }
      }),
    indices,
  )

const clickCardAction = (page, index, action) =>
  page.$$eval(
    '.card',
    (cards, { index, action }) => {
      const button = cards[index]?.querySelectorAll('.example-actions button')[
        action
      ]
      if (!button) throw new Error(`Missing action ${action} for card ${index}`)
      button.scrollIntoView({ block: 'center', behavior: 'instant' })
      button.click()
    },
    { index, action },
  )

const inspectCodeAndPlayground = async (page, locale, feature, index) => {
  await clickCardAction(page, index, 2)
  await page.waitForSelector('.code-dialog', { visible: true, timeout: 30_000 })
  await page.$$eval(
    '.code-dialog__tabs button',
    (buttons, label) =>
      [...buttons]
        .find((button) => button.textContent.trim() === label)
        ?.click(),
    locale === 'zh' ? '全部' : 'All',
  )
  const source = await page.$eval(
    '.code-dialog__body',
    (element) => element.textContent,
  )
  assert(source.includes('<template>'), `${locale}/${feature}: template`)
  assert(
    source.includes('<script setup') || source.includes('<script>'),
    `${locale}/${feature}: script`,
  )
  if (locale === 'en')
    assert(!/[\u3400-\u9FFF]/.test(source), `${feature}: English source`)
  else assert(/[\u3400-\u9FFF]/.test(source), `${feature}: Chinese source`)

  await page.$eval('.code-dialog__footer button', (button) => button.click())
  await page.waitForSelector('.example-playground-dialog', {
    visible: true,
    timeout: 30_000,
  })
  await page.waitForSelector('.live-example-preview .s-table', {
    timeout: 30_000,
  })
  await pause(180)
  const preview = await page.$eval('.live-example-preview', (element) => ({
    tables: element.querySelectorAll('.s-table').length,
    rows: element.querySelectorAll('.s-table__data-row').length,
    fixed: element.querySelectorAll('.s-table .is-fixed-column').length,
    virtual: element.querySelectorAll('.s-table .s-vl__window').length,
    error:
      element.querySelector('.live-example-preview__error')?.textContent ?? '',
  }))
  assert(preview.tables > 0, `${locale}/${feature}: Playground table`)
  assert.equal(preview.error, '', `${locale}/${feature}: Playground error`)
  await page.$eval('.example-playground-dialog__close', (button) =>
    button.click(),
  )
  await page.waitForSelector('.example-playground-dialog', {
    hidden: true,
    timeout: 30_000,
  })
  return { sourceLength: source.length, preview }
}

try {
  for (const locale of ['en', 'zh'])
    for (const pageConfig of pages) {
      const page = await browser.newPage()
      page.on('pageerror', (error) =>
        errors.push(`${locale}/${pageConfig.path}: ${error.message}`),
      )
      await page.setViewport({ width: 1440, height: 1000 })
      await page.goto(
        `${base}/${locale === 'zh' ? 'zh/' : ''}${pageConfig.path}`,
        {
          waitUntil: 'domcontentloaded',
          timeout: 60_000,
        },
      )
      await page.waitForSelector('.card .s-table', { timeout: 60_000 })
      await pause(800)
      const indices = pageConfig.features.map(([, index]) => index)
      const light = await cardSnapshot(page, indices)
      light.forEach((card, index) => {
        assert(
          card.heading,
          `${locale}/${pageConfig.features[index][0]}: heading`,
        )
        assert(
          card.tables > 0,
          `${locale}/${pageConfig.features[index][0]}: rendered table`,
        )
        assert(
          card.color,
          `${locale}/${pageConfig.features[index][0]}: light color`,
        )
      })
      await page.$eval('.theme-toggle', (button) => button.click())
      await pause(350)
      const dark = await cardSnapshot(page, indices)
      dark.forEach((card, index) =>
        assert.notEqual(
          card.color,
          light[index].color,
          `${locale}/${pageConfig.features[index][0]}: theme color`,
        ),
      )
      await page.$eval('.theme-toggle', (button) => button.click())
      await pause(200)

      for (
        let position = 0;
        position < pageConfig.features.length;
        position++
      ) {
        const [feature, index] = pageConfig.features[position]
        const dialogs = await inspectCodeAndPlayground(
          page,
          locale,
          feature,
          index,
        )
        const result = {
          locale,
          page: pageConfig.path,
          feature,
          heading: light[position].heading,
          lightColor: light[position].color,
          darkColor: dark[position].color,
          rendered: {
            tables: light[position].tables,
            fixed: light[position].fixed,
            virtual: light[position].virtual,
          },
          ...dialogs,
        }
        results.push(result)
        process.stdout.write(`${locale}/${feature}: passed\n`)
      }
      await page.close()
    }

  assert.deepEqual(errors, [])
  assert.equal(results.length, 46)
  await writeFile(
    'reports/table-final-browser.json',
    `${JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        browser: await browser.version(),
        results,
      },
      null,
      2,
    )}\n`,
  )
} finally {
  await browser.close()
}
