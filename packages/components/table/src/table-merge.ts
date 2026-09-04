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

export interface TableMergeQuery extends TableMergeWindow {
  area: 'body' | 'footer'
  rowCount: number
  columnCount: number
  rowAt: (row: number) => TableRow | undefined
  columnAt: (position: number) => TableColumn | undefined
}

/** Return whole regions intersecting the query, including origins outside it. */
export type TableMergeResolver = (
  query: TableMergeQuery,
) => readonly TableMergeRange[]

export type TableMergeSource = readonly TableMergeRange[] | TableMergeResolver

export interface TableMergeConfig {
  enabled?: boolean
  body?: TableMergeSource
  footer?: TableMergeSource
}
