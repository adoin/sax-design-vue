import { tableFieldValue } from '../data-utils'
import { editableField } from '../edit-utils'
import { TableChartLimitError, tableChartLimits } from '../chart-data'
import type {
  TableChartLimits,
  TableChartRecord,
  TableChartScope,
  TableChartValue,
} from '../chart-data'
import type { TableCellRangeBounds } from '../table-cell-range'
import type { TableClipboardCell } from '../clipboard-data'
import type { TableColumn, TableFlatRow } from '../table'
import type { TableGroupNode } from '../table-group'

export interface TableChartSeriesMapping {
  /** Visible column key/index, or an aggregate key for aggregate scope. */
  column: string | number
  name?: string
}
export interface TableChartRequest {
  scope: TableChartScope
  series: readonly TableChartSeriesMapping[]
  /** Defaults to the first column of the selected range/filtered view. */
  category?: string | number
  bounds?: TableCellRangeBounds
  aggregate?: 'groups' | 'summary'
  /** Omit to use root groups. Explicit keys can select nested groups. */
  groupKeys?: readonly string[]
  summaryLabel?: string
}
export interface TableChartColumn {
  column: TableColumn
  index: number
  position: number
}
interface Options {
  selection: () => TableCellRangeBounds | null | undefined
  count: () => { rows: number; columns: number }
  columnAt: (position: number) => TableChartColumn | undefined
  column: (key: string | number) => TableChartColumn | undefined
  rowAt: (index: number) => TableFlatRow | undefined
  cells: (
    bounds: TableCellRangeBounds,
  ) => (row: number, column: number) => TableClipboardCell | undefined
  filtered: () => {
    count: number
    rowAt: (index: number) => TableFlatRow | undefined
    isCurrent: () => boolean
  }
  aggregates: () => {
    groups: readonly TableGroupNode[]
    group: (key: string) => TableGroupNode | undefined
    summary: Readonly<Record<string, unknown>>
    isCurrent: () => boolean
  }
}

const hasField = (entry?: TableChartColumn): entry is TableChartColumn =>
  Boolean(entry && !entry.column.type && editableField(entry.column.field))
const boundsFor = (
  bounds: TableCellRangeBounds,
  count: { rows: number; columns: number },
) => {
  if (
    ![bounds.rowStart, bounds.rowEnd, bounds.colStart, bounds.colEnd].every(
      (n) => Number.isSafeInteger(n) && n >= 0,
    ) ||
    bounds.rowStart > bounds.rowEnd ||
    bounds.colStart > bounds.colEnd ||
    bounds.rowEnd > count.rows ||
    bounds.colEnd > count.columns
  )
    throw new RangeError('Chart bounds are outside the current view')
  return { ...bounds }
}

/** Reuse the table's current row/column models; never fetch rows or rebuild filtering/grouping here. */
export function createTableChartScope(options: Options) {
  return (
    request: TableChartRequest,
    limits: TableChartLimits,
    current: () => boolean,
  ) => {
    const budget = tableChartLimits(limits)
    if (!['selection', 'filtered', 'aggregate'].includes(request.scope))
      throw new TypeError('Invalid chart scope')
    if (!request.series.length)
      throw new TypeError('Chart requires at least one series')
    if (request.series.length > budget.maxSeries)
      throw new TableChartLimitError('series')
    if (request.series.length + 1 > budget.maxCells)
      throw new TableChartLimitError('cells')
    const requested = request.series.map((series) => ({ ...series }))
    const scope = request.scope
    const value = (read: () => unknown, valid = current): TableChartValue => ({
      read,
      isCurrent: valid,
    })
    if (scope === 'aggregate') {
      if (request.bounds || request.category != null)
        throw new TypeError(
          'Aggregate charts use group labels and aggregate keys',
        )
      const aggregate = request.aggregate ?? 'groups'
      if (!['groups', 'summary'].includes(aggregate))
        throw new TypeError('Invalid chart aggregate scope')
      if (request.groupKeys && aggregate === 'summary')
        throw new TypeError('Group keys do not apply to the overall summary')
      if ((request.groupKeys?.length ?? 0) > budget.maxPoints)
        throw new TableChartLimitError('points')
      const groupKeys = request.groupKeys && [...request.groupKeys]
      const source = options.aggregates()
      const valid = () => current() && source.isCurrent()
      const summaryLabel = request.summaryLabel ?? 'Total'
      const series = requested.map(({ column, name }) => {
        if (typeof column !== 'string' || !column)
          throw new TypeError('Aggregate series require string keys')
        return { key: column, name: name ?? column }
      })
      const records = function* (): Generator<() => TableChartRecord> {
        if (aggregate === 'summary') {
          yield () => ({
            point: { key: '@summary' },
            isCurrent: valid,
            category: () => value(() => summaryLabel, valid),
            value: (index) =>
              value(() => source.summary[series[index].key], valid),
          })
          return
        }
        const count = groupKeys?.length ?? source.groups.length
        for (let index = 0; index < count; index++)
          yield () => {
            const group = groupKeys
              ? source.group(groupKeys[index])
              : source.groups[index]
            if (!group) throw new RangeError('Unknown chart group key')
            const currentGroup = () =>
              valid() &&
              (groupKeys
                ? source.group(groupKeys[index])
                : source.groups[index]) === group
            return {
              point: { key: group.key, groupKey: group.key },
              isCurrent: currentGroup,
              category: () => value(() => group.label, currentGroup),
              value: (column) =>
                value(() => group.aggregates[series[column].key], currentGroup),
            }
          }
      }
      return { scope, series, records: records() }
    }
    if (request.aggregate || request.groupKeys || request.summaryLabel != null)
      throw new TypeError('Group options require aggregate scope')
    if (scope === 'filtered' && request.bounds)
      throw new TypeError('Explicit chart bounds require selection scope')
    const selected =
      request.bounds ??
      (scope === 'selection' ? options.selection() : undefined)
    if (scope === 'selection' && !selected)
      throw new RangeError('Select a chart range first')
    const bounds = selected && boundsFor(selected, options.count())
    const resolveColumn = (selector: string | number | undefined) => {
      const entry =
        selector == null
          ? options.columnAt(bounds?.colStart ?? 0)
          : options.column(selector)
      if (!hasField(entry))
        throw new RangeError('Chart columns must be visible data fields')
      if (
        bounds &&
        (entry.position < bounds.colStart || entry.position >= bounds.colEnd)
      )
        throw new RangeError('Chart column is outside the selected range')
      return { ...entry, column: { ...entry.column } }
    }
    const category = resolveColumn(request.category)
    const entries = requested.map((series) => resolveColumn(series.column))
    const series = entries.map(({ column, index }, position) => ({
      key: column.key ?? column.field ?? String(index),
      name: requested[position].name ?? column.title ?? column.field!,
    }))
    if (scope === 'selection') {
      const range = bounds!
      const queryBounds = { ...range }
      queryBounds.rowEnd = Math.min(
        range.rowEnd,
        range.rowStart +
          Math.min(
            budget.maxPoints,
            Math.floor(budget.maxCells / (series.length + 1)),
          ),
      )
      queryBounds.colStart = category.position
      queryBounds.colEnd = category.position + 1
      for (const entry of entries) {
        queryBounds.colStart = Math.min(queryBounds.colStart, entry.position)
        queryBounds.colEnd = Math.max(queryBounds.colEnd, entry.position + 1)
      }
      const cellAt =
        range.rowStart === range.rowEnd || range.colStart === range.colEnd
          ? undefined
          : options.cells(queryBounds)
      const records = function* (): Generator<() => TableChartRecord> {
        for (let index = range.rowStart; index < range.rowEnd; index++)
          yield () => {
            const flat = options.rowAt(index)
            if (!flat) throw new RangeError('Chart row is no longer available')
            const valid = () =>
              current() && options.rowAt(index)?.key === flat.key
            const cell = (
              entry: TableChartColumn,
              label = false,
            ): TableChartValue => {
              const found = cellAt?.(index, entry.position)
              if (!found)
                throw new RangeError('Chart cell is no longer available')
              const span = found.span
              if (
                span &&
                (span.rowStart < range.rowStart ||
                  span.rowEnd > range.rowEnd ||
                  span.colStart < range.colStart ||
                  span.colEnd > range.colEnd)
              )
                throw new RangeError(
                  'Chart range must contain complete merged cells',
                )
              if (
                !label &&
                span &&
                (span.rowStart !== index || span.colStart !== entry.position)
              )
                return value(() => null, valid)
              return value(
                () =>
                  tableFieldValue(
                    found.context.row,
                    found.context.column.field,
                  ),
                valid,
              )
            }
            return {
              point: { key: flat.key, rowIndex: flat.index },
              isCurrent: valid,
              category: () => cell(category, true),
              value: (position) => cell(entries[position]),
            }
          }
      }
      return { scope, series, records: records() }
    }
    const filtered = options.filtered()
    const records = function* (): Generator<() => TableChartRecord> {
      for (let index = 0; index < filtered.count; index++)
        yield () => {
          const flat = filtered.rowAt(index)
          if (!flat) throw new RangeError('Chart row is no longer available')
          const valid = () =>
            current() &&
            filtered.isCurrent() &&
            filtered.rowAt(index)?.key === flat.key
          return {
            point: { key: flat.key, rowIndex: flat.index },
            isCurrent: valid,
            category: () =>
              value(
                () => tableFieldValue(flat.row, category.column.field),
                valid,
              ),
            value: (position) =>
              value(
                () => tableFieldValue(flat.row, entries[position].column.field),
                valid,
              ),
          }
        }
    }
    return { scope, series, records: records() }
  }
}
