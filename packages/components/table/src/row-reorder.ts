import type { TableDataIndex } from './change-data'
import type { TableRow, TableRowKey } from './table'
import type { TableRowDropPosition } from './table-row-drag'

/** Copies only the affected sibling list and its ancestors, including loaded lazy children. */
export function planTableRowReorder<Row extends TableRow>(
  source: TableDataIndex<Row>,
  fromKey: TableRowKey,
  targetKey: TableRowKey,
  position: TableRowDropPosition,
) {
  const from = source.nodes.get(fromKey)
  const target = source.nodes.get(targetKey)
  if (!from || !target || from.parent !== target.parent)
    throw new Error('Rows must belong to the same source parent')
  if (position !== 'before' && position !== 'after')
    throw new Error('Invalid drop position')
  const insertion = target.index + (position === 'after' ? 1 : 0)
  const newIndex = from.index < insertion ? insertion - 1 : insertion
  const result = { oldIndex: from.index, newIndex, parentKey: from.parent?.key }
  if (from === target || newIndex === from.index)
    return { ...result, data: source.data }
  let items = [...from.siblings]
  items.splice(from.index, 1)
  items.splice(newIndex, 0, from.row)
  for (let parent = from.parent; parent; parent = parent.parent) {
    const row = { ...parent.row, [source.childrenField]: items }
    items = [...parent.siblings]
    items[parent.index] = row
  }
  return { ...result, data: items }
}
