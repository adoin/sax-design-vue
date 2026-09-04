import { describe, expect, it, vi } from 'vitest'
import {
  createTableRangeExpansion,
  expandTableCellRange,
  tableRangeBetween,
  tableRangeContains,
  tableRangeIntersects,
} from '../src/composables/table-cell-range-model'
import type { TableCellRangeBounds } from '../src/table-cell-range'

const limits = { rows: 10, columns: 10 }
const box = (
  rowStart: number,
  rowEnd: number,
  colStart: number,
  colEnd: number,
) => ({ rowStart, rowEnd, colStart, colEnd })
const queryFor = (regions: TableCellRangeBounds[]) =>
  vi.fn((window: Readonly<TableCellRangeBounds>) =>
    regions.filter((region) => tableRangeIntersects(region, window)),
  )

describe('table range bounds', () => {
  it('normalizes reversed endpoints without counting group bands or pixel positions', () => {
    expect(
      tableRangeBetween({ row: 7, col: 2 }, { row: 1, col: 8 }, limits),
    ).toEqual(box(1, 8, 2, 9))
    expect(
      tableRangeBetween({ row: 3, col: 4 }, { row: 3, col: 4 }, limits),
    ).toEqual(box(3, 4, 4, 5))
  })
  it.each([-1, Number.NaN, Infinity, 0.5, 10, Number.MAX_SAFE_INTEGER + 1])(
    'rejects invalid endpoint %s',
    (value) => {
      expect(
        tableRangeBetween({ row: value, col: 0 }, { row: 0, col: 0 }, limits),
      ).toBeUndefined()
      expect(
        tableRangeBetween({ row: 0, col: value }, { row: 0, col: 0 }, limits),
      ).toBeUndefined()
    },
  )
  it('uses half-open membership and excludes fractional indices', () => {
    const bounds = box(1, 3, 2, 4)
    expect(tableRangeContains(bounds, 1, 2)).toBe(true)
    expect(tableRangeContains(bounds, 2, 3)).toBe(true)
    expect(tableRangeContains(bounds, 3, 3)).toBe(false)
    expect(tableRangeContains(bounds, 1, 4)).toBe(false)
    expect(tableRangeContains(bounds, 1.5, 2)).toBe(false)
    expect(tableRangeContains(null, 1, 2)).toBe(false)
  })
})

describe('incremental merged selection closure', () => {
  it('includes chained merges discovered only after an earlier expansion', () => {
    const regions = [box(1, 3, 1, 2), box(0, 2, 2, 4), box(0, 1, 0, 2)]
    const query = queryFor(regions)
    const initial = box(2, 4, 1, 3)
    const expansion = createTableRangeExpansion(initial, limits, query)
    let steps = 0
    while (!expansion.step(1)) expect(++steps).toBeLessThan(30)
    expect(expansion.bounds).toEqual(box(0, 4, 0, 4))
    expect(initial).toEqual(box(2, 4, 1, 3))
    const windows = query.mock.calls.map(([window]) => window)
    for (let i = 0; i < windows.length; i++)
      for (let j = i + 1; j < windows.length; j++)
        expect(tableRangeIntersects(windows[i], windows[j])).toBe(false)
    const calls = query.mock.calls.length
    expect(expansion.step()).toBe(true)
    expect(query).toHaveBeenCalledTimes(calls)
    expect(Object.isFrozen(expansion.bounds)).toBe(true)
  })

  it('clips remote merge extents to the current view and ignores unrelated results', async () => {
    const result = await expandTableCellRange(box(8, 9, 8, 9), limits, () => [
      box(7, 15, 6, 20),
      box(0, 1, 0, 1),
    ])
    expect(result).toEqual(box(7, 10, 6, 10))
  })

  it('handles enormous rectangular selections in one query without enumerating cells', async () => {
    const max = Number.MAX_SAFE_INTEGER
    const query = vi.fn(() => [])
    const result = await expandTableCellRange(
      box(0, max, 0, max),
      { rows: max, columns: max },
      query,
    )
    expect(result).toEqual(box(0, max, 0, max))
    expect(query).toHaveBeenCalledTimes(1)
  })

  it('matches a complete reference closure across deterministic disjoint merge layouts', () => {
    let seed = 137
    const random = (max: number) => {
      seed = (seed * 1664525 + 1013904223) >>> 0
      return seed % max
    }
    for (let iteration = 0; iteration < 50; iteration++) {
      const regions: TableCellRangeBounds[] = []
      for (let attempt = 0; attempt < 60; attempt++) {
        const row = random(9),
          col = random(9)
        const region = box(
          row,
          Math.min(10, row + random(3) + 1),
          col,
          Math.min(10, col + random(3) + 1),
        )
        if (!regions.some((other) => tableRangeIntersects(region, other)))
          regions.push(region)
      }
      const initial = tableRangeBetween(
        { row: random(10), col: random(10) },
        { row: random(10), col: random(10) },
        limits,
      )!
      let expected = { ...initial }
      for (;;) {
        const before = JSON.stringify(expected)
        for (const region of regions)
          if (tableRangeIntersects(expected, region))
            expected = box(
              Math.min(expected.rowStart, region.rowStart),
              Math.max(expected.rowEnd, region.rowEnd),
              Math.min(expected.colStart, region.colStart),
              Math.max(expected.colEnd, region.colEnd),
            )
        if (before === JSON.stringify(expected)) break
      }
      const expansion = createTableRangeExpansion(
        initial,
        limits,
        queryFor(regions),
      )
      let steps = 0
      while (!expansion.step(3)) expect(++steps).toBeLessThan(300)
      expect(expansion.bounds).toEqual(expected)
    }
  })

  it('validates bounds, budgets and malformed merge results', async () => {
    expect(() =>
      createTableRangeExpansion(box(0, 11, 0, 1), limits, () => []),
    ).toThrow(RangeError)
    expect(() =>
      createTableRangeExpansion(box(1, 1, 0, 1), limits, () => []),
    ).toThrow(RangeError)
    const expansion = createTableRangeExpansion(
      box(0, 1, 0, 1),
      limits,
      () => [],
    )
    expect(() => expansion.step(0)).toThrow(RangeError)
    expect(() => expansion.step(Infinity)).toThrow(RangeError)
    await expect(
      expandTableCellRange(box(0, 1, 0, 1), limits, () => [
        box(0, Number.NaN, 0, 1),
      ]),
    ).rejects.toThrow(RangeError)
    await expect(
      expandTableCellRange(box(0, 1, 0, 1), limits, () => {
        throw new Error('resolver failed')
      }),
    ).rejects.toThrow('resolver failed')
  })

  it('yields between bounded batches', async () => {
    const yieldControl = vi.fn(async () => {})
    const result = await expandTableCellRange(
      box(2, 4, 1, 3),
      limits,
      queryFor([box(1, 3, 1, 2), box(0, 2, 2, 4)]),
      { batchSize: 1, yieldControl },
    )
    expect(result).toEqual(box(0, 4, 1, 4))
    expect(yieldControl.mock.calls.length).toBeGreaterThan(1)
  })

  it('cancels before querying and during a non-cooperative yield without stale work', async () => {
    const before = new AbortController()
    before.abort(new Error('before'))
    const query = vi.fn(() => [])
    await expect(
      expandTableCellRange(box(0, 1, 0, 1), limits, query, {
        signal: before.signal,
      }),
    ).rejects.toThrow('before')
    expect(query).not.toHaveBeenCalled()

    const controller = new AbortController()
    const remove = vi.spyOn(controller.signal, 'removeEventListener')
    const result = expandTableCellRange(box(0, 1, 0, 1), limits, query, {
      batchSize: 1,
      signal: controller.signal,
      yieldControl: () => new Promise<void>(() => {}),
    })
    const assertion = expect(result).rejects.toThrow('superseded')
    await Promise.resolve()
    controller.abort(new Error('superseded'))
    await assertion
    expect(query).toHaveBeenCalledTimes(1)
    expect(remove).toHaveBeenCalledWith('abort', expect.any(Function))
  })
})
