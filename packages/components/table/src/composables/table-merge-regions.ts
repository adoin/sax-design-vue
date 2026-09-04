import type {
  TableMergeQuery,
  TableMergeRange,
  TableMergeSource,
  TableMergeWindow,
} from '../table-merge'

export interface TableMergeRegion extends Readonly<TableMergeRange> {
  readonly key: string
  readonly rowEnd: number
  readonly colEnd: number
}
export interface TableMergeIssue {
  index: number
  reason: 'invalid-range' | 'overlap' | 'resolver-error'
  error?: unknown
}
interface IndexedRegion {
  region: TableMergeRegion
  order: number
}
interface RegionNode {
  entry: IndexedRegion
  left?: RegionNode
  right?: RegionNode
  rowStart: number
  rowEnd: number
  colStart: number
  colEnd: number
}

const integer = (value: number) => Number.isSafeInteger(value) && value >= 0
const intersects = (region: TableMergeWindow, query: TableMergeWindow) =>
  region.rowStart < query.rowEnd &&
  region.rowEnd > query.rowStart &&
  region.colStart < query.colEnd &&
  region.colEnd > query.colStart
const bounds = (region: TableMergeRegion): TableMergeWindow => ({
  rowStart: region.row,
  rowEnd: region.rowEnd,
  colStart: region.col,
  colEnd: region.colEnd,
})

/** Augmented balanced tree, one record per region, never one per covered cell. */
const buildTree = (
  sorted: IndexedRegion[],
  start = 0,
  end = sorted.length,
): RegionNode | undefined => {
  if (start >= end) return
  const middle = start + Math.floor((end - start) / 2)
  const entry = sorted[middle]
  const left = buildTree(sorted, start, middle)
  const right = buildTree(sorted, middle + 1, end)
  const own = bounds(entry.region)
  return {
    entry,
    left,
    right,
    rowStart: Math.min(
      own.rowStart,
      left?.rowStart ?? Infinity,
      right?.rowStart ?? Infinity,
    ),
    rowEnd: Math.max(own.rowEnd, left?.rowEnd ?? 0, right?.rowEnd ?? 0),
    colStart: Math.min(
      own.colStart,
      left?.colStart ?? Infinity,
      right?.colStart ?? Infinity,
    ),
    colEnd: Math.max(own.colEnd, left?.colEnd ?? 0, right?.colEnd ?? 0),
  }
}

/** Returning true stops traversal, so conflict/point queries need no result array. */
const visit = (
  node: RegionNode | undefined,
  query: TableMergeWindow,
  found: (entry: IndexedRegion) => boolean,
): boolean => {
  if (!node || !intersects(node, query)) return false
  if (visit(node.left, query, found)) return true
  if (intersects(bounds(node.entry.region), query) && found(node.entry))
    return true
  return visit(node.right, query, found)
}

export interface TableMergeIndex {
  readonly regions: readonly TableMergeRegion[]
  readonly issues: readonly TableMergeIssue[]
  query: (window: TableMergeWindow) => readonly TableMergeRegion[]
  at: (row: number, col: number) => TableMergeRegion | undefined
}

const validWindow = (window: TableMergeWindow) =>
  [window.rowStart, window.rowEnd, window.colStart, window.colEnd].every(
    integer,
  ) &&
  window.rowEnd > window.rowStart &&
  window.colEnd > window.colStart

export function createTableMergeIndex(
  source: readonly TableMergeRange[],
  rowCount: number,
  columnCount: number,
): TableMergeIndex {
  const issues: TableMergeIssue[] = []
  const candidates: IndexedRegion[] = []
  if (integer(rowCount) && integer(columnCount)) {
    source.forEach((range, index) => {
      if (
        !range ||
        ![range.row, range.col, range.rowspan, range.colspan].every(integer) ||
        !range.rowspan ||
        !range.colspan ||
        !Number.isSafeInteger(range.row + range.rowspan) ||
        !Number.isSafeInteger(range.col + range.colspan)
      ) {
        issues.push({ index, reason: 'invalid-range' })
        return
      }
      if (range.row >= rowCount || range.col >= columnCount) return
      const rowspan = Math.min(range.rowspan, rowCount - range.row)
      const colspan = Math.min(range.colspan, columnCount - range.col)
      if (rowspan === 1 && colspan === 1) return
      const region = Object.freeze({
        row: range.row,
        col: range.col,
        rowspan,
        colspan,
        rowEnd: range.row + rowspan,
        colEnd: range.col + colspan,
        key: `${range.row}:${range.col}:${rowspan}:${colspan}`,
      })
      candidates.push({ region, order: index })
    })
  }
  const sorted = [...candidates].sort(
    (a, b) =>
      a.region.row - b.region.row ||
      a.region.col - b.region.col ||
      a.order - b.order,
  )
  const candidateTree = buildTree(sorted)
  const accepted = new Set<number>()
  for (const entry of candidates) {
    const overlap = visit(candidateTree, bounds(entry.region), (other) =>
      accepted.has(other.order),
    )
    if (overlap) issues.push({ index: entry.order, reason: 'overlap' })
    else accepted.add(entry.order)
  }
  const tree = buildTree(sorted.filter((entry) => accepted.has(entry.order)))
  return {
    regions: Object.freeze(
      candidates
        .filter((entry) => accepted.has(entry.order))
        .map((entry) => entry.region),
    ),
    issues: Object.freeze(issues.sort((a, b) => a.index - b.index)),
    query(window) {
      if (!validWindow(window)) return []
      const matches: IndexedRegion[] = []
      visit(tree, window, (entry) => {
        matches.push(entry)
        return false
      })
      return matches
        .sort((a, b) => a.order - b.order)
        .map((entry) => entry.region)
    },
    at(row, col) {
      if (
        !integer(row) ||
        !integer(col) ||
        row >= rowCount ||
        col >= columnCount
      )
        return
      let result: TableMergeRegion | undefined
      visit(
        tree,
        { rowStart: row, rowEnd: row + 1, colStart: col, colEnd: col + 1 },
        (entry) => {
          result = entry.region
          return true
        },
      )
      return result
    },
  }
}

export function resolveTableMergeWindow(
  source: TableMergeSource | undefined,
  query: TableMergeQuery,
): TableMergeIndex {
  try {
    const ranges = typeof source === 'function' ? source(query) : source
    if (ranges != null && !Array.isArray(ranges))
      throw new TypeError('Merge resolver must return an array')
    return createTableMergeIndex(
      ranges ?? [],
      query.rowCount,
      query.columnCount,
    )
  } catch (error) {
    const empty = createTableMergeIndex([], query.rowCount, query.columnCount)
    return {
      ...empty,
      issues: [{ index: -1, reason: 'resolver-error', error }],
    }
  }
}

export interface TableMergeFragment extends TableMergeWindow {
  key: string
  region: TableMergeRegion
  partition: string
  /** One accessible owner among the rendered fragments of the same region. */
  primary: boolean
}

/** Windows describe the visible row band and each disjoint fixed/center band. */
export function projectTableMergeRegions(
  index: TableMergeIndex,
  windows: readonly (TableMergeWindow & { partition: string })[],
): TableMergeFragment[] {
  const fragments: TableMergeFragment[] = []
  const primary = new Set<string>()
  for (const window of windows) {
    for (const region of index.query(window)) {
      fragments.push({
        key: `${region.key}:${window.partition}`,
        region,
        partition: window.partition,
        rowStart: Math.max(region.row, window.rowStart),
        rowEnd: Math.min(region.rowEnd, window.rowEnd),
        colStart: Math.max(region.col, window.colStart),
        colEnd: Math.min(region.colEnd, window.colEnd),
        primary: !primary.has(region.key),
      })
      primary.add(region.key)
    }
  }
  return fragments
}
