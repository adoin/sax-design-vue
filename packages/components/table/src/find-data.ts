import { cloneTableDataValue, equalTableDataValue } from './change-snapshot'
import { readTableDataField } from './change-utils'
import { editableField } from './edit-utils'
import { createTableCellWritePlan } from './cell-write-plan'
import { parseTableCellText } from './cell-text-value'
import { TableDataBatchConflictError } from './change-batch'
import { createTableWork } from './table-work'
import type { TableWork } from './table-work'
import type { TableCellWriteDraft } from './cell-write-plan'
import type { TableEditContext } from './table-edit'

export interface TableFindQuery {
  text: string
  caseSensitive?: boolean
  wholeCell?: boolean
}
export interface TableFindLimits {
  maxCells?: number
  maxMatches?: number
  maxCharacters?: number
}
export interface TableFindCell {
  context: TableEditContext
  /** Includes scope/configuration identity; no remote data is fetched here. */
  isCurrent: () => boolean
  locate?: (current: () => boolean, focus: boolean) => Promise<boolean>
}
export interface TableFindMatch extends TableFindCell {
  text: string
  occurrences: number
  matchedCharacters: number
  before: { value: unknown; exists: boolean }
}
export interface TableFindScan {
  query: TableFindQuery
  matches: TableFindMatch[]
  visited: number
  characters: number
  complete: boolean
  limit?: 'cells' | 'matches' | 'characters'
}
export class TableFindLimitError extends Error {
  constructor(readonly limit: 'cells' | 'matches' | 'characters') {
    super(`Table find ${limit} limit exceeded`)
    this.name = 'TableFindLimitError'
  }
}

const limitsFor = (options: TableFindLimits) => {
  const limits = {
    maxCells: options.maxCells ?? 100_000,
    maxMatches: options.maxMatches ?? 1_000,
    maxCharacters: options.maxCharacters ?? 2_000_000,
  }
  if (
    Object.values(limits).some(
      (value) => !Number.isSafeInteger(value) || value < 1,
    )
  )
    throw new TypeError('Find limits must be positive safe integers')
  return limits
}
const expressionFor = (query: TableFindQuery) =>
  new RegExp(
    query.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    query.caseSensitive ? 'gu' : 'giu',
  )
const defaultText = (value: unknown): string | undefined => {
  if (value == null) return ''
  if (['string', 'number', 'boolean', 'bigint'].includes(typeof value))
    return String(value)
  if (value instanceof Date && Number.isFinite(value.getTime()))
    return value.toISOString()
}
const identity = (context: TableEditContext) =>
  JSON.stringify([typeof context.rowKey, context.rowKey, context.columnKey])

/** Scan a supplied scope lazily. Resolvers are never called beyond the work budget. */
export async function scanTableFind(
  options: TableWork &
    TableFindLimits & {
      query: TableFindQuery
      cells: Iterable<() => TableFindCell | undefined>
      format?: (value: unknown, context: TableEditContext) => string | undefined
    },
): Promise<TableFindScan> {
  const limits = limitsFor(options)
  const query = { ...options.query }
  if (typeof query.text !== 'string')
    throw new TypeError('Find text must be a string')
  const result: TableFindScan = {
    query,
    matches: [],
    visited: 0,
    characters: 0,
    complete: true,
  }
  const work = createTableWork(options)
  work.check()
  if (!query.text.length) return result
  if (query.text.length > limits.maxCharacters)
    return { ...result, complete: false, limit: 'characters' }
  const finish = (limit?: TableFindScan['limit']) => {
    work.check()
    if (result.matches.some((match) => !match.isCurrent()))
      throw new TableDataBatchConflictError()
    return { ...result, complete: !limit, limit }
  }
  const expression = expressionFor(query)
  const seen = new Set<string>()
  for (const resolve of options.cells) {
    const waiting = work.checkpoint()
    if (waiting) await waiting
    const limit =
      result.visited >= limits.maxCells
        ? 'cells'
        : result.matches.length >= limits.maxMatches
          ? 'matches'
          : undefined
    if (limit) return finish(limit)
    result.visited++
    const cell = resolve()
    if (
      !cell ||
      cell.context.column.type ||
      !editableField(cell.context.column.field)
    )
      continue
    if (!cell.isCurrent())
      throw new DOMException('Find scope changed', 'AbortError')
    const key = identity(cell.context)
    if (seen.has(key)) continue
    seen.add(key)
    const field = cell.context.column.field!
    const read = readTableDataField(cell.context.row, field)
    const before = { ...read, value: cloneTableDataValue(read.value) }
    const context = {
      ...cell.context,
      value: cloneTableDataValue(before.value),
      get expanded() {
        return cell.context.expanded
      },
      get loading() {
        return cell.context.loading
      },
    }
    const text = options.format
      ? options.format(cloneTableDataValue(before.value), context)
      : defaultText(before.value)
    if (text === undefined) continue
    if (typeof text !== 'string')
      throw new TypeError('Find formatter must return text or undefined')
    if (text.length > limits.maxCharacters - result.characters)
      return finish('characters')
    result.characters += text.length
    let occurrences = 0
    let matchedCharacters = 0
    expression.lastIndex = 0
    for (
      let match = expression.exec(text);
      match;
      match = expression.exec(text)
    ) {
      const waiting = work.checkpoint()
      if (waiting) await waiting
      if (
        query.wholeCell &&
        (match.index !== 0 || match[0].length !== text.length)
      )
        break
      occurrences++
      matchedCharacters += match[0].length
    }
    const isCurrent = () => {
      const actual = readTableDataField(context.row, field)
      return (
        cell.isCurrent() &&
        options.current?.() !== false &&
        actual.exists === before.exists &&
        equalTableDataValue(actual.value, before.value)
      )
    }
    if (!isCurrent()) throw new TableDataBatchConflictError()
    if (occurrences)
      result.matches.push({
        locate: cell.locate,
        context,
        before,
        text,
        occurrences,
        matchedCharacters,
        isCurrent,
      })
  }
  return finish()
}

/** Build one transaction for the chosen matches; never apply a partial "replace all". */
export async function planTableFindReplace(
  options: TableWork &
    TableFindLimits & {
      result: TableFindScan
      /** Omit to replace all matches, which requires a complete scan. */
      matches?: readonly TableFindMatch[]
      replacement: string
      writable: (context: TableEditContext) => boolean
      parse?: (text: string, context: TableEditContext) => unknown
    },
) {
  const limits = limitsFor(options)
  if (!options.matches && !options.result.complete)
    throw new TableFindLimitError(options.result.limit!)
  const selected = [...(options.matches ?? options.result.matches)]
  if (selected.length > limits.maxMatches)
    throw new TableFindLimitError('matches')
  if (selected.length > limits.maxCells) throw new TableFindLimitError('cells')
  const allowed = new Set(options.result.matches)
  if (selected.some((match) => !allowed.has(match)))
    throw new TypeError('Match does not belong to this search')
  const query = { ...options.result.query }
  const replacement = options.replacement
  if (typeof replacement !== 'string')
    throw new TypeError('Replacement must be a string')
  if (replacement.length > limits.maxCharacters)
    throw new TableFindLimitError('characters')
  const work = createTableWork(options)
  work.check()
  const plan = createTableCellWritePlan()
  const seen = new Set<TableFindMatch>()
  let skipped = 0
  let characters = 0
  let replaced = 0
  for (const match of selected) {
    const waiting = work.checkpoint()
    if (waiting) await waiting
    if (seen.has(match)) continue
    seen.add(match)
    if (!match.isCurrent()) throw new TableDataBatchConflictError()
    const context = match.context
    const editor =
      typeof context.column.editor === 'object'
        ? context.column.editor
        : undefined
    if (
      editor?.props?.disabled ||
      editor?.props?.readonly ||
      !options.writable(context)
    ) {
      skipped++
      continue
    }
    const length =
      match.text.length -
      match.matchedCharacters +
      match.occurrences * replacement.length
    if (
      !Number.isSafeInteger(length) ||
      length > limits.maxCharacters - characters
    )
      throw new TableFindLimitError('characters')
    characters += length
    const text = match.text.replace(expressionFor(query), () => replacement)
    const value = (options.parse ?? parseTableCellText)(text, context)
    if (value && typeof (value as PromiseLike<unknown>).then === 'function')
      throw new TypeError('Replacement conversion must be synchronous')
    if (!match.isCurrent()) throw new TableDataBatchConflictError()
    plan.add(context, value, match.before)
    replaced += match.occurrences
  }
  const drafts: TableCellWriteDraft[] = []
  for (const draft of plan.drafts()) {
    const waiting = work.checkpoint()
    if (waiting) await waiting
    drafts.push(draft)
  }
  work.check()
  if (selected.some((match) => !match.isCurrent()))
    throw new TableDataBatchConflictError()
  return { drafts, skipped, replaced }
}
