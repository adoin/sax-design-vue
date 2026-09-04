import type { TableRow } from './table'

export type TableGroupValue =
  string | number | boolean | bigint | null | undefined | Date
export type TableAggregateMethod = 'count' | 'sum' | 'average' | 'min' | 'max'

export interface TableAggregateCell<Row extends TableRow = TableRow> {
  row: Row
  rowIndex: number
  value: unknown
}

/** A reducer stores one accumulator per group instead of collecting all cell values. */
export interface TableAggregateReducer<Row extends TableRow = TableRow> {
  initial: () => unknown
  step: (state: unknown, cell: TableAggregateCell<Row>) => unknown
  finish?: (state: unknown, rowCount: number) => unknown
}

export interface TableAggregate<Row extends TableRow = TableRow> {
  key: string
  field?: string
  method: TableAggregateMethod | TableAggregateReducer<Row>
}

export interface TableGroupField<Row extends TableRow = TableRow> {
  field: string
  /** Normalize object-valued fields into a stable, serializable grouping value. */
  value?: (row: Row, rowIndex: number) => TableGroupValue
  label?: (value: TableGroupValue) => string
}

export interface TableGroupPathEntry {
  field: string
  value: TableGroupValue
}

/** Group positions address data rows; group titles/subtotals never consume a data index. */
export interface TableGroupNode {
  key: string
  field: string
  value: TableGroupValue
  label: string
  depth: number
  path: readonly TableGroupPathEntry[]
  rowStart: number
  rowCount: number
  aggregates: Readonly<Record<string, unknown>>
  children: readonly TableGroupNode[]
}

export interface TableRemoteGroup {
  key: string
  field: string
  value: TableGroupValue
  label?: string
  /** First member's page data index, or absolute source index for generated data. */
  rowStart: number
  rowCount: number
  aggregates?: Readonly<Record<string, unknown>>
  children?: readonly TableRemoteGroup[]
}

export interface TableGroupRemoteResult {
  groups: readonly TableRemoteGroup[]
  summary?: Readonly<Record<string, unknown>>
}

export interface TableGroupConfig<Row extends TableRow = TableRow> {
  enabled?: boolean
  fields?: readonly (string | TableGroupField<Row>)[]
  aggregates?: readonly TableAggregate<Row>[]
  /** Local grouping uses the current page's filtered/sorted, expanded tree branches. */
  mode?: 'local' | 'remote'
  remote?: TableGroupRemoteResult
  defaultExpanded?: boolean
  subtotal?: boolean
  summary?: boolean
  /** Overall local summary only; group subtotals always cover their supplied members. */
  summaryScope?: 'page' | 'filtered'
}
