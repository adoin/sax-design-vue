import type { TableRow, TableRowKey } from './table'

/** Internal change contracts; exported publicly with the data-mutation API. */
export interface TableDataPosition {
  index: number
  parentKey?: TableRowKey
  beforeKey?: TableRowKey
  afterKey?: TableRowKey
}

export interface TableDataFieldPatch {
  field: string
  value: unknown
  /** false restores a missing property instead of assigning undefined. */
  exists: boolean
}

export interface TableDataFieldChange extends TableDataFieldPatch {
  oldValue: unknown
  oldExists: boolean
}

export interface TableChangedRow<Row extends TableRow = TableRow> {
  rowKey: TableRowKey
  /** Read-only consumer row reference; field values below are snapshots. */
  row: Readonly<Row>
  position: TableDataPosition
  fields: TableDataFieldChange[]
}

export interface TableChangeRecords<Row extends TableRow = TableRow> {
  version: number
  inserted: TableChangedRow<Row>[]
  updated: TableChangedRow<Row>[]
  removed: TableChangedRow<Row>[]
}

export type TableAcceptedDataOperation<Row extends TableRow = TableRow> = {
  rowKey: TableRowKey
  row: Row
  position: TableDataPosition
} & (
  | { type: 'insert' }
  | { type: 'remove' }
  | { type: 'update'; before: Row; fields: string[] }
)

export type TableRevertOperation<Row extends TableRow = TableRow> = {
  rowKey: TableRowKey
  row: Readonly<Row>
  position: TableDataPosition
  patches: TableDataFieldPatch[]
  type: 'remove' | 'update' | 'restore'
}

export interface TableChangeTransaction {
  /** Call only after the data owner accepts the corresponding mutation. */
  commit: () => boolean
  cancel: () => void
}
