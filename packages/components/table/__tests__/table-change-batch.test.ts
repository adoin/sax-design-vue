import { defineComponent, h, nextTick, reactive } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useTableChanges } from '../src/composables/use-table-changes'
import type { TableRowUpdate } from '../src/change-batch'
import type {
  TableDataChangeRequest,
  TableEmitFn,
  TableProps,
  TableRow,
} from '../src/table'

const cleanups: Array<() => void> = []
afterEach(() => cleanups.splice(0).forEach((cleanup) => cleanup()))

function host(
  data: TableRow[],
  extra: Partial<TableProps> = {},
  accepts = true,
) {
  const props = reactive({
    data,
    rowKey: 'id',
    changeConfig: true,
    historyConfig: true,
    ...extra,
  }) as { -readonly [Key in keyof TableProps]: TableProps[Key] }
  const events = vi.fn()
  const emit: TableEmitFn = (event, ...args) => {
    events(event, ...args)
    if (event === 'update:data' && accepts) props.data = args[0] as TableRow[]
  }
  let changes!: ReturnType<typeof useTableChanges>
  const root = mount(
    defineComponent({
      setup() {
        changes = useTableChanges(props, emit, {
          children: (row) => (row.children as TableRow[] | undefined) ?? [],
          changed: vi.fn(),
          editing: () => false,
        })
        return () => h('div')
      },
    }),
  )
  cleanups.push(() => root.unmount())
  return { props, events, changes, root }
}
const update = (
  rowKey: number,
  value: unknown,
  field = 'name',
): TableRowUpdate => ({
  rowKey,
  patches: [{ field, value, exists: true }],
})

describe('Table atomic row updates', () => {
  it('accepts one proposal and records a multi-row paste as one undo step', async () => {
    const initial = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ]
    const { props, changes, events } = host(initial)
    expect(await changes.updateRows([update(1, 'C'), update(2, 'D')])).toEqual({
      applied: true,
    })
    expect(initial.map((row) => row.name)).toEqual(['A', 'B'])
    expect(props.data.map((row) => row.name)).toEqual(['C', 'D'])
    expect(
      events.mock.calls.filter(([event]) => event === 'update:data'),
    ).toHaveLength(1)
    const accepted = events.mock.calls.filter(
      ([event]) => event === 'dataChange',
    )
    expect(accepted).toHaveLength(1)
    expect(accepted[0][1]).toHaveLength(2)
    expect(changes.getHistoryState().undoCount).toBe(1)
    expect(await changes.undo()).toEqual({ applied: true })
    expect(props.data).toEqual(initial)
    expect(changes.getChangeRecords().updated).toEqual([])
    expect(await changes.redo()).toEqual({ applied: true })
    expect(props.data.map((row) => row.name)).toEqual(['C', 'D'])
  })

  it('updates a parent and its loaded child together without replacing tree structure', async () => {
    const initial = [{ id: 1, name: 'A', children: [{ id: 2, name: 'B' }] }]
    const { props, changes } = host(initial, {
      treeConfig: { children: 'children' },
    })
    expect(await changes.updateRows([update(1, 'P'), update(2, 'C')])).toEqual({
      applied: true,
    })
    expect(props.data).toEqual([
      { id: 1, name: 'P', children: [{ id: 2, name: 'C' }] },
    ])
    expect(await changes.undo()).toEqual({ applied: true })
    expect(props.data).toEqual(initial)
  })

  it('does not apply a valid prefix when any row, key or field is invalid', async () => {
    for (const last of [
      update(99, 'missing'),
      update(2, 3, 'id'),
      update(2, 'x', '__proto__.value'),
      update(1, 'duplicate'),
    ]) {
      const { props, changes, events } = host([
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
      ])
      expect(await changes.updateRows([update(1, 'C'), last])).toMatchObject({
        applied: false,
        reason: 'invalid',
      })
      expect(props.data.map((row) => row.name)).toEqual(['A', 'B'])
      expect(events.mock.calls.some(([event]) => event === 'update:data')).toBe(
        false,
      )
      expect(changes.getHistoryState().undoCount).toBe(0)
    }
  })

  it('rejects changed read baselines, including missing versus explicit undefined', async () => {
    const { changes, events } = host([
      { id: 1, name: 'A' },
      { id: 2, name: undefined },
    ])
    for (const expected of [
      { field: 'name', exists: true, value: 'old' },
      { field: 'name', exists: false, value: undefined },
    ]) {
      expect(
        await changes.updateRows([
          update(1, 'new'),
          { ...update(2, 'new'), expected: [expected] },
        ]),
      ).toMatchObject({
        applied: false,
        reason: 'conflict',
      })
    }
    expect(events.mock.calls.some(([event]) => event === 'update:data')).toBe(
      false,
    )
    expect(changes.getHistoryState().undoCount).toBe(0)
  })

  it('keeps rejected batches out of data, records and history', async () => {
    const { props, changes } = host(
      [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
      ],
      {},
      false,
    )
    expect(await changes.updateRows([update(1, 'C'), update(2, 'D')])).toEqual({
      applied: false,
      reason: 'rejected',
    })
    expect(props.data.map((row) => row.name)).toEqual(['A', 'B'])
    expect(changes.getChangeRecords().updated).toEqual([])
    expect(changes.getHistoryState().undoCount).toBe(0)
  })

  it('cancels a pending adapter from the caller signal without waiting for its promise', async () => {
    let request!: TableDataChangeRequest
    const apply = vi.fn((value: TableDataChangeRequest) => {
      request = value
      return new Promise<boolean>(() => {})
    })
    const { changes } = host([{ id: 1, name: 'A' }], {
      changeConfig: { apply },
    })
    const controller = new AbortController()
    const pending = changes.updateRows(
      [update(1, 'B')],
      undefined,
      controller.signal,
    )
    expect(request.signal.aborted).toBe(false)
    expect(await changes.updateRows([update(1, 'C')])).toEqual({
      applied: false,
      reason: 'busy',
    })
    controller.abort()
    expect(await pending).toEqual({ applied: false, reason: 'cancelled' })
    expect(request.signal.aborted).toBe(true)
    expect(changes.getHistoryState().undoCount).toBe(0)
    expect(
      await changes.updateRows([update(1, 'B')], undefined, controller.signal),
    ).toEqual({ applied: false, reason: 'cancelled' })
    expect(apply).toHaveBeenCalledTimes(1)
  })

  it('checks currentness before preparation and again after adapter acceptance', async () => {
    let accept!: (value: boolean) => void
    let proposal!: TableDataChangeRequest
    let current = true
    const apply = vi.fn((value: TableDataChangeRequest) => {
      proposal = value
      return new Promise<boolean>((resolve) => {
        accept = resolve
      })
    })
    const { changes, props } = host([{ id: 1, name: 'A' }], {
      changeConfig: { apply },
    })
    expect(await changes.updateRows([update(1, 'B')], () => false)).toEqual({
      applied: false,
      reason: 'cancelled',
    })
    expect(apply).not.toHaveBeenCalled()
    const pending = changes.updateRows([update(1, 'B')], () => current)
    current = false
    // A misbehaving adapter can already have written; stale work must never publish success/history.
    props.data = proposal.data!
    accept(true)
    expect(await pending).toEqual({ applied: false, reason: 'cancelled' })
    expect(changes.getHistoryState().undoCount).toBe(0)
  })

  it('snapshots caller patches and restores deleted versus missing fields on undo', async () => {
    const { props, changes } = host([
      { id: 1, name: 'A', meta: { old: true } },
      { id: 2 },
    ])
    const value = { nested: ['B'] }
    const first = update(1, value, 'meta')
    const second = update(2, undefined)
    expect(await changes.updateRows([first, second])).toEqual({ applied: true })
    value.nested[0] = 'changed outside'
    first.patches[0].value = 'changed patch'
    expect(props.data[0].meta).toEqual({ nested: ['B'] })
    expect(Object.hasOwn(props.data[1], 'name')).toBe(true)
    expect(await changes.undo()).toEqual({ applied: true })
    expect(props.data[0].meta).toEqual({ old: true })
    expect(Object.hasOwn(props.data[1], 'name')).toBe(false)
    expect(await changes.redo()).toEqual({ applied: true })
    expect(props.data[0].meta).toEqual({ nested: ['B'] })
  })

  it('updates distant generated rows with one adapter call and sparse field reads', async () => {
    const values = new Map<number, unknown>()
    let reads = 0
    const row = (index: number): TableRow => {
      reads++
      return new Proxy(
        {},
        {
          get: (_, key) =>
            key === 'id'
              ? index
              : key === 'name'
                ? (values.get(index) ?? `Row ${index}`)
                : undefined,
          has: (_, key) => key === 'id' || key === 'name',
          ownKeys: () => {
            throw new Error('Do not enumerate generated columns')
          },
        },
      )
    }
    const apply = vi.fn(({ operations, signal }: TableDataChangeRequest) => {
      if (signal.aborted) return false
      for (const operation of operations)
        values.set(Number(operation.rowKey), operation.patches[0].value)
      return true
    })
    const { changes } = host([], {
      virtualSource: {
        rowCount: 1_000_000,
        columnCount: 100_000,
        columnWidth: 120,
        row,
        rowKey: (i) => i,
        column: (i) => ({ field: `c${i}` }),
      },
      changeConfig: { indexOf: Number, apply },
    })
    expect(
      await changes.updateRows([update(0, 'First'), update(999_999, 'Last')]),
    ).toEqual({ applied: true })
    expect(apply).toHaveBeenCalledTimes(1)
    expect(changes.getHistoryState().undoCount).toBe(1)
    expect(await changes.undo()).toEqual({ applied: true })
    expect(values.get(0)).toBe('Row 0')
    expect(values.get(999_999)).toBe('Row 999999')
    expect(await changes.redo()).toEqual({ applied: true })
    expect(values.get(999_999)).toBe('Last')
    expect(reads).toBeLessThan(40)
  })

  it('aborts on unmount and leaves empty batches silent', async () => {
    let request!: TableDataChangeRequest
    const { changes, events, root } = host([{ id: 1 }], {
      changeConfig: {
        apply: (value) => {
          request = value
          return new Promise<boolean>(() => {})
        },
      },
    })
    expect(await changes.updateRows([])).toEqual({ applied: true })
    expect(
      events.mock.calls.some(
        ([event]) => event === 'dataChange' || event === 'update:data',
      ),
    ).toBe(false)
    const pending = changes.updateRows([update(1, 'B')])
    root.unmount()
    expect(request.signal.aborted).toBe(true)
    expect(await pending).toEqual({ applied: false, reason: 'cancelled' })
    await nextTick()
    expect(await changes.updateRows([update(1, 'B')])).toEqual({
      applied: false,
      reason: 'disabled',
    })
  })
})
