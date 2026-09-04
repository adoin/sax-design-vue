import { nextTick } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { SPagination } from '@vuesax-alpha/components/pagination'
import Table from '../src/table.vue'
import type {
  TableColumn,
  TableInstance,
  TablePagerConfig,
  TableRow,
} from '../src/table'

beforeAll(() =>
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  ),
)
afterAll(() => vi.unstubAllGlobals())
const data = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
  team: i % 2 ? 'B' : 'A',
}))
const columns: TableColumn[] = [
  { type: 'seq', width: 60 },
  { field: 'name', title: 'Name', sortable: true },
  { field: 'team', title: 'Team', filters: [{ label: 'A', value: 'A' }] },
]
const visible = (wrapper: ReturnType<typeof mount>) =>
  wrapper
    .findAll('.s-table__data-row')
    .map((row) => row.findAll('.s-table__data-cell')[1].text())
const flip = async (wrapper: ReturnType<typeof mount>, page: number) => {
  wrapper.findComponent(SPagination).vm.$emit('update:current-page', page)
  await nextTick()
}

describe('Table built-in pagination', () => {
  it('is opt-in and slices local rows with continuous sequence numbers', async () => {
    const wrapper = mount(Table, { props: { data, columns } })
    expect(visible(wrapper)).toHaveLength(5)
    expect(wrapper.findComponent(SPagination).exists()).toBe(false)
    await wrapper.setProps({ pagerConfig: { pageSize: 2 } })
    expect(visible(wrapper)).toEqual(['Item 1', 'Item 2'])
    expect(wrapper.findComponent(SPagination).props('total')).toBe(5)
    await flip(wrapper, 2)
    expect(visible(wrapper)).toEqual(['Item 3', 'Item 4'])
    expect(wrapper.find('.s-table__data-cell').text()).toBe('3')
    await flip(wrapper, 3)
    expect(visible(wrapper)).toEqual(['Item 5'])
    await wrapper.setProps({ pagerConfig: false })
    expect(visible(wrapper)).toHaveLength(5)
    wrapper.unmount()
  })

  it('synchronizes controlled config and resets the page on size changes', async () => {
    const wrapper = mount(Table, {
      props: {
        data,
        columns,
        pagerConfig: { currentPage: 2, pageSize: 2, pageSizes: [2, 4] },
      },
    })
    wrapper.findComponent(SPagination).vm.$emit('update:page-size', 4)
    await nextTick()
    const config = wrapper
      .emitted('update:pagerConfig')
      ?.at(-1)?.[0] as TablePagerConfig
    expect(config).toEqual({ currentPage: 1, pageSize: 4, pageSizes: [2, 4] })
    expect(wrapper.emitted('pageChange')).toEqual([
      [{ currentPage: 1, pageSize: 4, total: 5, type: 'size' }],
    ])
    await wrapper.setProps({ pagerConfig: config })
    expect(visible(wrapper)).toHaveLength(4)
    await wrapper.setProps({ loading: true })
    await flip(wrapper, 2)
    expect(wrapper.emitted('pageChange')).toHaveLength(1)
    wrapper.unmount()
  })

  it('sorts and filters before paging, resets queries and clamps removed pages', async () => {
    const wrapper = mount(Table, {
      props: { data, columns, pagerConfig: { pageSize: 2 } },
    })
    const vm = wrapper.vm as unknown as TableInstance
    await flip(wrapper, 3)
    vm.setSort([{ field: 'name', order: 'desc' }])
    await nextTick()
    expect(visible(wrapper)).toEqual(['Item 5', 'Item 4'])
    await flip(wrapper, 2)
    vm.setFilters({ team: ['A'] })
    await nextTick()
    expect(visible(wrapper)).toEqual(['Item 5', 'Item 3'])
    expect(wrapper.findComponent(SPagination).props('total')).toBe(3)
    await flip(wrapper, 2)
    await wrapper.setProps({ data: [data[0]] })
    expect(visible(wrapper)).toEqual(['Item 1'])
    expect(wrapper.emitted('pageChange')?.at(-1)?.[0]).toMatchObject({
      currentPage: 1,
      type: 'clamp',
    })
    await wrapper.setProps({ data: [] })
    expect(visible(wrapper)).toEqual([])
    expect(wrapper.findComponent(SPagination).props('total')).toBe(0)
    wrapper.unmount()
  })

  it('selects only eligible current-page rows and retains reserved selections', async () => {
    const wrapper = mount(Table, {
      props: {
        data,
        columns: [{ type: 'checkbox', width: 60 }, ...columns.slice(1)],
        row: [],
        pagerConfig: { pageSize: 2 },
        selectionConfig: {
          reserve: true,
          checkMethod: ({ row }: { row: TableRow }) => row.id !== 2,
        },
      },
    })
    const vm = wrapper.vm as unknown as TableInstance
    vm.selectAll()
    expect(wrapper.emitted('update:row')?.at(-1)?.[0]).toEqual([data[0]])
    await wrapper.setProps({ row: [data[0]] })
    await flip(wrapper, 2)
    expect(wrapper.emitted('update:row')).toHaveLength(1)
    vm.selectAll()
    const selected = wrapper.emitted('update:row')?.at(-1)?.[0] as TableRow[]
    expect(selected.map((row) => row.id)).toEqual([1, 3, 4])
    await wrapper.setProps({ row: selected })
    await flip(wrapper, 1)
    expect(wrapper.find('.s-table__data-row input').element).toHaveProperty(
      'checked',
      true,
    )
    vm.selectAll(false)
    expect(wrapper.emitted('update:row')?.at(-1)?.[0]).toEqual([
      data[2],
      data[3],
    ])
    wrapper.unmount()
  })

  it('prunes selections outside the current page when not reserved', async () => {
    const wrapper = mount(Table, {
      props: {
        data,
        columns: [{ type: 'checkbox' }, ...columns],
        row: [data[0]],
        pagerConfig: { pageSize: 2 },
      },
    })
    await flip(wrapper, 2)
    expect(wrapper.emitted('update:row')?.at(-1)?.[0]).toEqual([])
    wrapper.unmount()
  })

  it('does not slice remote data and offsets remote sequence numbers', async () => {
    const wrapper = mount(Table, {
      props: {
        data: data.slice(0, 2),
        columns,
        pagerConfig: { remote: true, total: 100, currentPage: 3, pageSize: 2 },
      },
    })
    expect(visible(wrapper)).toEqual(['Item 1', 'Item 2'])
    expect(wrapper.find('.s-table__data-cell').text()).toBe('5')
    await flip(wrapper, 4)
    expect(wrapper.emitted('pageChange')?.at(-1)?.[0]).toEqual({
      currentPage: 4,
      pageSize: 2,
      total: 100,
      type: 'current',
    })
    expect(visible(wrapper)).toHaveLength(2)
    wrapper.unmount()
  })

  it('keeps expanded descendants on their root page including lazy children', async () => {
    const treeData = [
      { id: 'root', name: 'Root', hasChildren: true },
      { id: 'other', name: 'Other' },
    ]
    const wrapper = mount(Table, {
      props: {
        data: treeData,
        columns: columns.map((column) =>
          column.field === 'name' ? { ...column, treeNode: true } : column,
        ),
        pagerConfig: { pageSize: 1 },
        treeConfig: {
          hasChildren: 'hasChildren',
          load: async () => [{ id: 'child', name: 'Child' }],
        },
      },
    })
    await wrapper.find('.s-table__tree-toggle').trigger('click')
    await flushPromises()
    expect(visible(wrapper)).toEqual(['Root', 'Child'])
    expect(wrapper.findComponent(SPagination).props('total')).toBe(2)
    await flip(wrapper, 2)
    expect(visible(wrapper)).toEqual(['Other'])
    await flip(wrapper, 1)
    expect(visible(wrapper)).toEqual(['Root', 'Child'])
    wrapper.unmount()
  })

  it('virtualizes within the page instead of the full local data', async () => {
    const wrapper = mount(Table, {
      props: {
        data: Array.from({ length: 100 }, (_, i) => ({
          id: i,
          name: `Item ${i}`,
        })),
        columns,
        pagerConfig: { pageSize: 10 },
        virtualConfig: { height: 200, horizontal: true, dynamic: true },
      },
    })
    await flip(wrapper, 5)
    const rows = wrapper.findComponent({ name: 'SVirtualList' }).props('items')
    expect(rows).toHaveLength(10)
    expect(rows[0].row.id).toBe(40)
    expect(rows[9].row.id).toBe(49)
    wrapper.unmount()
  })

  it('reads generated sources only within the page using global row indices', async () => {
    const row = vi.fn((index: number) => ({ id: index, name: `Item ${index}` }))
    const wrapper = mount(Table, {
      props: {
        virtualSource: {
          rowCount: 100_000,
          columnCount: 100_000,
          row,
          rowKey: (index: number) => index,
          column: (index: number) => ({
            field: 'name',
            title: `Column ${index}`,
          }),
          columnWidth: 120,
        },
        virtualConfig: { height: 200, horizontal: true, dynamic: true },
        pagerConfig: { currentPage: 10, pageSize: 2 },
      },
    })
    await nextTick()
    const virtualList = wrapper.findComponent({ name: 'SVirtualList' })
    expect(virtualList.props('count')).toBe(2)
    // jsdom has no viewport layout; exercise the exact on-demand row/key
    // callbacks supplied to the virtual list instead of forcing fake DOM sizes.
    expect(virtualList.props('itemAt')(0).row.id).toBe(18)
    expect(virtualList.props('itemAt')(1).row.id).toBe(19)
    expect(virtualList.props('itemKeyAt')(0)).toBe(18)
    expect(row.mock.calls.length).toBeGreaterThan(0)
    expect(row.mock.calls.every(([index]) => index >= 18 && index <= 19)).toBe(
      true,
    )
    expect(wrapper.findComponent(SPagination).props('total')).toBe(100_000)
    await wrapper.setProps({ pagerConfig: { currentPage: 11, pageSize: 2 } })
    const nextVirtualList = wrapper.findComponent({ name: 'SVirtualList' })
    expect(nextVirtualList.vm).not.toBe(virtualList.vm)
    expect(nextVirtualList.props('itemAt')(0).row.id).toBe(20)
    expect(nextVirtualList.props('itemKeyAt')(0)).toBe(20)
    wrapper.unmount()
  })
})
