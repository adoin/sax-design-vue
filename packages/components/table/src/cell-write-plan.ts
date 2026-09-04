import { cloneTableDataValue, equalTableDataValue } from './change-snapshot'
import { projectTableDataPatches, readTableDataField } from './change-utils'
import { editableField } from './edit-utils'
import { TableDataBatchConflictError } from './change-batch'
import type { TableRowUpdate } from './change-batch'
import type { TableEditContext } from './table-edit'
import type { TableRow, TableRowKey } from './table'
import type { TableDataFieldPatch } from './table-changes'

/** Candidate rows shared by multi-cell writers before validation and owner approval. */
export interface TableCellWriteDraft {
  rowKey: TableRowKey
  row: TableRow
  draftRow: TableRow
  cells: Array<{ context: TableEditContext; value: unknown }>
  update: TableRowUpdate
}

export class TableCellWriteConflictError extends Error {
  constructor() {
    super('Different values target the same row field')
    this.name = 'TableCellWriteConflictError'
  }
}

export function createTableCellWritePlan() {
  const rows = new Map<TableRowKey, TableCellWriteDraft>()
  const fields = new Map<
    string,
    { value: unknown; before: TableDataFieldPatch }
  >()
  const add = (
    context: TableEditContext,
    value: unknown,
    expected = readTableDataField(context.row, context.column.field!),
  ) => {
    const field = context.column.field
    if (!editableField(field)) throw new TypeError('Invalid table field path')
    const next = cloneTableDataValue(value)
    const key = JSON.stringify([typeof context.rowKey, context.rowKey, field])
    const previous = fields.get(key)
    if (previous) {
      if (!equalTableDataValue(previous.value, next))
        throw new TableCellWriteConflictError()
      if (
        previous.before.exists !== expected.exists ||
        !equalTableDataValue(previous.before.value, expected.value)
      )
        throw new TableDataBatchConflictError()
      // Keep each column's rules, but submit only one patch per field.
      rows.get(context.rowKey)!.cells.push({ context, value: next })
      return
    }
    let draft = rows.get(context.rowKey)
    if (!draft) {
      draft = {
        rowKey: context.rowKey,
        row: context.row,
        draftRow: context.row,
        cells: [],
        update: { rowKey: context.rowKey, patches: [], expected: [] },
      }
      rows.set(context.rowKey, draft)
    }
    const before = {
      field,
      ...expected,
      value: cloneTableDataValue(expected.value),
    }
    fields.set(key, { value: next, before })
    draft.update.expected!.push(before)
    draft.update.patches.push({ field, value: next, exists: true })
    draft.cells.push({ context, value: next })
  }
  function* drafts() {
    for (const draft of rows.values()) {
      draft.draftRow = projectTableDataPatches(draft.row, draft.update.patches)
      yield draft
    }
  }
  return { add, drafts }
}
