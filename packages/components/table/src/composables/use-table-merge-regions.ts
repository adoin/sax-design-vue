import { computed } from 'vue'
import {
  createTableMergeIndex,
  resolveTableMergeWindow,
} from './table-merge-regions'
import type { TableMergeIndex, TableMergeIssue } from './table-merge-regions'
import type { TableColumn, TableRow } from '../table'
import type {
  TableMergeConfig,
  TableMergeQuery,
  TableMergeWindow,
} from '../table-merge'

type Area = 'body' | 'footer'
interface AreaOptions {
  count: () => number
  rowAt: (index: number) => TableRow | undefined
  windows: () => readonly TableMergeWindow[]
}
interface MergeOptions {
  config: () => boolean | TableMergeConfig | undefined
  columnCount: () => number
  columnAt: (position: number) => TableColumn | undefined
  body: AreaOptions
  footer: AreaOptions
}

/** Separate reactive queries from spatial lookup; static ranges build only once per input. */
export function useTableMergeRegions(options: MergeOptions) {
  const config = computed(() => {
    const value = options.config()
    return typeof value === 'object' ? value : {}
  })
  const enabled = computed(
    () => Boolean(options.config()) && config.value.enabled !== false,
  )
  const queryFor = (area: Area, window: TableMergeWindow): TableMergeQuery => ({
    ...window,
    area,
    rowCount: options[area].count(),
    columnCount: options.columnCount(),
    rowAt: options[area].rowAt,
    columnAt: options.columnAt,
  })
  const areaIndex = (area: Area) =>
    computed<TableMergeIndex>(() => {
      const count = options[area].count()
      const columns = options.columnCount()
      if (!enabled.value) return createTableMergeIndex([], count, columns)
      const source = config.value[area]
      if (typeof source !== 'function')
        return createTableMergeIndex(source ?? [], count, columns)
      const regions = new Map<string, TableMergeIndex['regions'][number]>()
      const issues: TableMergeIssue[] = []
      for (const window of options[area].windows()) {
        const result = resolveTableMergeWindow(source, queryFor(area, window))
        issues.push(...result.issues)
        for (const region of result.query(window))
          regions.set(region.key, region)
      }
      const index = createTableMergeIndex([...regions.values()], count, columns)
      return { ...index, issues: [...issues, ...index.issues] }
    })
  const body = areaIndex('body')
  const footer = areaIndex('footer')
  const at = (area: Area, row: number, col: number) => {
    if (
      !enabled.value ||
      !Number.isSafeInteger(row) ||
      !Number.isSafeInteger(col)
    )
      return
    const index = area === 'body' ? body.value : footer.value
    const result = index.at(row, col)
    if (result || typeof config.value[area] !== 'function') return result
    const inWindow = options[area]
      .windows()
      .some(
        (window) =>
          row >= window.rowStart &&
          row < window.rowEnd &&
          col >= window.colStart &&
          col < window.colEnd,
      )
    if (
      inWindow ||
      row < 0 ||
      row >= options[area].count() ||
      col < 0 ||
      col >= options.columnCount()
    )
      return
    // Programmatic focus may target an unmounted cell. Ask for that point only.
    return resolveTableMergeWindow(
      config.value[area],
      queryFor(area, {
        rowStart: row,
        rowEnd: row + 1,
        colStart: col,
        colEnd: col + 1,
      }),
    ).at(row, col)
  }
  return { enabled, body, footer, at }
}
