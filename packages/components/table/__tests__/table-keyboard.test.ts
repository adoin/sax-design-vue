import { defineComponent, h, nextTick, ref } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Table from '../src/table.vue'
import TableColumn from '../src/table-column.vue'
import type { TableColumn as Column, TableActiveCell } from '../src/table'

const data = [
  { id: 1, name: 'Alpha' },
  { id: 2, name: 'Beta' },
]
const columns: Column[] = [
  { field: 'name', title: 'Name', editor: true },
  { key: 'right', field: 'id', fixed: 'right' },
  { key: 'left', field: 'id', fixed: 'left' },
]
const wrappers: { unmount(): void }[] = []
const setup = (props = {}) => {
  const wrapper = mount(Table, {
    attachTo: document.body,
    props: { data, columns, rowKey: 'id', keyboardConfig: true, ...props },
  })
  wrappers.push(wrapper)
  return wrapper
}
const settle = async () => {
  await nextTick()
  await flushPromises()
  await nextTick()
}
const press = async (key: string, extra: KeyboardEventInit = {}) => {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...extra,
  })
  document.activeElement?.dispatchEvent(event)
  await settle()
  return event
}
const scrollDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollIntoView',
)
const scrollToDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollTo',
)
beforeEach(() => {
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
  })
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
  if (scrollDescriptor)
    Object.defineProperty(
      HTMLElement.prototype,
      'scrollIntoView',
      scrollDescriptor,
    )
  else Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView')
  if (scrollToDescriptor)
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', scrollToDescriptor)
  else Reflect.deleteProperty(HTMLElement.prototype, 'scrollTo')
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('table cell keyboard navigation', () => {
  it('is opt-in and leaves legacy editable cells focusable', async () => {
    const wrapper = setup({ keyboardConfig: false, editConfig: true })
    expect(await wrapper.vm.setActiveCell(0, 0)).toBe(false)
    expect(
      wrapper
        .get('.s-table__data-cell[data-column-index="0"]')
        .attributes('tabindex'),
    ).toBe('0')
    expect(wrapper.vm.getActiveCell()).toBeNull()
  })
  it('uses visual fixed-column order, wraps Tab, exits at edges and never selects a row', async () => {
    const wrapper = setup()
    expect(await wrapper.vm.setActiveCell(0, 2)).toBe(true)
    await press('ArrowRight')
    expect(wrapper.vm.getActiveCell()).toEqual({ rowKey: 1, columnKey: 'name' })
    await press('ArrowRight')
    expect(wrapper.vm.getActiveCell()?.columnKey).toBe('right')
    await press('Tab')
    expect(wrapper.vm.getActiveCell()).toEqual({ rowKey: 2, columnKey: 'left' })
    await press('Tab', { shiftKey: true })
    expect(wrapper.vm.getActiveCell()).toEqual({
      rowKey: 1,
      columnKey: 'right',
    })
    await wrapper.vm.setActiveCell(1, 1)
    expect((await press('Tab')).defaultPrevented).toBe(false)
    expect(wrapper.emitted('update:highlight')).toBeUndefined()
    await press('Escape')
    expect(wrapper.vm.getActiveCell()).toBeNull()
    expect(document.activeElement).toBe(wrapper.get('.s-table').element)
  })
  it('respects controlled refusal and accepted model updates', async () => {
    const wrapper = setup({ activeCell: null })
    expect(await wrapper.vm.setActiveCell(0, 0)).toBe(false)
    expect(wrapper.vm.getActiveCell()).toBeNull()
    expect(wrapper.emitted('activeCellChange')).toBeUndefined()
    await wrapper.setProps({ activeCell: { rowKey: 1, columnKey: 'name' } })
    expect(await wrapper.vm.setActiveCell(0, 0)).toBe(true)
    await press('ArrowDown')
    expect(wrapper.vm.getActiveCell()?.rowKey).toBe(1)
    expect(wrapper.emitted('update:activeCell')?.at(-1)).toEqual([
      { rowKey: 2, columnKey: 'name' },
    ])
  })
  it('preserves editor shortcuts and IME then restores cell focus on cancel', async () => {
    const wrapper = setup({ editConfig: true })
    await wrapper.vm.setActiveCell(0, 0)
    expect(
      (await press('ArrowDown', { isComposing: true })).defaultPrevented,
    ).toBe(false)
    expect(wrapper.vm.getActiveCell()?.rowKey).toBe(1)
    await press('Enter')
    expect(document.activeElement?.tagName).toBe('INPUT')
    expect((await press('ArrowDown')).defaultPrevented).toBe(false)
    expect((await press('Tab')).defaultPrevented).toBe(false)
    await press('Escape')
    expect(wrapper.find('.s-table__cell-editor').exists()).toBe(false)
    expect(document.activeElement?.getAttribute('data-column-index')).toBe('0')
    expect(wrapper.vm.getActiveCell()?.rowKey).toBe(1)
  })
  it('follows stable row keys after sorting and clears a removed active row', async () => {
    const wrapper = setup()
    await wrapper.vm.setActiveCell(0, 0)
    await wrapper.setProps({ data: [data[1], data[0]] })
    await press('ArrowUp')
    expect(wrapper.vm.getActiveCell()?.rowKey).toBe(2)
    await wrapper.setProps({ data: [data[0]] })
    await settle()
    expect(wrapper.vm.getActiveCell()).toBeNull()
  })
  it('skips hidden columns after column management and supports declarative tree columns', async () => {
    const active = ref<TableActiveCell | null>(null)
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(
            Table,
            {
              data: [
                { id: 1, name: 'Parent', children: [{ id: 2, name: 'Child' }] },
              ],
              rowKey: 'id',
              treeConfig: {},
              expandedKeys: [1],
              keyboardConfig: true,
              activeCell: active.value,
              'onUpdate:activeCell': (cell: TableActiveCell | null) => {
                active.value = cell
              },
              columnState: [{ key: 'hidden', hidden: true }],
            },
            {
              default: () => [
                h(TableColumn, { field: 'name', treeNode: true }),
                h(TableColumn, { field: 'hidden' }),
                h(TableColumn, { field: 'last', fixed: 'right' }),
              ],
            },
          ),
      }),
      { attachTo: document.body },
    )
    wrappers.push(wrapper)
    const table = wrapper.getComponent(Table)
    await settle()
    expect(await table.vm.setActiveCell(0, 0)).toBe(true)
    await press('ArrowRight')
    expect(active.value?.columnKey).toBe('last')
    await press('ArrowDown')
    expect(active.value?.rowKey).toBe(2)
  })
  it('navigates both generated axes without scanning rows or columns', async () => {
    const row = vi.fn((index) => ({ id: index, name: `Row ${index}` }))
    const column = vi.fn((index) => ({
      field: 'name',
      title: String(index),
      width: 140,
    }))
    const wrapper = setup({
      keyboardConfig: { rowIndexOf: (key: number) => key },
      virtualSource: {
        rowCount: 1_000_000,
        columnCount: 100_000,
        row,
        column,
        rowKey: (index: number) => index,
        columnWidth: () => 140,
        fixedLeftCount: 1,
        fixedRightCount: 1,
      },
      virtualConfig: { height: 200, horizontal: true, dynamic: true },
    })
    await settle()
    expect(await wrapper.vm.setActiveCell(999998, 99998)).toBe(true)
    await press('ArrowDown')
    expect(wrapper.vm.getActiveCell()).toEqual({
      rowKey: 999999,
      columnKey: '99998',
    })
    await press('ArrowRight')
    expect(wrapper.vm.getActiveCell()?.columnKey).toBe('99999')
    expect(wrapper.findAll('.s-table__data-row').length).toBeLessThan(30)
    expect(row.mock.calls.length).toBeLessThan(2000)
    expect(column.mock.calls.length).toBeLessThan(2000)
  })
  it('parks focus when a virtual cell unmounts and never restores over outside focus', async () => {
    const wrapper = setup({
      data: Array.from({ length: 100 }, (_, id) => ({ id, name: `Row ${id}` })),
      virtualConfig: { height: 200 },
    })
    await settle()
    await wrapper.vm.setActiveCell(0, 0)
    wrapper.vm.scrollToRow(99)
    await settle()
    expect(document.activeElement).toBe(wrapper.get('.s-table').element)
    wrapper.vm.scrollToRow(0)
    await settle()
    expect(document.activeElement?.getAttribute('data-column-index')).toBe('0')
    const outside = document.createElement('button')
    document.body.append(outside)
    outside.focus()
    wrapper.vm.scrollToRow(99)
    await settle()
    wrapper.vm.scrollToRow(0)
    await settle()
    expect(document.activeElement).toBe(outside)
    outside.remove()
  })
  it('clears activity when paging away or collapsing the active descendant', async () => {
    const wrapper = setup({ pagerConfig: { pageSize: 1, currentPage: 1 } })
    await wrapper.vm.setActiveCell(0, 0)
    await wrapper.setProps({ pagerConfig: { pageSize: 1, currentPage: 2 } })
    await settle()
    expect(wrapper.vm.getActiveCell()).toBeNull()
    await wrapper.setProps({
      pagerConfig: false,
      data: [{ ...data[0], children: [data[1]] }],
      expandedKeys: [1],
      treeConfig: {},
    })
    expect(await wrapper.vm.setActiveCell(1, 0)).toBe(true)
    await wrapper.setProps({ expandedKeys: [] })
    await settle()
    expect(wrapper.vm.getActiveCell()).toBeNull()
  })
  it('keeps only the latest pending navigation and settles on unmount', async () => {
    const wrapper = setup()
    const first = wrapper.vm.setActiveCell(0, 0)
    const second = wrapper.vm.setActiveCell(1, 0)
    expect(await first).toBe(false)
    expect(await second).toBe(true)
    expect(wrapper.vm.getActiveCell()?.rowKey).toBe(2)
    const pending = wrapper.vm.setActiveCell(0, 0)
    wrapper.unmount()
    expect(await pending).toBe(false)
    wrappers.splice(wrappers.indexOf(wrapper), 1)
  })
})
