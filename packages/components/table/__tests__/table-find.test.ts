import { defineComponent, h, nextTick, ref, shallowRef } from 'vue'
import { DOMWrapper, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Table from '../src/table.vue'
import type {
  TableColumn,
  TableExposes,
  TableProps,
  TableRow,
} from '../src/table'

const cleanups: Array<() => void> = []
const scroll = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollIntoView',
)
beforeEach(() => {
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
  })
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  )
})
afterEach(() => {
  cleanups.splice(0).forEach((cleanup) => cleanup())
  vi.unstubAllGlobals()
  if (scroll)
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', scroll)
  else Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView')
})
const columns: TableColumn[] = [
  { field: 'name', title: 'Name', editor: true },
  { field: 'count', title: 'Count', editor: { type: 'number' } },
]
const bounds = { rowStart: 0, rowEnd: 2, colStart: 0, colEnd: 2 }
const findPanel = () => {
  const panels = [
    ...document.querySelectorAll<HTMLElement>('.s-table__find-panel'),
  ]
  return (
    panels.findLast((panel) => getComputedStyle(panel).display !== 'none') ??
    panels.at(-1) ??
    null
  )
}
const panelControl = (selector: string) => {
  const node =
    findPanel()?.querySelector<HTMLElement>(selector) ??
    document.querySelector<HTMLElement>(selector)
  if (!node) throw new Error(`Missing find panel control: ${selector}`)
  return new DOMWrapper(node)
}
const panelAction = (label: string) => {
  const buttons = [...(findPanel()?.querySelectorAll('button') ?? [])].filter(
    (node) => node.getAttribute('aria-label') === label,
  )
  const button =
    buttons.find((node) => node.getClientRects().length > 0) ?? buttons[0]
  if (!button) throw new Error(`Missing find action: ${label}`)
  return button
}
function host(
  extra: Partial<TableProps> = {},
  accepts = true,
  initial: TableRow[] = [
    { id: 1, name: 'A', count: 1 },
    { id: 2, name: 'B', count: 2 },
  ],
) {
  const data = ref(initial)
  const settings = shallowRef(extra)
  const api = shallowRef<TableExposes>()
  const root = mount(
    defineComponent({
      setup: () => () =>
        h(Table, {
          ref: api,
          data: data.value,
          rowKey: 'id',
          columns,
          findConfig: true,
          toolbarConfig: { left: [{ itemRender: '$find' }] },
          changeConfig: true,
          historyConfig: true,
          editConfig: true,
          'onUpdate:data': (next: TableRow[]) => {
            if (accepts) data.value = next
          },
          ...settings.value,
        }),
    }),
    { attachTo: document.body },
  )
  cleanups.push(() => root.unmount())
  return { root, table: root.findComponent(Table), data, api, settings }
}

describe('Table find integration', () => {
  it('invalidates selected-range matches after selecting a new range but preserves explicit bounds', async () => {
    const { api } = host({ rangeConfig: true })
    const range = (rowKey: number) => ({
      anchor: { rowKey, columnKey: 'name' },
      focus: { rowKey, columnKey: 'name' },
    })
    await api.value!.setCellRange(range(1))
    await api.value!.findCells('A', { scope: 'selection' })
    expect(api.value!.getFindState().matches).toHaveLength(1)
    await api.value!.setCellRange(range(2))
    await nextTick()
    expect(api.value!.getFindState().matches).toEqual([])
    expect(await api.value!.replaceAll('C')).toMatchObject({
      applied: false,
      reason: 'empty',
    })
    await api.value!.findCells('A', { scope: 'selection', bounds })
    await api.value!.setCellRange(range(1))
    await nextTick()
    expect(api.value!.getFindState().matches).toHaveLength(1)
  })

  it('replaces stale panel feedback when a new query is started through the public API', async () => {
    const { api, settings } = host()
    await api.value!.openFind()
    await api.value!.findCells('A')
    await api.value!.findNext({ focus: false })
    await panelControl('[data-find-replacement] input').setValue('C')
    panelAction('Replace current').click()
    await vi.waitFor(() =>
      expect(
        findPanel()!.querySelector('[role="status"]')!.textContent,
      ).toContain('Updated 1'),
    )
    await api.value!.undo()
    await nextTick()
    expect(
      findPanel()!.querySelector('[role="status"]')?.textContent ?? '',
    ).not.toContain('Updated')
    settings.value = { findConfig: { maxCells: 1 } }
    await nextTick()
    await api.value!.findCells('unmatched')
    await nextTick()
    expect(
      findPanel()!.querySelector('[role="status"]')!.textContent,
    ).toContain('Limit reached')
    expect(
      findPanel()!.querySelector('[role="status"]')!.textContent,
    ).not.toContain('Updated')
  })

  it('uses current tree expansion state in data-scope replacement conditions', async () => {
    const { api, data } = host(
      {
        treeConfig: { children: 'children' },
        findConfig: { replaceableMethod: ({ expanded }) => expanded },
      },
      true,
      [{ id: 1, name: 'A', children: [{ id: 2, name: 'A' }] }],
    )
    await api.value!.findCells('A', { scope: 'data' })
    await api.value!.toggleRowExpand(data.value[0], true)
    expect(await api.value!.replaceAll('B')).toMatchObject({
      applied: true,
      changedCells: 1,
      skippedCells: 1,
    })
    expect(data.value[0].name).toBe('B')
    expect((data.value[0].children as TableRow[])[0].name).toBe('A')
  })

  it('finds generated cells in the painted view without spending the scan budget on off-screen columns', async () => {
    const { api } = host({
      virtualSource: {
        rowCount: 1_000_000,
        columnCount: 100_000,
        columnWidth: 140,
        fixedLeftCount: 1,
        fixedRightCount: 1,
        rowKey: (index) => index,
        row: (index) =>
          new Proxy(
            { id: index },
            {
              get: (target, key, receiver) =>
                typeof key === 'string' && /^c\d+$/.test(key)
                  ? `${index}/${key.slice(1)}`
                  : Reflect.get(target, key, receiver),
              has: (target, key) =>
                (typeof key === 'string' && /^c\d+$/.test(key)) ||
                key in target,
            },
          ),
        column: (index) => ({
          key: String(index),
          field: `c${index}`,
          width: 140,
          editor: index !== 0,
        }),
      },
      virtualConfig: { height: 280, rowHeight: 44, horizontal: true },
      findConfig: { maxCells: 4096 },
    })
    await nextTick()
    await nextTick()
    const result = await api.value!.findCells('3/3', { scope: 'view' })
    expect(result.state.complete).toBe(true)
    expect(result.state.visited).toBeLessThan(4096)
    expect(result.state.matches.some((match) => match.text === '3/3')).toBe(
      true,
    )
  })

  it('finishes an empty column scope without reading generated data', async () => {
    const read = vi.fn((index: number) => ({ id: index, name: 'A' }))
    const { api } = host({
      virtualSource: {
        rowCount: 1_000_000,
        columnCount: 100_000,
        columnWidth: 120,
        rowKey: (index) => index,
        row: read,
        column: (index) => ({ key: String(index), field: 'name' }),
      },
      virtualConfig: { height: 240, horizontal: true },
    })
    const before = read.mock.calls.length
    const result = await api.value!.findCells('A', {
      scope: 'data',
      columns: [],
    })
    expect(result).toMatchObject({
      success: true,
      state: { complete: true, visited: 0, matches: [] },
    })
    expect(read.mock.calls.length).toBe(before)
  })

  it('reports the scan limit rather than an empty result when no match was reached', async () => {
    const { api } = host({ findConfig: { maxCells: 1 } })
    expect((await api.value!.findCells('unmatched')).state).toMatchObject({
      complete: false,
      matches: [],
    })
    expect(await api.value!.replaceAll('C')).toMatchObject({
      applied: false,
      reason: 'limit',
    })
  })

  it('keeps the refreshed match and active cell aligned after replacement without taking focus', async () => {
    const { api } = host({}, true, [
      { id: 1, name: 'A', count: 1 },
      { id: 2, name: 'A', count: 2 },
    ])
    await api.value!.openFind()
    await api.value!.findCells('A')
    await api.value!.findNext({ focus: false })
    const input = panelControl('[data-find-query] input').element
    expect(document.activeElement).toBe(input)
    expect(await api.value!.replaceMatch('B')).toMatchObject({ applied: true })
    expect(api.value!.getFindState()).toMatchObject({
      activeIndex: 0,
      matches: [{ rowKey: 2 }],
    })
    expect(api.value!.getActiveCell()).toMatchObject({
      rowKey: 2,
      columnKey: 'name',
    })
    expect(document.activeElement).toBe(input)
  })

  it('opens the localized panel from table shortcuts, searches from its input and restores focus on Escape', async () => {
    const { api, table } = host()
    await table.find('.s-table').trigger('keydown', { key: 'f', ctrlKey: true })
    await nextTick()
    const input = panelControl('[data-find-query] input')
    expect(document.activeElement).toBe(input.element)
    await input.setValue('A')
    await input.trigger('keydown', { key: 'Enter' })
    await vi.waitFor(() =>
      expect(api.value!.getFindState().matches).toHaveLength(1),
    )
    await input.trigger('keydown', { key: 'Escape' })
    expect(
      table.find('.s-table__find-trigger').attributes('aria-expanded'),
    ).toBe('false')
    expect(document.activeElement).toBe(
      table.find('.s-table__find-trigger').element,
    )
  })

  it('opens the teleported SPopper from an SVG icon trigger', async () => {
    const { table, api } = host()
    const trigger = table.get('.s-table__find-trigger')
    expect(trigger.element.tagName).toBe('svg')
    expect(trigger.attributes('role')).toBe('button')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    await trigger.trigger('click')
    await nextTick()
    expect(trigger.attributes('aria-expanded')).toBe('true')
    expect(findPanel()?.querySelector('[role="search"]')).not.toBeNull()
    await panelControl('[data-find-query] input').setValue('A')
    await panelControl('[data-find-query] input').trigger('keydown', {
      key: 'Enter',
    })
    await vi.waitFor(() =>
      expect(api.value!.getFindState().matches).toHaveLength(1),
    )
    await trigger.trigger('click')
    await nextTick()
    expect(trigger.attributes('aria-expanded')).toBe('false')
    await trigger.trigger('click')
    await nextTick()
    expect(trigger.attributes('aria-expanded')).toBe('true')
    expect(api.value!.getFindState().matches).toEqual([])
    expect(
      (panelControl('[data-find-query] input').element as HTMLInputElement)
        .value,
    ).toBe('')
  })

  it('opens the form without empty-state copy and uses small field controls', async () => {
    const { api } = host()
    await api.value!.openFind()
    const panel = findPanel()!
    expect(panel.textContent).not.toContain(
      'Enter text and choose a search scope.',
    )
    expect(panel.querySelector('p[role="status"]')).toBeNull()
    expect(panel.querySelectorAll('.s-input--small')).toHaveLength(2)
  })

  it('defaults to an icon trigger and shows optional content after the icon', async () => {
    const labeled = host({
      toolbarConfig: { left: [{ itemRender: '$find', content: 'Find cells' }] },
    })
    const labeledTrigger = labeled.table.get('.s-table__find-trigger')
    expect(labeledTrigger.classes()).not.toContain('is-icon-only')
    expect(labeled.table.get('.s-table__find-caption').text()).toContain(
      'Find cells',
    )

    const { table } = host()
    const trigger = table.get('.s-table__find-trigger')
    expect(trigger.classes()).toContain('is-icon-only')
    expect(trigger.attributes('aria-label')).toBe('Find and replace')
    expect(trigger.text()).not.toContain('Find and replace')
  })

  it('shows the icon action purpose in a hover tooltip', async () => {
    const { api } = host()
    await api.value!.openFind()
    const find = panelAction('Find')
    find
      .closest('.s-table__find-tool')!
      .dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
    await vi.waitFor(() =>
      expect(
        [...document.querySelectorAll('.s-tooltip')].some((node) =>
          node.textContent?.includes('Find'),
        ),
      ).toBe(true),
    )
  })

  it('keeps the teleported panel open until Close and collapses to result controls after search', async () => {
    const { table, api } = host()
    expect(await api.value!.openFind()).toBe(true)
    const trigger = table.get('.s-table__find-trigger')
    const layer = findPanel()!
    const outside = document.createElement('button')
    document.body.append(outside)
    outside.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    outside.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))
    await nextTick()
    expect(trigger.attributes('aria-expanded')).toBe('true')
    outside.remove()
    await panelControl('[data-find-query] input').setValue('A')
    panelAction('Find').click()
    await vi.waitFor(() =>
      expect(api.value!.getFindState().matches).toHaveLength(1),
    )
    await vi.waitFor(() =>
      expect(layer.classList.contains('is-compact')).toBe(true),
    )
    expect(layer.classList.contains('is-translucent')).toBe(false)
    expect(layer.querySelector('.s-popper__close')).toBeNull()
    expect(
      getComputedStyle(layer.querySelector('.s-table__find-form')!).display,
    ).toBe('none')
    expect(
      getComputedStyle(layer.querySelector('.s-table__find-results')!).display,
    ).not.toBe('none')
    panelAction('Show find options').click()
    await nextTick()
    expect(layer.classList.contains('is-compact')).toBe(false)
    expect(layer.querySelector('.s-popper__close')).not.toBeNull()
    panelAction('Find').click()
    await vi.waitFor(() =>
      expect(layer.classList.contains('is-compact')).toBe(true),
    )
    panelAction('Close').click()
    await vi.waitFor(() =>
      expect(trigger.attributes('aria-expanded')).toBe('false'),
    )
  })

  it('resets the form and previous matches each time the trigger opens the panel', async () => {
    const { api } = host()
    await api.value!.openFind()
    await panelControl('[data-find-query] input').setValue('A')
    await panelControl('[data-find-replacement] input').setValue('Z')
    await panelControl('[data-find-query] input').trigger('keydown', {
      key: 'Enter',
    })
    api.value!.closeFind()
    await nextTick()
    expect(api.value!.getFindState().matches).toHaveLength(1)
    expect(await api.value!.openFind()).toBe(true)
    await nextTick()
    expect(api.value!.getFindState().matches).toEqual([])
    expect(
      (panelControl('[data-find-query] input').element as HTMLInputElement)
        .value,
    ).toBe('')
    expect(
      (
        panelControl('[data-find-replacement] input')
          .element as HTMLInputElement
      ).value,
    ).toBe('')
  })

  it('keeps replacement text when find is requested while the panel is already open', async () => {
    const { api } = host()
    await api.value!.openFind()
    await panelControl('[data-find-query] input').setValue('A')
    await panelControl('[data-find-replacement] input').setValue('Keep me')
    expect(await api.value!.openFind()).toBe(true)
    await nextTick()
    expect(
      (panelControl('[data-find-query] input').element as HTMLInputElement)
        .value,
    ).toBe('A')
    expect(
      (
        panelControl('[data-find-replacement] input')
          .element as HTMLInputElement
      ).value,
    ).toBe('Keep me')
  })

  it('keeps replacement text after search collapses and the form is expanded again', async () => {
    const { api } = host()
    await api.value!.openFind()
    await panelControl('[data-find-query] input').setValue('A')
    await panelControl('[data-find-replacement] input').setValue('Keep me')
    const input = panelControl('[data-find-replacement] input')
      .element as HTMLInputElement
    expect(input.id).not.toMatch(/replace|password/i)
    expect(input.name).not.toMatch(/replace|password/i)
    panelAction('Find').click()
    await vi.waitFor(() =>
      expect(findPanel()!.classList.contains('is-compact')).toBe(true),
    )
    expect(panelControl('[data-find-replacement] input').element).toBe(input)
    panelAction('Show find options').click()
    await nextTick()
    expect(input.value).toBe('Keep me')
    input.value = ''
    input.dispatchEvent(
      new InputEvent('input', {
        bubbles: true,
        cancelable: true,
        data: '',
        inputType: 'insertReplacementText',
      }),
    )
    await nextTick()
    expect(input.value).toBe('Keep me')
  })

  it('keeps replacement text typed after the compact bar is expanded', async () => {
    const { api } = host()
    await api.value!.openFind()
    await panelControl('[data-find-query] input').setValue('A')
    panelAction('Find').click()
    await vi.waitFor(() =>
      expect(findPanel()!.classList.contains('is-compact')).toBe(true),
    )
    panelAction('Show find options').click()
    await nextTick()
    await panelControl('[data-find-replacement] input').setValue('X')
    await nextTick()
    expect(
      (
        panelControl('[data-find-replacement] input')
          .element as HTMLInputElement
      ).value,
    ).toBe('X')
  })

  it('respects rejected page changes without discarding data-scope results', async () => {
    const { api } = host({ pagerConfig: { pageSize: 1, currentPage: 1 } })
    await api.value!.findCells('B', { scope: 'data' })
    expect(await api.value!.findNext()).toBe(false)
    expect(api.value!.getFindState().matches).toHaveLength(1)
  })

  it('searches and replaces a merged range at the end of a huge generated source', async () => {
    const rowsRead = vi.fn((index: number) => ({ id: index, value: 'Needle' }))
    let values = new Map<number, string>()
    const rowKey = (index: number) => index
    const column = (index: number) => ({
      key: String(index),
      field: 'value',
      title: `C${index}`,
      editor: true,
      fixed: index === 99_999 ? ('right' as const) : undefined,
    })
    const source = () => ({
      rowCount: 1_000_000,
      columnCount: 100_000,
      columnWidth: 120,
      rowKey,
      row: (index: number) => ({
        ...rowsRead(index),
        value: values.get(index) ?? 'Needle',
      }),
      column,
    })
    const initial = source()
    const { api, settings } = host({
      virtualSource: initial,
      virtualConfig: { height: 240, horizontal: true, dynamic: true },
      mergeConfig: {
        body: [{ row: 999_998, col: 99_998, rowspan: 2, colspan: 2 }],
      },
      changeConfig: {
        indexOf: Number,
        apply: async ({ operations, signal }) => {
          if (signal.aborted) return false
          values = new Map(values)
          for (const op of operations)
            if (op.type === 'update')
              for (const patch of op.patches)
                values.set(Number(op.rowKey), String(patch.value))
          settings.value = { ...settings.value, virtualSource: source() }
          return true
        },
      },
    })
    rowsRead.mockClear()
    const result = await api.value!.findCells('Needle', {
      bounds: {
        rowStart: 999_998,
        rowEnd: 1_000_000,
        colStart: 99_998,
        colEnd: 100_000,
      },
    })
    expect(result.state.matches).toHaveLength(1)
    expect(result.state.visited).toBe(4)
    expect(rowsRead.mock.calls.length).toBeLessThan(100)
    expect(await api.value!.replaceAll('Updated')).toMatchObject({
      applied: true,
      changedCells: 1,
    })
    expect(values.get(999_998)).toBe('Updated')
    expect(await api.value!.undo()).toMatchObject({ applied: true })
    expect(values.get(999_998)).toBe('Needle')
  })
  it('is opt-in and keeps returned state independent from its internal matches', async () => {
    const { api, settings, table } = host({
      findConfig: false,
      toolbarConfig: false,
    })
    expect(await api.value!.findCells('A')).toMatchObject({
      success: false,
      reason: 'disabled',
    })
    expect(table.emitted('findChange')).toBeUndefined()
    settings.value = { findConfig: true, toolbarConfig: false }
    await nextTick()
    const result = await api.value!.findCells('A')
    expect(result).toMatchObject({
      success: true,
      state: { complete: true, matches: [{ rowKey: 1, field: 'name' }] },
    })
    result.state.matches[0].text = 'Caller changed'
    expect(api.value!.getFindState().matches[0].text).toBe('A')
  })

  it('renders no panel from findConfig alone and lets the $find toolbar renderer enable the UI', async () => {
    const plain = host({ toolbarConfig: false })
    expect(plain.table.find('.s-table__find').exists()).toBe(false)
    expect(await plain.api.value!.openFind()).toBe(false)
    expect(await plain.api.value!.findCells('A')).toMatchObject({
      success: true,
    })

    const rendered = host({ findConfig: false })
    expect(rendered.table.find('.s-table__find').exists()).toBe(true)
    expect(await rendered.api.value!.openFind()).toBe(true)
    expect(document.querySelector('[role="search"]')).not.toBeNull()
    expect(await rendered.api.value!.findCells('A')).toMatchObject({
      success: true,
    })
  })

  it('navigates matches in both directions and respects controlled active-cell rejection', async () => {
    const { api } = host()
    await api.value!.findCells({ text: 'a', caseSensitive: false })
    expect(await api.value!.findNext()).toBe(true)
    expect(api.value!.getActiveCell()).toMatchObject({
      rowKey: 1,
      columnKey: 'name',
    })
    expect(await api.value!.findPrevious()).toBe(true)
    const controlled = host({ activeCell: null })
    await controlled.api.value!.findCells('A')
    expect(await controlled.api.value!.findNext()).toBe(false)
  })

  it('limits selection scope and keeps fixed column visual order', async () => {
    const { api } = host({
      rangeConfig: true,
      columns: [{ ...columns[0], fixed: 'right' }, columns[1]],
    })
    await api.value!.setCellRange({
      anchor: { rowKey: 1, columnKey: 'count' },
      focus: { rowKey: 2, columnKey: 'count' },
    })
    expect(
      (await api.value!.findCells('A', { scope: 'selection' })).state.matches,
    ).toEqual([])
    expect(
      (await api.value!.findCells('1', { scope: 'selection' })).state.matches,
    ).toMatchObject([{ rowKey: 1, field: 'count' }])
    expect(
      (await api.value!.findCells('A', { bounds: { ...bounds, colStart: 1 } }))
        .state.matches,
    ).toHaveLength(1)
  })

  it('searches supplied data across pages, locates the matching page and updates off-page rows in one batch', async () => {
    const { api, data } = host({ pagerConfig: { pageSize: 1 } })
    expect((await api.value!.findCells('B')).state.matches).toHaveLength(0)
    const result = await api.value!.findCells('B', { scope: 'data' })
    expect(result.state.matches).toHaveLength(1)
    expect(await api.value!.findNext()).toBe(true)
    expect(api.value!.getActiveCell()).toMatchObject({ rowKey: 2 })
    expect(await api.value!.replaceMatch('C')).toMatchObject({
      applied: true,
      changedCells: 1,
    })
    expect(data.value[1].name).toBe('C')
    expect(api.value!.getFindState().matches).toEqual([])
    expect(await api.value!.undo()).toMatchObject({ applied: true })
    expect(data.value[1].name).toBe('B')
  })

  it('finds loaded collapsed tree children and opens their ancestors without loading unrelated branches', async () => {
    const load = vi.fn(async () => [])
    const { api } = host({ treeConfig: { children: 'children', load } }, true, [
      { id: 1, name: 'Parent', children: [{ id: 2, name: 'Child' }] },
      { id: 3, name: 'Other' },
    ])
    expect(
      (await api.value!.findCells('Child', { scope: 'data' })).state.matches,
    ).toHaveLength(1)
    expect(await api.value!.findNext()).toBe(true)
    expect(api.value!.getActiveCell()).toMatchObject({ rowKey: 2 })
    expect(load).not.toHaveBeenCalled()
  })

  it('opens collapsed groups for data-scope navigation while view scope excludes their members', async () => {
    const { api } = host({
      groupConfig: { fields: ['name'], defaultExpanded: false },
    })
    expect((await api.value!.findCells('A')).state.matches).toEqual([])
    expect(
      (await api.value!.findCells('A', { scope: 'data' })).state.matches,
    ).toHaveLength(1)
    expect(await api.value!.findNext()).toBe(true)
    expect(api.value!.getActiveCell()).toMatchObject({ rowKey: 1 })
  })

  it('validates every candidate before emitting a single accepted batch and history step', async () => {
    const validate = vi.fn(
      ({ draftRow }: { draftRow: TableRow }) =>
        draftRow.name !== 'invalid' || 'Rejected name',
    )
    const { api, data, table } = host(
      {
        validationConfig: true,
        validationRules: { name: { validator: validate } },
      },
      true,
      [
        { id: 1, name: 'A', count: 1 },
        { id: 2, name: 'A', count: 2 },
      ],
    )
    await api.value!.findCells('A')
    expect(await api.value!.replaceAll('invalid')).toMatchObject({
      applied: false,
      reason: 'validation',
    })
    expect(data.value.map((r) => r.name)).toEqual(['A', 'A'])
    expect(api.value!.getValidationErrors()).toHaveLength(2)
    expect(table.emitted('dataChange')).toBeUndefined()
    expect(await api.value!.replaceAll('B')).toMatchObject({
      applied: true,
      changedCells: 2,
    })
    expect(table.emitted('dataChange')).toHaveLength(1)
    expect(api.value!.getHistoryState().undoCount).toBe(1)
    expect(await api.value!.undo()).toMatchObject({ applied: true })
    expect(data.value.map((r) => r.name)).toEqual(['A', 'A'])
  })

  it('honors editor readonly conditions, owner rejection and incomplete scans', async () => {
    const { api, data } = host({
      columns: [{ ...columns[0], editor: false }, columns[1]],
    })
    await api.value!.findCells('A')
    expect(await api.value!.replaceAll('C')).toMatchObject({
      applied: false,
      reason: 'readonly',
    })
    expect(data.value[0].name).toBe('A')
    const rejecting = host({}, false)
    await rejecting.api.value!.findCells('A')
    expect(await rejecting.api.value!.replaceAll('C')).toMatchObject({
      applied: false,
      reason: 'rejected',
    })
    const limited = host({ findConfig: { maxCells: 1 } })
    expect((await limited.api.value!.findCells('A')).state).toMatchObject({
      complete: false,
      limit: 'cells',
    })
    expect(await limited.api.value!.replaceAll('C')).toMatchObject({
      applied: false,
      reason: 'limit',
    })
    expect(
      await limited.api.value!.replaceMatch('C', { index: 0 }),
    ).toMatchObject({ applied: true })
  })

  it('replaces writable text and skips number cells that cannot accept the replacement', async () => {
    const { api, data } = host(
      {
        columns: [
          { field: 'id', title: 'Id' },
          { field: 'name', title: 'Name', editor: true },
          { field: 'score', title: 'Score', editor: { type: 'number' } },
        ],
        validationConfig: true,
        validationRules: {
          name: { required: true, max: 24 },
          score: { type: 'number', min: 0, max: 100 },
        },
      },
      true,
      [{ id: 1, name: 'Alpha 1', score: 61 }],
    )
    await api.value!.openFind()
    await panelControl('[data-find-query] input').setValue('1')
    await panelControl('[data-find-replacement] input').setValue('X')
    panelAction('Find').click()
    await vi.waitFor(() =>
      expect(api.value!.getFindState().matches).toHaveLength(3),
    )
    expect(
      api.value!.getFindState().matches[api.value!.getFindState().activeIndex],
    ).toMatchObject({ field: 'name', text: 'Alpha 1', replaceable: true })
    expect(panelAction('Replace current')).toHaveProperty('disabled', false)
    expect(await api.value!.replaceAll('X')).toMatchObject({
      applied: true,
      changedCells: 1,
      skippedCells: 2,
    })
    expect(data.value[0]).toMatchObject({
      id: 1,
      name: 'Alpha X',
      score: 61,
    })
  })

  it('disables replace actions when every match is read-only', async () => {
    const { api } = host(
      {
        columns: [
          { field: 'id', title: 'Id' },
          { field: 'name', title: 'Name', editor: true },
        ],
      },
      true,
      [{ id: 1, name: 'Alpha' }],
    )
    await api.value!.openFind()
    await api.value!.findCells('1')
    await api.value!.findNext({ focus: false })
    expect(api.value!.getFindState()).toMatchObject({
      complete: true,
      activeIndex: 0,
      matches: [{ text: '1', replaceable: false }],
    })
    expect(panelAction('Replace current')).toHaveProperty('disabled', true)
    expect(panelAction('Replace all')).toHaveProperty('disabled', true)
  })

  it('disables replace actions when the draft replacement cannot convert into the active cell', async () => {
    const { api } = host(
      {
        columns: [
          { field: 'id', title: 'Id' },
          { field: 'name', title: 'Name', editor: true },
          { field: 'score', title: 'Score', editor: { type: 'number' } },
        ],
      },
      true,
      [{ id: 1, name: 'Alpha', score: 60 }],
    )
    await api.value!.openFind()
    await panelControl('[data-find-query] input').setValue('0')
    await panelControl('[data-find-replacement] input').setValue('X')
    panelAction('Find').click()
    await vi.waitFor(() =>
      expect(api.value!.getFindState().matches).toHaveLength(1),
    )
    expect(api.value!.getFindState().matches[0]).toMatchObject({
      field: 'score',
      text: '60',
      replaceable: true,
    })
    expect(panelAction('Replace current')).toHaveProperty('disabled', true)
    expect(panelAction('Replace all')).toHaveProperty('disabled', true)
    panelAction('Show find options').click()
    await nextTick()
    await panelControl('[data-find-replacement] input').setValue('9')
    expect(panelAction('Replace current')).toHaveProperty('disabled', true)
    await vi.waitFor(() => {
      expect(panelAction('Replace current')).toHaveProperty('disabled', false)
      expect(panelAction('Replace all')).toHaveProperty('disabled', false)
    })
  })

  it('cancels never-ending validation and suppresses stale replacement feedback', async () => {
    const validator = vi.fn(() => new Promise<boolean>(() => {}))
    const { api, table, data } = host({
      validationConfig: true,
      validationRules: { name: { validator } },
    })
    await api.value!.findCells('A')
    const pending = api.value!.replaceAll('C')
    await vi.waitFor(() => expect(validator).toHaveBeenCalled())
    await api.value!.findCells('B')
    expect(await pending).toMatchObject({ applied: false, reason: 'cancelled' })
    expect(api.value!.getFindState().matches).toMatchObject([{ text: 'B' }])
    expect(table.emitted('replace')).toBeUndefined()
    expect(data.value[0].name).toBe('A')
  })

  it('invalidates results after data, view or configuration changes and stops on unmount', async () => {
    const { api, settings, data, root } = host()
    await api.value!.findCells('A')
    data.value = [{ id: 1, name: 'External' }]
    await nextTick()
    expect(api.value!.getFindState().matches).toEqual([])
    await api.value!.findCells('External')
    settings.value = { findConfig: { maxMatches: 3 } }
    await nextTick()
    expect(api.value!.getFindState().matches).toEqual([])
    const method = api.value!.findCells
    root.unmount()
    expect(await method('A')).toMatchObject({
      success: false,
      reason: 'disabled',
    })
  })
})
