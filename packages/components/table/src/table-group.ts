import type { TableRow } from './table'
import type { FieldPath } from '../../types'

export type TableGroupValue =
  string | number | boolean | bigint | null | undefined | Date
export type TableAggregateMethod = 'count' | 'sum' | 'average' | 'min' | 'max'

export interface TableAggregateCell<Row extends object = TableRow> {
  row: Row
  rowIndex: number
  value: unknown
}

/** Convenient custom aggregate for ordinary in-memory data sets. */
export type TableAggregateFunction<Row extends object = TableRow> = (
  cells: readonly TableAggregateCell<Row>[],
) => string | number

/** A reducer stores one accumulator per group instead of collecting all cell values. */
export interface TableAggregateReducer<Row extends object = TableRow> {
  initial: () => unknown
  step: (state: unknown, cell: TableAggregateCell<Row>) => unknown
  finish?: (state: unknown, rowCount: number) => unknown
}

export interface TableAggregate<Row extends object = TableRow> {
  /** Output key for the aggregate result; it does not need to be a row field. */
  key: string
  field?: FieldPath<Row>
  method:
    | TableAggregateMethod
    | TableAggregateFunction<Row>
    | TableAggregateReducer<Row>
}

export interface TableGroupField<Row extends object = TableRow> {
  field: FieldPath<Row>
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

export interface TableGroupConfig<Row extends object = TableRow> {
  enabled?: boolean
  fields?: readonly (FieldPath<Row> | TableGroupField<Row>)[]
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
