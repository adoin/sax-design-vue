import { describe, expect, it, vi } from 'vitest'
import {
  TableClipboardShapeError,
  planTableClipboardPaste,
  readTableClipboardRegion,
} from '../src/clipboard-data'
import { TableClipboardLimitError } from '../src/clipboard-text'
import type { TableClipboardCell } from '../src/clipboard-data'
import type { TableColumn, TableRow } from '../src/table'

const columns: TableColumn[] = [
  { key: 'name', field: 'name', editor: true },
  { key: 'count', field: 'count', editor: { type: 'number' } },
]
const bounds = { rowStart: 0, rowEnd: 2, colStart: 0, colEnd: 2 }
const makeCell = (
  row: TableRow,
  rowIndex: number,
  columnIndex: number,
  column = columns[columnIndex],
): TableClipboardCell => ({
  context: {
    row,
    rowKey: row.id as number,
    column,
    rowIndex,
    columnIndex,
    columnKey: column.key!,
    value: row[column.field!],
    depth: 0,
    expanded: false,
    loading: false,
    toggleExpand: async () => {},
  },
})
const fixture = () => {
  const rows: TableRow[] = [
    { id: 1, name: 'A', count: 2 },
    { id: 2, name: 'B', count: 3 },
  ]
  const cellAt = vi.fn((row: number, column: number) =>
    rows[row] && columns[column] ? makeCell(rows[row], row, column) : undefined,
  )
  return { rows, cellAt, bounds, writable: () => true }
}

describe('Table logical clipboard regions', () => {
  it('returns independent typed data and formatted text without changing source values', async () => {
    const options = fixture()
    const result = await readTableClipboardRegion(options)
    expect(result.data).toEqual([
      ['A', 2],
      ['B', 3],
    ])
    expect(result.text).toBe('A\t2\r\nB\t3')
    result.data[0][0] = 'caller edit'
    expect(options.rows[0].name).toBe('A')
    expect(result.isCurrent()).toBe(true)
    options.rows[0].name = 'external edit'
    expect(result.isCurrent()).toBe(false)
  })

  it('plans a whole final draft for cross-field validation and keeps readonly coordinates', async () => {
    const options = fixture()
    const parse = vi.fn(
      (value: unknown, { column }: TableClipboardCell['context']) =>
        column.field === 'count' ? Number(value) : value,
    )
    const result = await planTableClipboardPaste({
      ...options,
      data: [
        ['C', '4'],
        ['D', '5'],
      ],
      parse,
      writable: ({ rowKey, column }) => rowKey !== 2 || column.field !== 'name',
    })
    expect(result.skipped).toBe(1)
    expect(parse).toHaveBeenCalledTimes(3)
    expect(
      result.drafts.map(({ draftRow }) => [draftRow.name, draftRow.count]),
    ).toEqual([
      ['C', 4],
      ['B', 5],
    ])
    expect(result.drafts[0].update.expected).toEqual([
      { field: 'name', exists: true, value: 'A' },
      { field: 'count', exists: true, value: 2 },
    ])
    expect(options.rows.map(({ name, count }) => [name, count])).toEqual([
      ['A', 2],
      ['B', 3],
    ])
  })

  it('tiles a scalar or rectangle only over a complete multiple of its shape', async () => {
    const options = fixture()
    const scalar = await planTableClipboardPaste({ ...options, data: [['X']] })
    expect(
      scalar.drafts.flatMap(({ update }) =>
        update.patches.map(({ value }) => value),
      ),
    ).toEqual(['X', 'X', 'X', 'X'])
    await expect(
      planTableClipboardPaste({ ...options, data: [['A', 'B', 'C']] }),
    ).rejects.toThrow(TableClipboardShapeError)
    const oneRow = await planTableClipboardPaste({
      ...options,
      data: [['X', 'Y']],
    })
    expect(
      oneRow.drafts.map(({ draftRow }) => [draftRow.name, draftRow.count]),
    ).toEqual([
      ['X', 'Y'],
      ['X', 'Y'],
    ])
  })

  it('copies a merged owner once, accepts blank continuations and rejects conflicting merged values', async () => {
    const options = fixture()
    const owner = {
      ...options.cellAt(0, 0)!,
      span: { rowStart: 0, rowEnd: 1, colStart: 0, colEnd: 2 },
    }
    const cellAt = (row: number, column: number) =>
      row === 0 ? owner : options.cellAt(row, column)
    const copied = await readTableClipboardRegion({ ...options, cellAt })
    expect(copied.data).toEqual([
      ['A', ''],
      ['B', 3],
    ])
    const pasted = await planTableClipboardPaste({
      ...options,
      cellAt,
      data: [
        ['C', ''],
        ['D', 4],
      ],
    })
    expect(pasted.drafts[0].update.patches).toEqual([
      { field: 'name', value: 'C', exists: true },
    ])
    await expect(
      planTableClipboardPaste({
        ...options,
        cellAt,
        data: [
          ['C', 'conflict'],
          ['D', 4],
        ],
      }),
    ).rejects.toThrow(TableClipboardShapeError)
    await expect(
      readTableClipboardRegion({
        ...options,
        cellAt,
        bounds: { ...bounds, colEnd: 1 },
      }),
    ).rejects.toThrow(TableClipboardShapeError)
  })

  it('never silently overwrites a field shown in two different columns', async () => {
    const options = fixture()
    const cellAt = (row: number, column: number) =>
      makeCell(options.rows[row], row, column, {
        field: 'name',
        key: `alias-${column}`,
        editor: true,
      })
    await expect(
      planTableClipboardPaste({ ...options, cellAt, data: [['A', 'B']] }),
    ).rejects.toThrow(TableClipboardShapeError)
    const result = await planTableClipboardPaste({
      ...options,
      cellAt,
      data: [['X', 'X']],
    })
    expect(result.drafts.map(({ update }) => update.patches.length)).toEqual([
      1, 1,
    ])
  })

  it('respects disabled controls, readonly fields and invalid field paths even when the caller permits writes', async () => {
    const row = { id: 1, name: 'A' }
    const fields: TableColumn[] = [
      { field: 'name', editor: { props: { disabled: true } } },
      { field: 'name', editor: { props: { readonly: true } } },
      { field: '__proto__.name', editor: true },
      { type: 'seq' },
    ]
    const result = await planTableClipboardPaste({
      bounds: { rowStart: 0, rowEnd: 1, colStart: 0, colEnd: 4 },
      data: [['X']],
      writable: () => true,
      cellAt: (_row, column) =>
        makeCell(row, 0, column, { ...fields[column], key: `c${column}` }),
    })
    expect(result.skipped).toBe(4)
    expect(result.drafts).toEqual([])
    expect(row.name).toBe('A')
  })

  it('touches only the requested cells at the far end of a huge logical source', async () => {
    let reads = 0
    const cellAt = vi.fn((row: number, column: number) =>
      makeCell(
        new Proxy(
          {},
          {
            get: (_, field) => {
              reads++
              return field === 'id'
                ? row
                : field === `c${column}`
                  ? `${row}:${column}`
                  : undefined
            },
            has: (_, field) => field === 'id' || field === `c${column}`,
            ownKeys: () => {
              throw new Error('Do not enumerate generated rows')
            },
          },
        ),
        row,
        column,
        { field: `c${column}`, key: `c${column}`, editor: true },
      ),
    )
    const options = {
      cellAt,
      bounds: {
        rowStart: 999_998,
        rowEnd: 1_000_000,
        colStart: 99_998,
        colEnd: 100_000,
      },
    }
    const copied = await readTableClipboardRegion(options)
    expect(copied.data[1][1]).toBe('999999:99999')
    const result = await planTableClipboardPaste({
      ...options,
      data: [['changed']],
      writable: () => true,
    })
    expect(result.drafts[1].draftRow.c99999).toBe('changed')
    expect(cellAt).toHaveBeenCalledTimes(8)
    expect(reads).toBeLessThan(50)
    cellAt.mockClear()
    await expect(
      readTableClipboardRegion({
        ...options,
        bounds: {
          rowStart: 0,
          rowEnd: 1_000_000,
          colStart: 0,
          colEnd: 100_000,
        },
      }),
    ).rejects.toThrow(TableClipboardLimitError)
    expect(cellAt).not.toHaveBeenCalled()
  })

  it('cancels during a scheduler yield, including a scheduler that never resolves', async () => {
    const controller = new AbortController()
    let ready!: () => void
    const reached = new Promise<void>((resolve) => {
      ready = resolve
    })
    const cellAt = vi.fn((row: number) =>
      makeCell({ id: row, name: `Row ${row}` }, row, 0),
    )
    const pending = readTableClipboardRegion({
      bounds: { rowStart: 0, rowEnd: 500, colStart: 0, colEnd: 1 },
      cellAt,
      signal: controller.signal,
      yieldControl: () => {
        ready()
        return new Promise<void>(() => {})
      },
    })
    await reached
    controller.abort()
    await expect(pending).rejects.toMatchObject({ name: 'AbortError' })
    expect(cellAt.mock.calls.length).toBeLessThan(129)
  })

  it('rejects stale source values and view revisions during a long read', async () => {
    const row = { id: 1, name: 'A' }
    const cellAt = (_row: number, column: number) =>
      makeCell(row, 0, column, { field: 'name', key: String(column) })
    await expect(
      readTableClipboardRegion({
        bounds: { rowStart: 0, rowEnd: 1, colStart: 0, colEnd: 256 },
        cellAt,
        yieldControl: async () => {
          row.name = 'changed'
        },
      }),
    ).rejects.toMatchObject({ name: 'AbortError' })
    await expect(
      planTableClipboardPaste({
        ...fixture(),
        data: [['X']],
        current: () => false,
      }),
    ).rejects.toMatchObject({ name: 'AbortError' })
  })

  it('snapshots programmatic matrices before yielding and exposes complete sparse drafts', async () => {
    const data = [[{ tags: ['original'] }]]
    const result = await planTableClipboardPaste({
      bounds: { rowStart: 0, rowEnd: 256, colStart: 0, colEnd: 1 },
      cellAt: (row) => makeCell({ id: row, name: 'old' }, row, 0),
      data,
      writable: () => true,
      parse: (value, context) => {
        const item = value as { tags: string[] }
        item.tags.push(String(context.rowKey))
        return item
      },
      yieldControl: async () => {
        data[0][0].tags[0] = 'changed'
      },
    })
    expect(result.drafts[0].draftRow.name).toEqual({ tags: ['original', '0'] })
    expect(result.drafts[255].draftRow.name).toEqual({
      tags: ['original', '255'],
    })
    expect(result.drafts[0].draftRow.name).not.toBe(
      result.drafts[255].draftRow.name,
    )
  })

  it('fails conversions or oversized text without exposing a partial write plan', async () => {
    const options = fixture()
    await expect(
      planTableClipboardPaste({
        ...options,
        data: [['X', 'NaN']],
        parse: (value, { column }) => {
          if (column.field === 'count') throw new TypeError('Not a number')
          return value
        },
      }),
    ).rejects.toThrow('Not a number')
    await expect(
      planTableClipboardPaste({
        ...options,
        data: [['oversized']],
        maxCharacters: 3,
      }),
    ).rejects.toThrow(TableClipboardLimitError)
    await expect(
      readTableClipboardRegion({
        ...options,
        format: () => 'oversized',
        maxCharacters: 3,
      }),
    ).rejects.toThrow(TableClipboardLimitError)
    expect(options.rows[0].name).toBe('A')
  })
})
