import {
  computed,
  nextTick,
  onBeforeUnmount,
  shallowRef,
  toRaw,
  watch,
} from 'vue'
import { createTableDataIndex, validTableDataKey } from '../change-data'
import { planTableRowReorder, resolveTableRowDrop } from '../row-reorder'
import type {
  TableCoreEmitFn,
  TableCoreProps,
  TableFlatRow,
  TableRow,
  TableRowKey,
} from '../table'
import type {
  TableRowDragContext,
  TableRowDragResult,
  TableRowDragTreeConfig,
  TableRowDropContext,
  TableRowDropPosition,
  TableRowReorderRequest,
} from '../table-row-drag'

export interface RowReorderOptions {
  rowAt: (index: number) => TableFlatRow | undefined
  count: () => number
  blocked: () => boolean
  children: (row: TableRow, key: TableRowKey) => TableRow[]
  revision: () => unknown
  expand: (key: TableRowKey) => void | Promise<void>
  changed: () => void
}

/** Controlled source-order changes. Pointer hit testing is deliberately separate. */
export function useTableRowReorder(
  props: TableCoreProps,
  emit: TableCoreEmitFn,
  options: RowReorderOptions,
) {
  const config = computed(() =>
    typeof props.rowDragConfig === 'object' ? props.rowDragConfig : {},
  )
  const treeConfig = computed<TableRowDragTreeConfig | undefined>(() => {
    if (!props.treeConfig || !config.value.tree) return
    return config.value.tree === true ? {} : config.value.tree
  })
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
    depth: row.depth,
    parentKey: row.parentKey,
    hasChildren: row.hasChildren,
    expanded: row.expanded,
    childCount: options.children(row.row, row.key).length,
  })
  const key = (row: TableRow): TableRowKey => {
    const value =
      typeof props.rowKey === 'function'
        ? props.rowKey(row, -1)
        : (row as Record<string, unknown>)[props.rowKey]
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
        config.value.draggableMethod?.(context(row, index)) !== false
      )
    } catch {
      return false
    }
  }
  let indexedData: TableRow[] | undefined
  let indexedRevision: unknown
  let indexedChildrenField: string | undefined
  let index: ReturnType<typeof createTableDataIndex> | undefined
  const dataIndex = () => {
    const data = toRaw(props.data)
    const revision = options.revision()
    const childrenField = props.treeConfig?.children ?? 'children'
    if (
      !index ||
      indexedData !== data ||
      indexedRevision !== revision ||
      indexedChildrenField !== childrenField
    ) {
      indexedData = data
      indexedRevision = revision
      indexedChildrenField = childrenField
      index = createTableDataIndex({
        data,
        childrenField,
        key,
        children: options.children,
      })
    }
    return index
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
      !['before', 'inside', 'after'].includes(position)
    )
      return
    const targetChildren = options.children(target.row, target.key)
    const source = props.virtualSource
    let destination: {
      oldIndex: number
      newIndex: number
      oldParentKey?: TableRowKey
      newParentKey?: TableRowKey
      newDepth: number
      subtreeDepth: number
      reparented: boolean
    }
    if (source) {
      if (position === 'inside') return
      const oldIndex = row.index
      const insertion = target.index + (position === 'after' ? 1 : 0)
      destination = {
        oldIndex,
        newIndex: oldIndex < insertion ? insertion - 1 : insertion,
        newDepth: 0,
        subtreeDepth: 0,
        reparented: false,
      }
    } else {
      const tree = treeConfig.value
      if (!tree && row.parentKey !== target.parentKey) return
      if (position === 'inside' && (!tree || tree.allowDropInside === false))
        return
      if (
        position === 'inside' &&
        target.hasChildren &&
        targetChildren.length === 0
      )
        return
      const resolved = resolveTableRowDrop(
        dataIndex(),
        row.key,
        target.key,
        position,
        tree?.insidePosition,
      )
      if (resolved.reparented && (!tree || tree.allowReparent === false)) return
      if (
        tree?.maxDepth != null &&
        (!Number.isSafeInteger(tree.maxDepth) ||
          tree.maxDepth < 0 ||
          resolved.newDepth + resolved.subtreeDepth > tree.maxDepth)
      )
        return
      destination = {
        oldIndex: resolved.oldIndex,
        newIndex: resolved.newIndex,
        oldParentKey: resolved.oldParentKey,
        newParentKey: resolved.newParentKey,
        newDepth: resolved.newDepth,
        subtreeDepth: resolved.subtreeDepth,
        reparented: resolved.reparented,
      }
    }
    const value = {
      ...context(row, from),
      targetRow: target.row,
      targetKey: target.key,
      targetIndex: to,
      targetDepth: target.depth,
      targetParentKey: target.parentKey,
      targetHasChildren: target.hasChildren,
      targetExpanded: target.expanded,
      targetChildCount: targetChildren.length,
      position,
      ...destination,
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
      const plan = source
        ? {
            oldIndex: drop.oldIndex,
            newIndex: drop.newIndex,
            oldParentKey: undefined,
            newParentKey: undefined,
            newDepth: 0,
            subtreeDepth: 0,
            reparented: false,
            data: undefined,
          }
        : planTableRowReorder(
            dataIndex(),
            drop.rowKey,
            drop.targetKey,
            position,
            treeConfig.value?.insidePosition,
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
      if (
        !source &&
        position === 'inside' &&
        treeConfig.value?.expandOnDrop !== false
      )
        await options.expand(drop.targetKey)
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
  watch(
    [
      enabled,
      () => config.value.apply,
      () => config.value.tree,
      () => props.rowKey,
    ],
    cancel,
  )
  watch(options.blocked, (blocked) => {
    if (blocked) cancel()
  })
  onBeforeUnmount(() => {
    disposed = true
    cancel()
  })
  return {
    config,
    treeConfig,
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
