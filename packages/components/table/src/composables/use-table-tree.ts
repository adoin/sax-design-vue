import { computed, reactive, ref, shallowReactive, watch } from 'vue'
import type { ComputedRef } from 'vue'
import type {
  TableFlatRow,
  TableRow,
  TableRowKey,
  TableRowKeyGetter,
  TableTreeConfig,
} from '../table'

interface UseTableTreeOptions<Row extends TableRow> {
  data: ComputedRef<Row[]>
  rowKey: ComputedRef<TableRowKeyGetter<Row>>
  config: ComputedRef<TableTreeConfig<Row> | undefined>
  expandedKeys: ComputedRef<TableRowKey[] | undefined>
  sortRows?: ComputedRef<((rows: Row[]) => Row[]) | undefined>
  filterRow?: ComputedRef<((row: Row) => boolean) | undefined>
  onExpandedKeysChange: (keys: TableRowKey[]) => void
  onTreeExpand: (row: Row, expanded: boolean) => void
  onLazyLoad: (row: Row, children: Row[]) => void
}

export function useTableTree<Row extends TableRow>(
  options: UseTableTreeOptions<Row>,
) {
  const internalExpandedKeys = ref(new Set<TableRowKey>())
  const lazyChildren = shallowReactive(
    new Map<TableRowKey, { rows: Row[]; original: unknown }>(),
  )
  const loadingKeys = reactive(new Set<TableRowKey>())
  const generatedRowKeys = new WeakMap<Row, TableRowKey>()
  let generatedRowKeySeed = 0
  let initialized = false

  const getRowKey = (row: Row, index: number): TableRowKey => {
    const key = options.rowKey.value
    const value = typeof key === 'function' ? key(row, index) : row[key]
    if (typeof value === 'number' || typeof value === 'string') return value

    const existing = generatedRowKeys.get(row)
    if (existing != null) return existing
    const generated = `_S_ROW_${++generatedRowKeySeed}`
    generatedRowKeys.set(row, generated)
    return generated
  }

  const getChildren = (row: Row, key: TableRowKey): Row[] => {
    const localChildren = lazyChildren.get(key)
    const childrenKey = options.config.value?.children ?? 'children'
    const children = row[childrenKey]
    if (localChildren && children === localChildren.original)
      return localChildren.rows
    return Array.isArray(children) ? (children as Row[]) : []
  }

  const hasLazyChildren = (row: Row) => {
    const hasChildren = options.config.value?.hasChildren
    if (typeof hasChildren === 'function') return hasChildren(row)
    if (typeof hasChildren === 'string') return Boolean(row[hasChildren])
    return false
  }

  const collectExpandableKeys = (rows: Row[]): TableRowKey[] => {
    const result: TableRowKey[] = []
    let cursor = 0
    const walk = (items: Row[]) => {
      items.forEach((row) => {
        const key = getRowKey(row, cursor++)
        const children = getChildren(row, key)
        if (children.length || hasLazyChildren(row)) result.push(key)
        if (children.length) walk(children)
      })
    }
    walk(rows)
    return result
  }

  const setExpandedKeys = (keys: TableRowKey[]) => {
    internalExpandedKeys.value = new Set(keys)
    options.onExpandedKeysChange(keys)
  }

  const flatRows = computed<TableFlatRow<Row>[]>(() => {
    const result: TableFlatRow<Row>[] = []
    let sourceIndex = 0
    const filter = options.filterRow?.value
    const matches = new WeakMap<Row, boolean>()
    const matchesBranch = (row: Row): boolean => {
      if (!filter) return true
      const cached = matches.get(row)
      if (cached !== undefined) return cached
      const match =
        filter(row) || getChildren(row, getRowKey(row, 0)).some(matchesBranch)
      matches.set(row, match)
      return match
    }
    const walk = (rows: Row[], depth: number, parentKey?: TableRowKey) => {
      const ordered = options.sortRows?.value?.(rows) ?? rows
      ordered.forEach((row) => {
        if (!matchesBranch(row)) return
        const index = sourceIndex++
        const key = getRowKey(row, index)
        const children = getChildren(row, key)
        const hasChildren = children.length > 0 || hasLazyChildren(row)
        const expanded =
          internalExpandedKeys.value.has(key) ||
          Boolean(filter && children.some(matchesBranch))
        result.push({
          row,
          key,
          index,
          depth,
          parentKey,
          hasChildren,
          expanded,
          loading: loadingKeys.has(key),
        })
        if (hasChildren && expanded && children.length)
          walk(children, depth + 1, key)
      })
    }
    walk(options.data.value, 0)
    return result
  })

  const rowIndex = computed(() => {
    const byKey = new Map<TableRowKey, number>()
    const byRow = new WeakMap<Row, number>()
    const entryByRow = new WeakMap<Row, TableFlatRow<Row>>()
    flatRows.value.forEach((entry, flatIndex) => {
      byKey.set(entry.key, flatIndex)
      byRow.set(entry.row, flatIndex)
      entryByRow.set(entry.row, entry)
    })
    return { byKey, byRow, entryByRow }
  })

  const getRowIndex = (rowOrKey: Row | TableRowKey) =>
    typeof rowOrKey === 'object'
      ? (rowIndex.value.byRow.get(rowOrKey) ?? -1)
      : (rowIndex.value.byKey.get(rowOrKey) ?? -1)

  const toggleRowExpand = async (row: Row, expanded?: boolean) => {
    const entry = rowIndex.value.entryByRow.get(row)
    if (!entry || !entry.hasChildren || loadingKeys.has(entry.key)) return

    const nextExpanded = expanded ?? !entry.expanded
    if (
      nextExpanded &&
      getChildren(row, entry.key).length === 0 &&
      options.config.value?.load
    ) {
      loadingKeys.add(entry.key)
      try {
        const children = await options.config.value.load({
          row,
          rowKey: entry.key,
        })
        lazyChildren.set(entry.key, {
          rows: children,
          original: row[options.config.value?.children ?? 'children'],
        })
        options.onLazyLoad(row, children)
      } finally {
        loadingKeys.delete(entry.key)
      }
    }

    const next = new Set(internalExpandedKeys.value)
    if (nextExpanded) next.add(entry.key)
    else next.delete(entry.key)
    internalExpandedKeys.value = next
    options.onExpandedKeysChange([...next])
    options.onTreeExpand(row, nextExpanded)
  }

  watch(
    options.expandedKeys,
    (keys) => {
      if (keys) internalExpandedKeys.value = new Set(keys)
    },
    { immediate: true },
  )

  watch(
    [options.data, options.config],
    () => {
      if (initialized || options.expandedKeys.value) return
      const config = options.config.value
      internalExpandedKeys.value = new Set(
        config?.expandAll
          ? collectExpandableKeys(options.data.value)
          : (config?.defaultExpandedKeys ?? []),
      )
      initialized = true
    },
    { immediate: true },
  )

  return {
    flatRows,
    getChildren,
    getRowIndex,
    getRowKey,
    getAllRows: () => {
      const rows: Row[] = []
      const walk = (items: Row[]) => {
        for (const row of items) {
          const key = getRowKey(row, rows.length)
          rows.push(row)
          const children = getChildren(row, key)
          if (children.length) walk(children)
        }
      }
      walk(options.data.value)
      return rows
    },
    setExpandedKeys,
    toggleRowExpand,
  }
}
