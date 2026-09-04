import { tableFieldValue } from '../data-utils'
import { createTableMergeIndex } from './table-merge-regions'
import type { TableCellRangeBounds } from '../table-cell-range'
import type { TableClipboardCell } from '../clipboard-data'
import type { TableColumn, TableFlatRow } from '../table'
import type { TableMergeRegion } from './table-merge-regions'

interface Options {
  count: () => { rows: number; columns: number; sourceRows: number }
  sourceIndexAt: (index: number) => number
  viewIndexNear: (index: number, backwards: boolean) => number | undefined
  rowAt: (index: number) => TableFlatRow | undefined
  columnAt: (
    index: number,
  ) => { column: TableColumn; index: number } | undefined
  query: (bounds: TableCellRangeBounds) => readonly TableMergeRegion[]
  toggle: (row: TableFlatRow, expanded?: boolean) => Promise<void>
}

/** One sparse merge query per operation, sharing the table's logical row/column mapping. */
export function createTableClipboardCells(options: Options) {
  return (bounds: TableCellRangeBounds) => {
    const first = options.sourceIndexAt(bounds.rowStart)
    const last = options.sourceIndexAt(bounds.rowEnd - 1)
    const count = options.count()
    const merges = createTableMergeIndex(
      options.query({ ...bounds, rowStart: first, rowEnd: last + 1 }),
      count.sourceRows,
      count.columns,
    )
    return (row: number, column: number): TableClipboardCell | undefined => {
      if (row < 0 || row >= count.rows || column < 0 || column >= count.columns)
        return
      const sourceRow = options.sourceIndexAt(row)
      const region = merges.at(sourceRow, column)
      const flat = options.rowAt(region?.row ?? sourceRow)
      const entry = options.columnAt(region?.col ?? column)
      if (!flat || !entry?.column) return
      const start = region
        ? options.viewIndexNear(region.row, false)
        : undefined
      const end = region
        ? options.viewIndexNear(region.rowEnd - 1, true)
        : undefined
      return {
        span:
          region && start != null && end != null
            ? {
                rowStart: start,
                rowEnd: end + 1,
                colStart: region.col,
                colEnd: region.colEnd,
              }
            : undefined,
        context: {
          row: flat.row,
          rowKey: flat.key,
          rowIndex: flat.index,
          column: entry.column,
          columnIndex: entry.index,
          columnKey:
            entry.column.key ?? entry.column.field ?? String(entry.index),
          value: tableFieldValue(flat.row, entry.column.field),
          depth: flat.depth,
          expanded: flat.expanded,
          loading: flat.loading,
          toggleExpand: (expanded) => options.toggle(flat, expanded),
        },
      }
    }
  }
}
