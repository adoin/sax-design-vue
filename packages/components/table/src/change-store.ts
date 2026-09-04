import { cloneTableDataValue, equalTableDataValue } from './change-snapshot'
import { mergeTableDataChanges } from './change-utils'
import type { TableRow, TableRowKey } from './table'
import type { TableChangeCheckpoint } from './table-history'
import type {
  TableAcceptedDataOperation,
  TableChangeRecords,
  TableChangeTransaction,
  TableChangedRow,
  TableRevertOperation,
} from './table-changes'

interface Entry<Row extends TableRow> extends TableChangedRow<Row> {
  type: 'insert' | 'update' | 'remove'
}

/** Sparse journal of accepted data changes. Drafts never enter this store. */
export function createTableChangeStore<Row extends TableRow = TableRow>(
  onChange: (version: number) => void = () => {},
) {
  let entries = new Map<TableRowKey, Entry<Row>>()
  let version = 0
  let epoch = 0
  let disposed = false
  // Only pending transactions retain key revisions, including currently clean rows.
  const pendingKeys = new Map<
    TableRowKey,
    { revision: number; users: number }
  >()
  const changed = () => onChange(++version)
  const snapshot = ({
    rowKey,
    row,
    position,
    fields,
  }: Entry<Row>): TableChangedRow<Row> => ({
    rowKey,
    row,
    position: { ...position },
    fields: cloneTableDataValue(fields),
  })
  const getRecords = (): TableChangeRecords<Row> => {
    const result: TableChangeRecords<Row> = {
      version,
      inserted: [],
      updated: [],
      removed: [],
    }
    for (const entry of entries.values()) {
      const target =
        entry.type === 'insert'
          ? result.inserted
          : entry.type === 'update'
            ? result.updated
            : result.removed
      target.push(snapshot(entry))
    }
    return result
  }
  const getRecord = (key: TableRowKey) => {
    const entry = entries.get(key)
    return entry ? { ...snapshot(entry), type: entry.type } : undefined
  }
  const transaction = (
    expected: Map<TableRowKey, Entry<Row> | undefined>,
    next: Map<TableRowKey, Entry<Row> | undefined>,
  ): TableChangeTransaction => {
    const origin = epoch
    let settled = false
    const revisions = new Map<TableRowKey, number>()
    for (const key of expected.keys()) {
      const state = pendingKeys.get(key) ?? { revision: 0, users: 0 }
      state.users++
      pendingKeys.set(key, state)
      revisions.set(key, state.revision)
    }
    const release = () => {
      if (settled) return
      settled = true
      if (origin !== epoch) return
      for (const key of revisions.keys()) {
        const state = pendingKeys.get(key)
        if (state && --state.users === 0) pendingKeys.delete(key)
      }
    }
    return {
      cancel: release,
      checkpoint: () => {
        const capture = (states: Map<TableRowKey, Entry<Row> | undefined>) =>
          [...states].map(([rowKey, entry]) => ({
            rowKey,
            entry: entry ? { ...snapshot(entry), type: entry.type } : undefined,
          }))
        return { before: capture(expected), after: capture(next) }
      },
      commit: () => {
        if (settled) return false
        if (disposed || origin !== epoch) {
          release()
          return false
        }
        for (const [key, revision] of revisions) {
          if (pendingKeys.get(key)?.revision !== revision) {
            release()
            return false
          }
        }
        for (const key of revisions.keys()) pendingKeys.get(key)!.revision++
        release()
        const updates = [...next].filter(
          ([key, entry]) => entry !== entries.get(key),
        )
        if (!updates.length) return true
        for (const [key, entry] of updates) {
          if (entry) entries.set(key, entry)
          else entries.delete(key)
        }
        changed()
        return true
      },
    }
  }
  const prepare = (
    operations: TableAcceptedDataOperation<Row>[],
  ): TableChangeTransaction => {
    const expected = new Map<TableRowKey, Entry<Row> | undefined>()
    const next = new Map<TableRowKey, Entry<Row> | undefined>()
    for (const operation of operations) {
      const { rowKey, row, position, type } = operation
      if (
        (typeof rowKey !== 'string' && typeof rowKey !== 'number') ||
        (typeof rowKey === 'number' && !Number.isFinite(rowKey))
      )
        throw new TypeError(
          'A stable string or finite numeric row key is required',
        )
      if (!Number.isSafeInteger(position.index) || position.index < 0)
        throw new RangeError('Invalid source row position')
      if (!expected.has(rowKey)) expected.set(rowKey, entries.get(rowKey))
      const previous = next.has(rowKey) ? next.get(rowKey) : entries.get(rowKey)
      if (type === 'insert') {
        if (previous) throw new Error('Cannot insert a tracked row key twice')
        next.set(rowKey, {
          type,
          rowKey,
          row,
          position: { ...position },
          fields: [],
        })
      } else if (type === 'remove') {
        next.set(
          rowKey,
          previous?.type === 'insert'
            ? undefined
            : previous?.type === 'remove'
              ? previous
              : {
                  type,
                  rowKey,
                  row,
                  position: { ...position },
                  fields: cloneTableDataValue(previous?.fields ?? []),
                },
        )
      } else {
        if (previous?.type === 'remove')
          throw new Error('Cannot update a removed row')
        const fields = mergeTableDataChanges(
          operation.before,
          row,
          operation.fields,
          previous?.fields ?? [],
        )
        if (previous?.type === 'insert') {
          next.set(
            rowKey,
            fields.length ? { ...previous, row, fields: [] } : previous,
          )
        } else if (!fields.length) next.set(rowKey, undefined)
        else
          next.set(
            rowKey,
            previous &&
              previous.row === row &&
              equalTableDataValue(fields, previous.fields)
              ? previous
              : {
                  type,
                  rowKey,
                  row,
                  position: { ...(previous?.position ?? position) },
                  fields,
                },
          )
      }
    }
    return transaction(expected, next)
  }
  const prepareRevert = (keys?: TableRowKey[]) => {
    const selected = keys ? new Set(keys) : new Set(entries.keys())
    const expected = new Map<TableRowKey, Entry<Row> | undefined>()
    const next = new Map<TableRowKey, Entry<Row> | undefined>()
    const operations: TableRevertOperation<Row>[] = []
    for (const key of selected) {
      const entry = entries.get(key)
      if (!entry) continue
      expected.set(key, entry)
      next.set(key, undefined)
      operations.push({
        rowKey: key,
        row: entry.row,
        position: { ...entry.position },
        type:
          entry.type === 'insert'
            ? 'remove'
            : entry.type === 'remove'
              ? 'restore'
              : 'update',
        patches: entry.fields.map(({ field, oldValue, oldExists }) => ({
          field,
          value: cloneTableDataValue(oldValue),
          exists: oldExists,
        })),
      })
    }
    return { ...transaction(expected, next), operations }
  }
  const accept = (keys?: TableRowKey[], expectedVersion = version) => {
    if (disposed || expectedVersion !== version) return false
    // A save acknowledgement must never silently confirm newer local edits.
    epoch++
    pendingKeys.clear()
    const next = new Map(entries)
    for (const key of keys ?? next.keys()) next.delete(key)
    if (next.size !== entries.size) {
      entries = next
      changed()
    }
    return true
  }
  const prepareCheckpoint = (checkpoints: TableChangeCheckpoint[]) => {
    const expected = new Map<TableRowKey, Entry<Row> | undefined>()
    const next = new Map<TableRowKey, Entry<Row> | undefined>()
    for (const { rowKey, entry } of checkpoints) {
      expected.set(rowKey, entries.get(rowKey))
      next.set(
        rowKey,
        entry
          ? {
              ...entry,
              row: entry.row as Row,
              fields: cloneTableDataValue(entry.fields),
              position: { ...entry.position },
            }
          : undefined,
      )
    }
    return transaction(expected, next)
  }
  const reset = () => {
    if (disposed) return
    epoch++
    pendingKeys.clear()
    entries = new Map()
    changed()
  }
  const dispose = () => {
    disposed = true
    epoch++
    pendingKeys.clear()
    entries.clear()
  }
  return {
    prepare,
    prepareRevert,
    prepareCheckpoint,
    getRecords,
    getRecord,
    accept,
    reset,
    dispose,
  }
}
