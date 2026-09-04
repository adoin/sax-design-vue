import { shallowRef } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { useTableMergeRegions } from '../src/composables/use-table-merge-regions'
import type {
  TableMergeConfig,
  TableMergeQuery,
  TableMergeRange,
} from '../src/table-merge'

const setup = (initial: boolean | TableMergeConfig) => {
  const config = shallowRef(initial)
  const rowAt = vi.fn(() => undefined)
  const columnAt = vi.fn(() => undefined)
  const merges = useTableMergeRegions({
    config: () => config.value,
    columnCount: () => 100_000,
    columnAt,
    body: {
      count: () => 1_000_000,
      rowAt,
      windows: () => [{ rowStart: 0, rowEnd: 10, colStart: 0, colEnd: 5 }],
    },
    footer: { count: () => 1, rowAt, windows: () => [] },
  })
  return { config, rowAt, columnAt, merges }
}
describe('merge rectangle queries outside the render window', () => {
  it('queries a million-row range once without enumerating its data or columns', () => {
    const resolver = vi.fn<(query: TableMergeQuery) => TableMergeRange[]>(
      () => [{ row: 800_000, col: 90_000, rowspan: 200_000, colspan: 10_000 }],
    )
    const { merges, rowAt, columnAt } = setup({ body: resolver })
    const query = {
      rowStart: 0,
      rowEnd: 1_000_000,
      colStart: 0,
      colEnd: 100_000,
    }
    expect(merges.query('body', query)).toHaveLength(1)
    expect(resolver).toHaveBeenCalledTimes(1)
    expect(resolver.mock.calls[0][0]).toMatchObject(query)
    expect(rowAt).not.toHaveBeenCalled()
    expect(columnAt).not.toHaveBeenCalled()
  })
  it('returns full intersecting regions and clips the query, not the returned origin', () => {
    const resolver = vi.fn<(query: TableMergeQuery) => TableMergeRange[]>(
      () => [{ row: 800_000, col: 90_000, rowspan: 200_000, colspan: 10_000 }],
    )
    const { merges } = setup({ body: resolver })
    const query = Object.freeze({
      rowStart: 999_999,
      rowEnd: 2_000_000,
      colStart: 99_999,
      colEnd: 200_000,
    })
    expect(merges.query('body', query)[0]).toMatchObject({
      row: 800_000,
      col: 90_000,
      rowEnd: 1_000_000,
      colEnd: 100_000,
    })
    expect(resolver.mock.calls[0][0]).toMatchObject({
      rowEnd: 1_000_000,
      colEnd: 100_000,
    })
    expect(query.rowEnd).toBe(2_000_000)
  })
  it('reuses static regions and distinguishes body and footer', () => {
    const { merges } = setup({
      body: [{ row: 10, col: 2, rowspan: 3, colspan: 2 }],
      footer: [{ row: 0, col: 0, rowspan: 1, colspan: 3 }],
    })
    const query = { rowStart: 11, rowEnd: 12, colStart: 2, colEnd: 3 }
    const result = merges.query('body', query)[0]
    expect(result).toBe(merges.body.value.regions[0])
    expect(merges.query('footer', query)).toEqual([])
    expect(
      merges.query('footer', {
        rowStart: 0,
        rowEnd: 1,
        colStart: 1,
        colEnd: 2,
      })[0].col,
    ).toBe(0)
  })
  it('does not invoke resolvers for disabled, empty or invalid windows', () => {
    const resolver = vi.fn(() => [])
    const { config, merges } = setup({ body: resolver })
    for (const rowStart of [-1, Number.NaN, 1_000_000])
      expect(
        merges.query('body', {
          rowStart,
          rowEnd: 1_000_001,
          colStart: 0,
          colEnd: 1,
        }),
      ).toEqual([])
    expect(
      merges.query('body', { rowStart: 1, rowEnd: 1, colStart: 0, colEnd: 1 }),
    ).toEqual([])
    config.value = { enabled: false, body: resolver }
    expect(
      merges.query('body', { rowStart: 0, rowEnd: 1, colStart: 0, colEnd: 1 }),
    ).toEqual([])
    expect(resolver).not.toHaveBeenCalled()
  })
  it('reports resolver failure to the cancellable range operation instead of accepting incomplete geometry', () => {
    const error = new Error('source unavailable')
    const { merges } = setup({
      body: () => {
        throw error
      },
    })
    expect(() =>
      merges.query('body', { rowStart: 0, rowEnd: 1, colStart: 0, colEnd: 1 }),
    ).toThrow(error)
    expect(merges.body.value.issues[0]).toMatchObject({
      reason: 'resolver-error',
      error,
    })
  })
})
