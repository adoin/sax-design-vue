import { h, nextTick } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Table from '../src/table.vue'
import TableColumnComponent from '../src/table-column.vue'
import FooterRows from '../src/table-footer-rows.vue'
import type { TableColumn, TableRenderedEntry } from '../src/table'

const data = [{ id: 1, label: 'Order', amount: { net: 8 }, count: 2 }]
const columns: TableColumn[] = [
  { key: 'pick', type: 'checkbox', width: 50 },
  { field: 'label', title: 'Label', width: 140, fixed: 'left' },
  {
    title: 'Metrics',
    children: [
      {
        field: 'amount.net',
        title: 'Amount',
        width: 160,
        footerAlign: 'right',
        footerFormatter: ({ value }) => `$${Number(value).toFixed(2)}`,
      },
      { field: 'count', title: 'Count', width: 140, renderer: 'count' },
    ],
  },
  { key: 'state', field: 'state', title: 'State', width: 140, fixed: 'right' },
]
const footerData = [
  { id: 'sum', label: 'Total', amount: { net: 8 }, count: 2, state: 'Final' },
  { id: 'avg', label: 'Average', amount: { net: 4 }, count: 1, state: 'Draft' },
]
const scrollDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollTo',
)

describe('table footer data', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    )
    for (const key of ['clientWidth', 'offsetWidth'] as const)
      vi.spyOn(HTMLElement.prototype, key, 'get').mockReturnValue(600)
    for (const key of ['clientHeight', 'offsetHeight'] as const)
      vi.spyOn(HTMLElement.prototype, key, 'get').mockReturnValue(200)
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

  it('is opt-in and keeps data footer separate from the bottom toolbar', async () => {
    const wrapper = mount(Table, {
      props: { data, columns },
      slots: { footer: () => 'Toolbar' },
    })
    expect(wrapper.find('.s-table__data-footer').exists()).toBe(false)
    await wrapper.setProps({ footerData, footerRowKey: 'id' })
    const footer = wrapper.get('.s-table__data-footer')
    expect(footer.findAll('[role="row"]')).toHaveLength(2)
    expect(footer.text()).toContain('Total$8.002Final')
    expect(footer.text()).toContain('Average$4.001Draft')
    expect(footer.findAll('input')).toHaveLength(0)
    expect(wrapper.get('.s-table__footer').text()).toBe('Toolbar')
    expect(wrapper.get('[role="table"]').attributes('aria-rowcount')).toBe('5')
    expect(footer.findAll('[role="row"]')[0].attributes('aria-rowindex')).toBe(
      '4',
    )
    const amount = footer.findAll('[data-column-index="2"]')[0]
    expect(amount.attributes('style')).toContain('text-align: right')
    await amount.trigger('click')
    expect(wrapper.emitted('footerCellClick')?.[0]?.[0]).toMatchObject({
      row: footerData[0],
      value: 8,
      rowIndex: 0,
      columnIndex: 2,
    })
    expect(wrapper.emitted('rowClick')).toBeUndefined()
    expect(wrapper.emitted('cellClick')).toBeUndefined()
    expect(wrapper.emitted('update:highlight')).toBeUndefined()
    await wrapper.setProps({ footerData: [] })
    expect(wrapper.find('.s-table__data-footer').exists()).toBe(false)
    wrapper.unmount()
  })

  it('keeps footer render precedence independent of body renderers and formats only the fallback', async () => {
    const formatter = vi.fn(() => 'formatted')
    const footer = vi.fn(() => h('strong', 'column footer'))
    const named = vi.fn(() => 'named footer')
    const body = vi.fn(() => 'body only')
    const column: TableColumn = {
      field: 'label',
      title: 'Label',
      footer,
      footerFormatter: formatter,
      renderer: 'test',
      slots: { footer: 'total-label' },
    }
    const wrapper = mount(Table, {
      props: {
        data,
        columns: [column],
        footerData,
        renderers: { test: { cell: body, footer: named } },
      },
      slots: {
        'total-label': () => 'specific slot',
        'footer-cell': () => 'generic slot',
      },
    })
    expect(wrapper.get('.s-table__data-footer').text()).toBe(
      'specific slotspecific slot',
    )
    expect(footer).not.toHaveBeenCalled()
    expect(named).not.toHaveBeenCalled()
    expect(formatter).not.toHaveBeenCalled()
    expect(body).toHaveBeenCalledTimes(1)
    wrapper.unmount()
    const generic = mount(Table, {
      props: { columns: [column], footerData },
      slots: { 'footer-cell': () => 'generic' },
    })
    expect(generic.get('.s-table__data-footer').text()).toBe('genericgeneric')
    expect(footer).not.toHaveBeenCalled()
    generic.unmount()
    const fallback = mount(Table, {
      props: {
        columns: [column],
        footerData,
        renderers: { test: { footer: named } },
      },
    })
    expect(
      fallback.get('.s-table__data-footer').findAll('strong'),
    ).toHaveLength(2)
    await fallback.setProps({ columns: [{ ...column, footer: undefined }] })
    expect(fallback.get('.s-table__data-footer').text()).toBe(
      'named footernamed footer',
    )
    expect(formatter).not.toHaveBeenCalled()
    await fallback.setProps({ renderers: {} })
    expect(fallback.get('.s-table__data-footer').text()).toBe(
      'formattedformatted',
    )
    expect(formatter).toHaveBeenCalledTimes(2)
    fallback.unmount()
  })

  it('supports declarative footer slots and does not apply body overflow to footers', async () => {
    const wrapper = mount(Table, {
      props: { data, footerData, showOverflow: true },
      slots: {
        default: () =>
          h(
            TableColumnComponent,
            { field: 'label', title: 'Label' },
            {
              default: ({ row }: { row: (typeof data)[number] }) =>
                `Body ${row.label}`,
              footer: ({
                row,
                rowIndex,
              }: {
                row: (typeof footerData)[number]
                rowIndex: number
              }) => `${rowIndex}: ${row.label}`,
            },
          ),
      },
    })
    await flushPromises()
    expect(wrapper.get('.s-table__data-row').text()).toBe('Body Order')
    expect(wrapper.get('.s-table__data-footer').text()).toBe(
      '0: Total1: Average',
    )
    expect(
      wrapper
        .get('.s-table__footer-cell .s-table__cell-content')
        .attributes('data-table-overflow'),
    ).toBeUndefined()
    await wrapper.setProps({ showFooterOverflow: 'tooltip' })
    expect(
      wrapper
        .get('.s-table__footer-cell .s-table__cell-content')
        .attributes('tabindex'),
    ).toBe('0')
    wrapper.unmount()
  })

  it('preserves supplied totals through filtering and pagination and follows column state and widths', async () => {
    const wrapper = mount(Table, {
      props: {
        data,
        columns,
        footerData,
        footerRowKey: 'id',
        pagerConfig: { pageSize: 1 },
      },
    })
    await wrapper.setProps({
      columnState: [
        { key: 'count', fixed: 'right' },
        { key: 'amount.net', hidden: true },
      ],
      columnWidths: { label: 210 },
    })
    expect(
      wrapper.findAll('.s-table__footer-row')[0].findAll('[role="cell"]'),
    ).toHaveLength(4)
    const cell = wrapper.get('.s-table__footer-cell[data-column-index="1"]')
    expect(cell.attributes('style')).toContain('210px')
    expect(wrapper.get('.s-table__data-footer').text()).toContain('Total2Final')
    wrapper.vm.setFilters({ label: ['missing'] })
    await nextTick()
    expect(wrapper.find('.s-table__data-row').exists()).toBe(false)
    expect(wrapper.findAll('.s-table__footer-row')).toHaveLength(2)
    await wrapper.setProps({ footerData: [footerData[1], footerData[0]] })
    expect(
      wrapper
        .findAll('.s-table__footer-row')
        .map((row) => row.attributes('data-footer-row-key')),
    ).toEqual(['string:avg', 'string:sum'])
    expect(footerData[0].amount.net).toBe(8)
    wrapper.unmount()
  })

  it('renders only the generated column window, including empty-body horizontal scrolling', async () => {
    const row = vi.fn((index: number) => ({ id: index }))
    const column = vi.fn((index: number): TableColumn => ({
      key: String(index),
      title: `Column ${index}`,
      footer: ({ row }) => `${row.label}:${index}`,
    }))
    const source = {
      rowCount: 1_000_000,
      columnCount: 100_000,
      row,
      column,
      columnWidth: 120,
      fixedLeftCount: 1,
      fixedRightCount: 1,
    }
    const wrapper = mount(Table, {
      props: {
        virtualSource: source,
        virtualConfig: { height: 200, horizontal: true, dynamic: true },
        footerData: [{ label: 'Total' }],
      },
    })
    await flushPromises()
    wrapper.vm.scrollToColumn(99_998, 'end')
    wrapper.vm.scrollToRow(999_999, 'end')
    await flushPromises()
    await vi.waitFor(() =>
      expect(wrapper.get('.s-table__data-footer').text()).toContain(
        'Total:99998',
      ),
    )
    expect(wrapper.findAll('.s-table__footer-cell').length).toBeLessThan(15)
    expect(row.mock.calls.length).toBeLessThan(100)
    expect(column.mock.calls.length).toBeLessThan(200)
    await wrapper.setProps({ virtualSource: { ...source, rowCount: 0 } })
    await flushPromises()
    expect(wrapper.get('.s-table').classes()).not.toContain(
      'is-horizontal-virtual',
    )
    // The clipped data surface must itself expose the native scroll track.
    expect(
      Number.parseFloat(
        (wrapper.get('.s-table__data-view').element as HTMLElement).style
          .minWidth,
      ),
    ).toBeGreaterThan(600)
    wrapper.vm.scrollToColumn(99_998, 'end')
    await flushPromises()
    await vi.waitFor(() =>
      expect(wrapper.get('.s-table__data-footer').text()).toContain(
        'Total:99998',
      ),
    )
    expect(
      wrapper.get('.s-table__data-footer').attributes('style'),
    ).not.toContain('translateX')
    expect(
      wrapper.get('.s-table__footer-cell.is-fixed-left').attributes('style'),
    ).not.toContain('translateX')
    wrapper.unmount()
  })

  it('retains row height across windows, resets for changed data/layout and disconnects observers', async () => {
    let report: ResizeObserverCallback = () => {}
    const disconnect = vi.fn()
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: ResizeObserverCallback) {
          report = callback
        }
        observe() {}
        unobserve() {}
        disconnect = disconnect
      },
    )
    const entries: TableRenderedEntry[] = [
      {
        kind: 'column',
        key: 'label',
        column: { field: 'label' },
        index: 0,
        style: { width: '100px' },
      },
    ]
    const wrapper = mount(FooterRows, {
      props: {
        data: footerData,
        rowKey: 'id',
        entries,
        rowOffset: 2,
        fixedStyle: () => ({}),
        renderers: {},
        retainHeights: true,
      },
    })
    const element = wrapper.get('.s-table__footer-row').element
    const resize = (height: number) =>
      report(
        [{ target: element, contentRect: { height } } as ResizeObserverEntry],
        {} as ResizeObserver,
      )
    resize(90)
    await nextTick()
    expect(wrapper.get('.s-table__footer-row').attributes('style')).toContain(
      '90px',
    )
    await wrapper.setProps({ entries: [{ ...entries[0], key: 'next' }] })
    resize(44)
    await nextTick()
    expect(wrapper.get('.s-table__footer-row').attributes('style')).toContain(
      '90px',
    )
    wrapper.vm.measure()
    await nextTick()
    resize(44)
    await nextTick()
    expect(wrapper.get('.s-table__footer-row').attributes('style')).toContain(
      '44px',
    )
    await wrapper.setProps({ data: [{ ...footerData[0], label: 'Updated' }] })
    expect(
      wrapper.get('.s-table__footer-row').attributes('style') ?? '',
    ).not.toContain('44px')
    wrapper.unmount()
    expect(disconnect).toHaveBeenCalledTimes(1)
    expect(() => resize(100)).not.toThrow()
  })
})
