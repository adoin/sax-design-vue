import { describe, expect, it, vi } from 'vitest'
import {
  TableFindLimitError,
  planTableFindReplace,
  scanTableFind,
} from '../src/find-data'
import { TableDataBatchConflictError } from '../src/change-batch'
import { TableCellWriteConflictError } from '../src/cell-write-plan'
import type { TableFindCell } from '../src/find-data'
import type { TableColumn, TableRow } from '../src/table'

const makeCell = (
  row: TableRow,
  column: TableColumn = { field: 'name', editor: true },
  index = 0,
): TableFindCell => ({
  context: {
    row,
    rowKey: row.id as number,
    rowIndex: row.id as number,
    column,
    columnKey: column.key ?? column.field!,
    columnIndex: index,
    value: row[column.field!],
    depth: 0,
    expanded: false,
    loading: false,
    toggleExpand: async () => {},
  },
  isCurrent: () => true,
})
const source = (...values: unknown[]) =>
  values.map((name, id) => {
    const cell = makeCell({ id, name })
    return () => cell
  })
const query = { text: 'alpha' }
const writable = () => true

describe('Table lazy find and replace data', () => {
  it('finds literal Unicode text, case and whole-cell matches without interpreting regular expressions', async () => {
    const cells = source('Alpha alpha', 'ALPHA', 'alpha\n', '中文😀a.b', 'axb')
    const all = await scanTableFind({ query, cells })
    expect(all.complete).toBe(true)
    expect(all.matches.map(({ occurrences }) => occurrences)).toEqual([2, 1, 1])
    expect(
      (
        await scanTableFind({ query: { ...query, wholeCell: true }, cells })
      ).matches.map((m) => m.text),
    ).toEqual(['ALPHA'])
    expect(
      (
        await scanTableFind({ query: { ...query, caseSensitive: true }, cells })
      ).matches.map((m) => m.text),
    ).toEqual(['Alpha alpha', 'alpha\n'])
    expect(
      (await scanTableFind({ query: { text: '😀a.b' }, cells })).matches.map(
        (m) => m.text,
      ),
    ).toEqual(['中文😀a.b'])
    for (const text of ['[x]', '$&', '\\', '(a)+', '^a$', '?', '*'])
      expect(
        (await scanTableFind({ query: { text }, cells: source(text) })).matches,
      ).toHaveLength(1)
  })

  it('does not read the scope for an empty query and validates budgets', async () => {
    const resolve = vi.fn()
    expect(
      await scanTableFind({ query: { text: '' }, cells: [resolve] }),
    ).toMatchObject({ complete: true, visited: 0, matches: [] })
    expect(resolve).not.toHaveBeenCalled()
    for (const value of [0, -1, 1.5, Infinity, Number.NaN])
      await expect(
        scanTableFind({ query, cells: [], maxCells: value }),
      ).rejects.toThrow('positive safe integers')
  })

  it('bounds a million-row scope before invoking another cell resolver', async () => {
    const resolve = vi.fn((id: number) => makeCell({ id, name: 'no match' }))
    function* cells() {
      for (let index = 0; index < 1_000_000; index++) yield () => resolve(index)
    }
    const scan = await scanTableFind({ query, cells: cells(), maxCells: 128 })
    expect(scan).toMatchObject({
      complete: false,
      limit: 'cells',
      visited: 128,
    })
    expect(resolve).toHaveBeenCalledTimes(128)
    expect(
      await scanTableFind({ query, cells: source('no'), maxCells: 1 }),
    ).toMatchObject({ complete: true })
  })

  it('counts skipped coordinates toward the scan budget and deduplicates merged owners', async () => {
    const cell = makeCell({ id: 0, name: 'alpha' })
    const scan = await scanTableFind({
      query,
      cells: [() => undefined, () => cell, () => cell],
    })
    expect(scan.visited).toBe(3)
    expect(scan.matches).toHaveLength(1)
    const over = await scanTableFind({
      query,
      cells: [() => undefined, () => cell],
      maxCells: 1,
    })
    expect(over).toMatchObject({ complete: false, matches: [] })
  })

  it('reports match/text limits explicitly and disallows partial replace-all', async () => {
    const result = await scanTableFind({
      query,
      cells: source('alpha', 'alpha'),
      maxMatches: 1,
    })
    expect(result).toMatchObject({ complete: false, limit: 'matches' })
    await expect(
      planTableFindReplace({ result, replacement: 'B', writable }),
    ).rejects.toBeInstanceOf(TableFindLimitError)
    const single = await planTableFindReplace({
      result,
      matches: [result.matches[0]],
      replacement: 'B',
      writable,
    })
    expect(single.drafts[0].draftRow.name).toBe('B')
    expect(
      await scanTableFind({ query, cells: source('alpha'), maxCharacters: 4 }),
    ).toMatchObject({ complete: false, limit: 'characters', visited: 0 })
    expect(
      await scanTableFind({
        query,
        cells: source('alpha', 'alpha'),
        maxCharacters: 9,
      }),
    ).toMatchObject({ complete: false, limit: 'characters', visited: 2 })
  })

  it('searches scalar values and opt-in formatted objects without changing data', async () => {
    const object = { label: 'alpha' }
    const cells = source(12, true, new Date('2026-09-04T00:00:00Z'), object)
    expect(
      (await scanTableFind({ query: { text: '12' }, cells })).matches,
    ).toHaveLength(1)
    expect(
      (await scanTableFind({ query: { text: '2026-09' }, cells })).matches,
    ).toHaveLength(1)
    expect((await scanTableFind({ query, cells })).matches).toHaveLength(0)
    const result = await scanTableFind({
      query,
      cells,
      format: (value) => {
        if (value && typeof value === 'object' && 'label' in value) {
          const text = String(value.label)
          value.label = 'changed formatter input'
          return text
        }
      },
    })
    expect(result.matches).toHaveLength(1)
    expect(object.label).toBe('alpha')
    expect(result.matches[0].before.value).toEqual(object)
  })

  it('plans literal replacement text and complete candidate rows with no source mutation', async () => {
    const row = { id: 1, name: 'Alpha alpha', other: 'alpha' }
    const cells = [
      () => makeCell(row),
      () => makeCell(row, { field: 'other', editor: true }, 1),
    ]
    const result = await scanTableFind({ query, cells })
    const plan = await planTableFindReplace({
      result,
      replacement: '$&',
      writable,
    })
    expect(plan.replaced).toBe(3)
    expect(plan.drafts).toHaveLength(1)
    expect(plan.drafts[0].draftRow.name).toBe('$& $&')
    expect(plan.drafts[0].draftRow.other).toBe('$&')
    expect(plan.drafts[0].update.patches).toHaveLength(2)
    expect(plan.drafts[0].update.expected).toMatchObject([
      { value: 'Alpha alpha' },
      { value: 'alpha' },
    ])
    expect(row).toEqual({ id: 1, name: 'Alpha alpha', other: 'alpha' })
  })

  it('preserves readonly positions and skips disabled editors even when the caller allows writes', async () => {
    const cells = [
      () => makeCell({ id: 0, name: 'alpha' }),
      () =>
        makeCell(
          { id: 1, name: 'alpha' },
          { field: 'name', editor: { props: { disabled: true } } },
        ),
      () =>
        makeCell(
          { id: 2, name: 'alpha' },
          { field: 'name', editor: { props: { readonly: true } } },
        ),
      () => makeCell({ id: 3, name: 'alpha' }),
    ]
    const result = await scanTableFind({ query, cells })
    const plan = await planTableFindReplace({
      result,
      replacement: 'B',
      writable: (c) => c.rowKey !== 0,
    })
    expect(plan.skipped).toBe(3)
    expect(plan.drafts.map((draft) => draft.rowKey)).toEqual([3])
  })

  it('converts built-in numbers and rejects invalid or async conversions before any update', async () => {
    const cell = makeCell(
      { id: 1, name: 12 },
      { field: 'name', editor: { type: 'number' } },
    )
    const result = await scanTableFind({
      query: { text: '1' },
      cells: [() => cell],
    })
    expect(
      (await planTableFindReplace({ result, replacement: '2', writable }))
        .drafts[0].draftRow.name,
    ).toBe(22)
    await expect(
      planTableFindReplace({ result, replacement: 'X', writable }),
    ).rejects.toThrow('not finite')
    await expect(
      planTableFindReplace({
        result,
        replacement: '2',
        writable,
        parse: async () => 22,
      }),
    ).rejects.toThrow('synchronous')
    expect(cell.context.row.name).toBe(12)
  })

  it('rejects replacement expansion before constructing oversized output', async () => {
    const result = await scanTableFind({
      query: { text: 'a' },
      cells: source('a'.repeat(1000)),
    })
    const parse = vi.fn()
    await expect(
      planTableFindReplace({
        result,
        replacement: 'b'.repeat(1000),
        writable,
        maxCharacters: 10_000,
        parse,
      }),
    ).rejects.toBeInstanceOf(TableFindLimitError)
    expect(parse).not.toHaveBeenCalled()
  })

  it('combines repeated fields, retains their column rules and rejects conflicting formatted writes', async () => {
    const row = { id: 0, name: 'alpha' }
    const cells = ['a', 'b'].map(
      (key) => () => makeCell(row, { key, field: 'name', editor: true }),
    )
    const result = await scanTableFind({ query, cells })
    const plan = await planTableFindReplace({
      result,
      replacement: 'B',
      writable,
    })
    expect(plan.drafts[0].update.patches).toHaveLength(1)
    expect(plan.drafts[0].cells).toHaveLength(2)
    await expect(
      planTableFindReplace({
        result,
        replacement: 'B',
        writable,
        parse: (_text, c) => c.columnKey,
      }),
    ).rejects.toBeInstanceOf(TableCellWriteConflictError)
    expect(row.name).toBe('alpha')
  })

  it('rejects stale results including changes during conversion or while scanning the next batch', async () => {
    const row = { id: 0, name: 'alpha' }
    const cell = makeCell(row)
    const result = await scanTableFind({ query, cells: [() => cell] })
    row.name = 'external'
    await expect(
      planTableFindReplace({ result, replacement: 'B', writable }),
    ).rejects.toBeInstanceOf(TableDataBatchConflictError)
    row.name = 'alpha'
    await expect(
      planTableFindReplace({
        result,
        replacement: 'B',
        writable,
        parse: (text) => {
          row.name = 'during parse'
          return text
        },
      }),
    ).rejects.toBeInstanceOf(TableDataBatchConflictError)
    row.name = 'alpha'
    await expect(
      scanTableFind({
        query,
        cells: [
          () => cell,
          ...Array.from({ length: 128 }, () => () => undefined),
        ],
        yieldControl: async () => {
          row.name = 'during scan'
        },
      }),
    ).rejects.toBeInstanceOf(TableDataBatchConflictError)
  })

  it('cancels a scan waiting on an unresponsive scheduler and stops further reads', async () => {
    const controller = new AbortController()
    const scheduler = vi.fn(() => new Promise<void>(() => {}))
    const resolve = vi.fn(() => makeCell({ id: 1, name: 'alpha' }))
    const scanning = scanTableFind({
      query,
      cells: Array.from({ length: 1000 }, () => resolve),
      signal: controller.signal,
      yieldControl: scheduler,
    })
    await vi.waitFor(() => expect(scheduler).toHaveBeenCalled())
    controller.abort()
    await expect(scanning).rejects.toMatchObject({ name: 'AbortError' })
    expect(resolve.mock.calls.length).toBeLessThan(128)
  })

  it('accepts a narrow generated scope at the last row without enumerating preceding cells', async () => {
    const resolve = vi.fn(() => makeCell({ id: 999_999, name: 'alpha' }))
    const result = await scanTableFind({ query, cells: [resolve] })
    const plan = await planTableFindReplace({
      result,
      replacement: 'B',
      writable,
    })
    expect(resolve).toHaveBeenCalledTimes(1)
    expect(plan.drafts[0].update.rowKey).toBe(999_999)
  })

  it('cancels replacement preparation without mutating any source row', async () => {
    const cells = source(...Array.from({ length: 200 }, () => 'alpha'))
    const result = await scanTableFind({ query, cells })
    const controller = new AbortController()
    const scheduler = vi.fn(() => new Promise<void>(() => {}))
    const parse = vi.fn((text: string) => text)
    const pending = planTableFindReplace({
      result,
      replacement: 'B',
      writable,
      signal: controller.signal,
      yieldControl: scheduler,
      parse,
    })
    await vi.waitFor(() => expect(scheduler).toHaveBeenCalled())
    controller.abort()
    await expect(pending).rejects.toMatchObject({ name: 'AbortError' })
    expect(parse.mock.calls.length).toBeLessThan(128)
    expect(
      cells.every((resolve) => resolve().context.row.name === 'alpha'),
    ).toBe(true)
  })
})
