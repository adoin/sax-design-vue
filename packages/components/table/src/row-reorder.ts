import type { TableDataIndex, TableDataNode } from './change-data'
import type { TableRowKey } from './table'
import type {
  TableRowDropInsidePosition,
  TableRowDropPosition,
} from './table-row-drag'

const nodeDepth = <Row extends object>(node: TableDataNode<Row>) => {
  let depth = 0
  for (let parent = node.parent; parent; parent = parent.parent) depth++
  return depth
}

const subtreeDepth = <Row extends object>(
  source: TableDataIndex<Row>,
  row: Row,
) => {
  const visit = (current: Row): number => {
    const node = source.rows.get(current)!
    return node.children.length ? 1 + Math.max(...node.children.map(visit)) : 0
  }
  return visit(row)
}

/** Resolves a source-tree destination without allocating the proposed data. */
export function resolveTableRowDrop<Row extends object>(
  source: TableDataIndex<Row>,
  fromKey: TableRowKey,
  targetKey: TableRowKey,
  position: TableRowDropPosition,
  insidePosition: TableRowDropInsidePosition = 'last',
) {
  const from = source.nodes.get(fromKey)
  const target = source.nodes.get(targetKey)
  if (!from || !target) throw new Error('Row drag endpoints were not found')
  if (!['before', 'inside', 'after'].includes(position))
    throw new Error('Invalid drop position')
  if (!['first', 'last'].includes(insidePosition))
    throw new Error('Invalid inside drop position')
  const parent = position === 'inside' ? target : target.parent
  for (let node = parent; node; node = node.parent)
    if (node === from)
      throw new Error('A row cannot move into its own descendant')
  const siblings = position === 'inside' ? target.children : target.siblings
  const insertion =
    position === 'inside'
      ? insidePosition === 'first'
        ? 0
        : siblings.length
      : target.index + (position === 'after' ? 1 : 0)
  const sameParent = from.siblings === siblings
  const newIndex =
    sameParent && from.index < insertion ? insertion - 1 : insertion
  const oldParentKey = from.parent?.key
  const newParentKey = parent?.key
  return {
    from,
    target,
    siblings,
    oldIndex: from.index,
    newIndex,
    oldParentKey,
    newParentKey,
    parentKey: oldParentKey,
    oldDepth: nodeDepth(from),
    newDepth: parent ? nodeDepth(parent) + 1 : 0,
    subtreeDepth: subtreeDepth(source, from.row),
    reparented: oldParentKey !== newParentKey,
  }
}

/** Copies only the affected sibling list and its ancestors, including loaded lazy children. */
export function planTableRowReorder<Row extends object>(
  source: TableDataIndex<Row>,
  fromKey: TableRowKey,
  targetKey: TableRowKey,
  position: TableRowDropPosition,
  insidePosition: TableRowDropInsidePosition = 'last',
) {
  const resolved = resolveTableRowDrop(
    source,
    fromKey,
    targetKey,
    position,
    insidePosition,
  )
  const { from, target, siblings, ...result } = resolved
  if (
    from === target ||
    (from.siblings === siblings && result.newIndex === result.oldIndex)
  )
    return { ...result, data: source.data }
  const updates = new Map<Row[], Row[]>()
  const sourceSiblings = [...from.siblings]
  sourceSiblings.splice(from.index, 1)
  updates.set(from.siblings, sourceSiblings)
  const destination = [...(updates.get(siblings) ?? siblings)]
  destination.splice(result.newIndex, 0, from.row)
  updates.set(siblings, destination)
  const parents = new Set<NonNullable<typeof from.parent>>()
  for (const start of [
    from.parent,
    resolved.newParentKey == null
      ? undefined
      : source.nodes.get(resolved.newParentKey),
  ])
    for (let node = start; node; node = node.parent) parents.add(node)
  for (const parent of [...parents].sort(
    (a, b) => nodeDepth(b) - nodeDepth(a),
  )) {
    const children = updates.get(parent.children)
    if (!children) continue
    const current = updates.get(parent.siblings) ?? parent.siblings
    const index = current.findIndex((row) => source.key(row) === parent.key)
    if (index < 0) throw new Error('Destination ancestor was not found')
    const siblings = [...current]
    siblings[index] = {
      ...siblings[index],
      [source.childrenField]: children,
    }
    updates.set(parent.siblings, siblings)
  }
  return { ...result, data: updates.get(source.data) ?? source.data }
}
