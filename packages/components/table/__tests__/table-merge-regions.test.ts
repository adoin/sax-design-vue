import { describe, expect, it, vi } from 'vitest'
import {
  createTableMergeIndex,
  projectTableMergeRegions,
  resolveTableMergeWindow,
} from '../src/composables/table-merge-regions'
import type { TableMergeQuery, TableMergeRange } from '../src/table-merge'

describe('table merge regions', () => {
  it('owns covered coordinates and uses half-open bounds without changing caller records', () => {
    const range = { row: 2, col: 3, rowspan: 4, colspan: 2 }
    const index = createTableMergeIndex(Object.freeze([range]), 10, 10)
    expect(index.at(2, 3)).toMatchObject(range)
    expect(index.at(5, 4)).toBe(index.at(2, 3))
    expect(index.at(6, 4)).toBeUndefined()
    expect(index.at(5, 5)).toBeUndefined()
    expect(
      index.query({ rowStart: 4, rowEnd: 7, colStart: 4, colEnd: 8 }),
    ).toEqual(index.regions)
    expect(Object.keys(range)).toEqual(['row', 'col', 'rowspan', 'colspan'])
    range.row = 9
    expect(index.at(2, 3)?.row).toBe(2)
    expect(Object.isFrozen(index.at(2, 3))).toBe(true)
  })

  it('rejects malformed coordinates, clips to data bounds and ignores missing rows and trivial spans', () => {
    const index = createTableMergeIndex(
      [
        { row: -1, col: 0, rowspan: 2, colspan: 2 },
        { row: 0, col: 0, rowspan: 0, colspan: 2 },
        { row: 0, col: 0.5, rowspan: 2, colspan: 2 },
        { row: 0, col: 0, rowspan: Infinity, colspan: 2 },
        { row: Number.MAX_SAFE_INTEGER, col: 0, rowspan: 2, colspan: 2 },
        { row: 0, col: 0, rowspan: 1, colspan: 1 },
        { row: 20, col: 0, rowspan: 2, colspan: 2 },
        { row: 3, col: 3, rowspan: 8, colspan: 8 },
      ],
      5,
      5,
    )
    expect(index.issues.map((issue) => issue.index)).toEqual([0, 1, 2, 3, 4])
    expect(index.regions).toHaveLength(1)
    expect(index.regions[0]).toMatchObject({
      row: 3,
      col: 3,
      rowspan: 2,
      colspan: 2,
    })
    expect(index.at(Number.NaN, 0)).toBeUndefined()
    expect(index.at(0, Infinity)).toBeUndefined()
    expect(
      index.query({ rowStart: 4, rowEnd: 2, colStart: 0, colEnd: 5 }),
    ).toEqual([])
    expect(createTableMergeIndex(index.regions, 0, 0).regions).toEqual([])
  })

  it('uses first valid overlapping region and allows rectangles that only touch', () => {
    const index = createTableMergeIndex(
      [
        { row: 1, col: 1, rowspan: 2, colspan: 2 },
        { row: 0, col: 0, rowspan: 3, colspan: 3 },
        { row: 0, col: 0, rowspan: 1, colspan: 2 },
        { row: 3, col: 1, rowspan: 2, colspan: 2 },
        { row: 1, col: 3, rowspan: 2, colspan: 2 },
        { row: 1, col: 1, rowspan: 2, colspan: 2 },
      ],
      6,
      6,
    )
    expect(index.issues).toEqual([
      { index: 1, reason: 'overlap' },
      { index: 5, reason: 'overlap' },
    ])
    expect(index.regions).toHaveLength(4)
    expect(index.at(0, 0)?.rowspan).toBe(1)
    expect(index.at(3, 1)?.row).toBe(3)
  })

  it('matches a simple geometry oracle for varied sparse regions and windows', () => {
    let seed = 42
    const random = (limit: number) => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
      return seed % limit
    }
    const source: TableMergeRange[] = Array.from({ length: 300 }, () => ({
      row: random(90),
      col: random(90),
      rowspan: random(9) + 2,
      colspan: random(9) + 2,
    }))
    const oracle: TableMergeRange[] = []
    for (const region of source) {
      if (
        !oracle.some(
          (other) =>
            region.row < other.row + other.rowspan &&
            other.row < region.row + region.rowspan &&
            region.col < other.col + other.colspan &&
            other.col < region.col + region.colspan,
        )
      )
        oracle.push(region)
    }
    const index = createTableMergeIndex(source, 100, 100)
    expect(
      index.regions.map(({ row, col, rowspan, colspan }) => ({
        row,
        col,
        rowspan,
        colspan,
      })),
    ).toEqual(oracle)
    for (let i = 0; i < 120; i++) {
      const row = random(100)
      const col = random(100)
      const expected = oracle.filter(
        (region) =>
          region.row < row + 5 &&
          region.row + region.rowspan > row &&
          region.col < col + 5 &&
          region.col + region.colspan > col,
      )
      expect(
        index
          .query({
            rowStart: row,
            rowEnd: row + 5,
            colStart: col,
            colEnd: col + 5,
          })
          .map((region) => region.key),
      ).toEqual(
        expected.map(
          (region) =>
            `${region.row}:${region.col}:${region.rowspan}:${region.colspan}`,
        ),
      )
    }
  })

  it('projects a giant merge with an offscreen origin into fixed and scrolling fragments', () => {
    const index = createTableMergeIndex(
      [{ row: 0, col: 0, rowspan: 1_000_000, colspan: 100_000 }],
      1_000_000,
      100_000,
    )
    const fragments = projectTableMergeRegions(index, [
      {
        partition: 'left',
        rowStart: 999990,
        rowEnd: 1_000_000,
        colStart: 0,
        colEnd: 1,
      },
      {
        partition: 'center',
        rowStart: 999990,
        rowEnd: 1_000_000,
        colStart: 99994,
        colEnd: 99999,
      },
      {
        partition: 'right',
        rowStart: 999990,
        rowEnd: 1_000_000,
        colStart: 99999,
        colEnd: 100000,
      },
    ])
    expect(index.regions).toHaveLength(1)
    expect(fragments).toHaveLength(3)
    expect(
      fragments.map(({ rowStart, rowEnd, colStart, colEnd, primary }) => ({
        rowStart,
        rowEnd,
        colStart,
        colEnd,
        primary,
      })),
    ).toEqual([
      {
        rowStart: 999990,
        rowEnd: 1_000_000,
        colStart: 0,
        colEnd: 1,
        primary: true,
      },
      {
        rowStart: 999990,
        rowEnd: 1_000_000,
        colStart: 99994,
        colEnd: 99999,
        primary: false,
      },
      {
        rowStart: 999990,
        rowEnd: 1_000_000,
        colStart: 99999,
        colEnd: 100000,
        primary: false,
      },
    ])
    expect(
      fragments.every(
        (fragment) => fragment.region === index.at(999999, 99998),
      ),
    ).toBe(true)
  })

  it('queries many sparse ranges without allocating the covered matrix', () => {
    const ranges = Array.from({ length: 10_000 }, (_, index) => ({
      row: index * 100,
      col: index * 10,
      rowspan: 50,
      colspan: 5,
    }))
    const index = createTableMergeIndex(ranges, 1_000_000, 100_000)
    expect(index.regions).toHaveLength(10_000)
    expect(index.issues).toEqual([])
    expect(index.at(999940, 99992)).toMatchObject(ranges[9999])
    expect(
      index.query({
        rowStart: 999940,
        rowEnd: 999941,
        colStart: 99992,
        colEnd: 99993,
      }),
    ).toHaveLength(1)
  })

  it('evaluates body/footer rules for the requested logical window without reading rows or columns itself', () => {
    const query: TableMergeQuery = {
      area: 'body',
      rowStart: 999990,
      rowEnd: 1_000_000,
      colStart: 99990,
      colEnd: 100_000,
      rowCount: 1_000_000,
      columnCount: 100_000,
      rowAt: vi.fn(() => {
        throw new Error('Do not enumerate rows')
      }),
      columnAt: vi.fn(() => {
        throw new Error('Do not enumerate columns')
      }),
    }
    const resolver = vi.fn((window: TableMergeQuery) => [
      {
        row: window.rowStart - 10,
        col: window.colStart - 10,
        rowspan: 20,
        colspan: 20,
      },
    ])
    expect(
      resolveTableMergeWindow(resolver, query).at(999995, 99995),
    ).toMatchObject({ row: 999980, col: 99980 })
    expect(resolver).toHaveBeenCalledWith(query)
    expect(query.rowAt).not.toHaveBeenCalled()
    expect(query.columnAt).not.toHaveBeenCalled()
    expect(
      resolveTableMergeWindow(() => {
        throw new Error('Unavailable')
      }, query).issues[0],
    ).toMatchObject({ reason: 'resolver-error' })
    expect(
      resolveTableMergeWindow(undefined, {
        ...query,
        area: 'footer',
        rowCount: 2,
      }).regions,
    ).toEqual([])
  })
})
