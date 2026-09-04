import type { TableRowKey } from './table'

export interface TableActiveCell {
  rowKey: TableRowKey
  /** key/field, or @originalIndex for unnamed ordinary columns; source index string for generated columns. */
  columnKey: string
}
export interface TableKeyboardConfig {
  enabled?: boolean
  enterToEdit?: boolean
  /** Resolve a generated row key to an absolute source index without scanning rows. */
  rowIndexOf?: (key: TableRowKey) => number
}
