import { describe, expect, it, vi } from 'vitest'
import { buildTableChartData } from '../src/chart-data'
import { TableDataBatchConflictError } from '../src/change-batch'
import { createTableChartScope } from '../src/composables/table-chart-scope'
import { createTableClipboardCells } from '../src/composables/table-clipboard-cells'
import { buildTableGroupModel } from '../src/composables/table-group-model'
import type { TableChartRequest } from '../src/composables/table-chart-scope'
import type { TableColumn, TableFlatRow, TableRow } from '../src/table'
import type { TableMergeRegion } from '../src/composables/table-merge-regions'

const flat = (row: TableRow, index: number): TableFlatRow => ({
  row,
  key: row.id as number,
  index,
  depth: 0,
  hasChildren: false,
  expanded: false,
  loading: false,
})
const rows = [
  flat({ id: 1, name: 'A', sales: 10, cost: 4, team: 'East' }, 0),
  flat({ id: 2, name: 'B', sales: 20, cost: 9, team: 'East' }, 1),
]
const columns: TableColumn[] = [
  { field: 'name', title: 'Name', fixed: 'left' },
  { field: 'sales', title: 'Sales' },
  { field: 'cost', title: 'Cost', fixed: 'right' },
]
const bounds = { rowStart: 0, rowEnd: 2, colStart: 0, colEnd: 3 }
const mapping: TableChartRequest = {
  scope: 'selection',
  series: [{ column: 'sales' }, { column: 'cost' }],
}
const fixture = (merges: TableMergeRegion[] = []) => {
  let active = true
  const readRow = vi.fn((index: number) => rows[index])
  const entry = (position: number) =>
    columns[position]
      ? { column: columns[position], index: position, position }
      : undefined
  const query = vi.fn(() => merges)
  const cells = createTableClipboardCells({
    count: () => ({ rows: 2, columns: 3, sourceRows: 2 }),
    sourceIndexAt: (i) => i,
    viewIndexNear: (i) => i,
    rowAt: readRow,
    columnAt: entry,
    query,
    toggle: async () => {},
  })
  const model = buildTableGroupModel(
    rows,
    ['team', 'name'],
    [{ key: 'sum', field: 'sales', method: 'sum' }],
  )
  const source = {
    selection: () => bounds,
    count: () => ({ rows: 2, columns: 3 }),
    columnAt: entry,
    column: (key: string | number) =>
      entry(
        typeof key === 'number'
          ? key
          : columns.findIndex((c) => c.field === key),
      ),
    rowAt: readRow,
    cells: vi.fn(cells),
    filtered: () => ({
      count: rows.length,
      rowAt: readRow,
      isCurrent: () => active,
    }),
    aggregates: () => ({
      groups: model.groups,
      group: (key: string) =>
        [...model.groups, ...model.groups.flatMap((g) => g.children)].find(
          (g) => g.key === key,
        ),
      summary: model.summary,
      isCurrent: () => active,
    }),
  }
  return {
    source,
    readRow,
    query,
    model,
    deactivate: () => {
      active = false
    },
  }
}

describe('Table chart scope resolution', () => {
  it('uses explicit visible mappings and the selected first column for categories', async () => {
    const { source } = fixture()
    const chart = createTableChartScope(source)(mapping, {}, () => true)
    const result = await buildTableChartData(chart)
    expect(result.data.categories).toEqual(['A', 'B'])
    expect(result.data.series).toEqual([
      { key: 'sales', name: 'Sales', values: [10, 20] },
      { key: 'cost', name: 'Cost', values: [4, 9] },
    ])
    const renamed = await buildTableChartData(
      createTableChartScope(source)(
        { ...mapping, series: [{ column: 2, name: 'Spending' }] },
        {},
        () => true,
      ),
    )
    expect(renamed.data.series).toEqual([
      { key: 'cost', name: 'Spending', values: [4, 9] },
    ])
  })

  it('uses the provided pre-pagination filtered model rather than visible-page membership', async () => {
    const { source, readRow } = fixture()
    source.selection = () => ({ ...bounds, rowEnd: 1 })
    const resolve = createTableChartScope(source)
    expect(
      (await buildTableChartData(resolve(mapping, {}, () => true))).data.points,
    ).toHaveLength(1)
    readRow.mockClear()
    const result = await buildTableChartData(
      resolve({ ...mapping, scope: 'filtered' }, {}, () => true),
    )
    expect(result.data.categories).toEqual(['A', 'B'])
    expect(result.data.points).toHaveLength(2)
    expect(source.cells).toHaveBeenCalledTimes(1)
  })

  it('counts merged numeric owners once and leaves continuations as gaps across fixed columns', async () => {
    const { source } = fixture([
      {
        key: '0:1:2:2',
        row: 0,
        col: 1,
        rowspan: 2,
        colspan: 2,
        rowEnd: 2,
        colEnd: 3,
      },
    ])
    const result = await buildTableChartData(
      createTableChartScope(source)(mapping, {}, () => true),
    )
    expect(result.data.categories).toEqual(['A', 'B'])
    expect(result.data.series.map((s) => s.values)).toEqual([
      [10, null],
      [null, null],
    ])
  })

  it('rejects a partial merged selection instead of counting an external owner', async () => {
    const { source } = fixture([
      {
        key: '0:1:2:2',
        row: 0,
        col: 1,
        rowspan: 2,
        colspan: 2,
        rowEnd: 2,
        colEnd: 3,
      },
    ])
    const chart = createTableChartScope(source)(
      { ...mapping, bounds: { ...bounds, rowStart: 1 } },
      {},
      () => true,
    )
    await expect(buildTableChartData(chart)).rejects.toThrow(
      'complete merged cells',
    )
  })

  it('reads root groups, explicit nested groups and the overall summary without reading members', async () => {
    const { source, readRow, model } = fixture()
    const resolve = createTableChartScope(source)
    const request: TableChartRequest = {
      scope: 'aggregate',
      series: [{ column: 'sum', name: 'Revenue' }],
    }
    const root = await buildTableChartData(resolve(request, {}, () => true))
    expect(root.data.categories).toEqual(['East'])
    expect(root.data.series[0].values).toEqual([30])
    const child = model.groups[0].children[1]
    const nested = await buildTableChartData(
      resolve({ ...request, groupKeys: [child.key] }, {}, () => true),
    )
    expect(nested.data.categories).toEqual(['B'])
    expect(nested.data.series[0].values).toEqual([20])
    const summary = await buildTableChartData(
      resolve(
        { ...request, aggregate: 'summary', summaryLabel: '合计' },
        {},
        () => true,
      ),
    )
    expect(summary.data.categories).toEqual(['合计'])
    expect(summary.data.series[0].values).toEqual([30])
    expect(readRow).not.toHaveBeenCalled()
  })

  it('queries only budgeted selection rows and requested column span', async () => {
    const { source } = fixture()
    source.count = () => ({ rows: 1_000_000, columns: 100_000 })
    source.selection = () => ({
      rowStart: 0,
      rowEnd: 1_000_000,
      colStart: 0,
      colEnd: 100_000,
    })
    createTableChartScope(source)(
      mapping,
      { maxPoints: 5, maxCells: 12 },
      () => true,
    )
    expect(source.cells).toHaveBeenCalledWith({
      rowStart: 0,
      rowEnd: 4,
      colStart: 0,
      colEnd: 3,
    })
  })

  it('bounds generated filtered scans without pre-reading all rows', async () => {
    const { source } = fixture()
    const read = vi.fn((i: number) =>
      flat({ id: i, name: `R${i}`, sales: i, cost: 1 }, i),
    )
    source.filtered = () => ({
      count: 1_000_000,
      rowAt: read,
      isCurrent: () => true,
    })
    const result = await buildTableChartData({
      ...createTableChartScope(source)(
        { ...mapping, scope: 'filtered' },
        { maxPoints: 2 },
        () => true,
      ),
      maxPoints: 2,
    })
    expect(result).toMatchObject({ complete: false, limit: 'points' })
    expect(result.data.categories).toEqual(['R0', 'R1'])
    expect(new Set(read.mock.calls.map(([index]) => index))).toEqual(
      new Set([0, 1]),
    )
  })

  it('validates bounds, visible fields, scope options and aggregate references', async () => {
    const { source } = fixture()
    const resolve = createTableChartScope(source)
    expect(() =>
      resolve({ ...mapping, bounds: { ...bounds, rowEnd: 3 } }, {}, () => true),
    ).toThrow('outside')
    expect(() =>
      resolve({ ...mapping, series: [{ column: 'hidden' }] }, {}, () => true),
    ).toThrow('visible data')
    expect(() =>
      resolve({ ...mapping, bounds: { ...bounds, colEnd: 1 } }, {}, () => true),
    ).toThrow('outside the selected')
    expect(() =>
      resolve({ ...mapping, scope: 'filtered', bounds }, {}, () => true),
    ).toThrow('selection scope')
    expect(() =>
      resolve({ ...mapping, aggregate: 'summary' }, {}, () => true),
    ).toThrow('aggregate scope')
    expect(() =>
      resolve(
        { ...mapping, scope: 'aggregate', category: 'name' },
        {},
        () => true,
      ),
    ).toThrow('group labels')
    expect(() =>
      resolve(
        {
          ...mapping,
          scope: 'aggregate',
          aggregate: 'summary',
          groupKeys: ['a'],
        },
        {},
        () => true,
      ),
    ).toThrow('overall summary')
    expect(() =>
      resolve(
        { ...mapping, scope: 'aggregate', groupKeys: ['a', 'b'] },
        { maxPoints: 1 },
        () => true,
      ),
    ).toThrow('points limit')
    await expect(
      buildTableChartData(
        resolve(
          { ...mapping, scope: 'aggregate', groupKeys: ['unknown'] },
          {},
          () => true,
        ),
      ),
    ).rejects.toThrow('Unknown chart group')
  })

  it('cancels data from a stale filtered or aggregate model', async () => {
    for (const scope of ['filtered', 'aggregate'] as const) {
      const { source, deactivate } = fixture()
      const chart = createTableChartScope(source)(
        {
          ...mapping,
          scope,
          series: [{ column: scope === 'aggregate' ? 'sum' : 'sales' }],
        },
        {},
        () => true,
      )
      await expect(
        buildTableChartData({
          ...chart,
          valueMethod: (v) => {
            deactivate()
            return Number(v)
          },
        }),
      ).rejects.toBeInstanceOf(TableDataBatchConflictError)
    }
  })
})
