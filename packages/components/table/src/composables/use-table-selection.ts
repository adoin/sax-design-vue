import { computed, watch } from 'vue'
import type { ComputedRef } from 'vue'
import type {
  TableColumn,
  TableEmitFn,
  TableFlatRow,
  TableProps,
  TableRow,
  TableRowKey,
} from '../table'

interface SelectionOptions {
  columns: ComputedRef<TableColumn[]>
  flatRows: ComputedRef<TableFlatRow[]>
  getAllRows: () => TableRow[]
  getRowKey: (row: TableRow, index: number) => TableRowKey
  pageKey?: ComputedRef<string>
}

export function useTableSelection(
  props: TableProps,
  emit: TableEmitFn,
  options: SelectionOptions,
) {
  const columnType = computed(
    () =>
      options.columns.value.find(
        (column) => column.type === 'checkbox' || column.type === 'radio',
      )?.type,
  )
  const multiple = computed(
    () =>
      columnType.value === 'checkbox' ||
      (columnType.value !== 'radio' && props.multiple),
  )
  const sourceRows = computed(() =>
    props.virtualSource ? [] : options.getAllRows(),
  )
  const sourceKeys = computed(() => {
    const keys = new WeakMap<TableRow, TableRowKey>()
    sourceRows.value.forEach((row, index) =>
      keys.set(row, options.getRowKey(row, index)),
    )
    return keys
  })
  const rowKey = (row: TableRow) =>
    sourceKeys.value.get(row) ?? options.getRowKey(row, -1)
  const selectedValue = computed(() =>
    props.row !== undefined ? props.row : props.modelValue,
  )
  const getSelectedRows = (): TableRow[] => {
    const values = Array.isArray(selectedValue.value)
      ? selectedValue.value
      : [selectedValue.value]
    return values.filter(
      (value): value is TableRow => value !== null && typeof value === 'object',
    )
  }
  const selectedKeys = computed(() => new Set(getSelectedRows().map(rowKey)))
  const isSelectable = (row: TableRow, rowIndex: number) =>
    props.selectionConfig.checkMethod?.({ row, rowIndex }) !== false
  const selected = (key: TableRowKey) => selectedKeys.value.has(key)
  const emitRows = (rows: TableRow[]) => {
    const unique = [...new Map(rows.map((row) => [rowKey(row), row])).values()]
    const next = multiple.value ? unique : unique.slice(0, 1)
    const value = multiple.value ? next : (next[0] ?? null)
    emit('update:row', value)
    if (props.row === undefined) emit('update:modelValue', value)
    emit('selectionChange', next)
  }
  const setSelectedRows = (rows: TableRow[]) =>
    emitRows(
      rows.filter((row) => isSelectable(row, sourceRows.value.indexOf(row))),
    )
  const toggleRowSelection = (row: TableRow, checked?: boolean) => {
    if (!isSelectable(row, sourceRows.value.indexOf(row))) return
    const key = rowKey(row)
    const nextChecked = checked ?? !selectedKeys.value.has(key)
    const current = getSelectedRows().filter((item) => rowKey(item) !== key)
    if (!multiple.value) emitRows(nextChecked ? [row] : [])
    else emitRows(nextChecked ? [...current, row] : current)
  }
  const selectableRows = computed(() =>
    options.flatRows.value.filter(({ row, index }) => isSelectable(row, index)),
  )
  const allSelected = computed(
    () =>
      selectableRows.value.length > 0 &&
      selectableRows.value.every(({ key }) => selectedKeys.value.has(key)),
  )
  const indeterminate = computed(
    () =>
      !allSelected.value &&
      selectableRows.value.some(({ key }) => selectedKeys.value.has(key)),
  )
  const selectAll = (checked = true) => {
    // A generated source may represent billions of cells; it is never expanded
    // into a selection array. Individual generated rows remain selectable.
    if (props.virtualSource || !multiple.value) return
    const scope = new Set(selectableRows.value.map(({ key }) => key))
    const outside = getSelectedRows().filter((row) => !scope.has(rowKey(row)))
    emitRows(
      checked
        ? [...outside, ...selectableRows.value.map(({ row }) => row)]
        : outside,
    )
  }
  const onRowClick = (row: TableRow) => {
    if (
      (props.selectionConfig.trigger ?? (columnType.value ? 'cell' : 'row')) !==
      'row'
    )
      return
    toggleRowSelection(row, multiple.value ? undefined : true)
  }

  watch([() => props.data, () => options.pageKey?.value], () => {
    if (!columnType.value || props.virtualSource || !getSelectedRows().length)
      return
    const scope =
      options.pageKey?.value && !props.selectionConfig.reserve
        ? options.flatRows.value.map(({ row }) => row)
        : sourceRows.value
    const current = new Map(scope.map((row) => [rowKey(row), row]))
    const previous = getSelectedRows()
    const next: TableRow[] = []
    for (const row of previous) {
      const replacement = current.get(rowKey(row))
      if (replacement) next.push(replacement)
      else if (props.selectionConfig.reserve) next.push(row)
    }
    if (
      next.length !== previous.length ||
      next.some((row, index) => row !== previous[index])
    )
      emitRows(next)
  })

  return {
    multiple,
    selected,
    isSelectable,
    allSelected,
    indeterminate,
    selectableRows,
    onRowClick,
    getSelectedRows,
    setSelectedRows,
    toggleRowSelection,
    selectAll,
    clearSelection: () => emitRows([]),
  }
}
