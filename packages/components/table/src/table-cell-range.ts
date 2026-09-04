import type { TableActiveCell } from './table-keyboard'
import type { TableRowKey } from './table'

/** Stable endpoint addresses. Direction is preserved independently of the enclosing rectangle. */
export interface TableCellRange {
  anchor: TableActiveCell
  focus: TableActiveCell
}

/** Half-open visible data-row and visual-column positions; group bands are not data rows. */
export interface TableCellRangeBounds {
  rowStart: number
  rowEnd: number
  colStart: number
  colEnd: number
}

export interface TableRangeConfig {
  enabled?: boolean
  mouse?: boolean
  keyboard?: boolean
  autoScroll?: boolean
  scrollThreshold?: number
  scrollSpeed?: number
  /** Map a generated row key to its absolute source index without scanning rows. */
  rowIndexOf?: (key: TableRowKey) => number
}

export type TableCellRangeReason =
  'pointer' | 'keyboard' | 'programmatic' | 'external' | 'context' | 'clear'

export interface TableCellRangeChange {
  range: TableCellRange | null
  bounds: TableCellRangeBounds | null
  reason: TableCellRangeReason
}
