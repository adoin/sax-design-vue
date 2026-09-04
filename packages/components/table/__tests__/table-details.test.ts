import { h, nextTick } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Table from '../src/table.vue'
import TableColumn from '../src/table-column.vue'
import RowBlock from '../src/table-row-block.vue'
import VirtualList from '../../virtual-list/src/virtual-list.vue'
import type { TableColumn as Column, TableDetailSlotParams } from '../src/table'

const rows = [
  Object.freeze({
    id: 1,
    name: 'Parent',
    children: [{ id: 3, name: 'Child' }],
  }),
  Object.freeze({ id: 2, name: 'Sibling' }),
]
const columns: Column[] = [
  { key: 'details', type: 'expand', width: 56, fixed: 'left' },
  { field: 'name', title: 'Name', treeNode: true, width: 220 },
  { field: 'id', title: 'ID', width: 100, fixed: 'right' },
]
const originalScroll = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollTo',
)

describe('table detail integration', () => {
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
    if (originalScroll)
      Object.defineProperty(HTMLElement.prototype, 'scrollTo', originalScroll)
    else Reflect.deleteProperty(HTMLElement.prototype, 'scrollTo')
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('separates details from tree expansion, highlight and footer row indices', async () => {
    const wrapper = mount(Table, {
      props: {
        data: rows,
        columns,
        treeConfig: {},
        footerData: [{ name: 'Total' }],
      },
      slots: {
        detail: ({ row }: TableDetailSlotParams) => `Details of ${row.name}`,
      },
    })
    await wrapper.get('.s-table__detail-toggle').trigger('click')
    expect(wrapper.get('.s-table__detail-content').text()).toBe(
      'Details of Parent',
    )
    expect(wrapper.findAll('.s-table__data-row')).toHaveLength(2)
    expect(wrapper.emitted('update:expandedKeys')).toBeUndefined()
    expect(wrapper.emitted('update:highlight')).toBeUndefined()
    expect(wrapper.emitted('cellClick')).toBeUndefined()
    expect(
      wrapper.get('.s-table__detail-row').attributes('aria-rowindex'),
    ).toBe('3')
    expect(
      wrapper.findAll('.s-table__data-row')[1].attributes('aria-rowindex'),
    ).toBe('4')
    expect(
      wrapper
        .get('.s-table__data-footer [role="row"]')
        .attributes('aria-rowindex'),
    ).toBe('5')
    await wrapper.get('.s-table__tree-toggle').trigger('click')
    expect(wrapper.findAll('.s-table__data-row')).toHaveLength(3)
    expect(wrapper.get('.s-table__detail-content').text()).toContain('Parent')
    expect(wrapper.get('[role="table"]').attributes('aria-rowcount')).toBe('6')
    await wrapper.vm.toggleRowDetail(0, false)
    expect(wrapper.find('.s-table__detail-row').exists()).toBe(false)
    expect(
      wrapper.get('.s-table__tree-toggle').attributes('aria-expanded'),
    ).toBe('true')
    wrapper.unmount()
  })

  it('supports declarative expand columns, controlled acceptance and focus restoration', async () => {
    const wrapper = mount(Table, {
      attachTo: document.body,
      props: { data: rows, detailExpandedKeys: [] },
      slots: {
        default: () => [
          h(TableColumn, { type: 'expand', width: 56 }),
          h(TableColumn, { field: 'name' }),
        ],
        detail: ({ close }: TableDetailSlotParams) =>
          h('button', { onClick: close }, 'Close details'),
      },
    })
    await nextTick()
    const trigger = wrapper.get<HTMLButtonElement>('.s-table__detail-toggle')
    expect(trigger.attributes('type')).toBe('button')
    await trigger.trigger('click')
    expect(wrapper.emitted('update:detailExpandedKeys')?.[0]).toEqual([[1]])
    expect(wrapper.find('.s-table__detail-row').exists()).toBe(false)
    await wrapper.setProps({ detailExpandedKeys: [1] })
    const panel = wrapper.get('.s-table__detail-content')
    expect(trigger.attributes('aria-controls')).toBe(panel.attributes('id'))
    const close = panel.get<HTMLButtonElement>('button')
    close.element.focus()
    await close.trigger('click')
    expect(wrapper.find('.s-table__detail-row').exists()).toBe(true)
    await wrapper.setProps({ detailExpandedKeys: [] })
    await nextTick()
    expect(document.activeElement).toBe(trigger.element)
    await wrapper.setProps({ detailConfig: false })
    expect(
      wrapper.get('.s-table__detail-toggle').attributes('disabled'),
    ).toBeDefined()
    expect(wrapper.find('.s-table__row-block').exists()).toBe(false)
    wrapper.unmount()
  })

  it('assigns unique detail regions to separate tables with the same row key', async () => {
    const first = mount(Table, {
      props: { data: rows, columns, detailExpandedKeys: [1] },
    })
    const second = mount(Table, {
      props: { data: rows, columns, detailExpandedKeys: [1] },
    })
    const firstId = first.get('.s-table__detail-content').attributes('id')
    const secondId = second.get('.s-table__detail-content').attributes('id')
    expect(firstId).not.toBe(secondId)
    expect(
      first.get('.s-table__detail-toggle').attributes('aria-controls'),
    ).toBe(firstId)
    expect(
      second.get('.s-table__detail-toggle').attributes('aria-controls'),
    ).toBe(secondId)
    first.unmount()
    second.unmount()
  })

  it('renders default loading, error, retry and data fallbacks through forwarded slots', async () => {
    let reject!: (reason?: unknown) => void
    const load = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise((_, fail) => {
            reject = fail
          }),
      )
      .mockResolvedValue('Loaded details')
    const wrapper = mount(Table, {
      props: {
        data: rows,
        columns,
        detailConfig: { load, defaultExpandedKeys: [1] },
      },
    })
    await flushPromises()
    expect(
      wrapper.get('.s-table__detail-content').attributes('aria-busy'),
    ).toBe('true')
    expect(wrapper.get('[role="status"]').text()).not.toBe('')
    reject()
    await flushPromises()
    expect(wrapper.get('[role="alert"]').text()).not.toBe('')
    await wrapper.get('[role="alert"] button').trigger('click')
    await vi.waitFor(() => expect(load).toHaveBeenCalledTimes(2))
    await flushPromises()
    expect(wrapper.get('.s-table__detail-content').text()).toBe(
      'Loaded details',
    )
    expect(load).toHaveBeenCalledTimes(2)
    await wrapper.vm.reloadRowDetail(rows[0])
    expect(load).toHaveBeenCalledTimes(3)
    wrapper.unmount()
  })

  it('measures a combined virtual row, resets shrinking details, and disconnects observers', async () => {
    const observers: {
      callback: ResizeObserverCallback
      observe: ReturnType<typeof vi.fn>
      disconnect: ReturnType<typeof vi.fn>
    }[] = []
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe = vi.fn()
        unobserve = vi.fn()
        disconnect = vi.fn()
        constructor(public callback: ResizeObserverCallback) {
          observers.push(this)
        }
      },
    )
    const wrapper = mount(Table, {
      props: {
        data: rows,
        columns,
        detailConfig: { defaultExpandedKeys: [1] },
        virtualConfig: { height: 200, dynamic: false, horizontal: true },
      },
      slots: {
        detail: () => h('div', { style: { height: '300px' } }, 'Tall content'),
      },
    })
    await flushPromises()
    expect(wrapper.getComponent(VirtualList).props('dynamic')).toBe(true)
    expect(wrapper.getComponent(VirtualList).props('retainMaxSize')).toBe(true)
    const block = wrapper.getComponent(RowBlock)
    expect(block.find('.s-table__data-row').exists()).toBe(true)
    expect(block.find('.s-table__detail-row').exists()).toBe(true)
    const panel = block.get('.s-table__detail-content').element
    const observer = observers.find((item) =>
      item.observe.mock.calls.some(([element]) => element === panel),
    )!
    expect(observer).toBeDefined()
    const notify = (height: number) =>
      observer.callback(
        [
          {
            target: panel,
            borderBoxSize: [{ blockSize: height }],
          } as unknown as ResizeObserverEntry,
        ],
        observer as unknown as ResizeObserver,
      )
    notify(300)
    notify(100)
    expect(block.emitted('shrink')).toHaveLength(1)
    await wrapper.vm.toggleRowDetail(0, false)
    await flushPromises()
    expect(wrapper.find('.s-table__detail-row').exists()).toBe(false)
    wrapper.unmount()
    const emissions = block.emitted('shrink')?.length
    notify(10)
    expect(block.emitted('shrink')?.length).toBe(emissions)
    expect(observer.disconnect).toHaveBeenCalled()
  })

  it('keeps generated detail state sparse with source keys and offscreen operations', async () => {
    const row = vi.fn((index: number) => ({ label: `Row ${index}` }))
    const column = vi.fn((index: number): Column =>
      index === 0
        ? { type: 'expand', width: 56, fixed: 'left' }
        : { field: 'label', title: String(index), width: 120 },
    )
    const wrapper = mount(Table, {
      props: {
        detailConfig: true,
        virtualConfig: { height: 200, horizontal: true },
        virtualSource: {
          rowCount: 1_000_000,
          columnCount: 100_000,
          row,
          column,
          rowKey: (index: number) => `row-${index}`,
          columnWidth: 120,
          fixedLeftCount: 1,
        },
      },
      slots: { detail: ({ rowKey }: TableDetailSlotParams) => rowKey },
    })
    await flushPromises()
    await wrapper.get('.s-table__detail-toggle').trigger('click')
    expect(wrapper.get('.s-table__detail-content').text()).toBe('row-0')
    await wrapper.vm.toggleRowDetail(999_999, true)
    expect(wrapper.emitted('update:detailExpandedKeys')?.at(-1)?.[0]).toEqual([
      'row-0',
      'row-999999',
    ])
    expect(row.mock.calls.length).toBeLessThan(100)
    expect(column.mock.calls.length).toBeLessThan(200)
    expect(wrapper.findAll('.s-table__data-row').length).toBeLessThan(30)
    expect(wrapper.get('[role="table"]').attributes('aria-rowcount')).toBe('-1')
    expect(
      wrapper.get('.s-table__detail-row').attributes('aria-rowindex'),
    ).toBeUndefined()
    wrapper.unmount()
  })
})
