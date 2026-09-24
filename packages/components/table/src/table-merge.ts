import { get } from 'lodash-unified'
import type { TableColumn, TableRow } from './table'
import type { FieldPath, FieldPathValue } from '../../types'

/** Row and visual-column positions; spans count displayed rows and columns. */
export interface TableMergeRange {
  row: number
  col: number
  rowspan: number
  colspan: number
}

/** Half-open logical coordinates. End positions are not included. */
export interface TableMergeWindow {
  rowStart: number
  rowEnd: number
  colStart: number
  colEnd: number
}

export interface TableMergeQuery<
  Row extends object = TableRow,
> extends TableMergeWindow {
  area: 'body' | 'footer'
  rowCount: number
  columnCount: number
  rowAt: (row: number) => Row | undefined
  columnAt: (position: number) => TableColumn<Row> | undefined
}

/** Return whole regions intersecting the query, including origins outside it. */
export type TableMergeResolver<Row extends object = TableRow> = (
  query: TableMergeQuery<Row>,
) => readonly TableMergeRange[]

export type TableMergeSource<Row extends object = TableRow> =
  readonly TableMergeRange[] | TableMergeResolver<Row>

export interface TableMergeConfig<Row extends object = TableRow> {
  enabled?: boolean
  body?: TableMergeSource<Row>
  footer?: TableMergeSource<Row>
}

export interface TableRowspanMergeOptions<
  Row extends object,
  Field extends FieldPath<Row>,
> {
  /** Dot-separated JSON field whose consecutive equal values should merge. */
  field: Field
  /** Zero-based visible column position written to each merge range. */
  col: number
  /** Override Object.is comparison for normalized or structural values. */
  equals?: (
    previousValue: FieldPathValue<Row, Field>,
    value: FieldPathValue<Row, Field>,
    previousRow: Row,
    row: Row,
  ) => boolean
}

/**
 * Creates vertical merge ranges for consecutive rows with equal field values.
 * Single-row runs are omitted because they do not require a merge region.
 */
export const createTableRowspanMerges = <
  Row extends object,
  Field extends FieldPath<Row>,
>(
  rows: readonly Row[],
  options: TableRowspanMergeOptions<Row, Field>,
): TableMergeRange[] => {
  if (!Number.isInteger(options.col) || options.col < 0)
    throw new RangeError(
      'Table rowspan merge col must be a non-negative integer',
    )
  if (!String(options.field).trim())
    throw new TypeError('Table rowspan merge field must not be empty')
  if (rows.length < 2) return []

  type Value = FieldPathValue<Row, Field>
  const valueAt = (row: Row) => get(row, options.field) as Value
  const equals =
    options.equals ?? ((left: Value, right: Value) => Object.is(left, right))
  const ranges: TableMergeRange[] = []
  let start = 0
  let previousValue = valueAt(rows[0])

  const pushRange = (end: number) => {
    const rowspan = end - start
    if (rowspan > 1)
      ranges.push({
        row: start,
        col: options.col,
        rowspan,
        colspan: 1,
      })
  }

  for (let index = 1; index < rows.length; index++) {
    const value = valueAt(rows[index])
    if (!equals(previousValue, value, rows[index - 1], rows[index])) {
      pushRange(index)
      start = index
    }
    previousValue = value
  }
  pushRange(rows.length)
  return ranges
}
