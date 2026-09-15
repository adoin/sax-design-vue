import type { TableColumn, TableRow } from './table'

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
