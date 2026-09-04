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
  /** Current view's visible data-row and visual-column indices, excluding group bands. */
  bounds?: TableCellRangeBounds
  signal?: AbortSignal
}

export interface TableCopyOptions extends TableClipboardOptions {
  /** false returns the snapshot without writing to the system clipboard. */
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
