import { applyTableDataPatches } from './change-utils'
import type { TableRow, TableRowKey } from './table'
import type { TableDataFieldPatch, TableDataPosition } from './table-changes'

export interface TableDataNode<Row extends TableRow = TableRow> {
  key: TableRowKey
  row: Row
  parent?: TableDataNode<Row>
  siblings: Row[]
  index: number
  children: Row[]
}

interface TableDataIndexOptions<Row extends TableRow> {
  data: Row[]
  childrenField: string
  key: (row: Row) => TableRowKey
  children: (row: Row, key: TableRowKey) => Row[]
}

export type TableDataPlanOperation<Row extends TableRow = TableRow> =
  | { type: 'update'; rowKey: TableRowKey; patches: TableDataFieldPatch[] }
  | { type: 'remove'; rowKey: TableRowKey }
  | { type: 'insert'; row: Row; position: TableDataPosition }

export const validTableDataKey = (key: unknown): key is TableRowKey =>
  typeof key === 'string' || (typeof key === 'number' && Number.isFinite(key))

/** Index supplied and loaded data only; never call this for a generated source. */
export function createTableDataIndex<Row extends TableRow>(
  options: TableDataIndexOptions<Row>,
) {
  const nodes = new Map<TableRowKey, TableDataNode<Row>>()
  const rows = new WeakMap<Row, TableDataNode<Row>>()
  const visit = (items: Row[], parent?: TableDataNode<Row>) => {
    for (const [index, row] of items.entries()) {
      if (!row || typeof row !== 'object')
        throw new TypeError('Invalid table row')
      const key = options.key(row)
      if (!validTableDataKey(key))
        throw new TypeError('A stable row key is required')
      if (nodes.has(key) || rows.has(row))
        throw new Error('Duplicate or cyclic table row')
      const children = options.children(row, key)
      const node = { key, row, parent, siblings: items, index, children }
      nodes.set(key, node)
      rows.set(row, node)
      if (children.length) visit(children, node)
    }
  }
  visit(options.data)
  const position = (node: TableDataNode<Row>): TableDataPosition => ({
    index: node.index,
    parentKey: node.parent?.key,
    beforeKey: rows.get(node.siblings[node.index + 1])?.key,
    afterKey: rows.get(node.siblings[node.index - 1])?.key,
  })
  return { ...options, nodes, rows, position }
}

export type TableDataIndex<Row extends TableRow = TableRow> = ReturnType<
  typeof createTableDataIndex<Row>
>

/** Copy changed sibling arrays and ancestors; all other data remains shared. */
export function planTableData<Row extends TableRow>(
  source: TableDataIndex<Row>,
  operations: TableDataPlanOperation<Row>[],
): Row[] {
  if (!operations.length) return source.data
  const updates = new Map<TableRowKey, TableDataFieldPatch[]>()
  const removals = new Set<TableRowKey>()
  const insertions = new Map<
    TableRowKey | undefined,
    Array<{
      row: Row
      key: TableRowKey
      position: TableDataPosition
    }>
  >()
  const inserted = new Set<TableRowKey>()
  const affected = new Set<TableRowKey>()
  const touch = (node?: TableDataNode<Row>) => {
    for (let current = node; current; current = current.parent)
      affected.add(current.key)
  }
  for (const operation of operations) {
    if (operation.type === 'insert') {
      const { row, position } = operation
      if (!Number.isSafeInteger(position.index) || position.index < 0)
        throw new RangeError('Invalid source row position')
      const key = source.key(row)
      if (!validTableDataKey(key))
        throw new TypeError('A stable row key is required')
      const parent =
        position.parentKey === undefined
          ? undefined
          : source.nodes.get(position.parentKey)
      if (position.parentKey !== undefined && !parent)
        throw new Error('Insertion parent was not found')
      // Reject duplicate descendants as well as the inserted root.
      const subtree = createTableDataIndex({ ...source, data: [row] })
      for (const childKey of subtree.nodes.keys()) {
        if (source.nodes.has(childKey) || inserted.has(childKey))
          throw new Error('Duplicate inserted row key')
        inserted.add(childKey)
      }
      const items = insertions.get(position.parentKey) ?? []
      items.push({ row, key, position })
      insertions.set(position.parentKey, items)
      touch(parent)
    } else {
      const node = source.nodes.get(operation.rowKey)
      if (!node) throw new Error('Target row was not found')
      touch(node)
      if (operation.type === 'remove') removals.add(operation.rowKey)
      else {
        for (const patch of operation.patches)
          if (
            patch.field === source.childrenField ||
            patch.field.startsWith(`${source.childrenField}.`)
          )
            throw new Error(
              'Use insert/remove operations to change tree children',
            )
        updates.set(operation.rowKey, [
          ...(updates.get(operation.rowKey) ?? []),
          ...operation.patches,
        ])
      }
    }
  }
  for (const parentKey of insertions.keys()) {
    for (
      let node =
        parentKey === undefined ? undefined : source.nodes.get(parentKey);
      node;
      node = node.parent
    )
      if (removals.has(node.key))
        throw new Error('Cannot insert into a removed branch')
  }
  for (const key of updates.keys()) {
    for (let node = source.nodes.get(key); node; node = node.parent)
      if (removals.has(node.key))
        throw new Error('Cannot update a removed branch')
  }
  const transform = (items: Row[], parentKey?: TableRowKey): Row[] => {
    const result: Row[] = []
    const keys: TableRowKey[] = []
    for (const row of items) {
      const node = source.rows.get(row)!
      if (removals.has(node.key)) continue
      let next = row
      if (affected.has(node.key)) {
        const patches = updates.get(node.key)
        if (patches?.length) next = applyTableDataPatches(row, patches)
        if (source.key(next) !== node.key)
          throw new Error('A table mutation cannot change the stable row key')
        const children = transform(node.children, node.key)
        if (children !== node.children)
          next = { ...next, [source.childrenField]: children }
      }
      result.push(next)
      keys.push(node.key)
    }
    const additions = insertions.get(parentKey) ?? []
    // Equal index insertions retain request order rather than reversing it.
    const offsets = new Map<number, number>()
    const afterOffsets = new Map<TableRowKey, number>()
    for (const { row, key, position } of additions) {
      const before =
        position.beforeKey === undefined ? -1 : keys.indexOf(position.beforeKey)
      const after =
        position.afterKey === undefined ? -1 : keys.indexOf(position.afterKey)
      const offset = offsets.get(position.index) ?? 0
      const index =
        before >= 0
          ? before
          : after >= 0
            ? after + 1 + (afterOffsets.get(position.afterKey!) ?? 0)
            : Math.min(position.index + offset, result.length)
      result.splice(index, 0, row)
      keys.splice(index, 0, key)
      offsets.set(position.index, offset + 1)
      if (before < 0 && after >= 0)
        afterOffsets.set(
          position.afterKey!,
          (afterOffsets.get(position.afterKey!) ?? 0) + 1,
        )
    }
    return result.length === items.length &&
      result.every((row, index) => row === items[index])
      ? items
      : result
  }
  return transform(source.data)
}
