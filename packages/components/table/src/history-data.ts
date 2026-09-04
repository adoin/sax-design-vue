import { cloneTableDataValue, equalTableDataValue } from './change-snapshot'
import { mergeTableDataChanges, readTableDataField } from './change-utils'
import type { TableRow, TableRowKey } from './table'
import type {
  TableChangeTransaction,
  TableDataMutation,
  TableDataPosition,
} from './table-changes'
import type { TableHistoryEntry } from './table-history'

export interface TableHistoryTarget {
  row: TableRow
  position: TableDataPosition
}

/** Capture only touched fields and inserted/removed rows, never the whole data set. */
export function captureTableHistory(
  operations: TableDataMutation[],
  transaction: TableChangeTransaction,
  resolve: (key: TableRowKey) => TableHistoryTarget,
): TableHistoryEntry {
  const forward: TableDataMutation[] = []
  const backward: TableDataMutation[] = []
  for (const operation of operations) {
    if (operation.type === 'insert') {
      forward.push({
        ...operation,
        position: { ...operation.position },
        patches: [],
      })
      backward.unshift({
        ...operation,
        position: { ...operation.position },
        patches: [],
        type: 'remove',
      })
      continue
    }
    const target = resolve(operation.rowKey)
    if (operation.type === 'remove') {
      forward.push({ ...operation, ...target, type: 'remove', patches: [] })
      backward.unshift({ ...operation, ...target, type: 'insert', patches: [] })
      continue
    }
    const fields = mergeTableDataChanges(
      target.row,
      operation.row,
      operation.patches.map(({ field }) => field),
      [],
    )
    if (!fields.length) continue
    forward.push({
      ...operation,
      position: { ...target.position },
      patches: fields.map(({ field, value, exists }) => ({
        field,
        value,
        exists,
      })),
    })
    backward.unshift({
      ...operation,
      ...target,
      patches: fields.map(({ field, oldValue, oldExists }) => ({
        field,
        value: cloneTableDataValue(oldValue),
        exists: oldExists,
      })),
    })
  }
  return { forward, backward, ...transaction.checkpoint() }
}

/** An out-of-band write to a replayed field must not be overwritten by undo. */
export function tableHistoryMatches(
  expected: TableDataMutation[],
  resolve: (key: TableRowKey) => TableHistoryTarget,
) {
  for (const operation of expected) {
    if (operation.type !== 'update') continue
    const row = resolve(operation.rowKey).row
    for (const patch of operation.patches) {
      const field = readTableDataField(row, patch.field)
      if (
        field.exists !== patch.exists ||
        !equalTableDataValue(field.value, patch.value)
      )
        return false
    }
  }
  return true
}
