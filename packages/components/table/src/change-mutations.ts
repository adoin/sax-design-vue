import { createTableDataIndex, planTableData } from './change-data'
import { applyTableDataPatches } from './change-utils'
import type { TableDataIndex, TableDataNode } from './change-data'
import type { TableDataMutation } from './table-changes'
import type { TableRow } from './table'

/** Preserve loaded lazy descendants when a removed branch becomes a history entry. */
export function materializeTableBranch(
  tree: TableDataIndex,
  node: TableDataNode,
): TableRow {
  const children = node.children.map((row) =>
    materializeTableBranch(tree, tree.rows.get(row)!),
  )
  if (!children.length) return node.row
  return children.every((row, index) => row === node.children[index]) &&
    node.row[tree.childrenField] === node.children
    ? node.row
    : { ...node.row, [tree.childrenField]: children }
}

/** Build one immutable proposal for restore/undo/redo with parent-before-child insertion. */
export function planTableMutations(
  tree: TableDataIndex,
  operations: TableDataMutation[],
) {
  let working = tree
  const applied: TableDataMutation[] = []
  const removals = operations.filter((operation) => operation.type === 'remove')
  const removedKeys = new Set(removals.map(({ rowKey }) => rowKey))
  for (const operation of removals) {
    const node = working.nodes.get(operation.rowKey)
    if (!node) throw new Error('Removed row no longer exists')
    let parent = node.parent
    while (parent && !removedKeys.has(parent.key)) parent = parent.parent
    if (!parent)
      applied.push({
        ...operation,
        row: node.row,
        position: tree.position(node),
      })
  }
  const removed = planTableData(
    working,
    applied.map(({ rowKey }) => ({ type: 'remove', rowKey })),
  )
  if (removed !== working.data)
    working = createTableDataIndex({ ...tree, data: removed })
  const inserts = operations.filter((operation) => operation.type === 'insert')
  while (inserts.length) {
    const ready = inserts
      .filter(
        ({ position }) =>
          position.parentKey === undefined ||
          working.nodes.has(position.parentKey),
      )
      .sort((a, b) => a.position.index - b.position.index)
    if (!ready.length)
      throw new Error('Restore the removed parent before its child')
    const data = planTableData(
      working,
      ready.map(({ row, position }) => ({ type: 'insert', row, position })),
    )
    applied.push(...ready)
    for (const operation of ready) inserts.splice(inserts.indexOf(operation), 1)
    working = createTableDataIndex({ ...tree, data })
  }
  const updates = operations.filter((operation) => operation.type === 'update')
  const data = planTableData(
    working,
    updates.map((operation) => {
      const node = working.nodes.get(operation.rowKey)
      if (!node) throw new Error('Updated row no longer exists')
      applied.push({
        ...operation,
        row: applyTableDataPatches(node.row, operation.patches),
        position: working.position(node),
      })
      return {
        type: 'update',
        rowKey: operation.rowKey,
        patches: operation.patches,
      }
    }),
  )
  return { data, operations: applied }
}
