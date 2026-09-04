import { defineComponent, h, nextTick, ref, shallowRef } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useTableCellRange } from '../src/composables/use-table-cell-range'
import { tableRangeIntersects } from '../src/composables/table-cell-range-model'
import type { TableCellRangeState } from '../src/composables/use-table-cell-range'
import type {
  TableCellRange,
  TableCellRangeBounds,
  TableRangeConfig,
} from '../src/table-cell-range'

const range = (a = 0, b = 2, x = 'a', y = 'c'): TableCellRange => ({
  anchor: { rowKey: a, columnKey: x },
  focus: { rowKey: b, columnKey: y },
})
const wrappers: { unmount(): void }[] = []
const setup = (
  initial?: TableCellRange | null,
  batches: { batchSize?: number; yieldControl?: () => Promise<void> } = {},
) => {
  const model = ref<TableCellRange | null | undefined>(initial)
  const accept = shallowRef(false)
  const config = shallowRef<boolean | TableRangeConfig>(true)
  const disabled = shallowRef(false)
  const rows = shallowRef([0, 1, 2, 3, 4])
  const columns = shallowRef(['a', 'b', 'c', 'd'])
  const merges = shallowRef<TableCellRangeBounds[]>([])
  const fail = shallowRef(false)
  const onUpdate = vi.fn((next: TableCellRange | null) => {
    if (accept.value) model.value = next
  })
  const onChange = vi.fn()
  const onError = vi.fn()
  const query = vi.fn((bounds: Readonly<TableCellRangeBounds>) => {
    if (fail.value) throw new Error('merge resolver failed')
    return merges.value.filter((merge) => tableRangeIntersects(merge, bounds))
  })
  let state!: TableCellRangeState
  const wrapper = mount(
    defineComponent({
      setup() {
        state = useTableCellRange({
          config: () => config.value,
          value: () => model.value,
          disabled: () => disabled.value,
          limits: () => ({
            rows: rows.value.length,
            columns: columns.value.length,
          }),
          resolve: (address) => {
            const row = rows.value.indexOf(Number(address.rowKey))
            const col = columns.value.indexOf(address.columnKey)
            return row < 0 || col < 0
              ? undefined
              : { row, position: col, column: col, address: { ...address } }
          },
          merges: query,
          context: [rows, columns, merges],
          onUpdate,
          onChange,
          onError,
          ...batches,
        })
        return () => h('div')
      },
    }),
  )
  wrappers.push(wrapper)
  return {
    state,
    model,
    accept,
    config,
    disabled,
    rows,
    columns,
    merges,
    fail,
    onUpdate,
    onChange,
    onError,
    query,
    wrapper,
  }
}
const settle = async () => {
  await nextTick()
  await flushPromises()
  await nextTick()
}
afterEach(() => wrappers.splice(0).forEach((wrapper) => wrapper.unmount()))

describe('controlled table cell range state', () => {
  it('selects and clears an internal range without exposing mutable state', async () => {
    const { state, onUpdate, onChange } = setup()
    await settle()
    const requested = range(3, 1, 'd', 'b')
    expect(await state.select(requested)).toBe(true)
    expect(state.getBounds()).toEqual({
      rowStart: 1,
      rowEnd: 4,
      colStart: 1,
      colEnd: 4,
    })
    expect(state.contains(3, 3)).toBe(true)
    expect(state.contains(4, 3)).toBe(false)
    requested.anchor.rowKey = 0
    state.getRange()!.focus.rowKey = 0
    state.getBounds()!.rowStart = 0
    onUpdate.mock.calls[0][0]!.anchor.rowKey = 0
    onChange.mock.calls[0][0].bounds.rowStart = 0
    expect(state.getRange()).toEqual(range(3, 1, 'd', 'b'))
    expect(state.getBounds()?.rowStart).toBe(1)
    expect(await state.clear()).toBe(true)
    expect(state.getRange()).toBeNull()
    expect(state.getBounds()).toBeNull()
    expect(onChange.mock.calls[onChange.mock.calls.length - 1][0]).toEqual({
      range: null,
      bounds: null,
      reason: 'clear',
    })
  })

  it('waits for controlled acceptance and does not paint a rejected proposal', async () => {
    const { state, accept, model, onUpdate, onChange } = setup(null)
    await settle()
    expect(await state.select(range())).toBe(false)
    expect(onUpdate).toHaveBeenCalledWith(range())
    expect(onChange).not.toHaveBeenCalled()
    expect(state.getBounds()).toBeNull()
    accept.value = true
    expect(await state.select(range(), 'keyboard')).toBe(true)
    expect(model.value).toEqual(range())
    expect(state.getBounds()).toEqual({
      rowStart: 0,
      rowEnd: 3,
      colStart: 0,
      colEnd: 3,
    })
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0].reason).toBe('keyboard')
  })

  it('reconciles externally replaced and mutated endpoints without echoing updates', async () => {
    const { state, model, onUpdate } = setup(null)
    model.value = range(1, 2)
    await settle()
    expect(state.getBounds()?.rowStart).toBe(1)
    model.value!.focus.rowKey = 4
    await settle()
    expect(state.getBounds()?.rowEnd).toBe(5)
    expect(onUpdate).not.toHaveBeenCalled()
  })

  it('follows stable keys through row and column reorder', async () => {
    const { state, rows, columns, onUpdate } = setup(range(0, 2, 'a', 'b'))
    await settle()
    rows.value = [4, 3, 2, 1, 0]
    columns.value = ['d', 'c', 'b', 'a']
    await settle()
    expect(state.getRange()).toEqual(range(0, 2, 'a', 'b'))
    expect(state.getBounds()).toEqual({
      rowStart: 2,
      rowEnd: 5,
      colStart: 2,
      colEnd: 4,
    })
    expect(onUpdate).not.toHaveBeenCalled()
  })

  it.each([false, true])(
    'requests clearing a hidden endpoint with controlled acceptance %s',
    async (accepted) => {
      const { state, rows, accept, model, onUpdate } = setup(range())
      await settle()
      accept.value = accepted
      rows.value = [0, 1, 3, 4]
      await settle()
      expect(onUpdate).toHaveBeenCalledWith(null)
      expect(state.getBounds()).toBeNull()
      expect(model.value).toEqual(accepted ? null : range())
      await settle()
      expect(onUpdate).toHaveBeenCalledTimes(1)
    },
  )

  it('recalculates closure when merged layout changes', async () => {
    const { state, merges } = setup(range(1, 1, 'b', 'b'))
    await settle()
    expect(state.getBounds()).toEqual({
      rowStart: 1,
      rowEnd: 2,
      colStart: 1,
      colEnd: 2,
    })
    merges.value = [{ rowStart: 0, rowEnd: 3, colStart: 0, colEnd: 3 }]
    await settle()
    expect(state.getBounds()).toEqual(merges.value[0])
  })

  it('keeps the accepted range after invalid requests and merge errors', async () => {
    const { state, fail, onUpdate, onError } = setup()
    await settle()
    expect(await state.select(range())).toBe(true)
    expect(await state.select(range(0, 99))).toBe(false)
    expect(state.getRange()).toEqual(range())
    expect(onUpdate).toHaveBeenCalledTimes(1)
    fail.value = true
    expect(await state.select(range(0, 1))).toBe(false)
    expect(state.getRange()).toEqual(range())
    expect(state.getBounds()?.rowEnd).toBe(3)
    expect(onError).toHaveBeenCalledTimes(1)
  })

  it('disables interactions and restores geometry when enabled again', async () => {
    const { state, config, disabled, query } = setup(range())
    await settle()
    disabled.value = true
    await settle()
    const calls = query.mock.calls.length
    expect(await state.select(range(0, 1))).toBe(false)
    expect(state.getBounds()).toBeNull()
    expect(query).toHaveBeenCalledTimes(calls)
    disabled.value = false
    await settle()
    expect(state.getBounds()?.rowEnd).toBe(3)
    config.value = false
    await settle()
    expect(state.getBounds()).toBeNull()
  })

  it('lets a new range supersede a calculation stalled in a yield', async () => {
    const releases: (() => void)[] = []
    const { state, onUpdate, onError } = setup(undefined, {
      batchSize: 1,
      yieldControl: () =>
        new Promise<void>((resolve) => releases.push(resolve)),
    })
    await settle()
    const first = state.select(range())
    await Promise.resolve()
    const second = state.select(range(1, 1, 'a', 'a'))
    await Promise.resolve()
    expect(await first).toBe(false)
    expect(releases).toHaveLength(2)
    releases[1]()
    expect(await second).toBe(true)
    releases[0]()
    await settle()
    expect(state.getRange()).toEqual(range(1, 1, 'a', 'a'))
    expect(onUpdate).toHaveBeenCalledTimes(1)
    expect(onError).not.toHaveBeenCalled()
    expect(state.pending.value).toBe(false)
  })

  it('cancels a pending request on view change without publishing old coordinates', async () => {
    let release!: () => void
    const { state, rows, onUpdate } = setup(undefined, {
      batchSize: 1,
      yieldControl: () =>
        new Promise<void>((resolve) => {
          release = resolve
        }),
    })
    await settle()
    const request = state.select(range())
    await Promise.resolve()
    rows.value = [4, 3, 2, 1, 0]
    await nextTick()
    expect(await request).toBe(false)
    release()
    await settle()
    expect(onUpdate).not.toHaveBeenCalled()
    expect(state.getRange()).toBeNull()
  })

  it('settles and cleans up on unmount even if the scheduler never resumes', async () => {
    const { state, wrapper, onUpdate, onError } = setup(undefined, {
      batchSize: 1,
      yieldControl: () => new Promise<void>(() => {}),
    })
    await settle()
    const request = state.select(range())
    await Promise.resolve()
    wrapper.unmount()
    expect(await request).toBe(false)
    expect(state.pending.value).toBe(false)
    expect(state.getBounds()).toBeNull()
    expect(onUpdate).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
  })
})
