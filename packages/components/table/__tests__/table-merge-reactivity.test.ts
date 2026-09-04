import { computed, shallowRef } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { useTableMergeRegions } from '../src/composables/use-table-merge-regions'
import type { TableMergeConfig, TableMergeQuery } from '../src/table-merge'

describe('reactive table merges', () => {
  const range = { row: 0, col: 0, rowspan: 4, colspan: 4 }
  const window = { rowStart: 0, rowEnd: 4, colStart: 0, colEnd: 4 }
  it('updates reactive rule dependencies and deduplicates regions returned for adjacent panes', () => {
    const span = shallowRef(2)
    const source = vi.fn(() => [{ ...range, rowspan: span.value }])
    const config = shallowRef<boolean | TableMergeConfig>({
      body: source,
      footer: [range],
    })
    const merges = useTableMergeRegions({
      config: () => config.value,
      columnCount: () => 4,
      columnAt: () => ({ field: 'name' }),
      body: {
        count: () => 4,
        rowAt: () => ({ name: 'Body' }),
        windows: () => [
          { ...window, colEnd: 1 },
          { ...window, colStart: 1 },
        ],
      },
      footer: {
        count: () => 2,
        rowAt: () => ({ name: 'Footer' }),
        windows: () => [window],
      },
    })
    expect(merges.body.value.regions).toHaveLength(1)
    expect(merges.body.value.issues).toEqual([])
    expect(merges.at('body', 3, 3)).toBeUndefined()
    span.value = 4
    expect(merges.at('body', 3, 3)?.rowspan).toBe(4)
    expect(merges.at('footer', 1, 3)?.rowspan).toBe(2)
    config.value = false
    expect(merges.body.value.regions).toEqual([])
    expect(merges.at('footer', 0, 0)).toBeUndefined()
  })
  it('keeps static indexes stable while virtual windows move', () => {
    const start = shallowRef(0)
    const merges = useTableMergeRegions({
      config: () => ({ body: [range] }),
      columnCount: () => 4,
      columnAt: () => ({}),
      body: {
        count: () => 10,
        rowAt: () => ({}),
        windows: () => [
          { ...window, rowStart: start.value, rowEnd: start.value + 4 },
        ],
      },
      footer: { count: () => 0, rowAt: () => undefined, windows: () => [] },
    })
    const first = merges.body.value
    start.value = 4
    expect(merges.body.value).toBe(first)
  })
  it('queries one distant point for programmatic navigation and never invokes a rule per visible empty cell', () => {
    const rowAt = vi.fn(() => ({}))
    const source = vi.fn((query: TableMergeQuery) =>
      query.rowStart > 100
        ? [{ row: 999990, col: 99990, rowspan: 10, colspan: 10 }]
        : [],
    )
    const merges = useTableMergeRegions({
      config: () => ({ body: source }),
      columnCount: () => 100_000,
      columnAt: () => ({}),
      body: { count: () => 1_000_000, rowAt, windows: () => [window] },
      footer: { count: () => 0, rowAt: () => undefined, windows: () => [] },
    })
    for (let row = 0; row < 4; row++)
      for (let col = 0; col < 4; col++)
        expect(merges.at('body', row, col)).toBeUndefined()
    expect(source).toHaveBeenCalledTimes(1)
    expect(merges.at('body', 999999, 99999)).toMatchObject({
      row: 999990,
      col: 99990,
    })
    expect(source).toHaveBeenLastCalledWith(
      expect.objectContaining({
        rowStart: 999999,
        rowEnd: 1_000_000,
        colStart: 99999,
        colEnd: 100_000,
      }),
    )
    expect(rowAt).not.toHaveBeenCalled()
  })
  it('rebuilds positional rules when sorting/filtering changes the data they read', () => {
    const data = shallowRef([{ group: 'a' }, { group: 'a' }, { group: 'b' }])
    const rows = computed(() => data.value)
    const merges = useTableMergeRegions({
      config: () => ({
        body: (query) =>
          query.rowAt(0)?.group === query.rowAt(1)?.group
            ? [{ row: 0, col: 0, rowspan: 2, colspan: 1 }]
            : [],
      }),
      columnCount: () => 1,
      columnAt: () => ({ field: 'group' }),
      body: {
        count: () => rows.value.length,
        rowAt: (index) => rows.value[index],
        windows: () => [{ ...window, colEnd: 1 }],
      },
      footer: { count: () => 0, rowAt: () => undefined, windows: () => [] },
    })
    expect(merges.at('body', 1, 0)?.row).toBe(0)
    data.value = [data.value[2], data.value[0], data.value[1]]
    expect(merges.at('body', 1, 0)).toBeUndefined()
    data.value = data.value.slice(1)
    expect(merges.at('body', 1, 0)?.row).toBe(0)
  })
})
