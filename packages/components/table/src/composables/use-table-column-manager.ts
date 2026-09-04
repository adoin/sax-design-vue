import { computed, onMounted, shallowRef, watch } from 'vue'
import { createColumnLayout } from './column-layout'
import type { ComputedRef } from 'vue'
import type {
  TableColumn,
  TableColumnState,
  TableEmitFn,
  TableProps,
} from '../table'

export interface ManagedColumn {
  key: string
  index: number
  position: number
  title: string
  hidden: boolean
  fixed: false | 'left' | 'right'
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
    unique.set(state.key, state)
  }
  return [...unique.values()]
}

export function useTableColumnManager(
  props: TableProps,
  emit: TableEmitFn,
  columns: ComputedRef<TableColumn[]>,
) {
  const localState = shallowRef<TableColumnState[]>([])
  const mounted = shallowRef(false)
  const config = computed(() =>
    typeof props.columnManagerConfig === 'object'
      ? props.columnManagerConfig
      : {},
  )
  const enabled = computed(
    () => props.columnManagerConfig !== false && config.value.enabled !== false,
  )
  const state = computed(() =>
    normalizeColumnState(props.columnState ?? localState.value),
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
    return {
      key: keyAt(index),
      index,
      position,
      title: String(column?.title ?? column?.field ?? index + 1),
      hidden: layout.value.hidden.has(index),
      fixed: layout.value.fixedOf(index),
    }
  }
  const visibleColumns = computed(() => {
    if (props.virtualSource || !state.value.length) return columns.value
    const result: TableColumn[] = []
    for (let position = 0; position < count.value; position++) {
      const index = layout.value.sourceAt(position)
      if (!layout.value.hidden.has(index))
        result.push({
          ...columns.value[index],
          key: keyAt(index),
          fixed: layout.value.fixedOf(index),
        })
    }
    return result
  })
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
    if (indexForKey(key) < 0 || indexForKey(key) >= count.value) return
    const entries = new Map(state.value.map((entry) => [entry.key, entry]))
    entries.set(key, { ...entries.get(key), ...patch, key })
    commit(normalizeColumnState([...entries.values()]))
  }
  const move = (key: string, direction: -1 | 1) => {
    const index = indexForKey(key)
    const position = layout.value.positionOf(index)
    const other = layout.value.sourceAt(position + direction)
    if (index < 0 || other < 0) return
    // Preserve collision-resolved positions before swapping two neighboring slots.
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
    entries.set(key, { ...entries.get(key), key, order: position + direction })
    const otherKey = keyAt(other)
    entries.set(otherKey, {
      ...entries.get(otherKey),
      key: otherKey,
      order: position,
    })
    commit([...entries.values()])
  }
  let loadedKey: string | undefined
  let restoredState: TableColumnState[] | undefined
  const storageKey = computed(() => config.value.storageKey)
  const restore = () => {
    if (!mounted.value || typeof window === 'undefined') return
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
    enabled,
    state,
    count,
    layout,
    keyAt,
    indexForKey,
    columnAt,
    customizedSelectionColumns,
    itemAt,
    visibleColumns,
    update,
    move,
    reset: () => commit([]),
  }
}
