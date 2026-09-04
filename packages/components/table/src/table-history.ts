import type { TableRowKey } from './table'
import type { TableChangedRow, TableDataMutation } from './table-changes'

export interface TableHistoryConfig {
  enabled?: boolean
  /** Maximum retained operations; defaults to 100. */
  limit?: number
}

export interface TableHistoryState {
  undoCount: number
  redoCount: number
  canUndo: boolean
  canRedo: boolean
}

/** Internal sparse journal checkpoints. Row references remain read-only. */
export interface TableChangeCheckpoint {
  rowKey: TableRowKey
  entry?: TableChangedRow & { type: 'insert' | 'update' | 'remove' }
}

export interface TableHistoryEntry {
  forward: TableDataMutation[]
  backward: TableDataMutation[]
  before: TableChangeCheckpoint[]
  after: TableChangeCheckpoint[]
}
