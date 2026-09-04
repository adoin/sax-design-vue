import { cloneTableDataValue, equalTableDataValue } from './change-snapshot'
import { readTableDataField } from './change-utils'
import {
  TableCellWriteConflictError,
  createTableCellWritePlan,
} from './cell-write-plan'
import { editableField } from './edit-utils'
import {
  TableClipboardLimitError,
  checkTableClipboardArea,
  formatTableClipboardText,
  tableClipboardLimits,
} from './clipboard-text'
import { createTableClipboardWork } from './clipboard-work'
import type { TableCellWriteDraft } from './cell-write-plan'
import type { TableClipboardLimits } from './clipboard-text'
import type { TableClipboardWork } from './clipboard-work'
import type { TableCellRangeBounds } from './table-cell-range'
import type { TableEditContext } from './table-edit'
import type { TableRow } from './table'

export interface TableClipboardCell {
  context: TableEditContext
  /** Complete visible span of a merged cell; absent for ordinary cells. */
  span?: TableCellRangeBounds
}
interface RegionOptions extends TableClipboardWork, TableClipboardLimits {
  bounds: TableCellRangeBounds
  /** Resolve current logical coordinates, including offscreen and fixed cells. */
  cellAt: (row: number, column: number) => TableClipboardCell | undefined
}

export class TableClipboardShapeError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TableClipboardShapeError'
  }
}

const checkBounds = (bounds: TableCellRangeBounds, maxCells: number) => {
  if (
    ![bounds.rowStart, bounds.rowEnd, bounds.colStart, bounds.colEnd].every(
      (value) => Number.isSafeInteger(value) && value >= 0,
    )
  )
    throw new TypeError('Invalid clipboard coordinates')
  checkTableClipboardArea(
    bounds.rowEnd - bounds.rowStart,
    bounds.colEnd - bounds.colStart,
    maxCells,
  )
}
const resolve = (options: RegionOptions, row: number, column: number) => {
  const cell = options.cellAt(row, column)
  if (!cell)
    throw new TableClipboardShapeError('Clipboard cell no longer exists')
  const span = cell.span
  if (
    span &&
    (span.rowStart < options.bounds.rowStart ||
      span.rowEnd > options.bounds.rowEnd ||
      span.colStart < options.bounds.colStart ||
      span.colEnd > options.bounds.colEnd ||
      row < span.rowStart ||
      row >= span.rowEnd ||
      column < span.colStart ||
      column >= span.colEnd)
  )
    throw new TableClipboardShapeError(
      'Clipboard region must contain complete merged cells',
    )
  return cell.context
}
const identity = (context: TableEditContext) =>
  JSON.stringify([typeof context.rowKey, context.rowKey, context.columnKey])
const plainText = (value: unknown): string => {
  if (value == null) return ''
  if (value instanceof Date) return value.toISOString()
  if (['string', 'number', 'boolean', 'bigint'].includes(typeof value))
    return String(value)
  throw new TypeError('Provide a clipboard formatter for non-scalar values')
}

/** Read the logical region once; merged continuation slots stay empty in the matrix. */
export async function readTableClipboardRegion(
  options: RegionOptions & {
    format?: (value: unknown, context: TableEditContext) => string
  },
) {
  const limits = tableClipboardLimits(options)
  const bounds = { ...options.bounds }
  options = { ...options, bounds }
  checkBounds(bounds, limits.maxCells)
  const work = createTableClipboardWork(options)
  work.check()
  const seen = new Set<string>()
  const data: unknown[][] = []
  const text: string[][] = []
  const reads: Array<{
    row: TableRow
    field: string
    value: unknown
    exists: boolean
  }> = []
  let characters = 0
  for (let row = bounds.rowStart; row < bounds.rowEnd; row++) {
    const values: unknown[] = []
    const labels: string[] = []
    for (let column = bounds.colStart; column < bounds.colEnd; column++) {
      const waiting = work.checkpoint()
      if (waiting) await waiting
      const context = resolve(options, row, column)
      const key = identity(context)
      if (seen.has(key)) {
        values.push('')
        labels.push('')
        continue
      }
      seen.add(key)
      const field = context.column.field
      const before = field ? readTableDataField(context.row, field) : undefined
      const value = before ? before.value : context.value
      const label = (options.format ?? plainText)(value, context)
      if (typeof label !== 'string')
        throw new TypeError('Clipboard formatters must return text')
      characters += label.length
      if (characters > limits.maxCharacters)
        throw new TableClipboardLimitError('characters')
      const snapshot = cloneTableDataValue(value)
      // Keep guard snapshots separate from the returned caller-owned matrix.
      if (field && before)
        reads.push({
          row: context.row,
          field,
          exists: before.exists,
          value: cloneTableDataValue(snapshot),
        })
      values.push(snapshot)
      labels.push(label)
    }
    data.push(values)
    text.push(labels)
  }
  work.check()
  const isCurrent = () =>
    !options.signal?.aborted &&
    options.current?.() !== false &&
    reads.every((read) => {
      const actual = readTableDataField(read.row, read.field)
      return (
        actual.exists === read.exists &&
        equalTableDataValue(actual.value, read.value)
      )
    })
  if (!isCurrent())
    throw new DOMException('Table clipboard source changed', 'AbortError')
  return {
    bounds,
    data,
    text: formatTableClipboardText(text, limits),
    isCurrent,
  }
}

export type TableClipboardDraft = TableCellWriteDraft

/** Plan only: all read-only checks and conversions finish before validation or mutation. */
export async function planTableClipboardPaste(
  options: RegionOptions & {
    data: readonly (readonly unknown[])[]
    writable: (context: TableEditContext) => boolean
    parse?: (value: unknown, context: TableEditContext) => unknown
  },
) {
  const limits = tableClipboardLimits(options)
  const bounds = { ...options.bounds }
  options = { ...options, bounds }
  checkBounds(bounds, limits.maxCells)
  const work = createTableClipboardWork(options)
  work.check()
  const height = options.data.length
  checkTableClipboardArea(height, 1, limits.maxCells)
  let width = 0
  let characters = 0
  for (const row of options.data) {
    if (!Array.isArray(row))
      throw new TypeError('Clipboard rows must be arrays')
    width = Math.max(width, row.length)
    checkTableClipboardArea(height, Math.max(1, width), limits.maxCells)
    for (const value of row) {
      if (typeof value === 'string') characters += value.length
      if (characters > limits.maxCharacters)
        throw new TableClipboardLimitError('characters')
    }
  }
  checkTableClipboardArea(height, width, limits.maxCells)
  if (
    (bounds.rowEnd - bounds.rowStart) % height ||
    (bounds.colEnd - bounds.colStart) % width
  )
    throw new TableClipboardShapeError(
      'The target region must be a whole multiple of the copied rectangle',
    )
  // Capture supplied 2D values before yielding so caller edits cannot mix two inputs.
  const data = options.data.map((row) =>
    Array.from({ length: width }, (_, index) =>
      cloneTableDataValue(index < row.length ? row[index] : ''),
    ),
  )
  const plan = createTableCellWritePlan()
  const seen = new Map<string, unknown>()
  let skipped = 0
  for (let row = bounds.rowStart; row < bounds.rowEnd; row++) {
    for (let column = bounds.colStart; column < bounds.colEnd; column++) {
      const waiting = work.checkpoint()
      if (waiting) await waiting
      const context = resolve(options, row, column)
      const field = context.column.field
      const editor =
        typeof context.column.editor === 'object'
          ? context.column.editor
          : undefined
      if (
        !editableField(field) ||
        editor?.props?.disabled ||
        editor?.props?.readonly ||
        !options.writable(context)
      ) {
        skipped++
        continue
      }
      const value =
        data[(row - bounds.rowStart) % height][
          (column - bounds.colStart) % width
        ]
      const key = identity(context)
      if (seen.has(key)) {
        if (value !== '' && !equalTableDataValue(value, seen.get(key)))
          throw new TableClipboardShapeError(
            'Different clipboard values target the same merged cell',
          )
        continue
      }
      seen.set(key, value)
      const next = cloneTableDataValue(
        options.parse
          ? options.parse(cloneTableDataValue(value), context)
          : value,
      )
      try {
        plan.add(context, next)
      } catch (error) {
        if (error instanceof TableCellWriteConflictError)
          throw new TableClipboardShapeError(error.message)
        throw error
      }
    }
  }
  const drafts: TableClipboardDraft[] = []
  for (const draft of plan.drafts()) {
    const waiting = work.checkpoint()
    if (waiting) await waiting
    drafts.push(draft)
  }
  work.check()
  return { bounds, drafts, skipped }
}
