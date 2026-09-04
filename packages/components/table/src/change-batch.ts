import { cloneTableDataValue, equalTableDataValue } from './change-snapshot'
import {
  applyTableDataPatches,
  projectTableDataPatches,
  readTableDataField,
} from './change-utils'
import { editableField } from './edit-utils'
import type { TableRow, TableRowKey } from './table'
import type {
  TableAcceptedDataOperation,
  TableDataFieldPatch,
  TableDataMutation,
  TableDataPosition,
} from './table-changes'

/** Internal transaction input shared by clipboard and other multi-cell writers. */
export interface TableRowUpdate {
  rowKey: TableRowKey
  patches: TableDataFieldPatch[]
  /** Fields read before asynchronous preparation/validation; reject stale writes. */
  expected?: TableDataFieldPatch[]
}

export class TableDataBatchConflictError extends Error {
  constructor() {
    super('Table fields changed while preparing the batch')
    this.name = 'TableDataBatchConflictError'
  }
}

interface BatchOptions {
  target: (
    key: TableRowKey,
  ) => { row: TableRow; position: TableDataPosition } | undefined
  generated: boolean
  assertKey: (before: TableRow, after: TableRow, index: number) => void
}

/** Prepare every row before offering a single proposal to its data owner. */
export function planTableRowUpdates(
  updates: readonly TableRowUpdate[],
  options: BatchOptions,
) {
  const operations: TableDataMutation[] = []
  const accepted: TableAcceptedDataOperation[] = []
  const seen = new Set<TableRowKey>()
  for (const update of updates) {
    if (seen.has(update.rowKey))
      throw new TypeError(
        'Combine patches for the same row before applying a batch',
      )
    seen.add(update.rowKey)
    const target = options.target(update.rowKey)
    if (!target) throw new Error('Target row was not found')
    for (const expected of update.expected ?? []) {
      if (!editableField(expected.field))
        throw new TypeError('Invalid table field path')
      const actual = readTableDataField(target.row, expected.field)
      if (
        actual.exists !== expected.exists ||
        !equalTableDataValue(actual.value, expected.value)
      )
        throw new TableDataBatchConflictError()
    }
    const patches = update.patches.map((patch) => {
      if (!editableField(patch.field))
        throw new TypeError('Invalid table field path')
      return { ...patch, value: cloneTableDataValue(patch.value) }
    })
    const row = options.generated
      ? projectTableDataPatches(target.row, patches)
      : applyTableDataPatches(target.row, patches)
    options.assertKey(target.row, row, target.position.index)
    const operation: TableDataMutation = {
      type: 'update',
      rowKey: update.rowKey,
      row,
      position: target.position,
      patches,
    }
    operations.push(operation)
    accepted.push({
      ...operation,
      row,
      type: 'update',
      before: target.row,
      fields: patches.map(({ field }) => field),
    })
  }
  return { operations, accepted }
}
