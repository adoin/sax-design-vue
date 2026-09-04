import { projectTableMergeRegions } from './table-merge-regions'
import type { TableMergeFragment, TableMergeIndex } from './table-merge-regions'

export interface TableMergeRowBox {
  index: number
  top: number
  height: number
}
export interface TableMergeColumnBox {
  position: number
  left: number
  width: number
  fixed?: 'left' | 'right'
}
export interface TableMergeClip {
  left: number
  right: number
  top: number
  bottom: number
}
export interface TableMergeBox extends TableMergeFragment {
  left: number
  top: number
  width: number
  height: number
}

/** Details and gaps in the rendered window split a merge's vertical surface. */
function rowBands(rows: readonly TableMergeRowBox[]): TableMergeRowBox[][] {
  const bands: TableMergeRowBox[][] = []
  for (const row of [...rows].sort((a, b) => a.index - b.index)) {
    const band = bands[bands.length - 1]
    const previous = band?.[band.length - 1]
    if (
      previous &&
      row.index === previous.index + 1 &&
      Math.abs(row.top - previous.top - previous.height) < 1
    )
      band!.push(row)
    else bands.push([row])
  }
  return bands
}

/** Geometry comes only from mounted rows/columns; compressed track sizes never enter it. */
export function layoutTableMergeBoxes(
  index: TableMergeIndex,
  rows: readonly TableMergeRowBox[],
  columns: readonly TableMergeColumnBox[],
  clip: TableMergeClip,
): TableMergeBox[] {
  if (clip.right <= clip.left || clip.bottom <= clip.top) return []
  const boxes: TableMergeBox[] = []
  const primary = new Set<string>()
  const visibleColumns = columns.filter((column) => column.width > 0)
  const leftColumns = visibleColumns.filter((column) => column.fixed === 'left')
  const rightColumns = visibleColumns.filter(
    (column) => column.fixed === 'right',
  )
  const centerLeft = Math.max(
    clip.left,
    ...leftColumns.map((column) => column.left + column.width),
  )
  const centerRight = Math.min(
    clip.right,
    ...rightColumns.map((column) => column.left),
  )
  const panes = [
    { key: 'left', columns: leftColumns, left: clip.left, right: clip.right },
    {
      key: 'center',
      columns: visibleColumns.filter((column) => !column.fixed),
      left: centerLeft,
      right: centerRight,
    },
    { key: 'right', columns: rightColumns, left: clip.left, right: clip.right },
  ]
  for (const band of rowBands(rows.filter((row) => row.height > 0))) {
    for (const pane of panes) {
      const sorted = [...pane.columns].sort((a, b) => a.position - b.position)
      // Usually one run per pane. Splitting also handles nonadjacent rendered columns.
      const runs: TableMergeColumnBox[][] = []
      for (const column of sorted) {
        const run = runs[runs.length - 1]
        if (run?.[run.length - 1]?.position === column.position - 1)
          run.push(column)
        else runs.push([column])
      }
      for (const run of runs) {
        const fragments = projectTableMergeRegions(index, [
          {
            partition: `${pane.key}:${band[0].index}:${run[0].position}`,
            rowStart: band[0].index,
            rowEnd: band[band.length - 1].index + 1,
            colStart: run[0].position,
            colEnd: run[run.length - 1].position + 1,
          },
        ])
        for (const fragment of fragments) {
          const firstRow = band[fragment.rowStart - band[0].index]
          const lastRow = band[fragment.rowEnd - 1 - band[0].index]
          const firstColumn = run[fragment.colStart - run[0].position]
          const lastColumn = run[fragment.colEnd - 1 - run[0].position]
          const left = Math.max(firstColumn.left, pane.left)
          const right = Math.min(lastColumn.left + lastColumn.width, pane.right)
          const top = Math.max(firstRow.top, clip.top)
          const bottom = Math.min(lastRow.top + lastRow.height, clip.bottom)
          if (right <= left || bottom <= top) continue
          boxes.push({
            ...fragment,
            left,
            top,
            width: right - left,
            height: bottom - top,
            primary: !primary.has(fragment.region.key),
          })
          primary.add(fragment.region.key)
        }
      }
    }
  }
  return boxes
}
