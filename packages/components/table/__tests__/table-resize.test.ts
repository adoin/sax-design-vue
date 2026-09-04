import { h, nextTick } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Table from '../src/table.vue'
import TableColumnComponent from '../src/table-column.vue'
import { createSparseColumnMetrics } from '../src/composables/sparse-column-metrics'
import type { TableColumn } from '../src/table'

const pointer = (target: EventTarget, type: string, clientX: number) => {
  const event = new MouseEvent(type, { bubbles: true, button: 0, clientX })
  Object.defineProperty(event, 'pointerId', { value: 1 })
  target.dispatchEvent(event)
}
const cols: TableColumn[] = [
  { field: 'id', title: 'ID', width: 80, minWidth: 60, fixed: 'left' },
  { field: 'name', title: 'Name', width: 160, fixed: 'left', treeNode: true },
  { field: 'description', title: 'Description', width: 220 },
  { field: 'status', title: 'Status', width: 120, fixed: 'right' },
]
const data = [
  {
    id: 1,
    name: 'Parent',
    description: 'Wrapping text',
    children: [{ id: 2, name: 'Child' }],
  },
]
const headers = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findAll('[role="columnheader"]')
const scrollDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollTo',
)

describe('Table column resizing', () => {
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(200)
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(600)
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(200)
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(600)
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      configurable: true,
      value(this: HTMLElement, options: ScrollToOptions) {
        if (options.top != null) this.scrollTop = options.top
        if (options.left != null) this.scrollLeft = options.left
        this.dispatchEvent(new Event('scroll'))
      },
    })
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function (this: HTMLElement) {
        return {
          width: Number.parseFloat(this.style.width) || 120,
          height: 48,
          top: 0,
          left: 0,
          right: 120,
          bottom: 48,
        } as DOMRect
      },
    )
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
    if (scrollDescriptor)
      Object.defineProperty(HTMLElement.prototype, 'scrollTo', scrollDescriptor)
    else Reflect.deleteProperty(HTMLElement.prototype, 'scrollTo')
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('is opt-in and shares configured and declarative resizing', async () => {
    const wrapper = mount(Table, {
      props: { data },
      slots: {
        default: () => cols.map((column) => h(TableColumnComponent, column)),
      },
    })
    expect(wrapper.find('[role="separator"]').exists()).toBe(false)
    await wrapper.setProps({ resizeConfig: true })
    expect(
      headers(wrapper)[0].get('[role="separator"]').attributes('aria-label'),
    ).toBe('Resize column ID')
    await headers(wrapper)[0]
      .get('[role="separator"]')
      .trigger('keydown', { key: 'ArrowRight' })
    expect(headers(wrapper)[0].attributes('style')).toContain('width: 90px')
    expect(headers(wrapper)[1].attributes('style')).toContain(
      'left: calc(90px)',
    )
    expect(wrapper.emitted('columnResize')?.[0]?.[0]).toMatchObject({
      columnKey: 'id',
      width: 90,
      oldWidth: 80,
      source: 'keyboard',
    })
    wrapper.unmount()
  })

  it('commits pointer width, clamps minimums and never mutates frozen columns or rows', async () => {
    const columns = cols.map((column) => Object.freeze({ ...column }))
    const wrapper = mount(Table, {
      props: {
        data: data.map((row) => Object.freeze({ ...row })),
        columns,
        resizeConfig: true,
      },
    })
    const handle = headers(wrapper)[0].get('[role="separator"]').element
    pointer(handle, 'pointerdown', 80)
    pointer(window, 'pointerup', 5)
    await nextTick()
    expect(headers(wrapper)[0].attributes('style')).toContain('width: 60px')
    expect(wrapper.emitted('update:columnWidths')?.[0]?.[0]).toEqual({ id: 60 })
    expect(columns[0].width).toBe(80)
    expect(document.documentElement.style.userSelect).toBe('')
    wrapper.unmount()
  })

  it('resizes right-fixed columns from their left edge and supports cancellation', async () => {
    const wrapper = mount(Table, {
      props: { data, columns: cols, resizeConfig: true },
    })
    const handle = headers(wrapper)[3].get('[role="separator"]').element
    pointer(handle, 'pointerdown', 700)
    pointer(window, 'pointerup', 650)
    await nextTick()
    expect(headers(wrapper)[3].attributes('style')).toContain('width: 170px')
    pointer(handle, 'pointerdown', 650)
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    pointer(window, 'pointerup', 600)
    await nextTick()
    expect(wrapper.emitted('columnResize')).toHaveLength(1)
    expect(headers(wrapper)[3].attributes('style')).toContain('width: 170px')
    pointer(handle, 'pointerdown', 650)
    const events = wrapper.emitted('columnResize')!
    wrapper.unmount()
    expect(document.documentElement.style.cursor).toBe('')
    pointer(window, 'pointerup', 0)
    expect(events).toHaveLength(1)
  })

  it('honors controlled widths, disabled columns, IME and external resets', async () => {
    const wrapper = mount(Table, {
      props: {
        data,
        columns: [{ ...cols[0] }, { ...cols[1], resizable: false }],
        resizeConfig: true,
        columnWidths: { id: 100 },
      },
    })
    expect(wrapper.findAll('[role="separator"]')).toHaveLength(1)
    const handle = wrapper.get('[role="separator"]')
    await handle.trigger('keydown', { key: 'ArrowRight', isComposing: true })
    expect(wrapper.emitted('columnResize')).toBeUndefined()
    await handle.trigger('keydown', { key: 'ArrowRight' })
    expect(headers(wrapper)[0].attributes('style')).toContain('width: 100px')
    expect(wrapper.emitted('update:columnWidths')?.[0]?.[0]).toEqual({
      id: 110,
    })
    await wrapper.setProps({ columnWidths: { id: 110 } })
    expect(headers(wrapper)[1].attributes('style')).toContain(
      'left: calc(110px)',
    )
    await wrapper.setProps({ columnWidths: {} })
    expect(headers(wrapper)[0].attributes('style')).toContain('width: 80px')
    await wrapper.setProps({ loading: true })
    expect(wrapper.find('[role="separator"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('keeps trees, pagination, fixed cells and virtual rows in the same layout', async () => {
    const wrapper = mount(Table, {
      props: {
        data,
        columns: cols,
        treeConfig: { expandAll: true },
        pagerConfig: { pageSize: 5 },
        virtualConfig: { height: 200, horizontal: true, dynamic: true },
        resizeConfig: true,
      },
    })
    await flushPromises()
    await headers(wrapper)[0]
      .get('[role="separator"]')
      .trigger('keydown', { key: 'ArrowRight', shiftKey: true })
    await flushPromises()
    expect(wrapper.findAll('.s-table__data-row')).toHaveLength(2)
    for (const row of wrapper.findAll('.s-table__data-row')) {
      expect(
        row.findAll('.s-table__data-cell')[0].attributes('style'),
      ).toContain('width: 130px')
      expect(
        row.findAll('.s-table__data-cell')[1].attributes('style'),
      ).toContain('left: calc(130px)')
    }
    wrapper.unmount()
  })

  it('only renders a bounded window when resizing one of millions of generated columns', async () => {
    const column = vi.fn((index: number) => ({
      field: `c${index}`,
      title: `C${index}`,
      width: 120,
    }))
    const row = vi.fn((index: number) => ({ id: index }))
    const wrapper = mount(Table, {
      props: {
        resizeConfig: true,
        virtualSource: {
          rowCount: 100000,
          columnCount: 16777216,
          columnWidth: 120,
          column,
          row,
          fixedLeftCount: 1,
          fixedRightCount: 1,
        },
        virtualConfig: { horizontal: true, height: 200 },
      },
    })
    await flushPromises()
    const center = headers(wrapper).find(
      (cell) => cell.attributes('data-column-index') === '1',
    )!
    await center
      .get('[role="separator"]')
      .trigger('keydown', { key: 'ArrowRight' })
    await flushPromises()
    expect(wrapper.emitted('update:columnWidths')?.[0]?.[0]).toEqual({
      '1': 130,
    })
    expect(column.mock.calls.length).toBeLessThan(150)
    expect(row.mock.calls.length).toBeLessThan(200)
    expect(headers(wrapper).length).toBeLessThan(15)
    const fixedHeader = wrapper.get('.s-table__data-head-cell.is-fixed-right')
    expect(fixedHeader.attributes('style')).toContain('position: relative')
    expect(fixedHeader.attributes('style')).toContain('right: auto')
    await wrapper.setProps({
      virtualSource: { ...wrapper.props('virtualSource')!, rowCount: 50 },
    })
    await flushPromises()
    expect(
      headers(wrapper)
        .find((cell) => cell.attributes('data-column-index') === '1')!
        .attributes('style'),
    ).toContain('width: 130px')
    await wrapper.setProps({
      virtualSource: {
        ...wrapper.props('virtualSource')!,
        column: (index) => ({ ...column(index) }),
      },
    })
    await flushPromises()
    expect(
      headers(wrapper)
        .find((cell) => cell.attributes('data-column-index') === '1')!
        .attributes('style'),
    ).toContain('width: 120px')
    wrapper.unmount()
  })

  it('calculates sparse offsets and ranges beyond resized tracks', () => {
    const metrics = createSparseColumnMetrics(
      16777216,
      120,
      new Map([
        [1, 200],
        [8000000, 40],
      ]),
    )
    expect(metrics.totalWidth).toBe(16777216 * 120)
    expect(metrics.offsetAt(2)).toBe(320)
    expect(metrics.offsetAt(8000000)).toBe(8000000 * 120 + 80)
    expect(metrics.widthAt(8000000)).toBe(40)
    expect(metrics.range(metrics.offsetAt(8000000), 200, 1)).toMatchObject({
      start: 7999999,
      end: 8000004,
    })
  })
})
