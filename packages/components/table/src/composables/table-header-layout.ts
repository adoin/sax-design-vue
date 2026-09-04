import type { CSSProperties } from 'vue'
import type { TableRenderedColumnEntry, TableRenderedEntry } from '../table'
import type { HeaderAncestor } from './table-column-tree'

export interface TableHeaderEntry extends TableRenderedColumnEntry {
  group?: boolean
  rowSpan?: number
  colSpan?: number
}

/** Project only rendered leaves; never enumerate a generated column source. */
export function createTableHeaderLayout(
  entries: TableRenderedEntry[],
  depth: number,
  pathFor: (entry: TableRenderedColumnEntry) => HeaderAncestor[],
) {
  const rows: TableHeaderEntry[][] = Array.from({ length: depth }, () => [])
  const widths = entries.map((entry) =>
    entry.kind === 'spacer'
      ? `${entry.width}px`
      : String(entry.style.width ?? entry.style.minWidth ?? '120px'),
  )
  const flexible = entries.filter(
    (entry) => entry.kind === 'column' && !entry.style.width,
  ).length
  const totalBase = widths.length ? widths.join(' + ') : '0px'
  const tracks = entries.map((entry, index) =>
    entry.kind === 'column' && !entry.style.width
      ? `minmax(${widths[index]}, calc(${widths[index]} + (100% - (${totalBase})) / ${flexible}))`
      : widths[index],
  )
  const active: Array<{ key: string; cell: TableHeaderEntry } | undefined> = []
  entries.forEach((entry, index) => {
    if (entry.kind === 'spacer') {
      active.length = 0
      return
    }
    const path = pathFor(entry).slice(0, depth - 1)
    const leafStyle: CSSProperties = {
      ...entry.style,
      width: undefined,
      minWidth: 0,
      gridColumn: `${index + 1}`,
      gridRow: `${path.length + 1} / span ${depth - path.length}`,
    }
    rows[path.length].push({
      ...entry,
      rowSpan: depth - path.length,
      style: leafStyle,
    })
    path.forEach((ancestor, level) => {
      // A group can split at fixed partitions, virtual gaps, or reordered leaves.
      const key = JSON.stringify([
        entry.fixed ?? 'center',
        ...path.slice(0, level + 1).map((part) => part.key),
      ])
      const previous = active[level]
      if (previous?.key === key) {
        const cell = previous.cell
        cell.colSpan = (cell.colSpan ?? 1) + 1
        cell.style.gridColumn = `${String(cell.style.gridColumn).split(' / ')[0]} / span ${cell.colSpan}`
        cell.fixedBoundary ||= entry.fixedBoundary
        if (entry.fixed === 'right') cell.style.right = entry.style.right
      } else {
        const cell: TableHeaderEntry = {
          ...entry,
          key: `group:${level}:${index}:${ancestor.key}`,
          column: ancestor.column,
          group: true,
          colSpan: 1,
          style: {
            ...leafStyle,
            gridColumn: `${index + 1} / span 1`,
            gridRow: `${level + 1}`,
          },
        }
        rows[level].push(cell)
        active[level] = { key, cell }
      }
    })
    active.length = path.length
  })
  return { rows, tracks: tracks.join(' ') }
}
