import { computed, nextTick, onBeforeUnmount, shallowRef, watch } from 'vue'
import {
  expandTableCellRange,
  tableRangeBetween,
  tableRangeContains,
} from './table-cell-range-model'
import type { WatchSource } from 'vue'
import type { TableCellCoordinate } from './use-table-keyboard'
import type {
  TableRangeLimits,
  TableRangeMergeQuery,
} from './table-cell-range-model'
import type {
  TableCellRange,
  TableCellRangeBounds,
  TableCellRangeChange,
  TableCellRangeReason,
  TableRangeConfig,
} from '../table-cell-range'

export interface TableRangeHints {
  anchor?: TableCellCoordinate
  focus?: TableCellCoordinate
}
interface RangeProjection {
  range: TableCellRange
  bounds: Readonly<TableCellRangeBounds>
  hints: TableRangeHints
}
interface Options {
  config: () => boolean | TableRangeConfig | undefined
  value: () => TableCellRange | null | undefined
  disabled: () => boolean
  limits: () => TableRangeLimits
  resolve: (
    address: TableCellRange['anchor'],
    hint?: TableCellCoordinate,
  ) => TableCellCoordinate | undefined
  merges: TableRangeMergeQuery
  context: WatchSource[]
  onUpdate: (range: TableCellRange | null) => void
  onChange: (change: TableCellRangeChange) => void
  onError: (error: unknown) => void
  /** The default yields to a task between batches so pointer input can supersede work. */
  batchSize?: number
  yieldControl?: () => Promise<void>
}

const validAddress = (value: TableCellRange['anchor'] | undefined) =>
  value &&
  (typeof value.rowKey === 'string' ||
    (typeof value.rowKey === 'number' && Number.isFinite(value.rowKey))) &&
  typeof value.columnKey === 'string'
export const equalTableCellRange = (
  a: TableCellRange | null | undefined,
  b: TableCellRange | null | undefined,
) =>
  (!a && !b) ||
  Boolean(
    a &&
    b &&
    a.anchor?.rowKey === b.anchor?.rowKey &&
    a.anchor?.columnKey === b.anchor?.columnKey &&
    a.focus?.rowKey === b.focus?.rowKey &&
    a.focus?.columnKey === b.focus?.columnKey,
  )
const copyRange = (range: TableCellRange | null): TableCellRange | null =>
  range ? { anchor: { ...range.anchor }, focus: { ...range.focus } } : null
const sameBounds = (
  a?: TableCellRangeBounds | null,
  b?: TableCellRangeBounds | null,
) =>
  (!a && !b) ||
  Boolean(
    a &&
    b &&
    a.rowStart === b.rowStart &&
    a.rowEnd === b.rowEnd &&
    a.colStart === b.colStart &&
    a.colEnd === b.colEnd,
  )

/** Controlled range acceptance and cancellable logical geometry; no DOM or cell-value enumeration. */
export function useTableCellRange(options: Options) {
  const config = computed<TableRangeConfig>(() => {
    const value = options.config()
    return typeof value === 'object' ? value : {}
  })
  const enabled = computed(
    () =>
      Boolean(options.config()) &&
      config.value.enabled !== false &&
      !options.disabled(),
  )
  const local = shallowRef<TableCellRange | null>(null)
  const value = computed(() =>
    options.value() === undefined ? local.value : (options.value() ?? null),
  )
  const projection = shallowRef<RangeProjection | null>(null)
  const pending = shallowRef(false)
  const bounds = computed(() =>
    enabled.value &&
    projection.value &&
    equalTableCellRange(value.value, projection.value.range)
      ? projection.value.bounds
      : null,
  )
  let active: AbortController | undefined
  let revision = 0
  let disposed = false
  let publishing: { revision: number; range: TableCellRange | null } | undefined
  const cancelPending = () => {
    revision++
    active?.abort()
    active = undefined
    pending.value = false
  }
  const project = async (
    range: TableCellRange,
    signal: AbortSignal,
    hints: TableRangeHints,
  ) => {
    if (!validAddress(range.anchor) || !validAddress(range.focus)) return
    const cached = projection.value?.hints
    const matchingHint = (address: TableCellRange['anchor']) =>
      [hints.anchor, hints.focus, cached?.anchor, cached?.focus].find(
        (hint) =>
          hint?.address.rowKey === address.rowKey &&
          hint.address.columnKey === address.columnKey,
      )
    const anchor = options.resolve(range.anchor, matchingHint(range.anchor))
    const focus = options.resolve(range.focus, matchingHint(range.focus))
    if (!anchor || !focus) return
    const limits = options.limits()
    const initial = tableRangeBetween(
      { row: anchor.viewRow ?? anchor.row, col: anchor.position },
      { row: focus.viewRow ?? focus.row, col: focus.position },
      limits,
    )
    if (!initial) return
    const bounds = await expandTableCellRange(initial, limits, options.merges, {
      signal,
      batchSize: options.batchSize,
      yieldControl: options.yieldControl,
    })
    return { range, bounds, hints: { anchor, focus } }
  }
  const calculate = async (
    requested: TableCellRange | null,
    reason: TableCellRangeReason,
    hints: TableRangeHints = {},
    reconcile = false,
  ): Promise<boolean> => {
    if (disposed) return false
    cancelPending()
    if (!enabled.value) {
      projection.value = null
      return false
    }
    const controller = new AbortController()
    active = controller
    const request = revision
    const previous = projection.value
    if (reconcile) projection.value = null
    pending.value = true
    try {
      let next = copyRange(requested)
      let result = next ? await project(next, controller.signal, hints) : null
      if (disposed || request !== revision || controller.signal.aborted)
        return false
      if (next && !result) {
        if (!reconcile) return false
        // A removed/hidden endpoint requests model clearing, including controlled ranges.
        next = null
        result = null
      }
      publishing = { revision: request, range: next }
      if (!equalTableCellRange(value.value, next)) {
        if (options.value() === undefined) local.value = copyRange(next)
        options.onUpdate(copyRange(next))
        await nextTick()
      }
      if (
        disposed ||
        request !== revision ||
        !enabled.value ||
        !equalTableCellRange(value.value, next)
      )
        return false
      projection.value = result ?? null
      if (
        !equalTableCellRange(previous?.range, next) ||
        !sameBounds(previous?.bounds, result?.bounds)
      )
        options.onChange({
          range: copyRange(next),
          bounds: result ? { ...result.bounds } : null,
          reason,
        })
      return true
    } catch (error) {
      if (!disposed && request === revision && !controller.signal.aborted)
        options.onError(error ?? new Error('Range calculation failed'))
      return false
    } finally {
      if (publishing?.revision === request) publishing = undefined
      if (request === revision) {
        active = undefined
        pending.value = false
      }
    }
  }
  const select = (
    range: TableCellRange | null,
    reason: TableCellRangeReason = 'programmatic',
    hints?: TableRangeHints,
  ) => calculate(range, reason, hints)
  const reconcile = (reason: TableCellRangeReason = 'context') =>
    calculate(value.value, reason, projection.value?.hints, true)
  watch(
    () => options.value(),
    () => {
      if (
        publishing &&
        publishing.revision === revision &&
        equalTableCellRange(value.value, publishing.range)
      )
        return
      reconcile('external')
    },
    { deep: true, immediate: true },
  )
  watch(
    [
      enabled,
      () => options.limits().rows,
      () => options.limits().columns,
      ...options.context,
    ],
    () => {
      reconcile('context')
    },
  )
  onBeforeUnmount(() => {
    disposed = true
    cancelPending()
    projection.value = null
  })
  return {
    config,
    enabled,
    pending,
    bounds,
    select,
    reconcile,
    clear: () => select(null, 'clear'),
    cancelPending,
    getRange: () => copyRange(value.value),
    getHints: (): TableRangeHints => {
      const copy = (point?: TableCellCoordinate) =>
        point ? { ...point, address: { ...point.address } } : undefined
      return {
        anchor: copy(projection.value?.hints.anchor),
        focus: copy(projection.value?.hints.focus),
      }
    },
    getBounds: () => (bounds.value ? { ...bounds.value } : null),
    contains: (row: number, col: number) =>
      tableRangeContains(bounds.value, row, col),
  }
}

export type TableCellRangeState = ReturnType<typeof useTableCellRange>
