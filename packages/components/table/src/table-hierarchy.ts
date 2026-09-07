import type { CSSProperties } from 'vue'

export type TableHierarchyTarget = 'first' | 'tree'

export interface TableHierarchyState {
  depth: number
  ancestorHasNext: readonly boolean[]
  isLastChild: boolean
  continues: boolean
  indent: number
  origin: number
  target: TableHierarchyTarget
}

export interface TableHierarchyGuide {
  depth: number
  fromMiddle?: boolean
  toMiddle?: boolean
  branch?: boolean
}

export const createTableHierarchyGuides = (
  state: TableHierarchyState,
): TableHierarchyGuide[] => {
  const guides: TableHierarchyGuide[] = []

  for (let depth = 0; depth < state.depth - 1; depth++) {
    if (state.ancestorHasNext[depth + 1]) guides.push({ depth })
  }

  if (state.depth > 0) {
    guides.push({
      depth: state.depth - 1,
      toMiddle: state.isLastChild,
      branch: true,
    })
  }

  if (state.continues) guides.push({ depth: state.depth, fromMiddle: true })

  return guides
}

export const tableHierarchyStyle = (
  state: TableHierarchyState,
): CSSProperties => {
  const contentStart =
    state.target === 'tree'
      ? 14 + state.depth * state.indent
      : state.origin + state.depth * state.indent + 10

  return {
    '--s-table-hierarchy-content-start': `${contentStart}px`,
    '--s-table-hierarchy-continuation-offset': `${state.target === 'tree' ? 13 : 10}px`,
  }
}
