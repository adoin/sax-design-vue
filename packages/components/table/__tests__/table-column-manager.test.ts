import { h, nextTick } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Table from '../src/table.vue'
import TableColumn from '../src/table-column.vue'
import ColumnManager from '../src/table-column-manager.vue'
import { SPopper } from '../../popper'
import { createColumnLayout } from '../src/composables/column-layout'
import type { TableColumnState } from '../src/table'

const columns = [
  { key: 'check', type: 'checkbox' as const, width: 50 },
  { field: 'id', title: 'ID', width: 80, fixed: 'left' as const },
  { field: 'name', title: 'Name', width: 160, sortable: true, treeNode: true },
  { field: 'description', title: 'Description', width: 220 },
  { field: 'status', title: 'Status', width: 120, fixed: 'right' as const },
]
const data = [
  {
    id: 1,
    name: 'B',
    description: 'Parent',
    children: [{ id: 3, name: 'Child' }],
  },
  { id: 2, name: 'A' },
]
const headers = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findAll('[role="columnheader"]')
const titles = (wrapper: ReturnType<typeof mount>) =>
  headers(wrapper).map((header) => header.text())
const scrollDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollTo',
)

describe('column management', () => {
  beforeEach(() => {
    localStorage.clear()
    for (const dimension of ['offsetHeight', 'clientHeight'] as const)
      vi.spyOn(HTMLElement.prototype, dimension, 'get').mockReturnValue(200)
    for (const dimension of ['offsetWidth', 'clientWidth'] as const)
      vi.spyOn(HTMLElement.prototype, dimension, 'get').mockReturnValue(600)
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function (this: HTMLElement) {
        const width = Number.parseFloat(this.style.width) || 120
        return {
          width,
          height: 48,
          left: 0,
          top: 0,
          right: width,
          bottom: 48,
        } as DOMRect
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

  it('reorders from the rendered buttons and restores trigger focus after Escape', async () => {
    const wrapper = mount(Table, {
      attachTo: document.body,
      props: { data, columns, columnManagerConfig: true },
    })
    await wrapper.get('.s-table__column-manager button').trigger('click')
    await vi.waitFor(() =>
      expect(document.querySelector('.s-table__column-panel')).not.toBeNull(),
    )
    const button = document.querySelector<HTMLButtonElement>(
      '.s-table__column-panel [data-column-key="description"] button[data-action="up"]',
    )!
    button.click()
    await nextTick()
    expect(titles(wrapper)).toEqual(['ID', '', 'Description', 'Name', 'Status'])
    expect(wrapper.emitted('update:columnState')?.[0]?.[0]).toEqual([
      { key: 'description', order: 2 },
      { key: 'name', order: 3 },
    ])
    await flushPromises()
    document
      .querySelector('[role="dialog"]')!
      .dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
      )
    await nextTick()
    // Vue Test Utils stubs transitions; complete the shared popper's leave phase.
    wrapper.getComponent(ColumnManager).getComponent(SPopper).vm.$emit('hide')
    expect(document.activeElement).toBe(
      wrapper.get('.s-table__column-manager button').element,
    )
    wrapper.unmount()
  })

  it('is opt-in, preserves hidden selection/query columns and restores declarative defaults', async () => {
    const wrapper = mount(Table, {
      props: { data, sortBy: [{ field: 'name', order: 'asc' }] },
      slots: { default: () => columns.map((column) => h(TableColumn, column)) },
    })
    expect(wrapper.findComponent(ColumnManager).exists()).toBe(false)
    await wrapper.setProps({ columnManagerConfig: true })
    const manager = wrapper.getComponent(ColumnManager).props('manager')
    manager.update('check', { hidden: true })
    manager.update('name', { hidden: true })
    manager.update('description', { fixed: 'left' })
    manager.move('description', -1)
    await nextTick()
    expect(titles(wrapper)).toEqual(['ID', 'Description', 'Status'])
    expect(wrapper.findAll('.s-table__data-row')[0].text()).toContain('2')
    wrapper.vm.setSelectedRows(data)
    expect(wrapper.emitted('update:row')?.[0]?.[0]).toEqual(data)
    expect(
      headers(wrapper).map((header) => header.attributes('aria-colindex')),
    ).toEqual(['1', '2', '3'])
    expect(headers(wrapper)[1].classes()).toContain('is-fixed-left')
    manager.reset()
    await nextTick()
    expect(titles(wrapper)).toEqual(['ID', '', 'Name', 'Description', 'Status'])
    expect(columns[3]).not.toHaveProperty('fixed')
    wrapper.unmount()
  })

  it('waits for controlled acceptance, respects loading and supports all columns hidden', async () => {
    const wrapper = mount(Table, {
      props: { data, columns, columnManagerConfig: true, columnState: [] },
    })
    const manager = wrapper.getComponent(ColumnManager).props('manager')
    manager.update('name', { hidden: true })
    await nextTick()
    expect(titles(wrapper)).toContain('Name')
    const proposal = wrapper.emitted(
      'update:columnState',
    )![0][0] as TableColumnState[]
    await wrapper.setProps({ columnState: proposal })
    expect(titles(wrapper)).not.toContain('Name')
    await wrapper.setProps({ loading: true })
    manager.reset()
    expect(wrapper.emitted('update:columnState')).toHaveLength(1)
    await wrapper.setProps({
      loading: false,
      columnState: columns.map((column) => ({
        key: column.key ?? column.field!,
        hidden: true,
      })),
    })
    expect(headers(wrapper)).toHaveLength(0)
    expect(wrapper.findComponent(ColumnManager).exists()).toBe(true)
    manager.reset()
    await wrapper.setProps({ columnState: [] })
    expect(headers(wrapper)).toHaveLength(columns.length)
    wrapper.unmount()
  })

  it('persists only with an explicit key, handles key changes and storage failures', async () => {
    const storageKey = 'table-columns-test'
    localStorage.setItem(
      storageKey,
      JSON.stringify({ version: 1, columns: [{ key: 'name', hidden: true }] }),
    )
    const wrapper = mount(Table, {
      props: { data, columns, columnManagerConfig: { storageKey } },
    })
    await nextTick()
    expect(titles(wrapper)).not.toContain('Name')
    const manager = wrapper.getComponent(ColumnManager).props('manager')
    manager.update('status', { fixed: 'left' })
    await nextTick()
    expect(
      JSON.parse(localStorage.getItem(storageKey)!).columns,
    ).toContainEqual({ key: 'status', fixed: 'left' })
    await wrapper.setProps({
      columnManagerConfig: { storageKey: 'another-table' },
    })
    expect(titles(wrapper)).toContain('Name')
    const storage = Object.getPrototypeOf(localStorage)
    vi.spyOn(storage, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })
    manager.update('name', { hidden: true })
    await nextTick()
    expect(titles(wrapper)).not.toContain('Name')
    expect(wrapper.emitted('columnStorageError')?.at(-1)?.[0]).toMatchObject({
      operation: 'write',
    })
    vi.spyOn(storage, 'getItem').mockImplementation(() => {
      throw new Error('denied')
    })
    await wrapper.setProps({ columnManagerConfig: { storageKey: 'blocked' } })
    expect(wrapper.emitted('columnStorageError')?.at(-1)?.[0]).toMatchObject({
      operation: 'read',
    })
    expect(titles(wrapper)).toContain('Name')
    wrapper.unmount()
  })

  it('keeps key-based resizing and fixed/header/body alignment after reordering a tree', async () => {
    const wrapper = mount(Table, {
      props: {
        data,
        columns,
        columnManagerConfig: true,
        resizeConfig: true,
        treeConfig: { expandAll: true },
        pagerConfig: { pageSize: 5 },
        virtualConfig: { height: 200, horizontal: true, dynamic: true },
      },
    })
    await flushPromises()
    const manager = wrapper.getComponent(ColumnManager).props('manager')
    manager.update('description', { fixed: 'left', order: 0 })
    manager.update('check', { hidden: true })
    await nextTick()
    const first = headers(wrapper)[0]
    expect(first.text()).toBe('Description')
    await first
      .get('[role="separator"]')
      .trigger('keydown', { key: 'ArrowRight' })
    await flushPromises()
    expect(wrapper.emitted('update:columnWidths')?.[0]?.[0]).toEqual({
      description: 230,
    })
    expect(wrapper.findAll('.s-table__data-row')).toHaveLength(3)
    expect(headers(wrapper)[1].attributes('style')).toContain(
      'left: calc(230px)',
    )
    for (const row of wrapper.findAll('.s-table__data-row'))
      expect(row.findAll('[role="cell"]')[0].attributes('style')).toContain(
        'width: 230px',
      )
    wrapper.unmount()
  })

  it('reorders, hides and pins millions of generated columns without enumerating them', async () => {
    const column = vi.fn((index: number) => ({
      title: `C${index}`,
      field: `c${index}`,
      type: index === 0 ? ('checkbox' as const) : undefined,
    }))
    const row = vi.fn((id: number) => ({ id }))
    const count = 16_777_216
    const wrapper = mount(Table, {
      props: {
        columnManagerConfig: true,
        resizeConfig: true,
        columnWidths: { '8000000': 180 },
        virtualSource: {
          rowCount: 1_000_000,
          columnCount: count,
          columnWidth: 120,
          column,
          row,
          fixedLeftCount: 1,
          fixedRightCount: 1,
        },
        virtualConfig: { height: 200 },
      },
    })
    await flushPromises()
    const manager = wrapper.getComponent(ColumnManager).props('manager')
    manager.update('8000000', { order: 1 })
    manager.update('1', { hidden: true })
    manager.update('2', { fixed: 'right' })
    await flushPromises()
    expect(headers(wrapper)[1].text()).toBe('C8000000')
    expect(headers(wrapper)[1].attributes('style')).toContain('width: 180px')
    expect(wrapper.get('[role="table"]').attributes('aria-colcount')).toBe(
      String(count - 1),
    )
    expect(
      wrapper
        .findAll('.s-table__data-head-cell.is-fixed-right')
        .map((cell) => cell.text()),
    ).toEqual(['C2', `C${count - 1}`])
    expect(column.mock.calls.length).toBeLessThan(200)
    expect(row.mock.calls.length).toBeLessThan(300)
    expect(headers(wrapper).length).toBeLessThan(16)
    wrapper.vm.scrollToColumn(8000000, 'start')
    await flushPromises()
    expect(titles(wrapper)).toContain('C8000000')
    expect(manager.state.value).toHaveLength(3)
    manager.update('0', { hidden: true })
    await nextTick()
    wrapper.vm.setSelectedRows([{ id: 1 }, { id: 2 }])
    expect(wrapper.emitted('update:highlight')?.[0]?.[0]).toEqual([
      { id: 1 },
      { id: 2 },
    ])
    wrapper.unmount()
  })
})

describe('sparse column permutation', () => {
  it('resolves collisions and preserves a reversible permutation and fixed partitions', () => {
    const state: TableColumnState[] = [
      { key: '4', order: 1 },
      { key: '3', order: 1, fixed: 'left' },
      { key: '0', hidden: true },
      { key: '2', order: 4, fixed: 'right' },
    ]
    const layout = createColumnLayout({
      count: 6,
      state,
      indexForKey: Number,
      left: [],
      right: [],
    })
    expect(
      Array.from({ length: 6 }, (_, index) => layout.sourceAt(index)),
    ).toEqual([0, 3, 4, 1, 2, 5])
    for (let index = 0; index < 6; index++)
      expect(layout.sourceAt(layout.positionOf(index))).toBe(index)
    expect(layout.left).toEqual([3])
    expect(layout.right).toEqual([2])
    expect(
      Array.from({ length: layout.centerCount }, (_, index) =>
        layout.centerAt(index),
      ),
    ).toEqual([4, 1, 5])
    for (let index = 0; index < layout.centerCount; index++)
      expect(layout.centerIndexOf(layout.centerAt(index))).toBe(index)
    expect(layout.centerIndexOf(0)).toBe(-1)
    expect(layout.centerAt(-1)).toBe(-1)
  })
  it('handles end collisions, missing schema keys, and a sixteen-million-column sparse swap', () => {
    const small = createColumnLayout({
      count: 3,
      state: [
        { key: '0', order: 2 },
        { key: '1', order: 2 },
        { key: '99', hidden: true },
      ],
      indexForKey: Number,
      left: [],
      right: [],
    })
    expect([0, 1, 2].map(small.sourceAt)).toEqual([1, 2, 0])
    const count = 16_777_216
    const layout = createColumnLayout({
      count,
      state: [
        { key: '1', order: count - 2 },
        { key: String(count - 2), order: 1 },
      ],
      indexForKey: Number,
      left: [0],
      right: [count - 1],
    })
    expect(layout.centerAt(0)).toBe(count - 2)
    expect(layout.centerAt(count - 3)).toBe(1)
    expect(layout.positionOf(8_000_000)).toBe(8_000_000)
  })
})
