import { cloneTableDataValue, equalTableDataValue } from './change-snapshot'
import { TableDataBatchConflictError } from './change-batch'
import { createTableWork } from './table-work'
import type { TableWork } from './table-work'

export type TableChartScope = 'selection' | 'filtered' | 'aggregate'
export type TableChartLimit = 'points' | 'series' | 'cells' | 'characters'
export interface TableChartLimits {
  maxPoints?: number
  maxSeries?: number
  maxCells?: number
  maxCharacters?: number
}
export interface TableChartPoint {
  /** A stable row or group key. Equal category labels remain distinct points. */
  key: string | number
  rowIndex?: number
  groupKey?: string
}
export interface TableChartSeriesInfo {
  key: string
  name: string
}
export interface TableChartSeriesData extends TableChartSeriesInfo {
  /** Missing or non-numeric values are gaps, never implicit zeroes. */
  values: readonly (number | null)[]
}
export interface TableChartData {
  scope: TableChartScope
  categories: readonly string[]
  points: readonly Readonly<TableChartPoint>[]
  series: readonly Readonly<TableChartSeriesData>[]
}
export interface TableChartConversionContext {
  scope: TableChartScope
  point: Readonly<TableChartPoint>
  series?: Readonly<TableChartSeriesInfo>
}
export interface TableChartConversions {
  categoryMethod?: (
    value: unknown,
    context: TableChartConversionContext,
  ) => string
  valueMethod?: (
    value: unknown,
    context: TableChartConversionContext,
  ) => number | null
}
export interface TableChartValue {
  read: () => unknown
  isCurrent: () => boolean
}
export interface TableChartRecord {
  point: TableChartPoint
  category: () => TableChartValue
  value: (series: number) => TableChartValue
  isCurrent: () => boolean
}
export interface TableChartScan {
  data: Readonly<TableChartData>
  complete: boolean
  visited: number
  characters: number
  limit?: TableChartLimit
}
export class TableChartLimitError extends Error {
  constructor(readonly limit: TableChartLimit) {
    super(`Table chart ${limit} limit exceeded`)
    this.name = 'TableChartLimitError'
  }
}

export const tableChartLimits = (options: TableChartLimits) => {
  const limits = {
    maxPoints: options.maxPoints ?? 1_000,
    maxSeries: options.maxSeries ?? 32,
    maxCells: options.maxCells ?? 10_000,
    maxCharacters: options.maxCharacters ?? 2_000_000,
  }
  if (Object.values(limits).some((n) => !Number.isSafeInteger(n) || n < 1))
    throw new TypeError('Chart limits must be positive safe integers')
  return limits
}
const categoryText = (value: unknown): string => {
  if (value == null) return ''
  if (['string', 'number', 'boolean', 'bigint'].includes(typeof value))
    return String(value)
  if (value instanceof Date && Number.isFinite(value.getTime()))
    return value.toISOString()
  return ''
}
const numericValue = (value: unknown) =>
  typeof value === 'number' && Number.isFinite(value) ? value : null
const copyPoint = (point: TableChartPoint): Readonly<TableChartPoint> => {
  if (
    !(
      typeof point.key === 'string' ||
      (typeof point.key === 'number' && Number.isFinite(point.key))
    ) ||
    (point.rowIndex != null &&
      (!Number.isSafeInteger(point.rowIndex) || point.rowIndex < 0)) ||
    (point.groupKey != null && typeof point.groupKey !== 'string')
  )
    throw new TypeError('Invalid chart point address')
  return Object.freeze({
    key: point.key,
    rowIndex: point.rowIndex,
    groupKey: point.groupKey,
  })
}

/** Build a bounded, immutable chart snapshot without importing a chart engine. */
export async function buildTableChartData(
  options: TableWork &
    TableChartLimits &
    TableChartConversions & {
      scope: TableChartScope
      series: readonly TableChartSeriesInfo[]
      records: Iterable<() => TableChartRecord>
    },
): Promise<TableChartScan> {
  const limits = tableChartLimits(options)
  if (!['selection', 'filtered', 'aggregate'].includes(options.scope))
    throw new TypeError('Invalid chart scope')
  if (!options.series.length)
    throw new TypeError('Chart requires at least one series')
  if (options.series.length > limits.maxSeries)
    throw new TableChartLimitError('series')
  if (options.series.length + 1 > limits.maxCells)
    throw new TableChartLimitError('cells')
  const scope = options.scope
  const categoryMethod = options.categoryMethod ?? categoryText
  const valueMethod = options.valueMethod ?? numericValue
  const work = createTableWork(options)
  work.check()
  let characters = 0
  const seen = new Set<string>()
  const series = options.series.map((info) => {
    if (
      typeof info.key !== 'string' ||
      !info.key ||
      typeof info.name !== 'string' ||
      seen.has(info.key)
    )
      throw new TypeError('Chart series require unique string keys and names')
    seen.add(info.key)
    characters += info.key.length + info.name.length
    if (characters > limits.maxCharacters)
      throw new TableChartLimitError('characters')
    return {
      info: Object.freeze({ key: info.key, name: info.name }),
      values: [] as (number | null)[],
    }
  })
  const categories: string[] = []
  const points: Readonly<TableChartPoint>[] = []
  const guards: Array<() => boolean> = []
  let visited = 0
  const read = (cell: TableChartValue) => {
    work.check()
    if (!cell.isCurrent()) throw new TableDataBatchConflictError()
    visited++
    const before = cloneTableDataValue(cell.read())
    guards.push(
      () => cell.isCurrent() && equalTableDataValue(before, cell.read()),
    )
    return cloneTableDataValue(before)
  }
  const finish = async (limit?: TableChartLimit): Promise<TableChartScan> => {
    work.check()
    for (const guard of guards) {
      const waiting = work.checkpoint()
      if (waiting) await waiting
      if (!guard()) throw new TableDataBatchConflictError()
    }
    work.check()
    return {
      data: Object.freeze({
        scope,
        categories: Object.freeze(categories),
        points: Object.freeze(points),
        series: Object.freeze(
          series.map(({ info, values }) =>
            Object.freeze({ ...info, values: Object.freeze(values) }),
          ),
        ),
      }),
      complete: !limit,
      visited,
      characters,
      limit,
    }
  }
  const pointsSeen = new Set<string>()
  for (const resolve of options.records) {
    const waiting = work.checkpoint()
    if (waiting) await waiting
    if (points.length >= limits.maxPoints) return finish('points')
    // Reserve the complete point before resolving any of its data.
    if (visited + series.length + 1 > limits.maxCells) return finish('cells')
    const record = resolve()
    if (!record.isCurrent()) throw new TableDataBatchConflictError()
    guards.push(() => record.isCurrent())
    const point = copyPoint(record.point)
    const addressCharacters =
      String(point.key).length + (point.groupKey?.length ?? 0)
    if (addressCharacters > limits.maxCharacters - characters)
      return finish('characters')
    const identity = JSON.stringify([
      typeof point.key,
      point.key,
      point.groupKey,
    ])
    if (pointsSeen.has(identity))
      throw new TypeError('Duplicate chart point key')
    const label = categoryMethod(read(record.category()), { scope, point })
    if (typeof label !== 'string')
      throw new TypeError('Chart categories must be synchronous strings')
    const nextCharacters = addressCharacters + label.length
    if (nextCharacters > limits.maxCharacters - characters)
      return finish('characters')
    const values: (number | null)[] = []
    for (const [index, element] of series.entries()) {
      const waiting = work.checkpoint()
      if (waiting) await waiting
      const value = valueMethod(read(record.value(index)), {
        scope,
        point,
        series: element.info,
      })
      if (
        value !== null &&
        (typeof value !== 'number' || !Number.isFinite(value))
      )
        throw new TypeError('Chart values must be finite numbers or null')
      values.push(value)
    }
    work.check()
    if (!record.isCurrent()) throw new TableDataBatchConflictError()
    pointsSeen.add(identity)
    characters += nextCharacters
    categories.push(label)
    points.push(point)
    for (let index = 0; index < series.length; index++)
      series[index].values.push(values[index])
  }
  return finish()
}
