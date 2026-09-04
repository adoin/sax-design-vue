import type { TableRow, TableRowKey } from './table'

/** Source sibling position, independent of display sorting and pagination. */
export interface TableDataPosition {
  index: number
  parentKey?: TableRowKey
  /** Next sibling: insert before this key when it still exists. */
  beforeKey?: TableRowKey
  /** Previous sibling: fallback anchor when beforeKey no longer exists. */
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

export interface TableDataMutation<Row extends TableRow = TableRow> {
  type: 'insert' | 'update' | 'remove'
  rowKey: TableRowKey
  row: Readonly<Row>
  position: TableDataPosition
  patches: TableDataFieldPatch[]
}

export interface TableDataChangeRequest<Row extends TableRow = TableRow> {
  operations: TableDataMutation<Row>[]
  /** Assign this exact proposed array before accepting; absent for generated sources. */
  data?: Row[]
  signal: AbortSignal
}

export interface TableChangeConfig<Row extends TableRow = TableRow> {
  enabled?: boolean
  /** Change this key when a generated/remote data set gets a new baseline. */
  dataKey?: string | number
  /** Apply the proposal to owned data; return false to reject it. Honor signal before writing. */
  apply?: (request: TableDataChangeRequest<Row>) => boolean | Promise<boolean>
  /** Generated sources must locate stable row keys without scanning all rows. */
  indexOf?: (rowKey: TableRowKey) => number
}

export interface TableDataMutationResult {
  applied: boolean
  reason?: 'disabled' | 'busy' | 'rejected' | 'cancelled' | 'invalid'
  error?: unknown
}
