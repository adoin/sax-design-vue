import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({ headless: true })
const page = await browser.newPage()
const base = process.env.TABLE_AUDIT_BASE_URL ?? 'http://localhost:8080'
const results = []
const pause = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms))
const scope = (index) => `[data-final-card="${index}"]`
const record = (feature, state) => {
  results.push({ feature, ...state })
  process.stdout.write(`${feature}: passed\n`)
}

try {
  await page.setViewport({ width: 1440, height: 1000 })
  await page.goto(`${base}/components/table.html`, {
    waitUntil: 'domcontentloaded',
    timeout: 60_000,
  })
  await page.waitForSelector('.card .s-table', { timeout: 60_000 })
  await page.$$eval('.card', (cards) =>
    cards.forEach((card, index) => {
      card.dataset.finalCard = String(index)
    }),
  )

  const group = `${scope(0)} .s-table__group-toggle`
  const groupBefore = await page.$eval(group, (button) =>
    button.getAttribute('aria-label'),
  )
  await page.focus(group)
  await page.keyboard.press('Enter')
  await pause()
  const groupAfter = await page.$eval(group, (button) => ({
    label: button.getAttribute('aria-label'),
    focused: document.activeElement === button,
  }))
  assert.notEqual(groupAfter.label, groupBefore)
  assert(groupAfter.focused)
  record('grouping', groupAfter)

  const details = `${scope(32)} .s-table__detail-toggle`
  const detailsBefore = await page.$eval(details, (button) =>
    button.getAttribute('aria-expanded'),
  )
  await page.focus(details)
  await page.keyboard.press('Enter')
  await pause()
  const detailsAfter = await page.$eval(details, (button) => ({
    expanded: button.getAttribute('aria-expanded'),
    focused: document.activeElement === button,
  }))
  assert.notEqual(detailsAfter.expanded, detailsBefore)
  assert(detailsAfter.focused)
  record('details', detailsAfter)

  const separator = `${scope(35)} .s-table__resize-handle`
  const widthBefore = await page.$eval(
    separator,
    (handle) => handle.parentElement.getBoundingClientRect().width,
  )
  await page.focus(separator)
  await page.keyboard.press('ArrowRight')
  await pause()
  const resizeAfter = await page.$eval(separator, (handle) => ({
    width: handle.parentElement.getBoundingClientRect().width,
    focused: document.activeElement === handle,
  }))
  assert(resizeAfter.width > widthBefore)
  assert(resizeAfter.focused)
  record('resize', resizeAfter)

  const firstCell = `${scope(16)} .s-table__data-cell`
  await page.focus(firstCell)
  const keyboardBefore = await page.$eval(
    firstCell,
    (cell) => cell.closest('[data-table-row-index]')?.dataset.tableRowIndex,
  )
  await page.keyboard.press('ArrowDown')
  await pause()
  const keyboardAfter = await page.$eval(scope(16), () => ({
    row: document.activeElement?.closest('[data-table-row-index]')?.dataset
      .tableRowIndex,
    active: document.activeElement?.classList.contains('s-table__data-cell'),
  }))
  assert.notEqual(keyboardAfter.row, keyboardBefore)
  assert(keyboardAfter.active)
  record('keyboard-navigation', keyboardAfter)

  const contextCell = `${scope(6)} .s-table__data-cell`
  await page.focus(contextCell)
  await page.keyboard.down('Shift')
  await page.keyboard.press('F10')
  await page.keyboard.up('Shift')
  await page.waitForSelector('[role="menu"]', {
    visible: true,
    timeout: 10_000,
  })
  const contextOpen = await page.$eval('[role="menu"]', (menu) => ({
    items: menu.querySelectorAll('[role="menuitem"]').length,
    focusInside: menu.contains(document.activeElement),
  }))
  assert(contextOpen.items > 0)
  assert(contextOpen.focusInside)
  await page.keyboard.press('Escape')
  await pause(400)
  const contextAfter = await page.$eval(contextCell, (cell) => ({
    closed: !document.querySelector('[role="menu"]'),
    restored: document.activeElement === cell,
  }))
  assert(contextAfter.closed)
  assert(contextAfter.restored)
  record('context-menu', { ...contextOpen, ...contextAfter })

  const rangeCell = `${scope(8)} .s-table__data-cell:not(.is-fixed-right)`
  await page.focus(rangeCell)
  await page.keyboard.down('Shift')
  await page.keyboard.press('ArrowRight')
  await page.keyboard.up('Shift')
  await pause()
  const range = await page.$eval(scope(8), (card) => ({
    cells: card.querySelectorAll('.s-table__data-cell.is-range-cell').length,
    focused: document.activeElement?.classList.contains('s-table__data-cell'),
  }))
  assert(range.cells >= 2)
  assert(range.focused)
  record('cell-range', range)

  const drag = `${scope(18)} .s-table__row-drag-handle`
  await page.focus(drag)
  await page.keyboard.press('Space')
  await page.keyboard.press('ArrowDown')
  assert(await page.$(`${scope(18)} .is-dragging-row`))
  await page.keyboard.press('Escape')
  await pause()
  const dragAfter = await page.$eval(scope(18), (card) => ({
    cancelled: !card.querySelector('.is-dragging-row'),
    focusOnHandle: document.activeElement?.classList.contains(
      's-table__row-drag-handle',
    ),
  }))
  assert(dragAfter.cancelled)
  assert(dragAfter.focusOnHandle)
  record('row-drag', dragAfter)

  const editCell = `${scope(28)} .s-table__data-cell.is-editable-cell`
  await page.$eval(editCell, (cell) =>
    cell.dispatchEvent(new MouseEvent('dblclick', { bubbles: true })),
  )
  await page.waitForSelector(`${scope(28)} .s-table__cell-editor input`, {
    timeout: 10_000,
  })
  const editOpen = await page.$eval(scope(28), (card) =>
    Boolean(
      card
        .querySelector('.s-table__cell-editor')
        ?.contains(document.activeElement),
    ),
  )
  assert(editOpen)
  await page.keyboard.press('Escape')
  await pause()
  const editAfter = await page.$eval(scope(28), (card) => ({
    closed: !card.querySelector('.s-table__cell-editor'),
    cellFocused:
      document.activeElement?.classList.contains('s-table__data-cell'),
  }))
  assert(editAfter.closed)
  assert(editAfter.cellFocused)
  record('editing', { editorFocused: editOpen, ...editAfter })

  const findCell = `${scope(14)} .s-table__data-cell`
  await page.focus(findCell)
  await page.keyboard.down('Control')
  await page.keyboard.press('f')
  await page.keyboard.up('Control')
  await page.waitForSelector(`${scope(14)} .s-table__find-panel`, {
    visible: true,
    timeout: 10_000,
  })
  const findOpen = await page.$eval(scope(14), (card) => ({
    inputFocused: card
      .querySelector('.s-table__find-panel')
      ?.contains(document.activeElement),
  }))
  assert(findOpen.inputFocused)
  await page.keyboard.press('Escape')
  await pause()
  const findAfter = await page.$eval(scope(14), (card) => ({
    closed: !card.querySelector('.s-table__find-panel'),
    focusReturned:
      document.activeElement === card.querySelector('.s-table__find > button'),
  }))
  assert(findAfter.closed)
  assert(findAfter.focusReturned)
  record('find', { ...findOpen, ...findAfter })

  const manager = `${scope(36)} .s-table__column-manager .s-popper__trigger`
  const managerTrigger = await page.$(manager)
  assert(managerTrigger)
  await managerTrigger.focus()
  await page.keyboard.press('Enter')
  await page.waitForSelector('.s-table__column-panel [role="dialog"]', {
    visible: true,
    timeout: 10_000,
  })
  await page.waitForFunction(() =>
    document
      .querySelector('.s-table__column-panel [role="dialog"]')
      ?.contains(document.activeElement),
  )
  await page.keyboard.press('Escape')
  await pause(400)
  const managerAfter = await managerTrigger.evaluate((trigger) => ({
    closed: trigger.getAttribute('aria-expanded') === 'false',
    restored: document.activeElement === trigger,
  }))
  assert(managerAfter.closed)
  assert(managerAfter.restored)
  record('column-manager', managerAfter)

  assert.equal(results.length, 10)
  await writeFile(
    'reports/table-final-keyboard.json',
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
