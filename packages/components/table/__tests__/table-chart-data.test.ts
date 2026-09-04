import { describe, expect, it, vi } from 'vitest'
import { TableChartLimitError, buildTableChartData } from '../src/chart-data'
import { TableDataBatchConflictError } from '../src/change-batch'
import type { TableChartRecord, TableChartSeriesInfo } from '../src/chart-data'

const series: TableChartSeriesInfo[] = [
  { key: 'sales', name: 'Sales' },
  { key: 'cost', name: 'Cost' },
]
const record = (
  key: string | number,
  category: unknown,
  values: unknown[],
): TableChartRecord => ({
  point: { key },
  category: () => ({ read: () => category, isCurrent: () => true }),
  value: (index) => ({ read: () => values[index], isCurrent: () => true }),
  isCurrent: () => true,
})
const options = (records: TableChartRecord[]) => ({
  scope: 'selection' as const,
  series,
  records: records.map((value) => () => value),
})

describe('Table chart data snapshots', () => {
  it('preserves category order, equal labels, stable typed keys, and missing values', async () => {
    const result = await buildTableChartData(
      options([
        record(1, 'Jan', [12, null]),
        record('1', 'Jan', [0, -3]),
        record(2, undefined, [undefined, 7]),
      ]),
    )
    expect(result).toMatchObject({ complete: true, visited: 9 })
    expect(result.data.categories).toEqual(['Jan', 'Jan', ''])
    expect(result.data.points.map((p) => p.key)).toEqual([1, '1', 2])
    expect(result.data.series).toEqual([
      { key: 'sales', name: 'Sales', values: [12, 0, null] },
      { key: 'cost', name: 'Cost', values: [null, -3, 7] },
    ])
  })

  it('keeps numeric strings, booleans, infinities, objects and bigint as gaps by default', async () => {
    const values = ['8', true, Number.NaN, Infinity, -Infinity, {}, BigInt(10)]
    const result = await buildTableChartData({
      ...options(values.map((value, index) => record(index, index, [value]))),
      series: [series[0]],
    })
    expect(result.data.series[0].values).toEqual(values.map(() => null))
  })

  it('allows explicit conversions, supplies point and series context, and protects input objects', async () => {
    const category = { title: 'January' }
    const value = { amount: 8 }
    const seen: unknown[] = []
    const result = await buildTableChartData({
      ...options([record('r1', category, [value])]),
      series: [series[0]],
      scope: 'filtered',
      categoryMethod: (copy) => {
        const object = copy as typeof category
        const title = object.title
        object.title = 'Changed'
        return title
      },
      valueMethod: (copy, context) => {
        seen.push(context)
        const object = copy as typeof value
        const amount = object.amount
        object.amount = 99
        return amount
      },
    })
    expect(category.title).toBe('January')
    expect(value.amount).toBe(8)
    expect(result.data.categories).toEqual(['January'])
    expect(result.data.series[0].values).toEqual([8])
    expect(seen).toMatchObject([
      { scope: 'filtered', point: { key: 'r1' }, series: { key: 'sales' } },
    ])
  })

  it('creates deeply frozen serializable output without leaking metadata or field objects', async () => {
    const entry = record('r1', new Date('2026-01-01T00:00:00Z'), [3, 4])
    const result = await buildTableChartData(options([entry]))
    entry.point.key = 'changed'
    expect(result.data.points[0].key).toBe('r1')
    expect(result.data.categories[0]).toBe('2026-01-01T00:00:00.000Z')
    for (const value of [
      result.data,
      result.data.categories,
      result.data.points,
      result.data.points[0],
      result.data.series,
      result.data.series[0],
      result.data.series[0].values,
    ])
      expect(Object.isFrozen(value)).toBe(true)
    expect(
      JSON.parse(JSON.stringify(result.data)).series.map(
        (item: { values: number[] }) => item.values,
      ),
    ).toEqual([[3], [4]])
  })

  it('accepts precomputed aggregate points without referring to original member rows', async () => {
    const group = record('group-a', 'Engineering', [50, 12])
    group.point.groupKey = 'group-a'
    const result = await buildTableChartData({
      ...options([group]),
      scope: 'aggregate',
    })
    expect(result.data).toMatchObject({
      scope: 'aggregate',
      points: [{ groupKey: 'group-a' }],
      series: [{ values: [50] }, { values: [12] }],
    })
  })

  it('reserves a full row against cell and point budgets before resolving generated data', async () => {
    const resolve = vi.fn((index: number) =>
      record(index, `Row ${index}`, [1, 2]),
    )
    function* records() {
      for (let i = 0; i < 1_000_000; i++) yield () => resolve(i)
    }
    const result = await buildTableChartData({
      scope: 'filtered',
      series,
      records: records(),
      maxCells: 8,
    })
    expect(result).toMatchObject({
      complete: false,
      limit: 'cells',
      visited: 6,
    })
    expect(result.data.points).toHaveLength(2)
    expect(resolve).toHaveBeenCalledTimes(2)
    resolve.mockClear()
    expect(
      await buildTableChartData({
        scope: 'filtered',
        series,
        records: records(),
        maxPoints: 3,
      }),
    ).toMatchObject({ complete: false, limit: 'points', visited: 9 })
    expect(resolve).toHaveBeenCalledTimes(3)
    expect(
      await buildTableChartData({
        ...options([record(0, 'Only', [1, 2])]),
        maxPoints: 1,
        maxCells: 3,
      }),
    ).toMatchObject({ complete: true, visited: 3 })
  })

  it('reads only requested fields at a distant generated row, without enumeration', async () => {
    const read = vi.fn((field: string) => (field === 'label' ? 'Last' : 42))
    const row = new Proxy(
      {},
      {
        ownKeys: () => {
          throw new Error('Do not enumerate')
        },
        get: (_, key) => read(String(key)),
      },
    ) as Record<string, unknown>
    const entry: TableChartRecord = {
      point: { key: 999_999, rowIndex: 999_999 },
      category: () => ({ read: () => row.label, isCurrent: () => true }),
      value: (i) => ({
        read: () => row[`c${99_998 + i}`],
        isCurrent: () => true,
      }),
      isCurrent: () => true,
    }
    const result = await buildTableChartData(options([entry]))
    expect(result.data.categories).toEqual(['Last'])
    expect(result.data.series.map((s) => s.values)).toEqual([[42], [42]])
    expect(new Set(read.mock.calls.map(([key]) => key))).toEqual(
      new Set(['label', 'c99998', 'c99999']),
    )
    expect(read.mock.calls.length).toBeLessThanOrEqual(6)
  })

  it('does not publish a half point when category text exceeds the remaining budget', async () => {
    const value = vi.fn(() => ({ read: () => 1, isCurrent: () => true }))
    const entry = { ...record(0, 'Too long', [1, 2]), value }
    const result = await buildTableChartData({
      ...options([entry]),
      maxCharacters: 19,
    })
    expect(result).toMatchObject({
      complete: false,
      limit: 'characters',
      visited: 1,
    })
    expect(result.data.categories).toEqual([])
    expect(result.data.series.map((s) => s.values)).toEqual([[], []])
    expect(value).not.toHaveBeenCalled()
  })

  it('bounds metadata before invoking a data resolver and rejects ambiguous schemas', async () => {
    const resolve = vi.fn(() => record(0, 'A', [1, 2]))
    const base = { scope: 'selection' as const, series, records: [resolve] }
    await expect(
      buildTableChartData({ ...base, maxSeries: 1 }),
    ).rejects.toMatchObject({ limit: 'series' })
    await expect(
      buildTableChartData({ ...base, maxCells: 2 }),
    ).rejects.toMatchObject({ limit: 'cells' })
    await expect(
      buildTableChartData({ ...base, maxCharacters: 1 }),
    ).rejects.toBeInstanceOf(TableChartLimitError)
    await expect(buildTableChartData({ ...base, series: [] })).rejects.toThrow(
      'at least one',
    )
    await expect(
      buildTableChartData({ ...base, series: [series[0], series[0]] }),
    ).rejects.toThrow('unique')
    for (const n of [0, -1, 1.5, Infinity, Number.MAX_SAFE_INTEGER + 1])
      await expect(
        buildTableChartData({ ...base, maxPoints: n }),
      ).rejects.toThrow('positive safe integers')
    expect(resolve).not.toHaveBeenCalled()
  })

  it('rejects duplicate point keys and invalid addresses', async () => {
    await expect(
      buildTableChartData(
        options([record(1, 'A', [1, 2]), record(1, 'B', [3, 4])]),
      ),
    ).rejects.toThrow('Duplicate chart point')
    const invalid = record(Infinity, 'A', [1, 2])
    await expect(buildTableChartData(options([invalid]))).rejects.toThrow(
      'Invalid chart point',
    )
    invalid.point.key = 1
    invalid.point.rowIndex = -1
    await expect(buildTableChartData(options([invalid]))).rejects.toThrow(
      'Invalid chart point',
    )
  })

  it('rejects non-finite and asynchronous conversions instead of inventing values', async () => {
    const base = options([record(1, 'A', [1, 2])])
    for (const value of [
      Infinity,
      Number.NaN,
      '1',
      undefined,
      Promise.resolve(1),
    ]) {
      await expect(
        buildTableChartData({ ...base, valueMethod: () => value as number }),
      ).rejects.toThrow('finite numbers or null')
    }
    await expect(
      buildTableChartData({
        ...base,
        categoryMethod: () => Promise.resolve('A') as unknown as string,
      }),
    ).rejects.toThrow('synchronous strings')
  })

  it('cancels yielded work even if the scheduler never resolves', async () => {
    const controller = new AbortController()
    const yieldControl = vi.fn(() => new Promise<void>(() => {}))
    const pending = buildTableChartData({
      ...options(Array.from({ length: 200 }, (_, i) => record(i, 'A', [1, 2]))),
      yieldControl,
      signal: controller.signal,
    })
    await vi.waitFor(() => expect(yieldControl).toHaveBeenCalled())
    controller.abort()
    await expect(pending).rejects.toMatchObject({ name: 'AbortError' })
  })

  it('stops on a cancelled signal before touching any source data', async () => {
    const controller = new AbortController()
    controller.abort()
    const resolve = vi.fn(() => record(1, 'A', [1, 2]))
    await expect(
      buildTableChartData({
        scope: 'selection',
        series,
        records: [resolve],
        signal: controller.signal,
      }),
    ).rejects.toMatchObject({ name: 'AbortError' })
    expect(resolve).not.toHaveBeenCalled()
  })

  it('rejects stale cell, row and scope snapshots without returning a partial chart', async () => {
    let value = 1
    const entry = record(0, 'A', [1, 2])
    entry.value = (index) => ({
      read: () => (index === 0 ? value : 2),
      isCurrent: () => true,
    })
    await expect(
      buildTableChartData({
        ...options([entry]),
        valueMethod: (v, context) => {
          if (context.series?.key === 'cost') value = 9
          return Number(v)
        },
      }),
    ).rejects.toBeInstanceOf(TableDataBatchConflictError)
    entry.isCurrent = () => false
    await expect(buildTableChartData(options([entry]))).rejects.toBeInstanceOf(
      TableDataBatchConflictError,
    )
    await expect(
      buildTableChartData({
        ...options([record(0, 'A', [1, 2])]),
        current: () => false,
      }),
    ).rejects.toMatchObject({ name: 'AbortError' })
  })

  it('snapshots series definitions before yielding so external edits cannot change later points', async () => {
    const definitions = [{ key: 'v', name: 'Original' }]
    const yieldControl = vi.fn(async () => {
      definitions[0].name = 'Changed'
      definitions.push({ key: 'extra', name: 'Extra' })
    })
    const result = await buildTableChartData({
      ...options(Array.from({ length: 200 }, (_, i) => record(i, i, [i]))),
      series: definitions,
      yieldControl,
    })
    expect(yieldControl).toHaveBeenCalled()
    expect(result.data.series).toHaveLength(1)
    expect(result.data.series[0].name).toBe('Original')
    expect(result.data.series[0].values).toHaveLength(200)
  })
})
