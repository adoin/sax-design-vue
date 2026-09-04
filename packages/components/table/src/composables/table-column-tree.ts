import type { TableColumn, TableColumnFixed } from '../table'

export interface HeaderAncestor {
  key: string
  column: TableColumn
}

/** Keep group metadata separate from the leaf-only query and layout pipeline. */
export function flattenTableColumns(columns: TableColumn[]) {
  const leaves: TableColumn[] = []
  const originals: TableColumn[] = []
  const paths = new Map<string, HeaderAncestor[]>()
  let depth = 1
  const visit = (
    nodes: TableColumn[],
    ancestors: HeaderAncestor[],
    parentKey: string,
    inheritedFixed?: TableColumnFixed,
  ) => {
    nodes.forEach((column, index) => {
      const key = `${parentKey}/${index}`
      const fixed = column.fixed ?? inheritedFixed
      if (column.children) {
        visit(column.children, [...ancestors, { key, column }], key, fixed)
      } else {
        paths.set(column.key ?? column.field ?? `@${leaves.length}`, ancestors)
        originals.push(column)
        leaves.push(fixed === column.fixed ? column : { ...column, fixed })
        depth = Math.max(depth, ancestors.length + 1)
      }
    })
  }
  visit(columns, [], '')
  return { leaves, originals, paths, depth }
}
