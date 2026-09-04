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
  /** Validate before editCommit when validationConfig is enabled. Defaults to true. */
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
  /** Defaults to all supplied/loaded rows; view uses the filtered, expanded current page. */
  scope?: 'all' | 'view'
  /**
   * Ordinary numbers address the flattened current page; row objects must belong
   * to supplied/loaded data. With scope:view they must also belong to that view.
   * Generated sources accept only absolute numeric indices; explicit rows override scope.
   */
  rows?: Array<Row | number>
  /** Stable keys for supplied tree/array rows. Generated sources also require numeric rows. */
  rowKeys?: TableRowKey[]
  /**
   * Omit for all configured columns (including hidden ones). Ordinary numbers
   * address resolved visible columns; objects or key/field strings may select
   * configured hidden columns. Generated sources require absolute numeric indices.
   */
  columns?: Array<TableColumn<Row> | string | number>
  /** Cancels this run; cancellation does not replace previously completed errors. */
  signal?: AbortSignal
  /** Overrides validationConfig.scrollToError; defaults to true. */
  scrollToError?: boolean
  /** Overrides validationConfig.maxErrors; defaults to 100, minimum 1 after flooring. */
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
