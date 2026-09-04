import { h, nextTick, ref } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Table from '../src/table.vue'
import TableColumn from '../src/table-column.vue'
import type { TableColumn as Column, TableMergeQuery } from '../src/table'

const columns: Column[] = [
  { field: 'name', width: 120, editor: true },
  { field: 'quantity', width: 120, editor: { type: 'number' } },
  { field: 'id', width: 120 },
]
const data = Array.from({ length: 4 }, (_, id) => ({
  id,
  name: `Row ${id}`,
  quantity: id + 1,
}))
const range = { row: 0, col: 0, rowspan: 2, colspan: 2 }
const wrappers: { unmount(): void }[] = []
const setup = (props = {}, slots = {}) => {
  const wrapper = mount(Table, {
    attachTo: document.body,
    props: {
      data,
      columns,
      rowKey: 'id',
      mergeConfig: { body: [range] },
      ...props,
    },
    slots,
  })
  wrappers.push(wrapper)
  return wrapper
}
const settle = async () => {
  for (let i = 0; i < 3; i++) {
    await nextTick()
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
    await flushPromises()
  }
}
const scrollToDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollTo',
)
const intoViewDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollIntoView',
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
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
    function (this: HTMLElement) {
      const root = this.closest('[role="table"]')
      const row = this.closest<HTMLElement>(
        '[data-table-row-index],[data-footer-row-index]',
      )
      const mounted = [
        ...(root?.querySelectorAll<HTMLElement>(
          '.s-vl__item [data-table-row-index]',
        ) ?? []),
      ]
      const first = mounted.length
        ? Math.min(...mounted.map((item) => Number(item.dataset.tableRowIndex)))
        : 0
      const index = row
        ? Number(
            row.dataset.tableRowIndex ?? Number(row.dataset.footerRowIndex) + 4,
          ) - first
        : 0
      const isCell = Object.hasOwn(this.dataset, 'columnIndex')
      const position = Number(
        this.dataset.columnPosition ??
          Number(this.getAttribute('aria-colindex')) - 1,
      )
      const left = isCell ? Math.max(0, position) * 120 : 0
      const top = row ? 44 + index * 44 : 0
      const width = isCell ? 120 : 600
      const height = row ? 44 : 200
      return {
        x: left,
        y: top,
        left,
        top,
        width,
        height,
        right: left + width,
        bottom: top + height,
      } as DOMRect
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
    ['scrollTo', scrollToDescriptor],
    ['scrollIntoView', intoViewDescriptor],
  ] as const) {
    if (descriptor)
      Object.defineProperty(HTMLElement.prototype, key, descriptor)
    else Reflect.deleteProperty(HTMLElement.prototype, key)
  }
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('table merge integration', () => {
  it('renders an owner once, keeps source tracks, and restores normal cells when disabled', async () => {
    const wrapper = setup()
    await settle()
    expect(wrapper.findAll('.s-table__merge-placeholder')).toHaveLength(4)
    const owner = wrapper.get('[data-merge-primary] [role="cell"]')
    expect(owner.text()).toBe('Row 0')
    expect(owner.attributes('aria-colspan')).toBe('2')
    expect(wrapper.get('[data-merge-primary]').attributes('style')).toContain(
      'width: 240px',
    )
    expect(wrapper.get('[data-merge-primary]').attributes('style')).toContain(
      'height: 88px',
    )
    await wrapper.setProps({ mergeConfig: false })
    await settle()
    expect(wrapper.findAll('[data-table-merge-layer]')).toHaveLength(0)
    expect(wrapper.findAll('.s-table__data-cell')).toHaveLength(12)
    expect(data[0]).toEqual({ id: 0, name: 'Row 0', quantity: 1 })
  })

  it('preserves declarative cell slots and independently formats merged footer rows', async () => {
    const wrapper = setup(
      {
        columns: [],
        footerData: [{ name: 'Total' }, { name: 'Average' }],
        mergeConfig: {
          body: [{ ...range, colspan: 1 }],
          footer: [{ ...range, colspan: 1 }],
        },
      },
      {
        default: () =>
          h(
            TableColumn,
            {
              field: 'name',
              width: 120,
              footerFormatter: ({ value }: { value: unknown }) =>
                `Summary: ${value}`,
            },
            {
              default: ({ value }: { value: unknown }) =>
                h('strong', String(value)),
            },
          ),
      },
    )
    await settle()
    expect(
      wrapper.get('[data-merge-primary]:not(.is-footer-merge) strong').text(),
    ).toBe('Row 0')
    expect(wrapper.get('.is-footer-merge [role="cell"]').text()).toBe(
      'Summary: Total',
    )
    await wrapper.get('.is-footer-merge [role="cell"]').trigger('click')
    expect(wrapper.emitted('footerCellClick')?.[0][0]).toMatchObject({
      rowIndex: 0,
      value: 'Total',
    })
  })

  it('routes fixed-pane continuation interactions to a single original owner', async () => {
    const menu = vi.fn(() => [{ label: 'Inspect', value: 'inspect' }])
    const wrapper = setup({
      columns: [
        { ...columns[0], fixed: 'left' },
        columns[1],
        { ...columns[2], fixed: 'right' },
      ],
      mergeConfig: { body: [{ ...range, colspan: 3 }] },
      keyboardConfig: true,
      editConfig: true,
      contextMenuConfig: { body: menu },
    })
    await settle()
    expect(wrapper.findAll('[data-merge-primary]')).toHaveLength(1)
    const continuation = wrapper.findAll(
      '[data-merge-region]:not([data-merge-primary])',
    )[1]
    expect(continuation.exists()).toBe(true)
    await continuation.trigger('click')
    await settle()
    expect(wrapper.emitted('cellClick')?.[0][0]).toMatchObject({
      rowIndex: 0,
      columnIndex: 0,
      value: 'Row 0',
    })
    expect(wrapper.vm.getActiveCell()).toEqual({ rowKey: 0, columnKey: 'name' })
    await continuation.trigger('dblclick')
    await settle()
    expect(wrapper.findAll('[data-table-merge-layer] input')).toHaveLength(1)
    await wrapper.vm.cancelEdit()
    await settle()
    await continuation.trigger('contextmenu', { clientX: 280, clientY: 80 })
    await settle()
    expect(menu).toHaveBeenCalledWith(
      expect.objectContaining({
        area: 'body',
        rowIndex: 0,
        columnIndex: 0,
        value: 'Row 0',
      }),
    )
    expect(data[0]).toEqual({ id: 0, name: 'Row 0', quantity: 1 })
  })

  it('updates factory ranges reactively and uses current sorted/page positions', async () => {
    const span = ref(2)
    const rule = vi.fn((query: TableMergeQuery) => {
      expect(query.rowAt(0)).toBeDefined()
      return [{ ...range, rowspan: span.value }]
    })
    const wrapper = setup({
      mergeConfig: { body: rule },
      pagerConfig: { pageSize: 2 },
    })
    await settle()
    expect(wrapper.get('[data-merge-primary]').attributes('style')).toContain(
      'height: 88px',
    )
    span.value = 1
    await settle()
    expect(wrapper.get('[data-merge-primary]').attributes('style')).toContain(
      'height: 44px',
    )
    await wrapper.setProps({ pagerConfig: { pageSize: 2, currentPage: 2 } })
    await settle()
    expect(wrapper.get('[data-merge-primary] [role="cell"]').text()).toBe(
      'Row 2',
    )
    expect(rule).toHaveBeenCalled()
  })

  it('updates declarative callbacks without a column registration loop', async () => {
    const formatter = ref((value: unknown) => `First: ${value}`)
    const wrapper = setup(
      { columns: [], footerData: [{ name: 'Total' }], mergeConfig: false },
      {
        default: () =>
          h(TableColumn, {
            field: 'name',
            width: 120,
            footerFormatter: ({ value }: { value: unknown }) =>
              formatter.value(value),
          }),
      },
    )
    await settle()
    expect(wrapper.get('.s-table__footer-cell').text()).toBe('First: Total')
    formatter.value = (value) => `Second: ${value}`
    await settle()
    expect(wrapper.get('.s-table__footer-cell').text()).toBe('Second: Total')
  })

  it('normalizes programmatic edit and keyboard movement to merged owners', async () => {
    const wrapper = setup({ keyboardConfig: true, editConfig: true })
    await settle()
    expect(await wrapper.vm.setActiveCell(1, 1)).toBe(true)
    expect(wrapper.vm.getActiveCell()).toEqual({ rowKey: 0, columnKey: 'name' })
    document.activeElement!.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
        cancelable: true,
      }),
    )
    await settle()
    expect(wrapper.vm.getActiveCell()).toEqual({ rowKey: 0, columnKey: 'id' })
    expect(await wrapper.vm.startEdit(1, 1)).toBe(true)
    await settle()
    const input = wrapper.get('[data-merge-primary] input')
    expect((input.element as HTMLInputElement).value).toBe('Row 0')
    await input.setValue('Updated owner')
    expect(await wrapper.vm.commitEdit()).toBe(true)
    expect(wrapper.emitted('editCommit')?.[0][0]).toMatchObject({
      rowKey: 0,
      columnKey: 'name',
      changes: [{ field: 'name', value: 'Updated owner', oldValue: 'Row 0' }],
    })
    expect(data[0].name).toBe('Row 0')
  })

  it('requests a controlled covered address normalization without pretending it was accepted', async () => {
    const wrapper = setup({
      keyboardConfig: true,
      activeCell: { rowKey: 1, columnKey: 'quantity' },
    })
    await settle()
    expect(wrapper.emitted('update:activeCell')?.[0]).toEqual([
      { rowKey: 0, columnKey: 'name' },
    ])
    expect(wrapper.vm.getActiveCell()).toBeNull()
    await wrapper.setProps({ activeCell: { rowKey: 0, columnKey: 'name' } })
    await settle()
    expect(wrapper.vm.getActiveCell()).toEqual({ rowKey: 0, columnKey: 'name' })
    expect(
      wrapper.get('[data-merge-primary] [role="cell"]').classes(),
    ).toContain('is-active-cell')
  })

  it('reconciles an active cell and edit session when a new range covers its position', async () => {
    const wrapper = setup({
      keyboardConfig: true,
      editConfig: true,
      mergeConfig: false,
    })
    await settle()
    await wrapper.vm.setActiveCell(1, 1)
    await wrapper.vm.startEdit(1, 1)
    await settle()
    await wrapper.setProps({ mergeConfig: { body: [range] } })
    await settle()
    expect(wrapper.vm.getActiveCell()).toEqual({ rowKey: 0, columnKey: 'name' })
    const cancellations = wrapper.emitted('editCancel') ?? []
    expect(cancellations[cancellations.length - 1]?.[0]).toMatchObject({
      reason: 'columns',
    })
    expect(wrapper.find('[data-merge-primary] input').exists()).toBe(false)
  })

  it('navigates and edits an owner before the current generated page without leaving that page', async () => {
    const wrapper = setup({
      data: [],
      columns: [],
      virtualSource: {
        rowCount: 8,
        columnCount: 3,
        row: (index: number) => ({ id: index, name: `Generated ${index}` }),
        rowKey: (index: number) => index,
        column: () => ({ field: 'name', width: 120, editor: true }),
        columnWidth: () => 120,
      },
      virtualConfig: { height: 200, dynamic: true },
      pagerConfig: { pageSize: 2, currentPage: 2 },
      keyboardConfig: { rowIndexOf: (key: unknown) => Number(key) },
      editConfig: true,
      mergeConfig: { body: [{ row: 0, col: 0, rowspan: 4, colspan: 2 }] },
    })
    await settle()
    expect(await wrapper.vm.setActiveCell(3, 1)).toBe(true)
    expect(wrapper.vm.getActiveCell()).toEqual({ rowKey: 0, columnKey: '0' })
    await wrapper
      .get('[data-merge-primary] [role="cell"]')
      .trigger('keydown', { key: 'ArrowRight' })
    await settle()
    expect(wrapper.vm.getActiveCell()).toEqual({ rowKey: 2, columnKey: '2' })
    await wrapper
      .get(
        '.s-table__data-row[data-table-row-index="0"] [data-column-index="2"]',
      )
      .trigger('keydown', { key: 'ArrowLeft' })
    await settle()
    expect(wrapper.vm.getActiveCell()).toEqual({ rowKey: 0, columnKey: '0' })
    await wrapper
      .get('[data-merge-primary] [role="cell"]')
      .trigger('keydown', { key: 'F2' })
    await settle()
    expect(wrapper.get('[data-merge-primary] input').element).toHaveProperty(
      'value',
      'Generated 0',
    )
    expect(wrapper.emitted('update:pagerConfig')).toBeUndefined()
    await wrapper.setProps({ mergeConfig: false })
    await settle()
    const cancellations = wrapper.emitted('editCancel') ?? []
    expect(cancellations[cancellations.length - 1]?.[0]).toMatchObject({
      reason: 'columns',
    })
  })

  it('keeps a giant offscreen-origin merge visible after jumping to the last generated rows', async () => {
    const row = vi.fn((index: number) => ({
      id: index,
      name: `Generated ${index}`,
    }))
    const wrapper = setup({
      data: [],
      columns: [],
      virtualSource: {
        rowCount: 1000000,
        columnCount: 2,
        row,
        rowKey: (index: number) => index,
        column: () => ({ field: 'name', width: 120, editor: true }),
        columnWidth: () => 120,
      },
      virtualConfig: { height: 200, dynamic: false },
      editConfig: true,
      keyboardConfig: { rowIndexOf: (key: unknown) => Number(key) },
      mergeConfig: { body: [{ row: 0, col: 0, rowspan: 1000000, colspan: 1 }] },
    })
    await settle()
    wrapper.vm.scrollToRow(999999)
    await settle()
    expect(wrapper.get('[data-merge-primary] [role="cell"]').text()).toBe(
      'Generated 0',
    )
    expect(
      Number(
        wrapper.get('[data-merge-primary]').attributes('data-merge-row-start'),
      ),
    ).toBeGreaterThan(999970)
    expect(wrapper.findAll('.s-vl__item').length).toBeLessThan(30)
    expect(row.mock.calls.length).toBeLessThan(2000)
    await wrapper.get('[data-merge-primary] [role="cell"]').trigger('dblclick')
    await settle()
    expect(wrapper.get('[data-merge-primary] input').element).toHaveProperty(
      'value',
      'Generated 0',
    )
    expect(
      Number(
        wrapper.get('[data-merge-primary]').attributes('data-merge-row-start'),
      ),
    ).toBeGreaterThan(999970)
    await wrapper.vm.cancelEdit()
    await wrapper.vm.setActiveCell(999999, 0)
    await settle()
    await wrapper
      .get('[data-merge-primary] [role="cell"]')
      .trigger('keydown', { key: 'F2' })
    await settle()
    expect(wrapper.get('[data-merge-primary] input').element).toHaveProperty(
      'value',
      'Generated 0',
    )
    expect(
      Number(
        wrapper.get('[data-merge-primary]').attributes('data-merge-row-start'),
      ),
    ).toBeGreaterThan(999970)
  })

  it('reprojects merged owners after sorting and filtering without changing source data', async () => {
    const wrapper = setup({
      columns: [
        {
          field: 'name',
          width: 120,
          sortable: true,
          filters: [{ label: 'Last', value: 'Row 3' }],
        },
        columns[1],
        columns[2],
      ],
      mergeConfig: { body: [{ ...range, colspan: 1 }] },
    })
    await settle()
    wrapper.vm.setSort([{ field: 'name', order: 'desc' }])
    await settle()
    expect(wrapper.get('[data-merge-primary] [role="cell"]').text()).toBe(
      'Row 3',
    )
    wrapper.vm.setFilters({ name: ['Row 3'] })
    await settle()
    expect(wrapper.find('[data-merge-primary]').exists()).toBe(false)
    expect(wrapper.findAll('.s-table__data-row')).toHaveLength(1)
    expect(data.map((row) => row.id)).toEqual([0, 1, 2, 3])
  })

  it('keeps a merged tree expander operable as lazy children enter and leave the virtual window', async () => {
    const parent = { id: 10, name: 'Parent', lazy: true }
    const load = vi.fn(async () => [
      { id: 11, name: 'Child A' },
      { id: 12, name: 'Child B' },
    ])
    const wrapper = setup({
      data: [parent, { id: 20, name: 'Sibling' }],
      columns: [
        { field: 'name', width: 120, treeNode: true },
        columns[1],
        columns[2],
      ],
      treeConfig: { hasChildren: 'lazy', load },
      virtualConfig: { height: 200, dynamic: true },
      mergeConfig: { body: [{ row: 0, col: 0, rowspan: 2, colspan: 1 }] },
    })
    await settle()
    await wrapper
      .get('[data-merge-primary] button[aria-expanded]')
      .trigger('click')
    await settle()
    expect(load).toHaveBeenCalledTimes(1)
    expect(parent).not.toHaveProperty('children')
    expect(
      wrapper.get('[data-merge-primary] button').attributes('aria-expanded'),
    ).toBe('true')
    expect(wrapper.text()).toContain('Child B')
    expect(wrapper.text()).not.toContain('Child A')
    await wrapper
      .get('[data-merge-primary] button[aria-expanded]')
      .trigger('click')
    await settle()
    expect(
      wrapper.get('[data-merge-primary] button').attributes('aria-expanded'),
    ).toBe('false')
    expect(wrapper.text()).not.toContain('Child B')
    expect(load).toHaveBeenCalledTimes(1)
  })
})
