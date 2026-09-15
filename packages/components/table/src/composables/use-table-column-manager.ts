import { computed, onMounted, shallowRef, watch } from 'vue'
import { createColumnLayout } from './column-layout'
import { applyTableColumnState, flattenTableColumns } from './table-column-tree'
import type { ComputedRef } from 'vue'
import type {
  TableColumn,
  TableColumnState,
  TableCoreEmitFn,
  TableCoreProps,
} from '../table'

export interface ManagedColumn {
  key: string
  index: number
  position: number
  title: string
  hidden: boolean
  fixed: false | 'left' | 'right'
  group: boolean
  depth: number
  parentKey: string | null
  siblingIndex: number
  childCount: number
}

export function normalizeColumnState(value: unknown): TableColumnState[] {
  if (!Array.isArray(value)) return []
  const unique = new Map<string, TableColumnState>()
  for (const entry of value) {
    if (!entry || typeof entry.key !== 'string') continue
    const state: TableColumnState = { key: entry.key }
    if (typeof entry.hidden === 'boolean') state.hidden = entry.hidden
    if (Number.isInteger(entry.order) && entry.order >= 0)
      state.order = entry.order
    if ([true, false, 'left', 'right'].includes(entry.fixed))
      state.fixed = entry.fixed
    if (
      entry.placement &&
      (entry.placement.parentKey === null ||
        typeof entry.placement.parentKey === 'string') &&
      Number.isInteger(entry.placement.index) &&
      entry.placement.index >= 0
    )
      state.placement = {
        parentKey: entry.placement.parentKey,
        index: entry.placement.index,
      }
    unique.set(state.key, state)
  }
  return [...unique.values()]
}

export function useTableColumnManager(
  props: TableCoreProps,
  emit: TableCoreEmitFn,
  columnDefinitions: ComputedRef<TableColumn[]>,
) {
  let resetWidths: () => void = () => undefined
  const localState = shallowRef<TableColumnState[]>([])
  const mounted = shallowRef(false)
  const state = computed(() =>
    normalizeColumnState(props.columnState ?? localState.value),
  )
  const effectiveColumns = computed(() =>
    applyTableColumnState(columnDefinitions.value, state.value),
  )
  const columnTree = computed(() => flattenTableColumns(effectiveColumns.value))
  const emptyColumns: TableColumn[] = []
  const columns = computed(() =>
    props.virtualSource ? emptyColumns : columnTree.value.leaves,
  )
  const count = computed(() =>
    props.virtualSource
      ? Math.max(0, Math.floor(props.virtualSource.columnCount))
      : columns.value.length,
  )
  const keyAt = (index: number) =>
    props.virtualSource
      ? String(index)
      : (columns.value[index]?.key ??
        columns.value[index]?.field ??
        `@${index}`)
  const indices = computed(() => {
    const map = new Map<string, number>()
    if (!props.virtualSource)
      columns.value.forEach((_, index) => map.set(keyAt(index), index))
    return map
  })
  const nodeByKey = computed(
    () => new Map(columnTree.value.nodes.map((node) => [node.key, node])),
  )
  const hasGroups = computed(() =>
    columnTree.value.nodes.some((node) => node.group),
  )
  const settingCount = computed(() =>
    props.virtualSource ? count.value : columnTree.value.nodes.length,
  )
  const indexForKey = (key: string) =>
    props.virtualSource
      ? /^(0|[1-9]\d*)$/.test(key)
        ? Number(key)
        : -1
      : (indices.value.get(key) ?? -1)
  const layout = computed(() => {
    const left: number[] = []
    const right: number[] = []
    if (props.virtualSource) {
      const leftCount = Math.min(
        count.value,
        Math.max(0, Math.floor(props.virtualSource.fixedLeftCount ?? 0)),
      )
      const rightCount = Math.min(
        count.value - leftCount,
        Math.max(0, Math.floor(props.virtualSource.fixedRightCount ?? 0)),
      )
      for (let i = 0; i < leftCount; i++) left.push(i)
      for (let i = count.value - rightCount; i < count.value; i++) right.push(i)
    } else
      columns.value.forEach((column, index) => {
        if (column.fixed === true || column.fixed === 'left') left.push(index)
        else if (column.fixed === 'right') right.push(index)
      })
    return createColumnLayout({
      count: count.value,
      state: state.value,
      indexForKey,
      left,
      right,
    })
  })
  const columnAt = (index: number): TableColumn => {
    const column = props.virtualSource?.column(index) ?? columns.value[index]
    return props.virtualSource
      ? { ...column, fixed: layout.value.fixedOf(index) }
      : column
  }
  const customizedSelectionColumns = computed(() => {
    const result: TableColumn[] = []
    if (!props.virtualSource) return result
    for (const entry of state.value) {
      const index = indexForKey(entry.key)
      if (index < 0 || index >= count.value) continue
      const column = columnAt(index)
      if (column.type === 'checkbox' || column.type === 'radio')
        result.push(column)
    }
    return result
  })
  const itemAt = (position: number): ManagedColumn => {
    const index = layout.value.sourceAt(position)
    const column = columnAt(index)
    const node = nodeByKey.value.get(keyAt(index))
    return {
      key: keyAt(index),
      index,
      position,
      title: String(column?.title ?? column?.field ?? index + 1),
      hidden: layout.value.hidden.has(index),
      fixed: layout.value.fixedOf(index),
      group: false,
      depth: node?.depth ?? 0,
      parentKey: node?.parentKey ?? null,
      siblingIndex: node?.siblingIndex ?? position,
      childCount: 0,
    }
  }
  const settingItemAt = (position: number): ManagedColumn => {
    if (props.virtualSource) return itemAt(position)
    const node = columnTree.value.nodes[position]
    if (!node) return itemAt(position)
    const fixed = node.group
      ? node.column.fixed === true
        ? 'left'
        : node.column.fixed || false
      : layout.value.fixedOf(node.leafIndex)
    return {
      key: node.key,
      index: node.leafIndex,
      position,
      title: String(node.column.title ?? node.column.field ?? position + 1),
      hidden: node.group ? false : layout.value.hidden.has(node.leafIndex),
      fixed,
      group: node.group,
      depth: node.depth,
      parentKey: node.parentKey,
      siblingIndex: node.siblingIndex,
      childCount: node.childKeys.length,
    }
  }
  const settingIndexForKey = (key: string) =>
    props.virtualSource
      ? layout.value.positionOf(indexForKey(key))
      : columnTree.value.nodes.findIndex((node) => node.key === key)
  const resolveVisibleColumns = (source: TableColumn[]) => {
    if (props.virtualSource || !state.value.length) return source
    const result: TableColumn[] = []
    for (let position = 0; position < count.value; position++) {
      const index = layout.value.sourceAt(position)
      if (!layout.value.hidden.has(index))
        result.push({
          ...source[index],
          key: keyAt(index),
          fixed: layout.value.fixedOf(index),
        })
    }
    return result
  }
  const visibleColumns = computed(() => resolveVisibleColumns(columns.value))
  const commit = (next: TableColumnState[]) => {
    if (props.loading) return
    if (props.columnState === undefined) localState.value = next
    emit('update:columnState', next)
    emit('columnStateChange', next)
  }
  const update = (
    key: string,
    patch: Omit<Partial<TableColumnState>, 'key'>,
  ) => {
    if (
      props.virtualSource
        ? indexForKey(key) < 0 || indexForKey(key) >= count.value
        : !nodeByKey.value.has(key)
    )
      return
    const entries = new Map(state.value.map((entry) => [entry.key, entry]))
    entries.set(key, { ...entries.get(key), ...patch, key })
    commit(normalizeColumnState([...entries.values()]))
  }
  const moveTo = (
    key: string,
    targetPosition: number,
    placement: 'before' | 'after' = 'before',
  ) => {
    const index = indexForKey(key)
    const position = layout.value.positionOf(index)
    if (
      index < 0 ||
      position < 0 ||
      targetPosition < 0 ||
      targetPosition >= count.value
    )
      return false
    let destination = targetPosition + (placement === 'after' ? 1 : 0)
    if (position < destination) destination--
    destination = Math.max(0, Math.min(count.value - 1, destination))
    if (destination === position) return false
    // Resolve sparse collisions before assigning the affected insertion range.
    const entries = new Map(
      state.value.map((entry) => [
        entry.key,
        entry.order == null
          ? entry
          : {
              ...entry,
              order: layout.value.positionOf(indexForKey(entry.key)),
            },
      ]),
    )
    const direction = destination > position ? 1 : -1
    entries.set(key, { ...entries.get(key), key, order: destination })
    for (
      let current = position + direction;
      direction > 0 ? current <= destination : current >= destination;
      current += direction
    ) {
      const shiftedIndex = layout.value.sourceAt(current)
      if (shiftedIndex < 0) continue
      const shiftedKey = keyAt(shiftedIndex)
      entries.set(shiftedKey, {
        ...entries.get(shiftedKey),
        key: shiftedKey,
        order: current - direction,
      })
    }
    commit([...entries.values()])
    return true
  }
  const move = (key: string, direction: -1 | 1) => {
    const index = indexForKey(key)
    const position = layout.value.positionOf(index)
    return moveTo(
      key,
      position + direction,
      direction === -1 ? 'before' : 'after',
    )
  }
  const moveSetting = (
    key: string,
    targetPosition: number,
    placement: 'before' | 'inside' | 'after',
  ) => {
    if (props.virtualSource || !hasGroups.value) {
      if (placement === 'inside') return false
      const target = settingItemAt(targetPosition)
      return moveTo(key, target.position, placement)
    }
    const source = nodeByKey.value.get(key)
    const target = columnTree.value.nodes[targetPosition]
    if (!source || !target || source.key === target.key) return false
    const parentKey = placement === 'inside' ? target.key : target.parentKey
    if (placement === 'inside' && !target.group) return false
    let cursor = parentKey
    while (cursor) {
      if (cursor === source.key) return false
      cursor = nodeByKey.value.get(cursor)?.parentKey ?? null
    }
    let index =
      placement === 'inside'
        ? target.childKeys.length
        : target.siblingIndex + (placement === 'after' ? 1 : 0)
    if (source.parentKey === parentKey && source.siblingIndex < index) index--
    if (source.parentKey === parentKey && source.siblingIndex === index)
      return false
    const entries = new Map(state.value.map((entry) => [entry.key, entry]))
    const previous = entries.get(key)
    entries.set(key, {
      ...previous,
      key,
      order: undefined,
      placement: { parentKey, index },
    })
    commit(normalizeColumnState([...entries.values()]))
    return true
  }
  let loadedKey: string | undefined
  let restoredState: TableColumnState[] | undefined
  const storageBindings = shallowRef(new Map<symbol, string>())
  const storageKey = computed(() => {
    const values = [...storageBindings.value.values()]
    return values[values.length - 1]
  })
  const setStorageKey = (owner: symbol, key?: string) => {
    const next = new Map(storageBindings.value)
    if (key) next.set(owner, key)
    else next.delete(owner)
    storageBindings.value = next
  }
  const setResetWidths = (reset: () => void) => {
    resetWidths = reset
  }
  const restore = () => {
    if (!mounted.value || typeof window === 'undefined') return
    if (!storageKey.value) {
      loadedKey = undefined
      restoredState = undefined
      return
    }
    const changedKey = loadedKey !== storageKey.value
    loadedKey = storageKey.value
    if (changedKey && props.columnState === undefined) {
      localState.value = []
      restoredState = localState.value
    }
    if (props.columnState !== undefined || !loadedKey) return
    try {
      const stored = window.localStorage.getItem(loadedKey)
      if (!stored) return
      const parsed = JSON.parse(stored)
      if (parsed.version !== 1 || !Array.isArray(parsed.columns)) return
      localState.value = normalizeColumnState(parsed.columns)
      restoredState = localState.value
    } catch (error) {
      emit('columnStorageError', { operation: 'read', error })
    }
  }
  onMounted(() => {
    mounted.value = true
    restore()
  })
  watch(storageKey, restore)
  watch(
    state,
    (next) => {
      if (
        !mounted.value ||
        !storageKey.value ||
        storageKey.value !== loadedKey ||
        typeof window === 'undefined'
      )
        return
      if (props.columnState === undefined && localState.value === restoredState)
        return
      try {
        window.localStorage.setItem(
          storageKey.value,
          JSON.stringify({ version: 1, columns: next }),
        )
      } catch (error) {
        emit('columnStorageError', { operation: 'write', error })
      }
    },
    { deep: true, flush: 'post' },
  )
  return {
    state,
    effectiveColumns,
    columnTree,
    columns,
    count,
    settingCount,
    hasGroups,
    layout,
    keyAt,
    indexForKey,
    columnAt,
    customizedSelectionColumns,
    itemAt,
    settingItemAt,
    settingIndexForKey,
    visibleColumns,
    resolveVisibleColumns,
    update,
    move,
    moveTo,
    moveSetting,
    setStorageKey,
    setResetWidths,
    reset: () => {
      commit([])
      resetWidths()
    },
  }
}
