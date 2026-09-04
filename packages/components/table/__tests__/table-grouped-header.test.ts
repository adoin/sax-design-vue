import { h, nextTick, ref } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Table from '../src/table.vue'
import TableColumnComponent from '../src/table-column.vue'
import { flattenTableColumns } from '../src/composables/table-column-tree'
import type { TableColumn } from '../src/table'

const columns: TableColumn[] = [
  { field: 'id', title: 'ID', width: 70, fixed: 'left' },
  {
    title: 'Profile',
    children: [
      { field: 'name', title: 'Name', minWidth: 160, sortable: true },
      {
        title: 'Details',
        children: [
          {
            field: 'team',
            title: 'Team',
            width: 140,
            filters: [{ label: 'Design', value: 'Design' }],
          },
          { field: 'city', title: 'City', minWidth: 180 },
        ],
      },
    ],
  },
  { field: 'status', title: 'Status', width: 100, fixed: 'right' },
]
const data = [
  { id: 1, name: 'Zoe', team: 'Design', city: 'Paris', status: 'Ready' },
  { id: 2, name: 'Amy', team: 'Engineering', city: 'London', status: 'Ready' },
]
const groups = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findAll('.is-group-header')
const scrollDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollTo',
)

describe('grouped table headers', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    )
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(600)
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(600)
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(200)
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(200)
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      configurable: true,
      value(this: HTMLElement, options: ScrollToOptions) {
        if (options.left != null) this.scrollLeft = options.left
        if (options.top != null) this.scrollTop = options.top
        this.dispatchEvent(new Event('scroll'))
      },
    })
  })
  afterEach(() => {
    if (scrollDescriptor)
      Object.defineProperty(HTMLElement.prototype, 'scrollTo', scrollDescriptor)
    else Reflect.deleteProperty(HTMLElement.prototype, 'scrollTo')
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('spans nested groups and keeps sorting, filtering and resizing on leaves', async () => {
    const wrapper = mount(Table, {
      props: { data, columns, resizeConfig: true },
    })
    expect(
      groups(wrapper).map((cell) => [
        cell.text(),
        cell.attributes('aria-colspan'),
      ]),
    ).toEqual([
      ['Profile', '3'],
      ['Details', '2'],
    ])
    const id = wrapper.get('[role="columnheader"][data-column-index="0"]')
    expect(id.attributes('aria-rowspan')).toBe('3')
    expect(wrapper.get('[role="table"]').attributes('aria-rowcount')).toBe('5')
    expect(wrapper.get('.s-table__data-row').attributes('aria-rowindex')).toBe(
      '4',
    )
    expect(
      wrapper.findAll('.s-table__data-row')[0].findAll('[role="cell"]'),
    ).toHaveLength(5)
    expect(wrapper.findAll('.s-table__resize-handle')).toHaveLength(5)
    expect(groups(wrapper).every((cell) => !cell.find('button').exists())).toBe(
      true,
    )
    const name = wrapper.get(
      '[role="columnheader"][data-column-index="1"]:not(.is-group-header)',
    )
    await name.get('button').trigger('click')
    expect(wrapper.findAll('.s-table__data-row')[0].text()).toContain('Amy')
    wrapper.vm.setFilters({ team: ['Design'] })
    await nextTick()
    expect(wrapper.findAll('.s-table__data-row')).toHaveLength(1)
    expect(wrapper.get('.s-table__data-row').text()).toContain('Zoe')
    expect(columns[1].children?.[0].width).toBeUndefined()
    wrapper.unmount()
  })

  it('projects groups after hiding, reordering and splitting fixed partitions', async () => {
    const wrapper = mount(Table, { props: { data, columns } })
    await wrapper.setProps({
      columnState: [
        { key: 'team', hidden: true },
        { key: 'city', fixed: 'right' },
      ],
    })
    expect(
      groups(wrapper).map((cell) => [
        cell.text(),
        cell.attributes('aria-colspan'),
      ]),
    ).toEqual([
      ['Profile', '1'],
      ['Profile', '1'],
      ['Details', '1'],
    ])
    const right = groups(wrapper).filter((cell) =>
      cell.classes().includes('is-fixed-right'),
    )
    expect(right).toHaveLength(2)
    expect(right[0].attributes('style')).toContain('right: calc(100px)')
    await wrapper.setProps({
      columnState: [
        { key: 'id', fixed: false, order: 2 },
        { key: 'team', order: 0 },
      ],
    })
    expect(
      groups(wrapper).filter((cell) => cell.text() === 'Profile'),
    ).toHaveLength(2)
    await wrapper.setProps({
      columnState: ['name', 'team', 'city'].map((key) => ({
        key,
        hidden: true,
      })),
    })
    expect(groups(wrapper)).toHaveLength(0)
    expect(wrapper.findAll('[role="columnheader"]')).toHaveLength(2)
    wrapper.unmount()
  })

  it('registers nested declarations through the columns slot without invoking cell slots early', async () => {
    const visible = ref(true)
    const label = ref('Contact')
    const wrapper = mount(Table, {
      props: { data },
      slots: {
        default: () => [
          h(
            TableColumnComponent,
            { title: label.value, fixed: 'left' },
            {
              columns: () => [
                h(
                  TableColumnComponent,
                  { field: 'name', title: 'Name' },
                  {
                    default: ({ row }: { row: (typeof data)[number] }) =>
                      `Hello ${row.name}`,
                  },
                ),
                visible.value
                  ? h(
                      TableColumnComponent,
                      { title: 'Location' },
                      {
                        columns: () =>
                          h(TableColumnComponent, {
                            field: 'city',
                            title: 'City',
                            fixed: false,
                          }),
                      },
                    )
                  : null,
              ],
              header: () => `Group: ${label.value}`,
            },
          ),
        ],
      },
    })
    await flushPromises()
    expect(groups(wrapper).map((cell) => cell.text())).toEqual([
      'Group: Contact',
      'Group: Contact',
      'Location',
    ])
    expect(wrapper.get('.s-table__data-row').text()).toContain('Hello Zoe')
    expect(wrapper.get('[role="cell"]').classes()).toContain('is-fixed-left')
    label.value = 'Person'
    visible.value = false
    await flushPromises()
    expect(groups(wrapper).map((cell) => cell.text())).toEqual([
      'Group: Person',
    ])
    expect(
      wrapper.findAll('.s-table__data-row')[0].findAll('[role="cell"]'),
    ).toHaveLength(1)
    // Explicit configuration continues to win over mounted declarations.
    await wrapper.setProps({ columns: [{ field: 'id', title: 'Only ID' }] })
    expect(groups(wrapper)).toHaveLength(0)
    expect(wrapper.get('[role="columnheader"]').text()).toBe('Only ID')
    wrapper.unmount()
  })

  it('inherits fixed sides without mutating consumer trees and ignores empty groups', () => {
    const leaf = { field: 'name' }
    const result = flattenTableColumns([
      { title: 'Empty', children: [] },
      {
        title: 'Person',
        fixed: 'left',
        children: [leaf, { field: 'id', fixed: false }],
      },
    ])
    expect(result.leaves.map((column) => column.fixed)).toEqual(['left', false])
    expect(leaf).toEqual({ field: 'name' })
    expect(result.originals[0]).toBe(leaf)
  })

  it('shares leaf selection and lazy-tree behavior with grouped headers and pagination', async () => {
    const parent = Object.freeze({ id: 1, name: 'Parent', expandable: true })
    const child = Object.freeze({ id: 2, name: 'Child' })
    const load = vi.fn(async () => [child])
    const wrapper = mount(Table, {
      props: {
        data: [parent],
        columns: [
          {
            title: 'Members',
            fixed: 'left',
            children: [
              { key: 'selection', type: 'checkbox', width: 50 },
              { field: 'name', title: 'Name', treeNode: true, width: 160 },
            ],
          },
        ],
        highlight: [],
        rowKey: 'id',
        treeConfig: { hasChildren: 'expandable', load },
        pagerConfig: { pageSize: 5 },
        virtualConfig: { height: 200, dynamic: true, horizontal: true },
      },
    })
    await wrapper.vm.toggleRowExpand(parent, true)
    await flushPromises()
    expect(load).toHaveBeenCalledTimes(1)
    expect(wrapper.findAll('.s-table__data-row')).toHaveLength(2)
    expect(groups(wrapper)[0].attributes('aria-colspan')).toBe('2')
    expect(wrapper.get('.s-table__data-head-cell').classes()).toContain(
      'is-fixed-left',
    )
    wrapper.vm.selectAll()
    expect(wrapper.emitted('update:highlight')?.at(-1)?.[0]).toEqual([
      parent,
      child,
    ])
    expect(parent).toEqual({ id: 1, name: 'Parent', expandable: true })
    await wrapper.setProps({ showHeader: false })
    expect(wrapper.findAll('[role="columnheader"]')).toHaveLength(0)
    expect(wrapper.get('.s-table__data-row').attributes('aria-rowindex')).toBe(
      '1',
    )
    wrapper.unmount()
  })

  it('reads grouped paths only for the generated window and preserves depth at the far end', async () => {
    const column = vi.fn((index: number) => ({
      field: `c${index}`,
      title: `Column ${index}`,
      width: 120,
    }))
    const headerPath = vi.fn((index: number) => [
      {
        key: `g${Math.floor(index / 10)}`,
        title: `Group ${Math.floor(index / 10)}`,
      },
    ])
    const wrapper = mount(Table, {
      props: {
        virtualSource: {
          rowCount: 1_000_000,
          columnCount: 100_000,
          row: (index: number) => ({ id: index }),
          rowKey: (index: number) => index,
          column,
          columnWidth: 120,
          fixedLeftCount: 1,
          fixedRightCount: 1,
          headerDepth: 3,
          headerPath,
        },
        virtualConfig: {
          height: 200,
          dynamic: true,
          horizontal: true,
          columnOverscan: 1,
        },
      },
    })
    await flushPromises()
    expect(headerPath.mock.calls.length).toBeLessThan(100)
    expect(wrapper.findAll('[role="columnheader"]').length).toBeLessThan(20)
    expect(wrapper.get('[role="table"]').attributes('aria-colcount')).toBe(
      '100000',
    )
    wrapper.vm.scrollToColumn(99_998, 'end')
    wrapper.vm.scrollToRow(999_999, 'end')
    await flushPromises()
    expect(
      wrapper
        .findAll('[role="columnheader"]')
        .some((cell) => cell.text() === 'Column 99998'),
    ).toBe(true)
    expect(groups(wrapper).some((cell) => cell.text() === 'Group 9999')).toBe(
      true,
    )
    expect(
      wrapper
        .get('[role="columnheader"]:not(.is-group-header)')
        .attributes('aria-rowspan'),
    ).toBe('2')
    expect(wrapper.findAll('.s-table__data-row').length).toBeLessThan(30)
    expect(headerPath.mock.calls.length).toBeLessThan(200)
    wrapper.unmount()
  })
})
