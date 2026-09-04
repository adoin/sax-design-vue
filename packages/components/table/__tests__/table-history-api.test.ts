import { computed, defineComponent, h, nextTick, ref, shallowRef } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Table from '../src/table.vue'
import type { Ref } from 'vue'
import type {
  TableChangeConfig,
  TableDataChangeRequest,
  TableExposes,
  TableRow,
} from '../src/table'

const columns = [{ field: 'name', title: 'Name', editor: true }]
const descriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollIntoView',
)
beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  )
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
  })
})
afterEach(() => {
  vi.unstubAllGlobals()
  if (descriptor)
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', descriptor)
  else Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView')
})
const host = (
  initial: TableRow[] = [{ id: 1, name: 'A' }],
  extra: Record<string, unknown> = {},
) => {
  const data = ref(initial)
  const options = shallowRef(extra)
  const api = shallowRef<TableExposes>()
  const root = mount(
    defineComponent({
      setup: () => () =>
        h(Table, {
          ref: api,
          data: data.value,
          columns,
          changeConfig: true,
          historyConfig: true,
          editConfig: true,
          'onUpdate:data': (next: TableRow[]) => {
            data.value = next
          },
          ...options.value,
        }),
    }),
  )
  return { root, table: root.findComponent(Table), data, api, options }
}

describe('Table undo and redo API', () => {
  it('requires explicit history and change tracking', async () => {
    for (const extra of [{ historyConfig: false }, { changeConfig: false }]) {
      const { root, api } = host(undefined, extra)
      expect(await api.value!.undo()).toEqual({
        applied: false,
        reason: 'disabled',
      })
      root.unmount()
    }
  })

  it('replays sequential edits, branches after undo, and skips unchanged values', async () => {
    const { root, api, data } = host()
    await api.value!.updateRow(1, { name: 'B' })
    await api.value!.updateRow(1, { name: 'C' })
    expect(await api.value!.undo()).toEqual({ applied: true })
    expect(data.value[0].name).toBe('B')
    expect(await api.value!.undo()).toEqual({ applied: true })
    expect(data.value[0].name).toBe('A')
    expect(api.value!.getChangeRecords().updated).toEqual([])
    expect(await api.value!.redo()).toEqual({ applied: true })
    expect(data.value[0].name).toBe('B')
    await api.value!.updateRow(1, { name: 'B' })
    expect(api.value!.getHistoryState()).toMatchObject({
      undoCount: 1,
      redoCount: 1,
    })
    await api.value!.updateRow(1, { name: 'D' })
    expect(api.value!.getHistoryState()).toMatchObject({
      undoCount: 2,
      redoCount: 0,
    })
    expect(await api.value!.redo()).toEqual({ applied: false, reason: 'empty' })
    root.unmount()
  })

  it('groups batch insertions and makes revert-all itself undoable', async () => {
    const { root, api, data } = host()
    await api.value!.insertRows([
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
    ])
    await api.value!.removeRows([1])
    expect(api.value!.getHistoryState().undoCount).toBe(2)
    await api.value!.revertChanges()
    expect(data.value).toEqual([{ id: 1, name: 'A' }])
    expect(await api.value!.undo()).toEqual({ applied: true })
    expect(data.value.map((row) => row.id)).toEqual([2, 3])
    expect(api.value!.getChangeRecords()).toMatchObject({
      inserted: [{ rowKey: 2 }, { rowKey: 3 }],
      removed: [{ rowKey: 1 }],
    })
    expect(await api.value!.undo()).toEqual({ applied: true })
    expect(data.value.map((row) => row.id)).toEqual([1, 2, 3])
    expect(await api.value!.undo()).toEqual({ applied: true })
    expect(data.value).toEqual([{ id: 1, name: 'A' }])
    expect(api.value!.getChangeRecords().inserted).toEqual([])
    root.unmount()
  })

  it('preserves missing nested properties and rejects out-of-band field conflicts', async () => {
    const { root, api, data } = host([{ id: 1 }])
    await api.value!.updateRow(1, { 'detail.name': 'B' })
    expect(await api.value!.undo()).toEqual({ applied: true })
    expect(data.value[0]).not.toHaveProperty('detail')
    await api.value!.redo()
    ;(data.value[0].detail as Record<string, unknown>).name = 'external'
    expect(await api.value!.undo()).toEqual({
      applied: false,
      reason: 'conflict',
    })
    expect(data.value[0].detail).toEqual({ name: 'external' })
    expect(api.value!.getHistoryState().undoCount).toBe(1)
    root.unmount()
  })

  it('records validated row edits as one step and protects the active draft', async () => {
    const { root, api, data, table } = host([{ id: 1, name: 'A', count: 1 }], {
      editConfig: { mode: 'row' },
      validationConfig: true,
      columns: [...columns, { field: 'count', editor: { type: 'number' } }],
      validationRules: { name: { required: true } },
    })
    await api.value!.startEdit(data.value[0], 'name')
    await table.get('.s-table__cell-editor input').setValue('')
    expect(await api.value!.commitEdit()).toBe(false)
    expect(api.value!.getHistoryState().undoCount).toBe(0)
    await table.findAll('.s-table__cell-editor input')[0].setValue('B')
    await table.findAll('.s-table__cell-editor input')[1].setValue(5)
    expect(await api.value!.commitEdit()).toBe(true)
    expect(api.value!.getHistoryState().undoCount).toBe(1)
    await api.value!.startEdit(data.value[0], 'name')
    expect(await api.value!.undo()).toEqual({
      applied: false,
      reason: 'editing',
    })
    api.value!.cancelEdit()
    expect(await api.value!.undo()).toEqual({ applied: true })
    expect(data.value[0]).toEqual({ id: 1, name: 'A', count: 1 })
    root.unmount()
  })

  it('restores removed lazy branches and their previous tracking state', async () => {
    const child = {
      id: 2,
      name: 'loaded',
      children: [{ id: 3, name: 'nested' }],
    }
    const { root, api, data, table } = host(
      [{ id: 1, name: 'parent', lazy: true }],
      {
        treeConfig: { hasChildren: 'lazy', load: async () => [child] },
      },
    )
    await api.value!.toggleRowExpand(data.value[0], true)
    await api.value!.updateRow(3, { name: 'edited' })
    await api.value!.removeRows([1])
    expect(await api.value!.undo()).toEqual({ applied: true })
    expect(table.text()).toContain('loaded')
    expect(
      ((data.value[0].children as TableRow[])[0].children as TableRow[])[0]
        .name,
    ).toBe('edited')
    expect(api.value!.getChangeRecords().updated[0].rowKey).toBe(3)
    expect(await api.value!.undo()).toEqual({ applied: true })
    expect(
      ((data.value[0].children as TableRow[])[0].children as TableRow[])[0]
        .name,
    ).toBe('nested')
    expect(await api.value!.redo()).toEqual({ applied: true })
    expect(await api.value!.redo()).toEqual({ applied: true })
    expect(data.value).toEqual([])
    root.unmount()
  })

  it('does not consume a rejected or cancelled asynchronous replay', async () => {
    let accept = true
    let delayed = false
    let request!: TableDataChangeRequest
    let finish!: (value: boolean) => void
    let data!: Ref<TableRow[]>
    const config: TableChangeConfig = {
      apply: (value) => {
        request = value
        if (delayed)
          return new Promise((resolve) => {
            finish = resolve
          })
        if (accept) data.value = value.data!
        return accept
      },
    }
    const instance = host(undefined, { changeConfig: config })
    data = instance.data
    const { root, api } = instance
    await api.value!.updateRow(1, { name: 'B' })
    accept = false
    expect(await api.value!.undo()).toEqual({
      applied: false,
      reason: 'rejected',
    })
    expect(api.value!.getHistoryState().undoCount).toBe(1)
    delayed = true
    const pending = api.value!.undo()
    expect(await api.value!.redo()).toEqual({ applied: false, reason: 'busy' })
    api.value!.cancelDataChange()
    expect(request.signal.aborted).toBe(true)
    finish(true)
    expect(await pending).toEqual({ applied: false, reason: 'cancelled' })
    expect(data.value[0].name).toBe('B')
    expect(api.value!.getHistoryState()).toMatchObject({
      undoCount: 1,
      redoCount: 0,
    })
    delayed = false
    accept = true
    expect(await api.value!.undo()).toEqual({ applied: true })
    root.unmount()
  })

  it('clears history on confirmation or external baselines and enforces a limit', async () => {
    const { root, api, data } = host(undefined, { historyConfig: { limit: 2 } })
    for (const name of ['B', 'C', 'D']) await api.value!.updateRow(1, { name })
    expect(api.value!.getHistoryState().undoCount).toBe(2)
    await api.value!.undo()
    await api.value!.undo()
    expect(data.value[0].name).toBe('B')
    expect(await api.value!.undo()).toEqual({ applied: false, reason: 'empty' })
    expect(
      api.value!.acceptChanges(api.value!.getChangeRecords().version, [1]),
    ).toBe(true)
    expect(api.value!.getHistoryState().redoCount).toBe(0)
    await api.value!.updateRow(1, { name: 'E' })
    data.value = [{ id: 1, name: 'new baseline' }]
    await nextTick()
    expect(api.value!.getHistoryState().undoCount).toBe(0)
    expect(api.value!.getChangeRecords().updated).toEqual([])
    root.unmount()
  })

  it('replays an opaque million-row source without enumerating rows or fields', async () => {
    const values = shallowRef(new Map<number, string>())
    const api = shallowRef<TableExposes>()
    const reads = vi.fn()
    const keyAt = (index: number) => index
    const column = () => columns[0]
    const source = computed(() => {
      const snapshot = values.value
      return {
        rowCount: 1_000_000,
        columnCount: 100_000,
        columnWidth: 120,
        column,
        rowKey: keyAt,
        row: (id: number) => {
          reads(id)
          return new Proxy(
            {},
            {
              get: (_, key) =>
                key === 'name' ? (snapshot.get(id) ?? `Row ${id}`) : undefined,
              ownKeys: () => {
                throw new Error('Do not enumerate generated data')
              },
            },
          )
        },
      }
    })
    const config: TableChangeConfig = {
      indexOf: (key) => Number(key),
      apply: ({ operations }) => {
        const next = new Map(values.value)
        for (const operation of operations)
          next.set(Number(operation.rowKey), operation.row.name as string)
        values.value = next
        return true
      },
    }
    const root = mount(
      defineComponent({
        setup: () => () =>
          h(Table, {
            ref: api,
            virtualSource: source.value,
            changeConfig: config,
            historyConfig: true,
            virtualConfig: { height: 180, horizontal: true },
          }),
      }),
    )
    const before = reads.mock.calls.length
    expect(await api.value!.updateRow(999_999, { name: 'B' })).toEqual({
      applied: true,
    })
    expect(await api.value!.undo()).toEqual({ applied: true })
    expect(values.value.get(999_999)).toBe('Row 999999')
    expect(await api.value!.redo()).toEqual({ applied: true })
    expect(values.value.get(999_999)).toBe('B')
    expect(api.value!.getChangeRecords().updated[0].fields[0]).toMatchObject({
      oldValue: 'Row 999999',
      value: 'B',
    })
    expect(reads.mock.calls.length - before).toBeLessThan(100)
    await flushPromises()
    root.unmount()
  })

  it('clears history without discarding changes and cancels a pending replay on unmount', async () => {
    const { root, api, data, options } = host()
    await api.value!.updateRow(1, { name: 'B' })
    api.value!.clearHistory()
    expect(data.value[0].name).toBe('B')
    expect(api.value!.getChangeRecords().updated).toHaveLength(1)
    expect(api.value!.getHistoryState()).toEqual({
      undoCount: 0,
      redoCount: 0,
      canUndo: false,
      canRedo: false,
    })
    await api.value!.updateRow(1, { name: 'C' })
    let request!: TableDataChangeRequest
    options.value = {
      changeConfig: {
        apply: (value: TableDataChangeRequest) => {
          request = value
          return new Promise<boolean>(() => {})
        },
      },
    }
    await nextTick()
    const undo = api.value!.undo()
    root.unmount()
    expect(request.signal.aborted).toBe(true)
    expect(await undo).toMatchObject({ applied: false, reason: 'cancelled' })
    expect(data.value[0].name).toBe('C')
  })

  it('restores adjacent removed rows in source order after sorting and paging', async () => {
    const original = [1, 2, 3, 4, 5].map((id) => ({ id, name: String(id) }))
    const { root, api, data } = host(original, {
      sortBy: [{ field: 'name', order: 'desc' }],
      pagerConfig: { pageSize: 2 },
    })
    await api.value!.removeRows([4, 2, 3])
    expect(data.value.map((row) => row.id)).toEqual([1, 5])
    expect(await api.value!.undo()).toEqual({ applied: true })
    expect(data.value).toEqual(original)
    expect(await api.value!.redo()).toEqual({ applied: true })
    expect(data.value.map((row) => row.id)).toEqual([1, 5])
    root.unmount()
  })
})
