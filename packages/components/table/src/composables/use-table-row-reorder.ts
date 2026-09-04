import {
  computed,
  nextTick,
  onBeforeUnmount,
  shallowRef,
  toRaw,
  watch,
} from 'vue'
import { createTableDataIndex, validTableDataKey } from '../change-data'
import { planTableRowReorder } from '../row-reorder'
import type {
  TableEmitFn,
  TableFlatRow,
  TableProps,
  TableRow,
  TableRowKey,
} from '../table'
import type {
  TableRowDragContext,
  TableRowDragResult,
  TableRowDropContext,
  TableRowDropPosition,
  TableRowReorderRequest,
} from '../table-row-drag'

export interface RowReorderOptions {
  rowAt: (index: number) => TableFlatRow | undefined
  count: () => number
  blocked: () => boolean
  children: (row: TableRow, key: TableRowKey) => TableRow[]
  changed: () => void
}

/** Controlled source-order changes. Pointer hit testing is deliberately separate. */
export function useTableRowReorder(
  props: TableProps,
  emit: TableEmitFn,
  options: RowReorderOptions,
) {
  const config = computed(() =>
    typeof props.rowDragConfig === 'object' ? props.rowDragConfig : {},
  )
  const pending = shallowRef(false)
  const enabled = computed(
    () =>
      Boolean(props.rowDragConfig) &&
      config.value.enabled !== false &&
      !props.loading &&
      (!props.virtualSource || Boolean(config.value.apply)),
  )
  let disposed = false
  let active: AbortController | undefined
  let proposed: TableRow[] | undefined
  const context = (row: TableFlatRow, index: number): TableRowDragContext => ({
    row: row.row,
    rowKey: row.key,
    rowIndex: index,
  })
  const key = (row: TableRow): TableRowKey => {
    const value =
      typeof props.rowKey === 'function'
        ? props.rowKey(row, -1)
        : row[props.rowKey]
    if (!validTableDataKey(value))
      throw new Error('Row dragging requires stable row keys')
    return value
  }
  const canStart = (row: TableFlatRow, index: number) => {
    if (!enabled.value || options.blocked() || pending.value || row.loading)
      return false
    try {
      const stable = props.virtualSource?.rowKey?.(row.index) ?? key(row.row)
      return (
        stable === row.key &&
        config.value.checkMethod?.(context(row, index)) !== false
      )
    } catch {
      return false
    }
  }
  const dropContext = (
    from: number,
    to: number,
    position: TableRowDropPosition,
  ): TableRowDropContext | undefined => {
    const row = options.rowAt(from)
    const target = options.rowAt(to)
    if (
      !row ||
      !target ||
      !canStart(row, from) ||
      row.key === target.key ||
      target.loading ||
      row.parentKey !== target.parentKey ||
      (position !== 'before' && position !== 'after')
    )
      return
    const value = {
      ...context(row, from),
      targetRow: target.row,
      targetKey: target.key,
      targetIndex: to,
      position,
    }
    if (config.value.dropMethod?.(value) === false) return
    return value
  }
  const cancel = () => active?.abort()
  const move = async (
    from: number,
    to: number,
    position: TableRowDropPosition = 'before',
  ): Promise<TableRowDragResult> => {
    const finish = (value: TableRowDragResult) => {
      if (!disposed) emit('rowDragEnd', value)
      return value
    }
    if (pending.value) return finish({ applied: false, reason: 'busy' })
    if (!enabled.value || options.blocked() || disposed)
      return finish({ applied: false, reason: 'disabled' })
    const controller = new AbortController()
    let request: TableRowReorderRequest | undefined
    try {
      if (
        !Number.isSafeInteger(from) ||
        !Number.isSafeInteger(to) ||
        from < 0 ||
        to < 0 ||
        from >= options.count() ||
        to >= options.count()
      )
        return finish({ applied: false, reason: 'invalid' })
      if (from === to) return finish({ applied: false, reason: 'empty' })
      const drop = dropContext(from, to, position)
      if (!drop) return finish({ applied: false, reason: 'invalid' })
      const source = props.virtualSource
      const sourceIndex = options.rowAt(from)!.index
      const targetIndex = options.rowAt(to)!.index
      const plan = source
        ? {
            oldIndex: sourceIndex,
            newIndex:
              targetIndex +
              (position === 'after' ? 1 : 0) -
              (sourceIndex < targetIndex + (position === 'after' ? 1 : 0)
                ? 1
                : 0),
            data: undefined,
          }
        : planTableRowReorder(
            createTableDataIndex({
              data: props.data,
              childrenField: props.treeConfig?.children ?? 'children',
              key,
              children: options.children,
            }),
            drop.rowKey,
            drop.targetKey,
            position,
          )
      if (plan.newIndex === plan.oldIndex)
        return finish({ applied: false, reason: 'empty' })
      request = { ...drop, ...plan, signal: controller.signal }
      active = controller
      proposed = plan.data
      pending.value = true
      let accepted = true
      const apply = config.value.apply
      if (apply) {
        accepted = await new Promise<boolean>((resolve, reject) => {
          const abort = () => resolve(false)
          controller.signal.addEventListener('abort', abort, { once: true })
          Promise.resolve()
            .then(() => (controller.signal.aborted ? false : apply(request!)))
            .then(resolve, reject)
            .finally(() =>
              controller.signal.removeEventListener('abort', abort),
            )
        })
      } else emit('update:data', plan.data!)
      await nextTick()
      if (controller.signal.aborted || disposed)
        return finish({ applied: false, reason: 'cancelled', request })
      if (!accepted || (plan.data && toRaw(props.data) !== toRaw(plan.data)))
        return finish({ applied: false, reason: 'rejected', request })
      if (source) {
        const actual =
          props.virtualSource?.rowKey?.(plan.newIndex) ??
          key(props.virtualSource!.row(plan.newIndex))
        if (actual !== drop.rowKey)
          return finish({ applied: false, reason: 'rejected', request })
      }
      options.changed()
      return finish({ applied: true, request })
    } catch (error) {
      return finish({
        applied: false,
        reason: controller.signal.aborted ? 'cancelled' : 'invalid',
        request,
        error,
      })
    } finally {
      if (active === controller) {
        active = undefined
        proposed = undefined
        pending.value = false
      }
    }
  }
  watch(
    () => props.data,
    (value) => {
      if (active && (!proposed || toRaw(value) !== toRaw(proposed))) cancel()
    },
    { flush: 'sync' },
  )
  watch([enabled, () => config.value.apply, () => props.rowKey], cancel)
  watch(options.blocked, (blocked) => {
    if (blocked) cancel()
  })
  onBeforeUnmount(() => {
    disposed = true
    cancel()
  })
  return {
    config,
    enabled,
    pending,
    canStart,
    context,
    dropContext,
    move,
    cancel,
  }
}

export type TableRowReorder = ReturnType<typeof useTableRowReorder>
