import { defineComponent, h, nextTick, ref, shallowRef } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Table from '../src/table.vue'
import type {
  TableClipboardResult,
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
const clipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard')
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
  if (clipboard) Object.defineProperty(navigator, 'clipboard', clipboard)
  else Reflect.deleteProperty(navigator, 'clipboard')
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
          clipboardConfig: true,
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
function mockClipboard() {
  class Item {
    constructor(readonly data: Record<string, Promise<Blob>>) {}
  }
  vi.stubGlobal('ClipboardItem', Item)
  const write = vi.fn(async (items: Item[]) => {
    await items[0].data['text/plain']
  })
  const readText = vi.fn(async () => 'C\t3\nD\t4')
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { write, readText },
  })
  return { write, readText }
}

describe('Table clipboard integration', () => {
  it.each([0, 1])(
    'honors both columns sharing a field when column %i rejects the value',
    async (rejecting) => {
      const { api, data } = host({
        validationConfig: true,
        columns: [0, 1].map((index) => ({
          key: `name-${index}`,
          field: 'name',
          editor: true,
          rules: { min: index === rejecting ? 3 : 1 },
        })),
      })
      const selected = { ...bounds, rowEnd: 1 }
      expect(
        await api.value!.pasteCells('C\tC', { bounds: selected }),
      ).toMatchObject({
        success: false,
        reason: 'validation',
        errors: [{ columnIndex: rejecting }],
      })
      expect(api.value!.getValidationErrors()).toMatchObject([
        { columnIndex: rejecting },
      ])
      expect(data.value[0].name).toBe('A')
      expect(api.value!.getHistoryState().undoCount).toBe(0)
      expect(
        await api.value!.pasteCells('Valid\tValid', { bounds: selected }),
      ).toMatchObject({
        success: true,
        changedCells: 1,
      })
      expect(api.value!.getValidationErrors()).toEqual([])
      expect(api.value!.getHistoryState().undoCount).toBe(1)
    },
  )

  it('preserves accepted writes when editing a grouping field creates different groups', async () => {
    const { api, data } = host({ groupConfig: { fields: ['name'] } })
    expect(await api.value!.pasteCells('C\t3\nD\t4', { bounds })).toMatchObject(
      { success: true, changedCells: 4 },
    )
    expect(data.value.map(({ name }) => name)).toEqual(['C', 'D'])
    expect(api.value!.getHistoryState().undoCount).toBe(1)
    expect(await api.value!.undo()).toEqual({ applied: true })
    expect(data.value.map(({ name }) => name)).toEqual(['A', 'B'])
  })

  it('uses visible page order and fixed-column order while updating source row keys', async () => {
    const { api, data } = host(
      {
        columns: [{ ...columns[0], fixed: 'right' }, columns[1]],
        pagerConfig: { currentPage: 2, pageSize: 2 },
      },
      true,
      Array.from({ length: 6 }, (_, id) => ({
        id,
        name: `Row ${id}`,
        count: id,
      })),
    )
    expect(
      await api.value!.copyCells({ bounds, writeClipboard: false }),
    ).toMatchObject({
      success: true,
      data: [
        [2, 'Row 2'],
        [3, 'Row 3'],
      ],
    })
    expect(
      await api.value!.pasteCells(
        [
          [22, 'Page C'],
          [33, 'Page D'],
        ],
        { bounds },
      ),
    ).toMatchObject({ success: true })
    expect(data.value[2]).toMatchObject({ id: 2, name: 'Page C', count: 22 })
    expect(data.value[0].name).toBe('Row 0')
  })

  it('updates expanded tree parents and children through the same batch and undo pipeline', async () => {
    const initial = [
      {
        id: 1,
        name: 'Parent',
        count: 1,
        children: [{ id: 2, name: 'Child', count: 2 }],
      },
    ]
    const { api, data } = host(
      { treeConfig: { children: 'children' }, expandedKeys: [1] },
      true,
      initial,
    )
    expect(
      await api.value!.copyCells({ bounds, writeClipboard: false }),
    ).toMatchObject({
      success: true,
      data: [
        ['Parent', 1],
        ['Child', 2],
      ],
    })
    expect(await api.value!.pasteCells('P\t3\nC\t4', { bounds })).toMatchObject(
      { success: true },
    )
    expect(data.value[0]).toMatchObject({
      name: 'P',
      children: [{ id: 2, name: 'C', count: 4 }],
    })
    expect(await api.value!.undo()).toEqual({ applied: true })
    expect(data.value).toEqual(initial)
  })

  it('does not claim a cancelled OS write failed or allow its late result to replace newer feedback', async () => {
    const { write } = mockClipboard()
    let resolve!: () => void
    write.mockImplementation(
      () =>
        new Promise<void>((done) => {
          resolve = done
        }),
    )
    const { api, table, data } = host()
    const pending = api.value!.cutCells({ bounds })
    await flushPromises()
    api.value!.cancelClipboard()
    const cancelled = await pending
    expect(cancelled).toMatchObject({
      reason: 'cancelled',
      clipboardWritten: null,
      applied: false,
    })
    const latest = await api.value!.copyCells({ bounds, writeClipboard: false })
    resolve()
    await flushPromises()
    expect(cancelled.clipboardWritten).toBeNull()
    expect(table.emitted('clipboard')!.at(-1)![0]).toEqual(latest)
    expect(data.value[0].name).toBe('A')
  })

  it('is opt-in and does not require OS access for explicit data snapshots', async () => {
    const { api, table } = host({ clipboardConfig: false })
    expect(
      await api.value!.copyCells({ bounds, writeClipboard: false }),
    ).toMatchObject({ success: false, reason: 'disabled' })
    expect(table.emitted('clipboard')).toHaveLength(1)
    const enabled = host()
    const result = await enabled.api.value!.copyCells({
      bounds,
      writeClipboard: false,
    })
    expect(result).toMatchObject({
      success: true,
      action: 'copy',
      clipboardWritten: false,
      applied: false,
      text: 'A\t1\r\nB\t2',
      data: [
        ['A', 1],
        ['B', 2],
      ],
    })
  })

  it('pastes one batch with typed numeric fields and one undo/redo step', async () => {
    const { api, data, table } = host()
    expect(await api.value!.pasteCells('C\t3\nD\t4', { bounds })).toMatchObject(
      { success: true, applied: true, changedCells: 4 },
    )
    expect(data.value.map(({ name, count }) => [name, count])).toEqual([
      ['C', 3],
      ['D', 4],
    ])
    expect(table.emitted('dataChange')).toHaveLength(1)
    expect(api.value!.getHistoryState().undoCount).toBe(1)
    expect(await api.value!.undo()).toEqual({ applied: true })
    expect(data.value.map(({ name, count }) => [name, count])).toEqual([
      ['A', 1],
      ['B', 2],
    ])
    expect(await api.value!.redo()).toEqual({ applied: true })
    expect(data.value[1].count).toBe(4)
  })

  it('falls back to the active cell and expands a one-cell destination to the incoming shape', async () => {
    const { api, data } = host()
    expect(await api.value!.setActiveCell(0, 0)).toBe(true)
    expect(
      await api.value!.pasteCells([
        ['C', 3],
        ['D', 4],
      ]),
    ).toMatchObject({ success: true, bounds })
    expect(data.value[1].name).toBe('D')
    expect(await api.value!.pasteCells([['X', 1, 2]])).toMatchObject({
      success: false,
      reason: 'shape',
    })
    expect(data.value[0].name).toBe('C')
  })

  it('uses the controlled range and keeps readonly cells in place', async () => {
    const { api, data } = host({
      rangeConfig: true,
      cellRange: {
        anchor: { rowKey: 1, columnKey: 'name' },
        focus: { rowKey: 2, columnKey: 'count' },
      },
      clipboardConfig: {
        checkMethod: ({ rowKey, column }) =>
          rowKey !== 1 || column.field !== 'name',
      },
    })
    await flushPromises()
    expect(await api.value!.pasteCells('C\t3\nD\t4')).toMatchObject({
      success: true,
      skippedCells: 1,
      changedCells: 3,
    })
    expect(data.value[0]).toMatchObject({ name: 'A', count: 3 })
    expect(data.value[1]).toMatchObject({ name: 'D', count: 4 })
  })

  it('copies before clearing a cut and leaves the cleared data undoable', async () => {
    const { write } = mockClipboard()
    const { api, data } = host({
      clipboardConfig: {
        checkMethod: ({ column }) => column.field !== 'count',
      },
    })
    expect(await api.value!.cutCells({ bounds })).toMatchObject({
      success: true,
      clipboardWritten: true,
      changedCells: 2,
      skippedCells: 2,
    })
    expect(write).toHaveBeenCalledTimes(1)
    expect(data.value.map(({ name, count }) => [name, count])).toEqual([
      [null, 1],
      [null, 2],
    ])
    expect(await api.value!.undo()).toEqual({ applied: true })
    expect(data.value[0].name).toBe('A')
  })

  it('validates complete candidate rows and retains all data on any validation failure', async () => {
    const validate = vi.fn(
      ({ draftRow }: { draftRow: TableRow }) =>
        (draftRow.name === 'C' && draftRow.count === 3) || 'Invalid pair',
    )
    const { api, data } = host({
      validationConfig: true,
      validationRules: { count: { validator: validate } },
    })
    expect(await api.value!.pasteCells('C\t3\nD\t4', { bounds })).toMatchObject(
      { success: false, reason: 'validation' },
    )
    expect(validate).toHaveBeenCalledTimes(2)
    expect(data.value.map(({ name }) => name)).toEqual(['A', 'B'])
    expect(api.value!.getHistoryState().undoCount).toBe(0)
    expect(api.value!.getValidationErrors()).toHaveLength(1)
    expect(await api.value!.pasteCells('C\t3\nC\t3', { bounds })).toMatchObject(
      { success: true },
    )
    expect(api.value!.getValidationErrors()).toEqual([])
  })

  it('reports a copied but uncleared cut when required validation prevents clearing', async () => {
    mockClipboard()
    const { api, data } = host({
      validationConfig: true,
      validationRules: { name: { required: true } },
    })
    expect(await api.value!.cutCells({ bounds })).toMatchObject({
      success: false,
      reason: 'validation',
      clipboardWritten: true,
      applied: false,
    })
    expect(data.value[0].name).toBe('A')
    expect(api.value!.getHistoryState().undoCount).toBe(0)
  })

  it('cancels a never-ending validator and does not let stale feedback replace a newer copy', async () => {
    const validator = vi.fn(() => new Promise<boolean>(() => {}))
    const { api, table, data } = host({
      validationConfig: true,
      validationRules: { name: { validator } },
    })
    const pending = api.value!.pasteCells('C\t3\nD\t4', { bounds })
    await flushPromises()
    expect(validator).toHaveBeenCalled()
    const copied = await api.value!.copyCells({ bounds, writeClipboard: false })
    expect(copied.success).toBe(true)
    expect(await pending).toMatchObject({ success: false, reason: 'cancelled' })
    expect(
      (table.emitted('clipboard')!.at(-1)![0] as TableClipboardResult).action,
    ).toBe('copy')
    expect(data.value[0].name).toBe('A')
  })

  it('aborts pending work on data replacement, configuration changes and unmount', async () => {
    for (const change of ['data', 'config', 'unmount']) {
      const { api, data, settings, root } = host({
        validationConfig: true,
        validationRules: {
          name: { validator: () => new Promise<boolean>(() => {}) },
        },
      })
      const pending = api.value!.pasteCells('C\t3\nD\t4', { bounds })
      await flushPromises()
      if (change === 'data')
        data.value = [{ id: 1, name: 'External' }, { id: 2 }]
      else if (change === 'config')
        settings.value = { ...settings.value, clipboardConfig: false }
      else root.unmount()
      await nextTick()
      expect(await pending).toMatchObject({
        success: false,
        reason: 'cancelled',
      })
    }
  })

  it('preserves the whole batch when its owner rejects it or a value cannot be converted', async () => {
    const { api, data } = host({}, false)
    expect(await api.value!.pasteCells('C\t3\nD\t4', { bounds })).toMatchObject(
      { success: false, reason: 'rejected' },
    )
    expect(
      await api.value!.pasteCells('C\tbad\nD\t4', { bounds }),
    ).toMatchObject({ success: false, reason: 'invalid' })
    expect(data.value[0].name).toBe('A')
    expect(api.value!.getHistoryState().undoCount).toBe(0)
  })

  it('reads native paste data synchronously and leaves editor copy/paste untouched', async () => {
    const { write, readText } = mockClipboard()
    const { api, data, table } = host()
    await api.value!.setActiveCell(0, 0)
    const event = new Event('paste', { bubbles: true, cancelable: true })
    Object.defineProperty(event, 'clipboardData', {
      value: { types: ['text/plain'], getData: () => 'C\t3\nD\t4' },
    })
    table.get('[role="cell"]').element.dispatchEvent(event)
    await flushPromises()
    expect(event.defaultPrevented).toBe(true)
    expect(readText).not.toHaveBeenCalled()
    expect(data.value[1].count).toBe(4)
    await api.value!.startEdit(data.value[0], 'name')
    const copy = new Event('copy', { bubbles: true, cancelable: true })
    table.get('.s-table__cell-editor input').element.dispatchEvent(copy)
    expect(copy.defaultPrevented).toBe(false)
    expect(write).not.toHaveBeenCalled()
    expect(await api.value!.pasteCells('X', { bounds })).toMatchObject({
      reason: 'editing',
    })
  })

  it('handles browser permission rejection without clearing source data', async () => {
    const { write } = mockClipboard()
    write.mockRejectedValue(new DOMException('Denied', 'NotAllowedError'))
    const { api, data } = host()
    expect(await api.value!.cutCells({ bounds })).toMatchObject({
      reason: 'clipboard',
      clipboardWritten: false,
      applied: false,
    })
    expect(data.value[0].name).toBe('A')
  })

  it('handles source indices, virtual columns and offscreen merges without materializing the matrix', async () => {
    const values = new Map<number, string>()
    let reads = 0
    const source = {
      rowCount: 1_000_000,
      columnCount: 100_000,
      columnWidth: 120,
      row: (index: number): TableRow => {
        reads++
        return new Proxy(
          {},
          {
            get: (_, field) =>
              field === 'id'
                ? index
                : (values.get(index) ?? `${index}:${String(field)}`),
            has: () => true,
            ownKeys: () => {
              throw new Error('Do not enumerate')
            },
          },
        )
      },
      rowKey: (index: number) => index,
      column: (index: number) => ({ field: `c${index}`, editor: true }),
    }
    const { api } = host(
      {
        virtualSource: source,
        virtualConfig: { horizontal: true },
        changeConfig: {
          indexOf: Number,
          apply: ({ operations }) => {
            for (const operation of operations)
              values.set(
                Number(operation.rowKey),
                String(operation.patches[0].value),
              )
            return true
          },
        },
        mergeConfig: {
          body: [{ row: 999_998, col: 99_998, rowspan: 2, colspan: 2 }],
        },
      },
      true,
      [],
    )
    reads = 0
    const end = {
      rowStart: 999_998,
      rowEnd: 1_000_000,
      colStart: 99_998,
      colEnd: 100_000,
    }
    expect(
      await api.value!.copyCells({ bounds: end, writeClipboard: false }),
    ).toMatchObject({
      success: true,
      data: [
        ['999998:c99998', ''],
        ['', ''],
      ],
    })
    expect(
      await api.value!.pasteCells(
        [
          ['changed', ''],
          ['', ''],
        ],
        { bounds: end },
      ),
    ).toMatchObject({ success: true, changedCells: 1 })
    expect(values.get(999_998)).toBe('changed')
    expect(reads).toBeLessThan(150)
  })
})
