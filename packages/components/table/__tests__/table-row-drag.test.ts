import { defineComponent, h, nextTick, ref, shallowRef } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Table from '../src/table.vue'
import TableColumn from '../src/table-column.vue'
import { createTableDataIndex } from '../src/change-data'
import { planTableRowReorder } from '../src/row-reorder'
import type {
  TableExposes,
  TableProps,
  TableRow,
  TableRowReorderRequest,
} from '../src/table'

const columns = [
  {
    field: 'name',
    title: 'Name',
    dragSort: true,
    fixed: 'left' as const,
    width: 140,
  },
  { field: 'id', width: 100 },
]
const makeRows = () => [
  { id: 1, name: 'A' },
  { id: 2, name: 'B' },
  { id: 3, name: 'C' },
]
const scrollDescriptor = Object.getOwnPropertyDescriptor(
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
  if (scrollDescriptor)
    Object.defineProperty(
      HTMLElement.prototype,
      'scrollIntoView',
      scrollDescriptor,
    )
  else Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView')
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
const setup = (
  extra: Partial<TableProps> = {},
  initial: TableRow[] = makeRows(),
) => {
  const data = shallowRef(initial)
  const table = ref<TableExposes>()
  const root = mount(
    defineComponent({
      setup: () => () =>
        h(Table, {
          ...extra,
          ref: table,
          data: data.value,
          columns: extra.columns ?? columns,
          rowDragConfig: extra.rowDragConfig ?? true,
          'onUpdate:data': (value: TableRow[]) => {
            data.value = value
          },
        }),
    }),
  )
  return { root, table, data }
}

describe('source row reorder planning', () => {
  it('copies only a moved sibling array and ancestor path', () => {
    const children = makeRows()
    const untouched = { id: 20, name: 'untouched' }
    const data = [{ id: 10, name: 'parent', children }, untouched]
    const source = createTableDataIndex({
      data,
      childrenField: 'children',
      key: (row) => row.id,
      children: (row) =>
        'children' in row ? (row.children as typeof children) : [],
    })
    const plan = planTableRowReorder(source, 1, 3, 'after')
    expect(plan).toMatchObject({ oldIndex: 0, newIndex: 2, parentKey: 10 })
    expect(plan.data[1]).toBe(untouched)
    expect(
      ((plan.data[0] as TableRow).children as TableRow[]).map((row) => row.id),
    ).toEqual([2, 3, 1])
    expect(children.map((row) => row.id)).toEqual([1, 2, 3])
    expect(planTableRowReorder(source, 1, 2, 'before').data).toBe(data)
    expect(() => planTableRowReorder(source, 1, 20, 'before')).toThrow(
      'same source parent',
    )
  })
})

describe('Table row dragging', () => {
  it('translates generated page positions into absolute source positions', async () => {
    const keys = new Map<number, number>()
    const keyAt = (index: number) => keys.get(index) ?? index
    const apply = vi.fn((request: TableRowReorderRequest) => {
      expect(request).toMatchObject({
        rowIndex: 0,
        targetIndex: 1,
        oldIndex: 20,
        newIndex: 21,
        rowKey: 20,
        targetKey: 21,
      })
      keys.set(20, 21)
      keys.set(21, 20)
      return true
    })
    const { root, table } = setup({
      virtualSource: {
        rowCount: 1000,
        columnCount: 1,
        row: (index) => ({ id: keyAt(index), name: String(keyAt(index)) }),
        rowKey: keyAt,
        column: () => columns[0],
        columnWidth: 140,
      },
      pagerConfig: { pageSize: 10, currentPage: 3 },
      rowDragConfig: { apply },
    })
    expect((await table.value!.moveRow(0, 1, 'after')).applied).toBe(true)
    expect(apply).toHaveBeenCalledOnce()
    root.unmount()
  })

  it('uses the same proposed array for asynchronous acceptance and reports rejection or adapter errors', async () => {
    let accept = true
    let fail = false
    const data = shallowRef<TableRow[]>(makeRows())
    const apply = async (request: TableRowReorderRequest) => {
      await Promise.resolve()
      if (fail) throw new Error('failed')
      if (accept) data.value = request.data!
      return accept
    }
    const table = ref<TableExposes>()
    const root = mount(
      defineComponent({
        setup: () => () =>
          h(Table, {
            ref: table,
            data: data.value,
            columns,
            rowDragConfig: { apply },
          }),
      }),
    )
    expect((await table.value!.moveRow(0, 2, 'after')).applied).toBe(true)
    accept = false
    expect((await table.value!.moveRow(0, 2, 'after')).reason).toBe('rejected')
    fail = true
    expect(await table.value!.moveRow(0, 2, 'after')).toMatchObject({
      reason: 'invalid',
      error: new Error('failed'),
    })
    expect(data.value.map((row) => row.id)).toEqual([2, 3, 1])
    root.unmount()
  })
  it('requires opt in and explicit handles, and rejects unaccepted data', async () => {
    const root = mount(Table, { props: { data: makeRows(), columns } })
    expect(root.find('.s-table__row-drag-handle').exists()).toBe(false)
    expect((await root.vm.moveRow(0, 2, 'after')).reason).toBe('disabled')
    await root.setProps({ rowDragConfig: true })
    expect(root.findAll('.s-table__row-drag-handle')).toHaveLength(3)
    expect((await root.vm.moveRow(0, 2, 'after')).reason).toBe('rejected')
    expect(root.props('data')![0].id).toBe(1)
    root.unmount()
  })

  it('accepts immutable source order while retaining row selection', async () => {
    const { root, table, data } = setup({ highlight: { id: 1, name: 'A' } })
    const before = data.value
    const result = await table.value!.moveRow(0, 2, 'after')
    expect(result.applied).toBe(true)
    expect(data.value.map((row) => row.id)).toEqual([2, 3, 1])
    expect(before.map((row) => row.id)).toEqual([1, 2, 3])
    expect(data.value[2]).toBe(before[0])
    expect(
      root.findAll('.s-table__data-row').at(-1)!.attributes('aria-selected'),
    ).toBe('true')
    root.unmount()
  })

  it('moves relative to visible targets while preserving hidden rows and other pages', async () => {
    const rows = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      name: String(i),
      group: i % 2 ? 'odd' : 'even',
    }))
    const { root, table, data } = setup(
      {
        columns: [
          ...columns,
          { field: 'group', filters: [{ label: 'even', value: 'even' }] },
        ],
        filters: { group: ['even'] },
        pagerConfig: { currentPage: 2, pageSize: 2 },
      },
      rows,
    )
    expect((await table.value!.moveRow(0, 1, 'after')).applied).toBe(true)
    expect(data.value.map((row) => row.id)).toEqual([0, 1, 2, 3, 5, 6, 4, 7])
    root.unmount()
  })

  it('respects sorted views, predicates, active drafts and unsaved changes', async () => {
    const { root, table } = setup({
      columns: [{ ...columns[0], sortable: true, editor: true }],
      editConfig: true,
      changeConfig: true,
    })
    table.value!.setSort([{ field: 'name', order: 'asc' }])
    await nextTick()
    expect((await table.value!.moveRow(0, 2)).reason).toBe('disabled')
    table.value!.clearSort()
    await nextTick()
    expect(await table.value!.startEdit(0, 'name')).toBe(true)
    expect((await table.value!.moveRow(0, 2)).reason).toBe('disabled')
    table.value!.cancelEdit()
    await nextTick()
    await table.value!.updateRow(1, { name: 'new' })
    expect((await table.value!.moveRow(0, 2)).reason).toBe('disabled')
    table.value!.acceptChanges(table.value!.getChangeRecords().version)
    expect((await table.value!.moveRow(0, 2)).applied).toBe(true)
    root.unmount()
    const other = setup({
      rowDragConfig: {
        checkMethod: ({ rowKey }) => rowKey !== 1,
        dropMethod: ({ targetKey }) => targetKey !== 3,
      },
    })
    expect((await other.table.value!.moveRow(0, 1)).reason).toBe('invalid')
    expect((await other.table.value!.moveRow(1, 2)).reason).toBe('invalid')
    other.root.unmount()
  })

  it('reorders loaded lazy siblings without mutating the original parent', async () => {
    const parent = { id: 10, name: 'parent', lazy: true }
    const { root, table, data } = setup(
      {
        columns: [{ ...columns[0], treeNode: true }],
        treeConfig: { hasChildren: 'lazy', load: async () => makeRows() },
      },
      [parent],
    )
    await table.value!.toggleRowExpand(parent)
    await flushPromises()
    expect((await table.value!.moveRow(1, 3, 'after')).applied).toBe(true)
    expect((data.value[0].children as TableRow[]).map((row) => row.id)).toEqual(
      [2, 3, 1],
    )
    expect(parent).not.toHaveProperty('children')
    expect((await table.value!.moveRow(0, 1)).reason).toBe('invalid')
    root.unmount()
  })

  it('settles a cancelled or unmounted asynchronous adapter and preserves new external data', async () => {
    let request!: TableRowReorderRequest
    const adapter = vi.fn((value: TableRowReorderRequest) => {
      request = value
      return new Promise<boolean>(() => {})
    })
    const { root, table, data } = setup({ rowDragConfig: { apply: adapter } })
    const operation = table.value!.moveRow(0, 2, 'after')
    await flushPromises()
    expect((await table.value!.moveRow(0, 1)).reason).toBe('busy')
    data.value = [{ id: 99, name: 'external' }]
    await nextTick()
    expect((await operation).reason).toBe('cancelled')
    expect(request.signal.aborted).toBe(true)
    data.value = makeRows()
    await nextTick()
    const second = table.value!.moveRow(0, 2, 'after')
    await flushPromises()
    root.unmount()
    expect((await second).reason).toBe('cancelled')
  })

  it('moves generated source indices through a bounded sparse adapter', async () => {
    const keys = new Map<number, number>()
    const rowKey = (index: number) => keys.get(index) ?? index
    const row = vi.fn(
      (index: number) =>
        new Proxy(
          { id: rowKey(index), name: String(rowKey(index)) },
          {
            ownKeys() {
              throw new Error('Do not enumerate generated rows')
            },
          },
        ),
    )
    const apply = vi.fn((request: TableRowReorderRequest) => {
      expect(request.data).toBeUndefined()
      expect(request.oldIndex).toBe(999_998)
      keys.set(999_998, 999_999)
      keys.set(999_999, 999_998)
      return true
    })
    const { root, table } = setup({
      virtualSource: {
        rowCount: 1_000_000,
        columnCount: 100_000,
        row,
        rowKey,
        column: (index) => ({
          key: String(index),
          field: 'name',
          dragSort: index === 0,
        }),
        columnWidth: 120,
      },
      virtualConfig: { height: 180, horizontal: true, dynamic: true },
      rowDragConfig: { apply },
    })
    row.mockClear()
    expect(
      (await table.value!.moveRow(999_998, 999_999, 'after')).applied,
    ).toBe(true)
    expect(apply).toHaveBeenCalledOnce()
    expect(row.mock.calls.length).toBeLessThan(60)
    root.unmount()
  })

  it('supports keyboard pickup, target selection, drop and cancellation with declarative columns', async () => {
    const data = ref(makeRows())
    const root = mount(
      defineComponent({
        setup: () => () =>
          h(
            Table,
            {
              data: data.value,
              rowDragConfig: true,
              'onUpdate:data': (rows: TableRow[]) => {
                data.value = rows as typeof data.value
              },
            },
            () => h(TableColumn, { field: 'name', dragSort: true }),
          ),
      }),
      { attachTo: document.body },
    )
    await nextTick()
    const handle = root.findAll('.s-table__row-drag-handle')[0]
    await handle.trigger('keydown', { key: ' ' })
    await root.get('.s-table').trigger('keydown', { key: 'ArrowDown' })
    expect(root.find('.is-drop-after').text()).toContain('B')
    await root.get('.s-table').trigger('keydown', { key: 'Enter' })
    await flushPromises()
    expect(data.value.map((row) => row.id)).toEqual([2, 1, 3])
    await root
      .findAll('.s-table__row-drag-handle')[0]
      .trigger('keydown', { key: ' ' })
    await root.get('.s-table').trigger('keydown', { key: 'ArrowDown' })
    await root.get('.s-table').trigger('keydown', { key: 'Escape' })
    expect(data.value.map((row) => row.id)).toEqual([2, 1, 3])
    expect(root.find('.is-dragging-row').exists()).toBe(false)
    root.unmount()
  })
})
