import type { TableCellRangeBounds } from '../table-cell-range'
import type { TableMergeRegion } from './table-merge-regions'

interface Options {
  count: () => number
  /** Map current data-row positions to merge-source positions; group bands are excluded. */
  sourceIndexAt: (index: number) => number
  /** Closest visible data position in the requested direction, or undefined at the view edge. */
  viewIndexNear: (index: number, backwards: boolean) => number | undefined
  query: (window: TableCellRangeBounds) => readonly TableMergeRegion[]
}

/** Project sparse source merge regions onto the current page and expanded groups. */
export function createTableRangeMergeQuery(options: Options) {
  return (window: Readonly<TableCellRangeBounds>): TableCellRangeBounds[] => {
    const count = options.count()
    if (
      !count ||
      window.rowStart < 0 ||
      window.rowEnd > count ||
      window.rowEnd <= window.rowStart
    )
      return []
    const first = options.sourceIndexAt(window.rowStart)
    const last = options.sourceIndexAt(window.rowEnd - 1)
    if (first < 0 || last < first) return []
    const regions = options.query({
      ...window,
      rowStart: first,
      rowEnd: last + 1,
    })
    const result: TableCellRangeBounds[] = []
    for (const region of regions) {
      const start = options.viewIndexNear(region.row, false)
      const end = options.viewIndexNear(region.rowEnd - 1, true)
      // A returned merge may lie entirely inside a collapsed group between the
      // endpoints. Nearest visible neighbors must still belong to that region.
      if (
        start == null ||
        end == null ||
        start > end ||
        start < 0 ||
        end >= count ||
        options.sourceIndexAt(start) >= region.rowEnd ||
        options.sourceIndexAt(end) < region.row
      )
        continue
      result.push({
        rowStart: start,
        rowEnd: end + 1,
        colStart: region.col,
        colEnd: region.colEnd,
      })
    }
    return result
  }
}
