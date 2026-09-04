import { defineComponent, h, nextTick, shallowRef } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Table from '../src/table.vue'
import TableColumn from '../src/table-column.vue'
import type {
  TableColumn as Column,
  TableCellRange,
  TableMergeQuery,
} from '../src/table'

const data = Array.from({ length: 4 }, (_, id) => ({
  id,
  name: `Row ${id}`,
  team: id < 2 ? 'A' : 'B',
}))
const columns: Column[] = [
  { field: 'name', width: 120 },
  { field: 'id', width: 120, fixed: 'left' },
  { field: 'team', width: 120, fixed: 'right' },
]
const wrappers: { unmount(): void }[] = []
const setup = (props = {}, slots = {}) => {
  const wrapper = mount(Table, {
    attachTo: document.body,
    props: { data, columns, rowKey: 'id', rangeConfig: true, ...props },
    slots,
  })
  wrappers.push(wrapper)
  return wrapper
}
const settle = async () => {
  await nextTick()
  await flushPromises()
  await nextTick()
}
const range = (a = 0, b = 2): TableCellRange => ({
  anchor: { rowKey: a, columnKey: 'id' },
  focus: { rowKey: b, columnKey: 'team' },
})
const scrollDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollIntoView',
)
const scrollToDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollTo',
)
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
  vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockImplementation(
    function (this: HTMLElement) {
      return (
        Number.parseFloat(
          this.querySelector<HTMLElement>('.s-vl__content')?.style.height ?? '',
        ) || 200
      )
    },
  )
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
  })
  Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
    configurable: true,
    value(this: HTMLElement, options: ScrollToOptions) {
      if (options.top != null) this.scrollTop = options.top
      if (options.left != null) this.scrollLeft = options.left
      this.dispatchEvent(new Event('scroll'))
    },
  })
})
afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount())
  for (const [key, descriptor] of [
    ['scrollIntoView', scrollDescriptor],
    ['scrollTo', scrollToDescriptor],
  ] as const) {
    if (descriptor)
      Object.defineProperty(HTMLElement.prototype, key, descriptor)
    else Reflect.deleteProperty(HTMLElement.prototype, key)
  }
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('STable range integration', () => {
  it('keeps dragging when controlled updates recreate an equivalent inline merge config', async () => {
    const selected = shallowRef<TableCellRange | null>(null)
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(Table, {
            data,
            columns,
            rowKey: 'id',
            rangeConfig: true,
            cellRange: selected.value,
            'onUpdate:cellRange': (value: TableCellRange | null) => {
              selected.value = value
            },
            mergeConfig: { body: [{ row: 1, col: 1, rowspan: 2, colspan: 2 }] },
          }),
      }),
      { attachTo: document.body },
    )
    wrappers.push(wrapper)
    await settle()
    const event = new MouseEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      button: 0,
    })
    Object.defineProperties(event, {
      pointerId: { value: 1 },
      pointerType: { value: 'mouse' },
    })
    wrapper.get('[role="cell"]').element.dispatchEvent(event)
    await settle()
    expect(selected.value).not.toBeNull()
    expect(
      (wrapper.get('.s-table').element as HTMLElement).style.userSelect,
    ).toBe('none')
    const cancel = new MouseEvent('pointercancel', { bubbles: true })
    Object.defineProperty(cancel, 'pointerId', { value: 1 })
    document.dispatchEvent(cancel)
    await settle()
    expect(selected.value).toBeNull()
    expect(
      (wrapper.get('.s-table').element as HTMLElement).style.userSelect,
    ).toBe('')
  })
  it('is opt-in and shares fixed-column visual coordinates across configured and declarative columns', async () => {
    const disabled = setup({ rangeConfig: false })
    expect(await disabled.vm.setCellRange(range())).toBe(false)
    expect(disabled.find('.is-range-cell').exists()).toBe(false)
    for (const declarative of [false, true]) {
      const wrapper = setup(
        declarative ? { columns: [] } : {},
        declarative
          ? { default: () => columns.map((column) => h(TableColumn, column)) }
          : {},
      )
      await settle()
      expect(await wrapper.vm.setCellRange(range())).toBe(true)
      expect(wrapper.vm.getCellRangeBounds()).toEqual({
        rowStart: 0,
        rowEnd: 3,
        colStart: 0,
        colEnd: 3,
      })
      expect(wrapper.findAll('.is-range-cell')).toHaveLength(9)
      expect(wrapper.get('.is-range-cell').attributes('aria-description')).toBe(
        'In selected range',
      )
      expect(wrapper.get('.s-table__range-status').text()).toBe(
        'Selected range: 3 rows by 3 columns.',
      )
      expect(wrapper.emitted('update:cellRange')?.[0]).toEqual([range()])
      expect(wrapper.emitted('cellRangeChange')?.[0][0]).toMatchObject({
        reason: 'programmatic',
      })
      expect(await wrapper.vm.clearCellRange()).toBe(true)
      expect(wrapper.findAll('.is-range-cell')).toHaveLength(0)
    }
  })
  it('uses existing keyboard focus and handles Shift extension without enabling keyboard-config separately', async () => {
    const wrapper = setup()
    await settle()
    expect(await wrapper.vm.setActiveCell(0, 1)).toBe(true)
    await wrapper
      .get('.s-table')
      .trigger('keydown', { key: 'ArrowRight', shiftKey: true })
    await settle()
    expect(wrapper.vm.getCellRange()).toEqual({
      anchor: { rowKey: 0, columnKey: 'id' },
      focus: { rowKey: 0, columnKey: 'name' },
    })
    expect(wrapper.findAll('.is-range-cell')).toHaveLength(2)
    expect(wrapper.vm.getActiveCell()).toEqual({ rowKey: 0, columnKey: 'name' })
    await wrapper.get('.s-table').trigger('keydown', { key: 'Escape' })
    await settle()
    expect(wrapper.vm.getCellRange()).toBeNull()
    expect(wrapper.vm.getActiveCell()).toEqual({ rowKey: 0, columnKey: 'name' })
  })
  it('honors a rejected model and recomputes an externally replaced range', async () => {
    const wrapper = setup({ cellRange: null })
    expect(await wrapper.vm.setCellRange(range())).toBe(false)
    expect(wrapper.findAll('.is-range-cell')).toHaveLength(0)
    await wrapper.setProps({ cellRange: range(1, 3) })
    await settle()
    expect(wrapper.findAll('.is-range-cell')).toHaveLength(9)
    expect(wrapper.vm.getCellRangeBounds()?.rowStart).toBe(1)
    await wrapper.setProps({ data: data.slice(0, 3) })
    await settle()
    expect(wrapper.vm.getCellRangeBounds()).toBeNull()
    expect(wrapper.emitted('update:cellRange')?.at(-1)).toEqual([null])
  })
  it('expands to a full merged rectangle and rejects failed dynamic merge queries', async () => {
    const wrapper = setup({
      mergeConfig: { body: [{ row: 0, col: 0, rowspan: 2, colspan: 2 }] },
    })
    await settle()
    expect(
      await wrapper.vm.setCellRange({
        anchor: { rowKey: 1, columnKey: 'name' },
        focus: { rowKey: 2, columnKey: 'team' },
      }),
    ).toBe(true)
    expect(wrapper.vm.getCellRangeBounds()).toEqual({
      rowStart: 0,
      rowEnd: 3,
      colStart: 0,
      colEnd: 3,
    })
    const error = new Error('cannot resolve range')
    await wrapper.setProps({
      mergeConfig: {
        body: () => {
          throw error
        },
      },
    })
    await settle()
    expect(await wrapper.vm.setCellRange(range())).toBe(false)
    expect(wrapper.emitted('cellRangeError')?.at(-1)).toEqual([error])
  })
  it('keeps stable keys across sort order changes and clears a collapsed group endpoint', async () => {
    const wrapper = setup({ groupConfig: { fields: ['team'] } })
    await settle()
    expect(await wrapper.vm.setCellRange(range(0, 1))).toBe(true)
    const group = wrapper.vm.getGroups()[0]
    await wrapper.vm.toggleGroup(group.key, false)
    await settle()
    expect(wrapper.vm.getCellRange()).toBeNull()
  })
  it('selects a huge generated range and queries offscreen merges without mounting or scanning selected cells', async () => {
    const row = vi.fn((index: number) => ({ id: index, value: index }))
    const query = vi.fn((query: TableMergeQuery) =>
      query.rowEnd > 999_990
        ? [{ row: 999_980, col: 99_990, rowspan: 20, colspan: 10 }]
        : [],
    )
    const wrapper = setup({
      data: [],
      columns: [],
      virtualSource: {
        rowCount: 1_000_000,
        columnCount: 100_000,
        columnWidth: 120,
        row,
        rowKey: (index: number) => index,
        column: (index: number) => ({ field: `c${index}` }),
      },
      virtualConfig: { enabled: true, horizontal: true, height: 200 },
      rangeConfig: { rowIndexOf: (key: string | number) => Number(key) },
      mergeConfig: { body: query },
    })
    await settle()
    row.mockClear()
    query.mockClear()
    const requested = {
      anchor: { rowKey: 0, columnKey: '0' },
      focus: { rowKey: 999_999, columnKey: '99999' },
    }
    expect(await wrapper.vm.setCellRange(requested)).toBe(true)
    expect(wrapper.vm.getCellRangeBounds()).toEqual({
      rowStart: 0,
      rowEnd: 1_000_000,
      colStart: 0,
      colEnd: 100_000,
    })
    expect(row.mock.calls.length).toBeLessThan(80)
    const rangeQueries = query.mock.calls
      .map(([window]) => window)
      .filter((window) => window.rowEnd - window.rowStart > 1000)
    expect(rangeQueries).toHaveLength(2)
    expect(
      rangeQueries.reduce(
        (area, window) =>
          area +
          (window.rowEnd - window.rowStart) * (window.colEnd - window.colStart),
        0,
      ),
    ).toBe(1_000_000 * 100_000)
    const mountedCells = wrapper.findAll('[role="cell"]').length
    expect(query.mock.calls.length).toBeLessThan(mountedCells * 4 + 10)
    expect(wrapper.findAll('[data-table-row-index]').length).toBeLessThan(30)
  })
})
