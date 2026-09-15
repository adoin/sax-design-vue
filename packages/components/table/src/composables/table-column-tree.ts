import type { TableColumn, TableColumnFixed, TableColumnState } from '../table'

export interface HeaderAncestor {
  key: string
  column: TableColumn
}

export interface TableColumnTreeNode {
  key: string
  column: TableColumn
  parentKey: string | null
  depth: number
  siblingIndex: number
  group: boolean
  leafIndex: number
  childKeys: string[]
}

const groupKey = (column: TableColumn, path: string) =>
  column.key ?? `@group:${path}`

const leafKey = (column: TableColumn, index: number) =>
  column.key ?? column.field ?? `@${index}`

/** Apply user placement and group fixed-state overrides without mutating columns. */
export function applyTableColumnState(
  columns: TableColumn[],
  state: TableColumnState[],
) {
  interface MutableNode {
    key: string
    column: TableColumn
    parentKey: string | null
    children: string[]
    group: boolean
  }

  const nodes = new Map<string, MutableNode>()
  const roots: string[] = []
  let leafIndex = 0
  const visit = (
    items: TableColumn[],
    parentKey: string | null,
    path: string,
  ) => {
    const target = parentKey ? nodes.get(parentKey)!.children : roots
    items.forEach((column, index) => {
      const nextPath = `${path}/${index}`
      const key = column.children
        ? groupKey(column, nextPath)
        : leafKey(column, leafIndex++)
      const node: MutableNode = {
        key,
        column,
        parentKey,
        children: [],
        group: Boolean(column.children),
      }
      nodes.set(key, node)
      target.push(key)
      if (column.children) visit(column.children, key, nextPath)
    })
  }
  visit(columns, null, '')

  const states = new Map(state.map((entry) => [entry.key, entry]))
  for (const [key, entry] of states) {
    const node = nodes.get(key)
    if (!node?.column.children || entry.fixed === undefined) continue
    node.column = { ...node.column, fixed: entry.fixed }
  }

  const siblingsFor = (parentKey: string | null) =>
    parentKey ? nodes.get(parentKey)?.children : roots
  const isDescendant = (key: string, possibleParent: string | null) => {
    let cursor = possibleParent
    while (cursor) {
      if (cursor === key) return true
      cursor = nodes.get(cursor)?.parentKey ?? null
    }
    return false
  }
  for (const [key, entry] of states) {
    const placement = entry.placement
    const node = nodes.get(key)
    if (!node || !placement || isDescendant(key, placement.parentKey)) continue
    if (placement.parentKey && !nodes.get(placement.parentKey)?.column.children)
      continue
    const previous = siblingsFor(node.parentKey)
    const next = siblingsFor(placement.parentKey)
    if (!previous || !next) continue
    const previousIndex = previous.indexOf(key)
    if (previousIndex >= 0) previous.splice(previousIndex, 1)
    node.parentKey = placement.parentKey
    next.splice(Math.max(0, Math.min(next.length, placement.index)), 0, key)
  }

  const build = (key: string): TableColumn => {
    const node = nodes.get(key)!
    if (!node.group) return node.column
    return {
      ...node.column,
      key,
      children: node.children.map(build),
    }
  }
  return roots.map(build)
}

/** Keep group metadata separate from the leaf-only query and layout pipeline. */
export function flattenTableColumns(columns: TableColumn[]) {
  const leaves: TableColumn[] = []
  const originals: TableColumn[] = []
  const paths = new Map<string, HeaderAncestor[]>()
  const nodes: TableColumnTreeNode[] = []
  let depth = 1
  const visit = (
    items: TableColumn[],
    ancestors: HeaderAncestor[],
    parentKey: string | null,
    path: string,
    inheritedFixed?: TableColumnFixed,
    treeDepth = 0,
  ) => {
    items.forEach((column, siblingIndex) => {
      const nextPath = `${path}/${siblingIndex}`
      const fixed = column.fixed ?? inheritedFixed
      if (column.children) {
        const key = groupKey(column, nextPath)
        const descriptor: TableColumnTreeNode = {
          key,
          column,
          parentKey,
          depth: treeDepth,
          siblingIndex,
          group: true,
          leafIndex: -1,
          childKeys: [],
        }
        nodes.push(descriptor)
        const childStart = nodes.length
        visit(
          column.children,
          [...ancestors, { key, column }],
          key,
          nextPath,
          fixed,
          treeDepth + 1,
        )
        descriptor.childKeys = nodes
          .slice(childStart)
          .filter((node) => node.parentKey === key)
          .map((node) => node.key)
      } else {
        const index = leaves.length
        const key = leafKey(column, index)
        paths.set(key, ancestors)
        originals.push(column)
        leaves.push(fixed === column.fixed ? column : { ...column, fixed })
        nodes.push({
          key,
          column,
          parentKey,
          depth: treeDepth,
          siblingIndex,
          group: false,
          leafIndex: index,
          childKeys: [],
        })
        depth = Math.max(depth, ancestors.length + 1)
      }
    })
  }
  visit(columns, [], null, '')
  return { leaves, originals, paths, nodes, depth }
}
