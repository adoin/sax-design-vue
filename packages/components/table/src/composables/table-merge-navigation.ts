import type { TableMergeIndex } from './table-merge-regions'
type MergeLookup = Pick<TableMergeIndex, 'at'>

export interface TableMergePosition {
  row: number
  col: number
}

export function tableMergeOwner(
  index: MergeLookup,
  row: number,
  col: number,
): TableMergePosition {
  const region = index.at(row, col)
  return region ? { row: region.row, col: region.col } : { row, col }
}

/** Arrow movement leaves the entire merged region in the requested direction. */
export function stepTableMergeArrow(
  index: MergeLookup,
  current: TableMergePosition,
  direction: 'left' | 'right' | 'up' | 'down',
  rowCount: number,
  columnCount: number,
): TableMergePosition | undefined {
  const region = index.at(current.row, current.col)
  let { row, col } = region ?? current
  if (direction === 'left') col--
  else if (direction === 'right') col += region?.colspan ?? 1
  else if (direction === 'up') row--
  else row += region?.rowspan ?? 1
  if (row < 0 || col < 0 || row >= rowCount || col >= columnCount) return
  return tableMergeOwner(index, row, col)
}

/** Row-major focus traversal skips covered rectangles without visiting each cell. */
export function stepTableMergeTab(
  index: MergeLookup,
  current: TableMergePosition,
  backwards: boolean,
  rowCount: number,
  columnCount: number,
): TableMergePosition | undefined {
  if (rowCount <= 0 || columnCount <= 0) return
  const origin = tableMergeOwner(index, current.row, current.col)
  const region = index.at(origin.row, origin.col)
  let row = origin.row
  let col = backwards ? origin.col - 1 : origin.col + (region?.colspan ?? 1)
  let completeScan = false
  let blockedBoundary = backwards ? -1 : rowCount
  while (row >= 0 && row < rowCount) {
    if (col < 0 || col >= columnCount) {
      row = backwards
        ? completeScan && blockedBoundary >= 0
          ? blockedBoundary
          : row - 1
        : completeScan
          ? blockedBoundary
          : row + 1
      col = backwards ? columnCount - 1 : 0
      completeScan = true
      blockedBoundary = backwards ? -1 : rowCount
      if (row < 0 || row >= rowCount) return
    }
    const owner = index.at(row, col)
    if (!owner) return { row, col }
    if (owner.row === row && (backwards || owner.col === col))
      return { row: owner.row, col: owner.col }
    if (backwards) {
      blockedBoundary = Math.max(blockedBoundary, owner.row)
      col = owner.col - 1
    } else {
      blockedBoundary = Math.min(blockedBoundary, owner.rowEnd)
      col = owner.colEnd
    }
  }
  return undefined
}
