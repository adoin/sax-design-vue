import type { TableRowKey } from './table'
import type { TableEditContext } from './table-edit'
import type { TableCellRangeBounds } from './table-cell-range'
import type { TableValidationError } from './table-validation'
import type { TableFindLimits, TableFindQuery } from './find-data'
export type { TableFindQuery, TableFindLimits } from './find-data'

export type TableFindScope = 'view' | 'selection' | 'data'
export interface TableFindConfig extends TableFindLimits {
  enabled?: boolean
  keyboard?: boolean
  panel?: boolean
  scope?: TableFindScope
  formatCell?: (value: unknown, context: TableEditContext) => string | undefined
  parseCell?: (text: string, context: TableEditContext) => unknown
  checkMethod?: (context: TableEditContext) => boolean
}
export interface TableFindOptions {
  /** view: current expanded page; selection: cell range; data: all supplied/loaded rows. Defaults to findConfig.scope, then view. */
  scope?: TableFindScope
  /** Half-open visible coordinates, excluding group/detail bands. Overrides the current range for view/selection; invalid with data scope. */
  bounds?: TableCellRangeBounds
  /** Visible column keys or resolved indices (source indices for generated columns). Empty selects no columns; omit for all visible columns. */
  columns?: readonly (string | number)[]
  signal?: AbortSignal
}
export interface TableFindMatchInfo {
  rowKey: TableRowKey
  columnKey: string
  rowIndex: number
  columnIndex: number
  field: string
  text: string
  occurrences: number
}
export interface TableFindState {
  query: TableFindQuery
  scope: TableFindScope
  matches: TableFindMatchInfo[]
  activeIndex: number
  complete: boolean
  visited: number
  limit?: 'cells' | 'matches' | 'characters'
  pending: 'search' | 'replace' | null
}
export interface TableFindResult {
  success: boolean
  state: TableFindState
  reason?: 'disabled' | 'editing' | 'cancelled' | 'invalid' | 'conflict'
  error?: unknown
}
export interface TableFindNavigateOptions {
  /** Defaults to true. false scrolls to the match without taking the current input focus. */
  focus?: boolean
  signal?: AbortSignal
}
export interface TableReplaceOptions {
  /** Zero-based match index for replaceMatch; defaults to the active match. Ignored by replaceAll. */
  index?: number
  signal?: AbortSignal
}
export interface TableReplaceResult {
  applied: boolean
  changedCells: number
  skippedCells: number
  reason?:
    | 'disabled'
    | 'editing'
    | 'empty'
    | 'readonly'
    | 'cancelled'
    | 'invalid'
    | 'conflict'
    | 'validation'
    | 'limit'
    | 'busy'
    | 'rejected'
  errors?: TableValidationError[]
  error?: unknown
}
