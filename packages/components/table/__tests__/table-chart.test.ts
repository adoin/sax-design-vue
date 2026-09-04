import { defineComponent, h, nextTick, ref, shallowRef } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Table from '../src/table.vue'
import type {
  TableChartOptions,
  TableExposes,
  TableProps,
  TableRow,
} from '../src/table'

const cleanups: Array<() => void> = []
const originalScroll = HTMLElement.prototype.scrollIntoView
beforeEach(() => {
  HTMLElement.prototype.scrollIntoView = vi.fn()
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  )
})
afterEach(() => {
  cleanups.splice(0).forEach((dispose) => dispose())
  vi.unstubAllGlobals()
  HTMLElement.prototype.scrollIntoView = originalScroll
})
const request: TableChartOptions = {
  scope: 'filtered',
  category: 'name',
  series: [{ column: 'count' }],
}
function host(
  extra: Partial<TableProps> = {},
  initial: TableRow[] = [
    { id: 1, name: 'A', count: 2 },
    { id: 2, name: 'B', count: 8 },
  ],
) {
  const data = ref(initial)
  const settings = shallowRef(extra)
  const api = shallowRef<TableExposes>()
  const columns: TableProps['columns'] = [
    { field: 'name', title: 'Name', editor: true, fixed: 'left' },
    { field: 'count', title: 'Count', fixed: 'right' },
  ]
  const root = mount(
    defineComponent({
      setup: () => () =>
        h(Table, {
          ref: api,
          data: data.value,
          rowKey: 'id',
          chartConfig: true,
          columns,
          ...settings.value,
        }),
    }),
    { attachTo: document.body },
  )
  cleanups.push(() => root.unmount())
  return { root, api, data, settings }
}

describe('Table chart integration', () => {
  it('cancels a generated scan when its row provider changes in place', async () => {
    const source = ref({
      rowCount: 2000,
      columnCount: 2,
      columnWidth: 140,
      row: (index: number) => ({ id: index, name: `R${index}`, count: index }),
      column: (index: number) => ({
        key: String(index),
        field: index ? 'count' : 'name',
        title: String(index),
      }),
    })
    const { api } = host({
      virtualSource: source.value,
      virtualConfig: { enabled: true, horizontal: true },
      chartConfig: { maxPoints: 5000 },
    })
    const pending = api.value!.getChartData({
      scope: 'filtered',
      category: 0,
      series: [{ column: 1 }],
    })
    source.value.row = (index) => ({
      id: index,
      name: `R${index}`,
      count: index + 10,
    })
    expect(await pending).toMatchObject({ success: false, reason: 'cancelled' })
    const next = await api.value!.getChartData({
      scope: 'selection',
      bounds: { rowStart: 0, rowEnd: 1, colStart: 0, colEnd: 2 },
      category: 0,
      series: [{ column: 1 }],
    })
    expect(next.scan?.data.series[0].values).toEqual([10])
  })
  it('uses expanded loaded tree rows before paging and preserves existing aggregate scopes', async () => {
    const load = vi.fn(async () => [])
    const { api, data } = host(
      {
        treeConfig: { children: 'children', load },
        pagerConfig: { pageSize: 1 },
        groupConfig: {
          fields: ['name'],
          defaultExpanded: false,
          summary: true,
          summaryScope: 'filtered',
          aggregates: [{ key: 'total', field: 'count', method: 'sum' }],
        },
      },
      [
        {
          id: 1,
          name: 'Parent',
          count: 2,
          children: [{ id: 2, name: 'Child', count: 3 }],
        },
        { id: 3, name: 'Other', count: 8 },
      ],
    )
    expect(
      (await api.value!.getChartData(request)).scan?.data.categories,
    ).toEqual(['Parent', 'Other'])
    await api.value!.toggleRowExpand(data.value[0], true)
    expect(
      (await api.value!.getChartData(request)).scan?.data.categories,
    ).toEqual(['Parent', 'Child', 'Other'])
    const groups = await api.value!.getChartData({
      scope: 'aggregate',
      series: [{ column: 'total' }],
    })
    expect(groups.scan?.data.series[0].values).toEqual([5])
    const summary = await api.value!.getChartData({
      scope: 'aggregate',
      aggregate: 'summary',
      series: [{ column: 'total' }],
    })
    expect(summary.scan?.data.series[0].values).toEqual([13])
    expect(load).not.toHaveBeenCalled()
  })
  it('keeps the open snapshot while refreshing and ignores equivalent config objects', async () => {
    const chartConfig = {
      maxPoints: 5000,
      adapter: { mount: () => ({ dispose() {} }) },
    }
    const { api, settings } = host(
      { chartConfig, virtualConfig: { enabled: true } },
      Array.from({ length: 2000 }, (_, id) => ({
        id,
        name: `R${id}`,
        count: id,
      })),
    )
    const initial = await api.value!.openChart({
      ...request,
      scope: 'selection',
      bounds: { rowStart: 0, rowEnd: 1, colStart: 0, colEnd: 2 },
    })
    expect(initial.success).toBe(true)
    const refresh = api.value!.openChart(request)
    expect(api.value!.getChartState()).toMatchObject({
      visible: true,
      pending: true,
      scan: initial.scan,
    })
    settings.value = { ...settings.value, chartConfig: { ...chartConfig } }
    await nextTick()
    expect((await refresh).success).toBe(true)
    expect(api.value!.getChartState().scan?.data.points).toHaveLength(2000)
    api.value!.closeChart()
    expect(api.value!.getChartState().visible).toBe(false)
  })
  it('extracts the last selected range of a two-axis generated source across the right fixed edge', async () => {
    const { api } = host({
      rangeConfig: { rowIndexOf: (key) => Number(key) },
      virtualConfig: { enabled: true, horizontal: true },
      virtualSource: {
        rowCount: 1_000_000,
        columnCount: 100_000,
        columnWidth: 140,
        fixedLeftCount: 1,
        fixedRightCount: 1,
        rowKey: (index) => index,
        row: (index) => ({ id: index, label: `R${index}`, value: index }),
        column: (index) => ({
          key: String(index),
          field: index === 99998 ? 'label' : 'value',
          title: String(index),
          width: 140,
        }),
      },
    })
    expect(
      await api.value!.setCellRange({
        anchor: { rowKey: 999995, columnKey: '99998' },
        focus: { rowKey: 999999, columnKey: '99999' },
      }),
    ).toBe(true)
    const result = await api.value!.getChartData({
      scope: 'selection',
      category: 99998,
      series: [{ column: 99999 }],
    })
    expect(result.error).toBeUndefined()
    expect(result.success).toBe(true)
    expect(result.scan?.data.series[0].values).toEqual([
      999995, 999996, 999997, 999998, 999999,
    ])
  })
  it('is disabled by default, and extraction never requires a drawing adapter', async () => {
    const { api, settings } = host({ chartConfig: false })
    expect(await api.value!.getChartData(request)).toMatchObject({
      success: false,
      reason: 'disabled',
    })
    settings.value = { chartConfig: true }
    await nextTick()
    expect(await api.value!.openChart(request)).toMatchObject({
      success: false,
      reason: 'adapter',
    })
    const result = await api.value!.getChartData(request)
    expect(result.success).toBe(true)
    expect(result.scan?.data.series[0].values).toEqual([2, 8])
    expect(api.value!.getChartState().visible).toBe(false)
    expect(Object.isFrozen(result.scan?.data.series[0].values)).toBe(true)
  })
  it('uses filtered rows before local pagination', async () => {
    const { api } = host({ pagerConfig: { pageSize: 1 }, filterConfig: {} })
    expect(
      (await api.value!.getChartData(request)).scan?.data.categories,
    ).toEqual(['A', 'B'])
    api.value!.setFilters({ name: ['B'] })
    await nextTick()
    expect(
      (await api.value!.getChartData(request)).scan?.data.categories,
    ).toEqual(['B'])
  })
  it('reads selected visual columns across fixed regions and clears implicit selection snapshots', async () => {
    const { api } = host({ rangeConfig: true })
    await api.value!.setCellRange({
      anchor: { rowKey: 1, columnKey: 'name' },
      focus: { rowKey: 2, columnKey: 'count' },
    })
    expect(
      (await api.value!.getChartData({ ...request, scope: 'selection' })).scan
        ?.data.series[0].values,
    ).toEqual([2, 8])
    await api.value!.clearCellRange()
    expect(api.value!.getChartState().scan).toBeUndefined()
  })
  it('never opens a partial chart when a scan exceeds its budget', async () => {
    const { api } = host({
      chartConfig: {
        maxPoints: 1,
        adapter: { mount: () => ({ dispose() {} }) },
      },
    })
    const result = await api.value!.openChart(request)
    expect(result).toMatchObject({
      success: false,
      reason: 'limit',
      scan: { complete: false, limit: 'points' },
    })
    expect(api.value!.getChartState().visible).toBe(false)
  })
  it('cancels asynchronous scans without letting old work overwrite new results', async () => {
    const { api } = host(
      { chartConfig: { maxPoints: 5000 }, virtualConfig: { enabled: true } },
      Array.from({ length: 2000 }, (_, id) => ({
        id,
        name: `R${id}`,
        count: id,
      })),
    )
    const pending = api.value!.getChartData(request)
    api.value!.cancelChart()
    expect(await pending).toMatchObject({ success: false, reason: 'cancelled' })
    const next = await api.value!.getChartData({
      ...request,
      scope: 'selection',
      bounds: { rowStart: 0, rowEnd: 1, colStart: 0, colEnd: 2 },
    })
    expect(next.scan?.data.categories).toEqual(['R0'])
    expect(api.value!.getChartState().pending).toBe(false)
  })
  it('rejects pre-aborted requests and pending edits', async () => {
    const { api } = host({ editConfig: true })
    const signal = new AbortController()
    signal.abort()
    expect(
      await api.value!.getChartData({ ...request, signal: signal.signal }),
    ).toMatchObject({ success: false, reason: 'cancelled' })
    await api.value!.startEdit(0, 'name')
    expect(await api.value!.getChartData(request)).toMatchObject({
      success: false,
      reason: 'editing',
    })
  })
  it('uses remote group statistics without enumerating generated source rows', async () => {
    const row = vi.fn((index: number) => ({
      id: index,
      name: `R${index}`,
      count: index,
    }))
    const { api } = host({
      virtualConfig: { enabled: true, horizontal: true },
      virtualSource: {
        rowCount: 1_000_000,
        columnCount: 2,
        columnWidth: 140,
        row,
        column: (index) => ({
          field: index ? 'count' : 'name',
          title: String(index),
        }),
      },
      groupConfig: {
        mode: 'remote',
        remote: {
          groups: [
            {
              key: 'g',
              field: 'department',
              value: 'A',
              rowStart: 0,
              rowCount: 1_000_000,
              aggregates: { total: 99 },
            },
          ],
          summary: { total: 99 },
        },
      },
    })
    row.mockClear()
    const result = await api.value!.getChartData({
      scope: 'aggregate',
      series: [{ column: 'total' }],
    })
    expect(result.scan?.data.series[0].values).toEqual([99])
    expect(row).not.toHaveBeenCalled()
  })
  it('invalidates pending work on unmount and data replacement', async () => {
    const { api, data, root } = host(
      { chartConfig: { maxPoints: 5000 }, virtualConfig: { enabled: true } },
      Array.from({ length: 2000 }, (_, id) => ({
        id,
        name: `R${id}`,
        count: id,
      })),
    )
    const first = api.value!.getChartData(request)
    data.value = [...data.value]
    await nextTick()
    expect(await first).toMatchObject({ success: false, reason: 'cancelled' })
    const second = api.value!.getChartData(request)
    root.unmount()
    expect(await second).toMatchObject({ success: false, reason: 'cancelled' })
    cleanups.pop()
  })
})
