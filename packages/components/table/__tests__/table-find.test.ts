import { defineComponent, h, nextTick, ref, shallowRef } from 'vue'
import { mount } from '@vue/test-utils'
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
    const { api, table, settings } = host()
    await api.value!.findCells('A')
    await api.value!.findNext({ focus: false })
    await api.value!.openFind()
    await table.find('[data-find-replacement] input').setValue('C')
    const replace = table
      .findAll('.s-table__find-panel button')
      .find((button) => button.text() === 'Replace current')!
    await replace.trigger('click')
    await vi.waitFor(() =>
      expect(table.find('.s-table__find-panel > p').text()).toContain(
        'Updated 1',
      ),
    )
    await api.value!.undo()
    await nextTick()
    expect(table.find('.s-table__find-panel > p').text()).not.toContain(
      'Updated',
    )
    settings.value = { findConfig: { maxCells: 1 } }
    await nextTick()
    await api.value!.findCells('unmatched')
    await nextTick()
    expect(table.find('.s-table__find-panel > p').text()).toContain(
      'Limit reached',
    )
    expect(table.find('.s-table__find-panel > p').text()).not.toContain(
      'Updated',
    )
  })

  it('uses current tree expansion state in data-scope replacement conditions', async () => {
    const { api, data } = host(
      {
        treeConfig: { children: 'children' },
        findConfig: { checkMethod: ({ expanded }) => expanded },
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
    const { api, table } = host({}, true, [
      { id: 1, name: 'A', count: 1 },
      { id: 2, name: 'A', count: 2 },
    ])
    await api.value!.findCells('A')
    await api.value!.findNext({ focus: false })
    await api.value!.openFind()
    const input = table.find('[data-find-query] input').element
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
    const input = table.find('[data-find-query] input')
    expect(input.exists()).toBe(true)
    expect(document.activeElement).toBe(input.element)
    await input.setValue('A')
    await input.trigger('keydown', { key: 'Enter' })
    await vi.waitFor(() =>
      expect(api.value!.getFindState().matches).toHaveLength(1),
    )
    await input.trigger('keydown', { key: 'Escape' })
    expect(table.find('[role="search"]').exists()).toBe(false)
    expect(document.activeElement).toBe(
      table.find('.s-table__find > button').element,
    )
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
    const { api, settings, table } = host({ findConfig: false })
    expect(await api.value!.findCells('A')).toMatchObject({
      success: false,
      reason: 'disabled',
    })
    expect(table.emitted('findChange')).toBeUndefined()
    settings.value = { findConfig: true }
    await nextTick()
    const result = await api.value!.findCells('A')
    expect(result).toMatchObject({
      success: true,
      state: { complete: true, matches: [{ rowKey: 1, field: 'name' }] },
    })
    result.state.matches[0].text = 'Caller changed'
    expect(api.value!.getFindState().matches[0].text).toBe('A')
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
