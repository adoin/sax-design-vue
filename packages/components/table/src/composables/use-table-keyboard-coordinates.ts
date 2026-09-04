import { computed } from 'vue'
import type { Ref } from 'vue'
import type { TableColumn, TableFlatRow, TableProps } from '../table'
import type { TableActiveCell } from '../table-keyboard'
import type { TableCellCoordinate } from './use-table-keyboard'
import type { useTableColumnManager } from './use-table-column-manager'

interface CoordinateOptions {
  rows: Ref<TableFlatRow[]>
  count: () => number
  offset: () => number
  sourceViewIndex?: (index: number) => number
  rowAt: (index: number) => TableFlatRow | undefined
  columns: Ref<TableColumn[]>
  manager: ReturnType<typeof useTableColumnManager>
}

/** Visual order is fixed-left, scrolling columns, fixed-right in both render modes. */
export function useTableKeyboardCoordinates(
  props: TableProps,
  options: CoordinateOptions,
) {
  const ordinaryColumns = computed(() => {
    if (props.virtualSource) return []
    const entries = options.columns.value.map((column, index) => ({
      column,
      index,
    }))
    return [
      ...entries.filter(
        ({ column }) => column.fixed === true || column.fixed === 'left',
      ),
      ...entries.filter(({ column }) => !column.fixed),
      ...entries.filter(({ column }) => column.fixed === 'right'),
    ]
  })
  const rowsByKey = computed(
    () =>
      new Map(
        props.virtualSource
          ? []
          : options.rows.value.map((row, index) => [row.key, index]),
      ),
  )
  const keyAt = (index: number) =>
    props.virtualSource
      ? String(index)
      : (options.columns.value[index]?.key ??
        options.columns.value[index]?.field ??
        `@${index}`)
  const countColumns = () =>
    props.virtualSource
      ? options.manager.layout.value.visibleCount
      : ordinaryColumns.value.length
  const columnAt = (position: number) => {
    if (position < 0 || position >= countColumns()) return -1
    if (!props.virtualSource)
      return ordinaryColumns.value[position]?.index ?? -1
    const layout = options.manager.layout.value
    if (position < layout.left.length) return layout.left[position]
    const center = position - layout.left.length
    return center < layout.centerCount
      ? layout.centerAt(center)
      : layout.right[center - layout.centerCount]
  }
  const positionOf = (index: number) => {
    if (!props.virtualSource)
      return ordinaryColumns.value.findIndex((entry) => entry.index === index)
    if (
      !Number.isInteger(index) ||
      index < 0 ||
      index >= props.virtualSource.columnCount
    )
      return -1
    const layout = options.manager.layout.value
    if (layout.hidden.has(index)) return -1
    const left = layout.left.indexOf(index)
    if (left >= 0) return left
    const right = layout.right.indexOf(index)
    return right >= 0
      ? layout.left.length + layout.centerCount + right
      : layout.left.length + layout.centerIndexOf(index)
  }
  const at = (
    row: number,
    position: number,
  ): TableCellCoordinate | undefined => {
    if (
      !Number.isInteger(row) ||
      !Number.isInteger(position) ||
      row < 0 ||
      row >= options.count()
    )
      return
    const column = columnAt(position)
    if (column < 0) return
    const flat = options.rowAt(row)
    if (!flat) return
    return {
      row,
      position,
      column,
      address: { rowKey: flat.key, columnKey: keyAt(column) },
    }
  }
  const resolve = (address: TableActiveCell, hint?: TableCellCoordinate) => {
    let row = -1
    if (props.virtualSource) {
      const config =
        typeof props.keyboardConfig === 'object' ? props.keyboardConfig : {}
      if (config.rowIndexOf)
        row = options.sourceViewIndex
          ? options.sourceViewIndex(config.rowIndexOf(address.rowKey))
          : config.rowIndexOf(address.rowKey) - options.offset()
      else if (hint?.address.rowKey === address.rowKey) row = hint.row
    } else row = rowsByKey.value.get(address.rowKey) ?? -1
    const column = props.virtualSource
      ? Number(address.columnKey)
      : options.columns.value.findIndex(
          (_, index) => keyAt(index) === address.columnKey,
        )
    const target = at(row, positionOf(column))
    return target?.address.rowKey === address.rowKey &&
      target.address.columnKey === address.columnKey
      ? target
      : undefined
  }
  return { at, resolve, keyAt, countColumns, positionOf, columnAt }
}
