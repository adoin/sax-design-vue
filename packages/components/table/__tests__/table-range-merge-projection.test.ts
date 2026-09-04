import { describe, expect, it, vi } from 'vitest'
import { createTableRangeMergeQuery } from '../src/composables/table-range-merge-query'
import { createTableMergeIndex } from '../src/composables/table-merge-regions'
import { expandTableCellRange } from '../src/composables/table-cell-range-model'

describe('range merge projection through pagination and collapsed groups', () => {
  it('expands a range across visible members without counting group headers or hidden rows', async () => {
    const visible = [100, 101, 108, 109, 110]
    const index = createTableMergeIndex(
      [
        { row: 99, col: 1, rowspan: 4, colspan: 2 },
        { row: 104, col: 0, rowspan: 3, colspan: 4 },
        { row: 107, col: 3, rowspan: 5, colspan: 2 },
      ],
      1000,
      5,
    )
    const query = vi.fn(index.query)
    const projected = createTableRangeMergeQuery({
      count: () => visible.length,
      sourceIndexAt: (i) => visible[i] ?? -1,
      viewIndexNear: (row, backwards) => {
        if (backwards) {
          for (let i = visible.length - 1; i >= 0; i--)
            if (visible[i] <= row) return i
          return undefined
        }
        const i = visible.findIndex((value) => value >= row)
        return i < 0 ? undefined : i
      },
      query,
    })
    expect(
      projected({ rowStart: 0, rowEnd: 3, colStart: 0, colEnd: 5 }),
    ).toEqual([
      { rowStart: 0, rowEnd: 2, colStart: 1, colEnd: 3 },
      { rowStart: 2, rowEnd: 5, colStart: 3, colEnd: 5 },
    ])
    expect(query.mock.calls[0][0]).toEqual({
      rowStart: 100,
      rowEnd: 109,
      colStart: 0,
      colEnd: 5,
    })
    const bounds = await expandTableCellRange(
      { rowStart: 1, rowEnd: 3, colStart: 2, colEnd: 4 },
      { rows: visible.length, columns: 5 },
      projected,
    )
    expect(bounds).toEqual({ rowStart: 0, rowEnd: 5, colStart: 1, colEnd: 5 })
  })

  it('queries and projects a billion-row page with constant coordinate lookups', () => {
    const offset = 2_000_000_000
    const count = 1_000_000_000
    const index = createTableMergeIndex(
      [{ row: offset - 20, col: 0, rowspan: count + 40, colspan: 2 }],
      offset + count + 20,
      4,
    )
    const sourceIndexAt = vi.fn((i: number) => offset + i)
    const viewIndexNear = vi.fn((row: number) =>
      Math.max(0, Math.min(count - 1, row - offset)),
    )
    const query = createTableRangeMergeQuery({
      count: () => count,
      sourceIndexAt,
      viewIndexNear,
      query: index.query,
    })
    expect(
      query({ rowStart: 0, rowEnd: count, colStart: 0, colEnd: 4 }),
    ).toEqual([{ rowStart: 0, rowEnd: count, colStart: 0, colEnd: 2 }])
    expect(sourceIndexAt).toHaveBeenCalledTimes(4)
    expect(viewIndexNear).toHaveBeenCalledTimes(2)
  })

  it('does not query empty pages or invalid visible windows', () => {
    const query = vi.fn(() => [])
    const projected = createTableRangeMergeQuery({
      count: () => 0,
      sourceIndexAt: () => -1,
      viewIndexNear: () => undefined,
      query,
    })
    expect(
      projected({ rowStart: 0, rowEnd: 1, colStart: 0, colEnd: 1 }),
    ).toEqual([])
    expect(query).not.toHaveBeenCalled()
  })
})
