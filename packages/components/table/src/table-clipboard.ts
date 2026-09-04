import type { TableEditContext } from './table-edit'
import type { TableCellRangeBounds } from './table-cell-range'
import type { TableValidationError } from './table-validation'

export type TableClipboardAction = 'copy' | 'cut' | 'paste'
export type TableClipboardData = readonly (readonly unknown[])[]

export interface TableClipboardConfig {
  enabled?: boolean
  keyboard?: boolean
  copy?: boolean
  cut?: boolean
  paste?: boolean
  /** Maximum rectangular cell count, including read-only/merged positions; default 10000. */
  maxCells?: number
  /** Maximum TSV character count; default 2000000. */
  maxCharacters?: number
  formatCell?: (value: unknown, context: TableEditContext) => string
  parseCell?: (value: unknown, context: TableEditContext) => unknown
  /** Cut clears writable cells to null unless supplied here. */
  clearCell?: (context: TableEditContext) => unknown
  /** Additional write restriction; cannot override editConfig or disabled editors. */
  checkMethod?: (context: TableEditContext) => boolean
}

export interface TableClipboardOptions {
  /** Half-open current-view data-row/visual-column indices, excluding group/detail bands. Omit to use the selected range or active cell. A one-cell paste target expands to the payload size; larger targets must be whole multiples of that size. */
  bounds?: TableCellRangeBounds
  signal?: AbortSignal
}

export interface TableCopyOptions extends TableClipboardOptions {
  /** Defaults to true. false skips the OS write; cut still clears writable source cells after preparing its snapshot. */
  writeClipboard?: boolean
}

export interface TableClipboardResult {
  action: TableClipboardAction
  success: boolean
  applied: boolean
  /** null means an OS write was started but cancellation left its result unknown. */
  clipboardWritten: boolean | null
  bounds?: TableCellRangeBounds
  data?: unknown[][]
  text?: string
  changedCells: number
  skippedCells: number
  reason?:
    | 'disabled'
    | 'empty'
    | 'editing'
    | 'readonly'
    | 'cancelled'
    | 'limit'
    | 'shape'
    | 'validation'
    | 'clipboard'
    | 'conflict'
    | 'rejected'
    | 'busy'
    | 'invalid'
  errors?: TableValidationError[]
  error?: unknown
}
