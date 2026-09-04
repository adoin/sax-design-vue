import { h, nextTick } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import Table from '../src/table.vue'
import TableHeaderCell from '../src/table-header-cell.vue'
import TableColumnComponent from '../src/table-column.vue'
import type {
  TableColumn,
  TableFilterSlotParams,
  TableInstance,
  TableRow,
  TableSortMethod,
} from '../src/table'

const columns: TableColumn[] = [
  { field: 'name', title: 'Name', sortable: true },
  { field: 'score', title: 'Score', sortable: true },
  {
    field: 'team',
    title: 'Team',
    filters: [
      { label: 'Design', value: 'Design' },
      { label: 'Dev', value: 'Dev' },
    ],
  },
]
beforeAll(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  )
})
afterAll(() => vi.unstubAllGlobals())
const rows = [
  { id: 1, name: 'Item 10', score: 2, team: 'Design' },
  { id: 2, name: 'Item 2', score: 3, team: 'Dev' },
  { id: 3, name: 'Item 1', score: 2, team: 'Dev' },
]
const names = (wrapper: ReturnType<typeof mount>) =>
  wrapper
    .findAll('.s-table__data-row')
    .map((row) => row.findAll('.s-table__data-cell')[0].text())

describe('Table query and selection features', () => {
  it('queries normal data before virtualization and selects beyond the viewport', async () => {
    const data = Array.from({ length: 500 }, (_, index) => ({
      id: index,
      name: `Item ${index}`,
      team: index % 2 ? 'Dev' : 'Design',
    }))
    const wrapper = mount(Table, {
      props: {
        data,
        columns: [{ type: 'checkbox', width: 60 }, ...columns],
        virtualConfig: { height: 200, estimateSize: 32 },
        row: [],
      },
    })
    const vm = wrapper.vm as unknown as TableInstance
    vm.setFilters({ team: ['Dev'] })
    vm.setSort([{ field: 'name', order: 'desc' }])
    await nextTick()
    expect(wrapper.findAll('.s-table__data-row').length).toBeLessThan(40)
    const virtualRows = wrapper
      .findComponent({ name: 'SVirtualList' })
      .props('items') as Array<{ row: TableRow }>
    expect(virtualRows).toHaveLength(250)
    expect(virtualRows[0].row.name).toBe('Item 499')
    vm.selectAll()
    const selected = wrapper.emitted('update:row')?.at(-1)?.[0] as TableRow[]
    expect(selected).toHaveLength(250)
    expect(selected.every((row) => row.team === 'Dev')).toBe(true)
    wrapper.unmount()
  })

  it('never enumerates a generated source when query state or select-all changes', async () => {
    const row = vi.fn((index: number) => ({ id: index, name: `Item ${index}` }))
    const column = vi.fn((index: number) => ({
      field: `field${index}`,
      title: `${index}`,
      sortable: true,
      width: 120,
    }))
    const wrapper = mount(Table, {
      props: {
        virtualSource: {
          rowCount: 100_000,
          columnCount: 100_000,
          row,
          column,
          columnWidth: 120,
        },
        virtualConfig: { height: 240, horizontal: true, dynamic: true },
      },
    })
    const vm = wrapper.vm as unknown as TableInstance
    vm.setSort([{ field: 'field1', order: 'asc' }])
    vm.setFilters({ field1: ['missing'] })
    vm.selectAll()
    await nextTick()
    expect(row.mock.calls.length).toBeLessThan(100)
    expect(column.mock.calls.length).toBeLessThan(100)
    expect(wrapper.findAll('.s-table__data-row').length).toBeGreaterThan(0)
    expect(wrapper.emitted('update:row')).toBeUndefined()
    wrapper.unmount()
  })

  it('selects each sort direction independently and clears the active direction', async () => {
    const data = rows.map((row) => Object.freeze({ ...row }))
    const wrapper = mount(Table, { props: { data, columns } })
    const [ascending, descending] = wrapper.findAll('.s-table__sort-button')
    expect(wrapper.findAll('.s-table__sort-button')).toHaveLength(4)
    await ascending.trigger('click')
    expect(ascending.attributes('aria-pressed')).toBe('true')
    expect(descending.attributes('aria-pressed')).toBe('false')
    expect(names(wrapper)).toEqual(['Item 1', 'Item 2', 'Item 10'])
    expect(wrapper.find('[role="columnheader"]').attributes('aria-sort')).toBe(
      'ascending',
    )
    await descending.trigger('click')
    expect(names(wrapper)).toEqual(['Item 10', 'Item 2', 'Item 1'])
    expect(descending.attributes('aria-pressed')).toBe('true')
    await descending.trigger('click')
    expect(names(wrapper)).toEqual(data.map((row) => row.name))
    expect(wrapper.emitted('sortChange')).toHaveLength(3)
    await descending.trigger('click')
    expect(names(wrapper)).toEqual(['Item 10', 'Item 2', 'Item 1'])
    await ascending.trigger('click')
    await ascending.trigger('click')
    expect(names(wrapper)).toEqual(data.map((row) => row.name))
    expect(data.map((row) => row.id)).toEqual([1, 2, 3])
    wrapper.unmount()
  })

  it('supports multi-sort priority and controlled sort state', async () => {
    const wrapper = mount(Table, {
      props: {
        data: rows,
        columns,
        sortConfig: { multiple: true },
        sortBy: [],
      },
    })
    const vm = wrapper.vm as unknown as TableInstance
    vm.setSort([
      { field: 'score', order: 'asc' },
      { field: 'name', order: 'asc' },
    ])
    await nextTick()
    expect(names(wrapper)).toEqual(rows.map((row) => row.name))
    await wrapper.setProps({
      sortBy: [
        { field: 'score', order: 'asc' },
        { field: 'name', order: 'asc' },
      ],
    })
    expect(names(wrapper)).toEqual(['Item 1', 'Item 10', 'Item 2'])
    expect(
      wrapper.findAll('.s-table__sort-priority').map((item) => item.text()),
    ).toEqual(['2', '1'])
    await wrapper.findAll('.s-table__sort-button')[3].trigger('click')
    expect(wrapper.emitted('sortChange')?.at(-1)?.[0]).toEqual([
      { field: 'score', order: 'desc' },
      { field: 'name', order: 'asc' },
    ])
    // A controlled table waits for the parent to accept the requested direction.
    expect(names(wrapper)).toEqual(['Item 1', 'Item 10', 'Item 2'])
    await wrapper.setProps({ sortBy: [{ field: 'score', order: 'desc' }] })
    expect(wrapper.findAll('.s-table__sort-priority')).toHaveLength(0)
    expect(
      wrapper.findAll('.s-table__sort-button')[3].attributes('aria-pressed'),
    ).toBe('true')
    wrapper.unmount()
  })

  it('shows priorities only for multiple active sorts and hides them when one remains', async () => {
    const wrapper = mount(Table, {
      props: {
        data: rows,
        columns: columns.map((column) => ({ ...column, sortable: true })),
        sortConfig: { multiple: true },
      },
    })
    const priorities = () =>
      wrapper.findAll('.s-table__sort-priority').map((item) => item.text())
    const buttons = wrapper.findAll('.s-table__sort-button')
    expect(priorities()).toEqual([])
    await buttons[2].trigger('click')
    expect(priorities()).toEqual([])
    expect(buttons[2].attributes('aria-pressed')).toBe('true')
    await buttons[0].trigger('click')
    expect(priorities()).toEqual(['2', '1'])
    await buttons[4].trigger('click')
    expect(priorities()).toEqual(['2', '1', '3'])
    await buttons[2].trigger('click')
    expect(priorities()).toEqual(['1', '2'])
    await buttons[4].trigger('click')
    expect(priorities()).toEqual([])
    expect(buttons[0].attributes('aria-pressed')).toBe('true')
    await buttons[0].trigger('click')
    expect(priorities()).toEqual([])
    wrapper.unmount()
  })

  it.each<[string, TableSortMethod, string[]]>([
    ['numeric', 'number', ['2', '2', '10', '30']],
    ['lexical', 'string', ['10', '2', '2', '30']],
    ['boolean', (a, b) => Number(a) > Number(b), ['2', '2', '10', '30']],
    [
      'binary',
      (a, b) => (Number(a) > Number(b) ? 1 : 0),
      ['2', '2', '10', '30'],
    ],
    ['signed', (a, b) => Number(a) - Number(b), ['2', '2', '10', '30']],
  ])(
    'supports %s column comparators in both directions with stable ties',
    async (_, sortMethod, expected) => {
      const data = ['30', '2', '10', '2'].map((name, id) =>
        Object.freeze({ id, name }),
      )
      const wrapper = mount(Table, {
        props: {
          data,
          columns: [{ field: 'name', sortable: true, sortMethod }],
        },
      })
      const [asc, desc] = wrapper.findAll('.s-table__sort-button')
      await asc.trigger('click')
      expect(names(wrapper)).toEqual(expected)
      await desc.trigger('click')
      expect(names(wrapper)).toEqual([...expected].reverse())
      const records = wrapper.findAllComponents({ name: 'STableDataRow' })
      expect(
        records
          .filter((record) => record.props('flatRow').row.name === '2')
          .map((record) => record.props('flatRow').row.id),
      ).toEqual([1, 3])
      expect(data.map((row) => row.name)).toEqual(['30', '2', '10', '2'])
      wrapper.unmount()
    },
  )

  it('places missing and invalid numeric values last in either direction', async () => {
    const data = [
      null,
      '10',
      '',
      '2',
      'invalid',
      undefined,
      Number.NaN,
      Infinity,
    ].map((score, id) => ({ id, name: String(id), score }))
    const wrapper = mount(Table, {
      props: {
        data,
        columns: [
          columns[0],
          {
            field: 'score',
            sortable: true,
            sortMethod: 'number',
          },
        ],
      },
    })
    await wrapper.findAll('.s-table__sort-button')[2].trigger('click')
    expect(names(wrapper)).toEqual(['3', '1', '0', '2', '4', '5', '6', '7'])
    await wrapper.findAll('.s-table__sort-button')[3].trigger('click')
    expect(names(wrapper)).toEqual(['1', '3', '0', '2', '4', '5', '6', '7'])
    wrapper.unmount()
  })

  it('passes original row pairs to predicates and applies the next sort to ties', async () => {
    const comparator = vi.fn((a, b, rowA, rowB) => {
      expect(a).toBe(rowA.score)
      expect(b).toBe(rowB.score)
      return Number(a) > Number(b)
    })
    const wrapper = mount(Table, {
      props: {
        data: rows,
        columns: [columns[0], { ...columns[1], sortMethod: comparator }],
        sortConfig: {
          multiple: true,
          defaultSort: [
            { field: 'score', order: 'asc' },
            { field: 'name', order: 'asc' },
          ],
        },
      },
    })
    expect(names(wrapper)).toEqual(['Item 1', 'Item 10', 'Item 2'])
    expect(comparator).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('shares custom sorting with declarative columns', async () => {
    const wrapper = mount(Table, {
      props: {
        data: [
          { id: 1, name: '10' },
          { id: 2, name: '2' },
        ],
      },
      slots: {
        default: () =>
          h(TableColumnComponent, {
            field: 'name',
            sortable: true,
            sortMethod: 'number',
          }),
      },
    })
    await nextTick()
    await wrapper.find('.s-table__sort-button').trigger('click')
    expect(names(wrapper)).toEqual(['2', '10'])
    wrapper.unmount()
  })

  it('combines default and custom filters and clears them through the API', async () => {
    const wrapper = mount(Table, {
      props: {
        data: rows,
        columns: [
          ...columns,
          {
            field: 'score',
            key: 'score',
            title: 'Threshold',
            filterMethod: ({ value, values }) =>
              Number(value) >= Number(values[0]),
          },
        ],
      },
    })
    const vm = wrapper.vm as unknown as TableInstance
    vm.setFilters({ team: ['Dev'], score: [3] })
    await nextTick()
    expect(names(wrapper)).toEqual(['Item 2'])
    expect(wrapper.emitted('filterChange')?.[0]).toEqual([
      { team: ['Dev'], score: [3] },
    ])
    vm.clearFilters()
    await nextTick()
    expect(names(wrapper)).toHaveLength(3)
    wrapper.unmount()
  })

  it('uses remote query state without filtering or reordering local rows', async () => {
    const wrapper = mount(Table, {
      props: {
        data: rows,
        columns,
        sortConfig: { remote: true },
        filterConfig: { remote: true },
      },
    })
    const vm = wrapper.vm as unknown as TableInstance
    vm.setSort([{ field: 'name', order: 'asc' }])
    vm.setFilters({ team: ['Missing'] })
    await nextTick()
    expect(names(wrapper)).toEqual(rows.map((row) => row.name))
    expect(wrapper.emitted('sortChange')).toHaveLength(1)
    expect(wrapper.emitted('filterChange')).toHaveLength(1)
    wrapper.unmount()
  })

  it('sorts tree siblings and reveals matching descendants without changing expanded state', async () => {
    const data = [
      {
        id: 'root',
        name: 'Root',
        children: [
          { id: 'b', name: 'B', team: 'Dev' },
          { id: 'a', name: 'A', team: 'Design' },
        ],
      },
      { id: 'peer', name: 'Other', team: 'Other' },
    ]
    const wrapper = mount(Table, {
      props: {
        data,
        columns: columns.map((column) => ({
          ...column,
          treeNode: column.field === 'name',
        })),
        treeConfig: {},
      },
    })
    const vm = wrapper.vm as unknown as TableInstance
    vm.setFilters({ team: ['Dev'] })
    await nextTick()
    expect(names(wrapper)).toEqual(['Root', 'B'])
    expect(wrapper.emitted('update:expandedKeys')).toBeUndefined()
    vm.clearFilters()
    await nextTick()
    expect(names(wrapper)).toEqual(['Root', 'Other'])
    vm.setExpandedKeys(['root'])
    vm.setSort([{ field: 'name', order: 'asc' }])
    await nextTick()
    expect(names(wrapper)).toEqual(['Other', 'Root', 'A', 'B'])
    expect(data[0].children?.map((row) => row.name)).toEqual(['B', 'A'])
    wrapper.unmount()
  })

  it('selects all eligible filtered rows and preserves selections outside the filter', async () => {
    const wrapper = mount(Table, {
      props: {
        data: rows,
        columns: [{ type: 'checkbox', width: 60 }, ...columns],
        row: [],
        selectionConfig: {
          checkMethod: ({ row }: { row: TableRow }) => row.id !== 2,
        },
      },
    })
    const vm = wrapper.vm as unknown as TableInstance
    vm.selectAll()
    await nextTick()
    const selected = wrapper.emitted('update:row')?.at(-1)?.[0] as TableRow[]
    expect(selected.map((row) => row.id)).toEqual([1, 3])
    await wrapper.setProps({ row: selected })
    expect(wrapper.find('input[type="checkbox"]').element).toHaveProperty(
      'checked',
      true,
    )
    vm.setFilters({ team: ['Dev'] })
    await nextTick()
    vm.selectAll(false)
    expect(
      (wrapper.emitted('update:row')?.at(-1)?.[0] as TableRow[]).map(
        (row) => row.id,
      ),
    ).toEqual([1])
    wrapper.unmount()
  })

  it('keeps selection by row key across page replacements when reserve is enabled', async () => {
    const wrapper = mount(Table, {
      props: {
        data: rows,
        columns: [{ type: 'checkbox' }, ...columns],
        row: [rows[0]],
        selectionConfig: { reserve: true },
      },
    })
    await wrapper.setProps({
      data: [{ id: 9, name: 'Page 2', score: 1, team: 'Design' }],
    })
    expect(wrapper.emitted('update:row')).toBeUndefined()
    const replacement = { ...rows[0], name: 'Updated' }
    await wrapper.setProps({ data: [replacement] })
    expect(wrapper.emitted('update:row')?.at(-1)?.[0]).toEqual([replacement])
    expect(wrapper.find('.s-table__data-row').classes()).toContain(
      'is-selected',
    )
    wrapper.unmount()
  })

  it('prunes unreserved selection and uses a single object model for radio columns', async () => {
    const wrapper = mount(Table, {
      props: {
        data: rows,
        columns: [{ type: 'radio' }, ...columns],
        row: rows[0],
      },
    })
    await wrapper.findAll('input[type="radio"]')[1].setValue(true)
    expect(wrapper.emitted('update:row')?.at(-1)?.[0]).toEqual(rows[1])
    const before = wrapper.emitted('update:row')?.length
    await wrapper.findAll('.s-table__data-row')[2].trigger('click')
    expect(wrapper.emitted('update:row')).toHaveLength(before ?? 0)
    await wrapper.setProps({
      data: [{ id: 8, name: 'New', score: 1, team: 'Dev' }],
    })
    expect(wrapper.emitted('update:row')?.at(-1)?.[0]).toBeNull()
    wrapper.unmount()
  })

  it('renders ellipsis only when opted in and supports native title for clipped text', async () => {
    const wrapper = mount(Table, {
      props: {
        data: rows,
        columns,
        showOverflow: 'title',
        showHeaderOverflow: 'ellipsis',
      },
    })
    const content = wrapper.find('.s-table__cell-content')
    Object.defineProperties(content.element, {
      scrollWidth: { value: 200 },
      clientWidth: { value: 50 },
    })
    await content.trigger('mouseover')
    expect(content.attributes('title')).toBe('Item 10')
    expect(content.classes()).toContain('is-ellipsis')
    await wrapper.setProps({ showOverflow: false })
    expect(content.classes()).not.toContain('is-ellipsis')
    expect(content.attributes('title')).toBeUndefined()
    wrapper.unmount()
  })

  it('uses one shared tooltip and closes it when virtual content scrolls', async () => {
    const wrapper = mount(Table, {
      attachTo: document.body,
      props: {
        data: rows,
        columns,
        showOverflow: 'tooltip',
        showHeaderOverflow: true,
      },
    })
    const content = wrapper.find('.s-table__cell-content')
    Object.defineProperties(content.element, {
      scrollWidth: { value: 200 },
      clientWidth: { value: 50 },
    })
    await content.trigger('focusin')
    await flushPromises()
    expect(
      wrapper
        .findAllComponents({ name: 'SPopper' })
        .filter((item) => item.props('virtualTriggering')),
    ).toHaveLength(1)
    const sharedTooltip = wrapper
      .findAllComponents({ name: 'SPopper' })
      .find((item) => item.props('virtualTriggering'))!
    expect(sharedTooltip.vm.triggerRef).toBe(content.element)
    expect(
      document.querySelector('.s-table__overflow-tooltip')?.textContent,
    ).toBe('Item 10')
    const header = wrapper.find('.s-table__header-label')
    Object.defineProperties(header.element, {
      scrollWidth: { value: 160 },
      clientWidth: { value: 40 },
    })
    await header.trigger('mouseover')
    await flushPromises()
    expect(sharedTooltip.vm.triggerRef).toBe(header.element)
    expect(sharedTooltip.props('content')).toBe('Name')
    // Unclipped cells must never reuse the previous cell's tooltip.
    await wrapper.findAll('.s-table__cell-content')[1].trigger('mouseover')
    expect(sharedTooltip.props('visible')).toBe(false)
    await content.trigger('focusin')
    await wrapper.find('.s-table').trigger('scroll')
    await nextTick()
    const tooltip = wrapper
      .findAllComponents({ name: 'SPopper' })
      .find((item) => item.props('virtualTriggering'))
    expect(tooltip?.props('visible')).toBe(false)
    wrapper.unmount()
  })

  it('opens a filter draft without applying changes until confirmation', async () => {
    const wrapper = mount(TableHeaderCell, {
      attachTo: document.body,
      props: {
        column: columns[2],
        filterValues: ['Design'],
        allSelected: false,
        indeterminate: false,
        selectAllDisabled: false,
        showSelectAll: true,
      },
      slots: { default: 'Team' },
    })
    const popper = wrapper.findComponent({ name: 'SPopper' })
    popper.vm.$emit('update:visible', true)
    await flushPromises()
    const checkboxes = wrapper.findAllComponents({ name: 'SCheckbox' })
    expect(checkboxes).toHaveLength(2)
    checkboxes[1].vm.$emit('update:modelValue', true)
    await nextTick()
    expect(wrapper.emitted('filter')).toBeUndefined()
    const buttons = wrapper.findAllComponents({ name: 'SButton' })
    buttons[1].vm.$emit('click')
    expect(wrapper.emitted('filter')?.[0]).toEqual([['Design', 'Dev']])
    wrapper.unmount()
  })
  it('closes header filters during loading and rejects stale custom filter actions', async () => {
    let actions: TableFilterSlotParams | undefined
    const wrapper = mount(Table, {
      props: {
        data: rows,
        columns: [
          { ...columns[2], sortable: true, slots: { filter: 'filterTeam' } },
        ],
      },
      slots: {
        filterTeam: (params: TableFilterSlotParams) => {
          actions = params
          return h('span', 'Custom filter')
        },
      },
    })
    const header = wrapper.getComponent(TableHeaderCell)
    const popper = header.getComponent({ name: 'SPopper' })
    popper.vm.$emit('update:visible', true)
    await flushPromises()
    expect(actions).toBeDefined()
    actions!.setValues(['Design'])
    await wrapper.setProps({ loading: true })
    expect(popper.props('visible')).toBe(false)
    for (const control of wrapper.findAll<HTMLButtonElement>(
      '.s-table__header-action,.s-table__sort-button',
    ))
      expect(control.element.disabled).toBe(true)
    actions!.apply()
    actions!.reset()
    expect(wrapper.emitted('filterChange')).toBeUndefined()
    await wrapper.setProps({ loading: false })
    expect(
      wrapper.get<HTMLButtonElement>('.s-table__header-action').element
        .disabled,
    ).toBe(false)
    popper.vm.$emit('update:visible', true)
    await flushPromises()
    expect(actions!.values).toEqual([])
    actions!.setValues(['Design'])
    await nextTick()
    actions!.apply()
    expect(wrapper.emitted('filterChange')).toHaveLength(1)
    wrapper.unmount()
  })
})
