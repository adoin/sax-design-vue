import type { TableColumn, TableRow, TableRowKey } from './table'

export type TableValidationType =
  'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object' | 'date'
export interface TableValidationContext<Row extends TableRow = TableRow> {
  row: Row
  draftRow: Row
  rowKey: TableRowKey
  rowIndex: number
  column: TableColumn<Row>
  columnIndex: number
  field: string
  value: unknown
  signal: AbortSignal
}
export interface TableValidationRule<Row extends TableRow = TableRow> {
  required?: boolean
  type?: TableValidationType
  min?: number
  max?: number
  pattern?: RegExp
  message?: string
  validator?: (
    context: TableValidationContext<Row>,
  ) =>
    void | boolean | string | Error | Promise<void | boolean | string | Error>
}
export type TableValidationRules<Row extends TableRow = TableRow> = Record<
  string,
  TableValidationRule<Row> | TableValidationRule<Row>[]
>
export interface TableValidationConfig {
  /** Validate drafts before emitting editCommit. Defaults to true. */
  onCommit?: boolean
  /** Locate the first error after an explicit validation. Defaults to true. */
  scrollToError?: boolean
  /** Stop at this many errors. Defaults to 100; the result reports truncated. */
  maxErrors?: number
}
export interface TableValidationError<Row extends TableRow = TableRow> {
  row: Row
  rowKey: TableRowKey
  rowIndex: number
  column: TableColumn<Row>
  columnIndex: number
  field: string
  value: unknown
  message: string
}
export interface TableValidationResult<Row extends TableRow = TableRow> {
  valid: boolean
  errors: TableValidationError<Row>[]
  cancelled: boolean
  truncated: boolean
  checked: number
}
export interface TableValidateOptions<Row extends TableRow = TableRow> {
  /** all: all supplied/loaded rows; view: the filtered, expanded current page. */
  scope?: 'all' | 'view'
  rows?: Array<Row | number>
  columns?: Array<TableColumn<Row> | string | number>
  signal?: AbortSignal
  scrollToError?: boolean
  maxErrors?: number
}

/** Internal lazy target: do not snapshot a whole table to validate a field. */
export interface TableValidationCell {
  row: TableRow
  draftRow: TableRow
  rowKey: TableRowKey
  rowIndex: number
  column: TableColumn
  columnIndex: number
  field: string
  value: unknown
  rules: TableValidationRule[]
  isCurrent: () => boolean
  readValue: () => unknown
  locate?: () => boolean | Promise<boolean>
}
