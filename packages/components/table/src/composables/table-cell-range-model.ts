import type { TableCellRangeBounds } from '../table-cell-range'

export interface TableRangePoint {
  row: number
  col: number
}
export interface TableRangeLimits {
  rows: number
  columns: number
}
export type TableRangeMergeQuery = (
  bounds: Readonly<TableCellRangeBounds>,
) => readonly TableCellRangeBounds[]

const integer = (value: number) => Number.isSafeInteger(value) && value >= 0
const valid = (bounds: TableCellRangeBounds) =>
  bounds &&
  [bounds.rowStart, bounds.rowEnd, bounds.colStart, bounds.colEnd].every(
    integer,
  ) &&
  bounds.rowStart < bounds.rowEnd &&
  bounds.colStart < bounds.colEnd

export const tableRangeContains = (
  bounds: TableCellRangeBounds | null | undefined,
  row: number,
  col: number,
) =>
  Boolean(
    bounds &&
    integer(row) &&
    integer(col) &&
    row >= bounds.rowStart &&
    row < bounds.rowEnd &&
    col >= bounds.colStart &&
    col < bounds.colEnd,
  )

export const tableRangeIntersects = (
  a: TableCellRangeBounds,
  b: TableCellRangeBounds,
) =>
  a.rowStart < b.rowEnd &&
  a.rowEnd > b.rowStart &&
  a.colStart < b.colEnd &&
  a.colEnd > b.colStart

export function tableRangeBetween(
  anchor: TableRangePoint,
  focus: TableRangePoint,
  limits: TableRangeLimits,
): TableCellRangeBounds | undefined {
  if (
    !integer(limits.rows) ||
    !integer(limits.columns) ||
    ![anchor.row, anchor.col, focus.row, focus.col].every(integer) ||
    anchor.row >= limits.rows ||
    focus.row >= limits.rows ||
    anchor.col >= limits.columns ||
    focus.col >= limits.columns
  )
    return
  return {
    rowStart: Math.min(anchor.row, focus.row),
    rowEnd: Math.max(anchor.row, focus.row) + 1,
    colStart: Math.min(anchor.col, focus.col),
    colEnd: Math.max(anchor.col, focus.col) + 1,
  }
}

/** Disjoint newly covered strips; the already examined interior is never queried again. */
const addedStrips = (
  next: TableCellRangeBounds,
  before: TableCellRangeBounds,
) => {
  const result: TableCellRangeBounds[] = []
  if (next.rowStart < before.rowStart)
    result.push({ ...next, rowEnd: before.rowStart })
  if (next.rowEnd > before.rowEnd)
    result.push({ ...next, rowStart: before.rowEnd })
  if (next.colStart < before.colStart)
    result.push({ ...before, colStart: next.colStart, colEnd: before.colStart })
  if (next.colEnd > before.colEnd)
    result.push({ ...before, colStart: before.colEnd, colEnd: next.colEnd })
  return result
}

/** Incremental merge closure, proportional to intersecting regions rather than selected cells. */
export function createTableRangeExpansion(
  initial: TableCellRangeBounds,
  limits: TableRangeLimits,
  query: TableRangeMergeQuery,
) {
  if (
    !integer(limits.rows) ||
    !integer(limits.columns) ||
    !valid(initial) ||
    initial.rowEnd > limits.rows ||
    initial.colEnd > limits.columns
  )
    throw new RangeError('Range bounds must fit within the current data view')
  let bounds = { ...initial }
  let windows: TableCellRangeBounds[] = [{ ...initial }]
  let windowIndex = 0
  let activeWindow: TableCellRangeBounds | undefined
  let matches: readonly TableCellRangeBounds[] = []
  let matchIndex = 0
  let done = false
  const step = (budget = 128): boolean => {
    if (!Number.isSafeInteger(budget) || budget < 1)
      throw new RangeError('Range expansion budget must be a positive integer')
    while (!done && budget-- > 0) {
      if (matchIndex >= matches.length) {
        if (windowIndex >= windows.length) {
          done = true
          windows = []
          matches = []
          break
        }
        activeWindow = windows[windowIndex++]
        // Drop consumed windows between queries; memory follows unfinished work.
        if (windowIndex >= 128) {
          windows = windows.slice(windowIndex)
          windowIndex = 0
        }
        matches = query(Object.freeze({ ...activeWindow }))
        matchIndex = 0
        continue
      }
      const match = matches[matchIndex++]
      if (!valid(match)) throw new RangeError('Merged range bounds are invalid')
      if (!tableRangeIntersects(match, activeWindow!)) continue
      const next = {
        rowStart: Math.max(0, Math.min(bounds.rowStart, match.rowStart)),
        rowEnd: Math.min(limits.rows, Math.max(bounds.rowEnd, match.rowEnd)),
        colStart: Math.max(0, Math.min(bounds.colStart, match.colStart)),
        colEnd: Math.min(limits.columns, Math.max(bounds.colEnd, match.colEnd)),
      }
      windows.push(...addedStrips(next, bounds))
      bounds = next
    }
    return done
  }
  return {
    step,
    get bounds(): Readonly<TableCellRangeBounds> {
      return Object.freeze({ ...bounds })
    },
  }
}

const aborted = (signal?: AbortSignal) => {
  if (signal?.aborted)
    throw signal.reason ?? new Error('Range calculation cancelled')
}
const yieldTask = (signal?: AbortSignal, yieldControl?: () => Promise<void>) =>
  new Promise<void>((resolve, reject) => {
    let timer: ReturnType<typeof setTimeout> | undefined
    const cleanup = () => {
      if (timer !== undefined) clearTimeout(timer)
      signal?.removeEventListener('abort', abort)
    }
    const abort = () => {
      cleanup()
      reject(signal?.reason ?? new Error('Range calculation cancelled'))
    }
    if (signal?.aborted) return abort()
    signal?.addEventListener('abort', abort, { once: true })
    if (yieldControl) {
      Promise.resolve()
        .then(yieldControl)
        .then(
          () => {
            cleanup()
            resolve()
          },
          (error: unknown) => {
            cleanup()
            reject(error)
          },
        )
    } else
      timer = setTimeout(() => {
        cleanup()
        resolve()
      }, 0)
  })

export async function expandTableCellRange(
  initial: TableCellRangeBounds,
  limits: TableRangeLimits,
  query: TableRangeMergeQuery,
  options: {
    signal?: AbortSignal
    batchSize?: number
    yieldControl?: () => Promise<void>
  } = {},
): Promise<Readonly<TableCellRangeBounds>> {
  aborted(options.signal)
  const expansion = createTableRangeExpansion(initial, limits, query)
  while (!expansion.step(options.batchSize ?? 128)) {
    aborted(options.signal)
    await yieldTask(options.signal, options.yieldControl)
    aborted(options.signal)
  }
  aborted(options.signal)
  return expansion.bounds
}
