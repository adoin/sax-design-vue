import { computed, shallowRef } from 'vue'
import { tableColumnKey, tableFieldValue } from '../data-utils'
import { compareTableValues } from '../sort-utils'
import type { ComputedRef } from 'vue'
import type {
  TableColumn,
  TableEmitFn,
  TableFilterValue,
  TableFilters,
  TableProps,
  TableRow,
  TableSort,
  TableSortOrder,
} from '../table'

const copyFilters = (filters: TableFilters): TableFilters => {
  const result: TableFilters = {}
  for (const [field, values] of Object.entries(filters)) {
    if (values.length) result[field] = [...new Set(values)]
  }
  return result
}

export function useTableQuery(
  props: TableProps,
  emit: TableEmitFn,
  columns: ComputedRef<TableColumn[]>,
) {
  const internalSort = shallowRef<TableSort[]>(
    props.sortConfig.defaultSort ?? [],
  )
  const internalFilters = shallowRef<TableFilters>(
    copyFilters(props.filterConfig.defaultFilters ?? {}),
  )
  const normalizeSort = (sorts: TableSort[]) => {
    const unique = new Map<string, TableSort>()
    for (const sort of sorts) {
      if (sort.field && (sort.order === 'asc' || sort.order === 'desc'))
        unique.set(sort.field, { ...sort })
    }
    const result = [...unique.values()]
    return props.sortConfig.multiple ? result : result.slice(-1)
  }
  const sorts = computed(() =>
    normalizeSort(props.sortBy ?? internalSort.value),
  )
  const filters = computed(() => props.filters ?? internalFilters.value)
  const columnMap = computed(
    () =>
      new Map(columns.value.map((column) => [tableColumnKey(column), column])),
  )

  const setSort = (value: TableSort[]) => {
    const next = normalizeSort(value)
    if (props.sortBy === undefined) internalSort.value = next
    emit('update:sortBy', next)
    emit('sortChange', next)
  }
  const toggleSort = (column: TableColumn, requestedOrder: TableSortOrder) => {
    const field = tableColumnKey(column)
    const current = sorts.value.find((sort) => sort.field === field)
    const order = current?.order === requestedOrder ? undefined : requestedOrder
    const next = props.sortConfig.multiple
      ? sorts.value.filter((sort) => sort.field !== field)
      : []
    if (order) {
      // Preserve the priority of an existing field when changing its direction.
      const index = sorts.value.findIndex((sort) => sort.field === field)
      next.splice(index < 0 ? next.length : index, 0, { field, order })
    }
    setSort(next)
  }
  const setFilters = (value: TableFilters) => {
    const next = copyFilters(value)
    if (props.filters === undefined) internalFilters.value = next
    emit('update:filters', next)
    emit('filterChange', next)
  }

  const sortRows = computed(() => {
    // Index-generated data is intentionally opaque: never enumerate it here.
    if (props.virtualSource || props.sortConfig.remote || !sorts.value.length)
      return undefined
    const active: (TableSort & { column: TableColumn })[] = []
    for (const sort of sorts.value) {
      const column = columnMap.value.get(sort.field)
      if (column) active.push({ ...sort, column })
    }
    if (!active.length) return undefined
    return (rows: TableRow[]) =>
      [...rows].sort((a, b) => {
        for (const { column, order } of active) {
          const av = tableFieldValue(a, column.field)
          const bv = tableFieldValue(b, column.field)
          const diff = compareTableValues(
            av,
            bv,
            a,
            b,
            column.sortMethod,
            order,
          )
          if (diff) return diff
        }
        return 0
      })
  })

  const filterRow = computed(() => {
    if (props.virtualSource || props.filterConfig.remote) return undefined
    const active: { column: TableColumn; values: TableFilterValue[] }[] = []
    for (const [field, values] of Object.entries(filters.value)) {
      const column = columnMap.value.get(field)
      if (column && values.length) active.push({ column, values })
    }
    if (!active.length) return undefined
    return (row: TableRow) =>
      active.every(({ column, values }) => {
        const value = tableFieldValue(row, column.field)
        return column.filterMethod
          ? column.filterMethod({ row, column, value, values })
          : values.some((selected) => Object.is(selected, value))
      })
  })

  return {
    sorts,
    filters,
    sortRows,
    filterRow,
    toggleSort,
    setSort,
    setFilters,
    clearSort: () => setSort([]),
    clearFilters: () => setFilters({}),
  }
}
