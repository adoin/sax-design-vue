import { h, nextTick, reactive } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Table from '../src/table.vue'
import TableColumn from '../src/table-column.vue'
import type {
  TableValidationContext,
  TableValidationResult,
} from '../src/table'

const columns = [{ field: 'name', title: 'Name', width: 180, editor: true }]
const scrollDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollTo',
)
const intoViewDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollIntoView',
)
describe('table validation integration', () => {
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
            this.querySelector<HTMLElement>('.s-vl__content')?.style.height ??
              '',
          ) || 200
        )
      },
    )
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      configurable: true,
      value(this: HTMLElement, options: ScrollToOptions) {
        if (options.left != null) this.scrollLeft = options.left
        if (options.top != null) this.scrollTop = options.top
        this.dispatchEvent(new Event('scroll'))
      },
    })
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: vi.fn(),
    })
  })
  afterEach(() => {
    for (const [key, descriptor] of [
      ['scrollTo', scrollDescriptor],
      ['scrollIntoView', intoViewDescriptor],
    ] as const) {
      if (descriptor)
        Object.defineProperty(HTMLElement.prototype, key, descriptor)
      else Reflect.deleteProperty(HTMLElement.prototype, key)
    }
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('validates manually without enabling editing and exposes accessible field errors', async () => {
    const data = reactive([{ id: 1, name: '' }])
    const wrapper = mount(Table, {
      attachTo: document.body,
      props: {
        data,
        columns,
        validationRules: { name: { required: true, message: 'Name missing' } },
      },
    })
    const result = await wrapper.vm.validateCell(0, 'name')
    expect(result).toMatchObject({ valid: false, checked: 1, cancelled: false })
    const cell = wrapper.get('.s-table__data-cell[aria-invalid="true"]')
    expect(wrapper.get('[role="alert"]').text()).toBe('Name missing')
    expect(cell.attributes('aria-describedby')).toBe(
      wrapper.get('[role="alert"]').attributes('id'),
    )
    expect(document.activeElement).toBe(cell.element)
    data[0] = { id: 1, name: 'External replacement' }
    await nextTick()
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    expect(wrapper.vm.getValidationErrors()).toEqual([])
    expect((await wrapper.vm.validateRow(0)).valid).toBe(true)
    wrapper.unmount()
  })

  it('ends editing before manual validation and restores errors only after a failed commit', async () => {
    const wrapper = mount(Table, {
      attachTo: document.body,
      props: {
        data: [{ id: 1, name: '' }],
        columns,
        editConfig: true,
        validationConfig: true,
        validationRules: { name: { required: true, message: 'Name missing' } },
      },
    })

    await wrapper.vm.startEdit(0, 'name')
    expect(wrapper.vm.getEditRecord()).not.toBeNull()
    expect(
      await wrapper.vm.validateCell(0, 'name', { scrollToError: false }),
    ).toMatchObject({ valid: false })
    expect(wrapper.vm.getEditRecord()).toBeNull()
    expect(wrapper.emitted('editCancel')?.at(-1)?.[0]).toMatchObject({
      reason: 'api',
    })
    expect(wrapper.get('.s-table__data-cell').classes()).toContain('is-invalid')

    await wrapper.vm.startEdit(0, 'name')
    await nextTick()
    expect(wrapper.vm.getValidationErrors()).toEqual([])
    expect(wrapper.get('.s-table__data-cell').classes()).not.toContain(
      'is-invalid',
    )
    expect(wrapper.find('.s-table__validation-marker').exists()).toBe(false)

    expect(await wrapper.vm.commitEdit()).toBe(false)
    await flushPromises()
    expect(wrapper.vm.getEditRecord()).not.toBeNull()
    expect(wrapper.vm.getValidationErrors()[0]?.message).toBe('Name missing')
    expect(wrapper.get('.s-table__data-cell').classes()).toContain('is-invalid')
    expect(wrapper.find('.s-table__validation-marker').exists()).toBe(true)
    wrapper.unmount()
  })

  it('shows validation callouts temporarily and while hovering without blocking editing', async () => {
    vi.useFakeTimers()
    const requestFrame = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback) => {
        callback(0)
        return 1
      })
    const wrapper = mount(Table, {
      attachTo: document.body,
      props: {
        data: [{ id: 1, name: '' }],
        columns,
        editConfig: true,
        validationRules: { name: { required: true, message: 'Name missing' } },
      },
    })
    const validationPopper = () =>
      wrapper
        .findAllComponents({ name: 'SPopper' })
        .find(
          (component) =>
            component.props('popperClass') === 's-table__validation-popover',
        )!

    try {
      await wrapper.vm.validateCell(0, 'name', { scrollToError: false })
      await nextTick()
      await nextTick()
      expect(validationPopper().props('visible')).toBe(true)

      vi.advanceTimersByTime(1999)
      await nextTick()
      expect(validationPopper().props('visible')).toBe(true)
      vi.advanceTimersByTime(1)
      await nextTick()
      expect(validationPopper().props('visible')).toBe(false)

      const cell = wrapper.get('.s-table__data-cell.is-invalid')
      await cell.trigger('mouseenter')
      expect(validationPopper().props('visible')).toBe(true)
      await cell.trigger('mouseleave')
      expect(validationPopper().props('visible')).toBe(false)

      await cell.trigger('mouseenter')
      await cell.trigger('dblclick')
      await nextTick()
      expect(wrapper.vm.getEditRecord()).not.toBeNull()
    } finally {
      wrapper.unmount()
      requestFrame.mockRestore()
      vi.useRealTimers()
    }
  })

  it('hides a teleported validation callout when its cell leaves the table viewport', async () => {
    const intersections = new Map<Element, IntersectionObserverCallback>()
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        private callback: IntersectionObserverCallback
        constructor(callback: IntersectionObserverCallback) {
          this.callback = callback
        }
        observe(element: Element) {
          intersections.set(element, this.callback)
        }
        unobserve() {}
        disconnect() {}
      },
    )
    const wrapper = mount(Table, {
      attachTo: document.body,
      props: {
        data: [{ id: 1, name: '' }],
        columns,
        validationRules: { name: { required: true, message: 'Name missing' } },
      },
    })

    await wrapper.vm.validateCell(0, 'name', { scrollToError: false })
    await flushPromises()
    const cell = wrapper.get('.s-table__data-cell.is-invalid')
    const validationPopper = wrapper
      .findAllComponents({ name: 'SPopper' })
      .find(
        (component) =>
          component.props('popperClass') === 's-table__validation-popover',
      )!
    await vi.waitFor(() =>
      expect(validationPopper.vm.triggerRef).toBe(cell.element),
    )
    const callout = document.querySelector<HTMLElement>(
      '.s-table__validation-popover',
    )!
    expect(callout.parentElement).toBe(
      wrapper.get('.s-table__validation-overlay-host').element,
    )
    expect(callout.style.display).not.toBe('none')

    const intersection = intersections.get(cell.element)
    expect(intersection).toBeDefined()
    intersection!(
      [{ isIntersecting: false } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    )
    await nextTick()
    expect(callout.style.visibility).toBe('hidden')
    await vi.waitFor(() => expect(callout.style.display).toBe('none'))
    wrapper.unmount()
  })

  it('uses the table loading state and blocks editing while validation runs', async () => {
    let finish!: (value: boolean) => void
    const wrapper = mount(Table, {
      attachTo: document.body,
      props: {
        data: [{ id: 1, name: 'Current' }],
        columns,
        editConfig: true,
        validationRules: {
          name: {
            validator: () =>
              new Promise<boolean>((resolve) => {
                finish = resolve
              }),
          },
        },
      },
    })

    const pending = wrapper.vm.validateCell(0, 'name', {
      scrollToError: false,
    })
    await vi.waitFor(() => expect(finish).toBeTypeOf('function'))
    expect(wrapper.find('.s-table__loading-mask').exists()).toBe(true)
    expect(wrapper.get('.s-table').attributes('aria-busy')).toBe('true')
    expect(await wrapper.vm.startEdit(0, 'name')).toBe(false)

    finish(true)
    expect(await pending).toMatchObject({ valid: true })
    await nextTick()
    expect(wrapper.find('.s-table__loading-mask').exists()).toBe(false)
    expect(wrapper.get('.s-table').attributes('aria-busy')).toBeUndefined()
    expect(await wrapper.vm.startEdit(0, 'name')).toBe(true)
    wrapper.unmount()
  })

  it('renders an overlaid multi-error navigator and cycles between fields', async () => {
    const wrapper = mount(Table, {
      attachTo: document.body,
      props: {
        data: [{ id: 1, name: '', other: '' }],
        columns: [{ field: 'name' }, { field: 'other' }],
        validationRules: {
          name: { required: true, message: 'Name missing' },
          other: { required: true, message: 'Other missing' },
        },
      },
    })

    await wrapper.vm.validate({ scrollToError: false })
    await flushPromises()
    expect(wrapper.get('.s-table__validation-navigator').text()).toContain(
      '1 of 2',
    )
    await wrapper
      .get('.s-table__validation-navigation-action[aria-label="Next error"]')
      .trigger('click')
    await flushPromises()
    expect(document.activeElement?.getAttribute('data-column-index')).toBe('1')
    expect(wrapper.get('.s-table__validation-navigator').text()).toContain(
      '2 of 2',
    )
    await wrapper
      .get(
        '.s-table__validation-navigation-action[aria-label="Close error navigation"]',
      )
      .trigger('click')
    expect(wrapper.find('.s-table__validation-navigator').exists()).toBe(false)
    expect(wrapper.findAll('.s-table__data-cell.is-invalid')).toHaveLength(2)
    wrapper.unmount()
  })

  it('shows a lower-bound error count when validation reaches maxErrors', async () => {
    const wrapper = mount(Table, {
      attachTo: document.body,
      props: {
        data: Array.from({ length: 100 }, (_, index) => ({
          id: index + 1,
          name: '',
        })),
        columns,
        validationRules: { name: { required: true } },
      },
    })

    const result = await wrapper.vm.validate({ scrollToError: false })
    await flushPromises()
    expect(result).toMatchObject({ truncated: true })
    expect(wrapper.get('.s-table__validation-count').text()).toBe('99+')
    expect(wrapper.get('.s-table__validation-position').text()).toContain(
      '1 of 99+',
    )

    await wrapper
      .get(
        '.s-table__validation-navigation-action[aria-label="Previous error"]',
      )
      .trigger('click')
    await flushPromises()
    expect(wrapper.get('.s-table__validation-position').text()).toContain(
      '99+ of 99+',
    )
    wrapper.unmount()
  })

  it('uses declarative column rules over global rules and allows explicit empty rules', async () => {
    const table = mount(Table, {
      props: {
        data: [{ id: 1, name: '', other: '' }],
        validationRules: {
          name: { message: 'Global', required: true },
          other: { required: true },
        },
      },
      slots: {
        default: () => [
          h(TableColumn, {
            field: 'name',
            rules: { required: true, message: 'Column' },
          }),
          h(TableColumn, { field: 'other', rules: [] }),
        ],
      },
    })
    await nextTick()
    const result: TableValidationResult = await table.vm.validate({
      scrollToError: false,
    })
    expect(result.errors.map((error) => error.message)).toEqual(['Column'])
    expect(result.checked).toBe(1)
    table.vm.clearValidation(1, 'name')
    expect(table.vm.getValidationErrors()).toEqual([])
    table.unmount()
  })

  it('renders newly added errors after another field already failed', async () => {
    const wrapper = mount(Table, {
      props: {
        data: [{ id: 1, name: '', other: '' }],
        columns: [{ field: 'name' }, { field: 'other' }],
        validationRules: {
          name: { required: true },
          other: { required: true },
        },
      },
    })
    await wrapper.vm.validateCell(0, 'name', { scrollToError: false })
    expect(wrapper.findAll('[role="alert"]')).toHaveLength(1)
    await wrapper.vm.validateCell(0, 'other', { scrollToError: false })
    expect(wrapper.findAll('[role="alert"]')).toHaveLength(2)
    wrapper.vm.clearValidation(1, 'name')
    await nextTick()
    expect(wrapper.findAll('[role="alert"]')).toHaveLength(1)
    wrapper.unmount()
  })

  it('validates all ruled row fields, retains invalid drafts, and commits only valid data', async () => {
    const data = [{ id: 1, name: 'A', quantity: -2 }]
    const wrapper = mount(Table, {
      props: {
        data,
        columns: [
          ...columns,
          {
            field: 'quantity',
            editor: { type: 'number' },
            rules: { type: 'number', min: 0 },
          },
        ],
        editConfig: { mode: 'row' },
        validationConfig: true,
        validationRules: { name: { required: true } },
      },
    })
    await wrapper.vm.startEdit(0, 'name')
    expect(await wrapper.vm.commitEdit()).toBe(false)
    expect(wrapper.vm.getEditRecord()).not.toBeNull()
    expect(wrapper.vm.getValidationErrors()[0].field).toBe('quantity')
    const inputs = wrapper.findAll('.s-table__cell-editor input')
    await inputs[1].setValue('3')
    expect(await wrapper.vm.commitEdit()).toBe(true)
    expect(wrapper.emitted('editCommit')![0][0]).toMatchObject({
      updatedRow: { quantity: 3 },
    })
    expect(data[0].quantity).toBe(-2)
    wrapper.unmount()
  })

  it('aborts old asynchronous rules after typing or cancelling an edit', async () => {
    const resolvers: Array<(value: boolean | string) => void> = []
    const signals: AbortSignal[] = []
    const validator = (params: TableValidationContext) => {
      signals.push(params.signal)
      return new Promise<boolean | string>((resolve) => resolvers.push(resolve))
    }
    const wrapper = mount(Table, {
      props: {
        data: [{ id: 1, name: 'A' }],
        columns,
        editConfig: true,
        validationConfig: true,
        validationRules: { name: { validator } },
      },
    })
    await wrapper.vm.startEdit(0, 0)
    const first = wrapper.vm.commitEdit()
    await vi.waitFor(() => expect(signals).toHaveLength(1))
    expect(wrapper.get('.s-table__data-cell').attributes('aria-busy')).not.toBe(
      'false',
    )
    await wrapper.get('.s-table__cell-editor input').setValue('New draft')
    expect(await first).toBe(false)
    expect(signals[0].aborted).toBe(true)
    const second = wrapper.vm.commitEdit()
    await vi.waitFor(() => expect(signals).toHaveLength(2))
    wrapper.vm.cancelEdit()
    expect(await second).toBe(false)
    resolvers.forEach((resolve) => resolve('Old failure'))
    await flushPromises()
    expect(wrapper.vm.getValidationErrors()).toEqual([])
    expect(wrapper.emitted('editCommit')).toBeUndefined()
    wrapper.unmount()
  })

  it('finds errors in collapsed loaded children and navigates the existing local pager', async () => {
    const data = reactive([
      { id: 1, name: 'Valid' },
      { id: 2, name: 'Parent', children: [{ id: 3, name: '' }] },
    ])
    const wrapper = mount(Table, {
      attachTo: document.body,
      props: {
        data,
        columns: [{ ...columns[0], treeNode: true }],
        treeConfig: {},
        pagerConfig: { pageSize: 1 },
        validationRules: { name: { required: true } },
      },
    })
    expect((await wrapper.vm.validate({ scope: 'view' })).valid).toBe(true)
    const result = await wrapper.vm.validate()
    expect(result.errors[0].rowKey).toBe(3)
    expect(wrapper.emitted('pageChange')!.at(-1)![0]).toMatchObject({
      currentPage: 2,
    })
    expect(wrapper.findAll('.s-table__data-row')).toHaveLength(2)
    expect(document.activeElement?.getAttribute('aria-invalid')).toBe('true')
    wrapper.unmount()
  })

  it('keeps failed page-change drafts and returns to their error without cancelling them', async () => {
    const wrapper = mount(Table, {
      props: {
        data: [
          { id: 1, name: '' },
          { id: 2, name: 'B' },
        ],
        columns,
        pagerConfig: { pageSize: 1 },
        editConfig: { onContextChange: 'commit' },
        validationConfig: true,
        validationRules: { name: { validator: async () => 'Rejected' } },
      },
    })
    await wrapper.vm.startEdit(0, 0)
    await wrapper
      .get('.s-table__pagination button[aria-label="2"]')
      .trigger('click')
    await flushPromises()
    expect(wrapper.vm.getEditRecord()?.rowKey).toBe(1)
    expect(wrapper.vm.getValidationErrors()[0]?.message).toBe('Rejected')
    expect(wrapper.emitted('editCancel')).toBeUndefined()
    expect(wrapper.emitted('editCommit')).toBeUndefined()
    wrapper.unmount()
  })

  it('reports failed positioning when a controlled page change is refused', async () => {
    const data = reactive([
      { id: 1, name: 'A' },
      { id: 2, name: '' },
    ])
    const wrapper = mount(Table, {
      props: {
        data,
        columns,
        pagerConfig: { currentPage: 1, pageSize: 1 },
        validationRules: { name: { required: true } },
      },
    })
    const result = await wrapper.vm.validate({ scrollToError: false })
    expect(result.errors).toHaveLength(1)
    expect(await wrapper.vm.scrollToValidationError()).toBe(false)
    expect(wrapper.emitted('update:pagerConfig')!.at(-1)![0]).toMatchObject({
      currentPage: 2,
    })
    expect(wrapper.findAll('.s-table__data-row')[0].text()).toBe('A')
    wrapper.unmount()
  })

  it('keeps error IDs distinct when several columns display the same field', async () => {
    const wrapper = mount(Table, {
      attachTo: document.body,
      props: {
        data: [{ id: 1, name: '' }],
        columns: [
          { key: 'first', field: 'name' },
          { key: 'second', field: 'name' },
        ],
        validationRules: { name: { required: true } },
      },
    })
    await wrapper.vm.validateCell(0, 'second')
    const alerts = wrapper.findAll('[role="alert"]')
    expect(new Set(alerts.map((item) => item.attributes('id'))).size).toBe(2)
    expect(document.activeElement?.getAttribute('data-column-index')).toBe('1')
    wrapper.unmount()
  })

  it('validates and locates a far generated cell with bounded row and column reads', async () => {
    const row = vi.fn(
      (index: number) =>
        new Proxy(
          { id: index },
          {
            get(target, key, receiver) {
              return typeof key === 'string' && key.startsWith('value_')
                ? ''
                : Reflect.get(target, key, receiver)
            },
          },
        ),
    )
    const column = vi.fn((index: number) => ({
      key: String(index),
      field: `value_${index}`,
      width: 140,
    }))
    const wrapper = mount(Table, {
      attachTo: document.body,
      props: {
        virtualSource: {
          rowCount: 1_000_000,
          columnCount: 100_000,
          row,
          column,
          columnWidth: 140,
        },
        virtualConfig: { height: 200, horizontal: true },
        validationRules: { value_99998: { required: true } },
      },
    })
    await flushPromises()
    const result = await wrapper.vm.validateCell(999_999, 99_998)
    await flushPromises()
    expect(result.errors[0]).toMatchObject({
      rowKey: 999_999,
      columnIndex: 99_998,
    })
    expect(wrapper.findAll('.s-table__data-row').length).toBeLessThan(20)
    expect(wrapper.find('[data-column-index="99998"]').exists()).toBe(true)
    expect(row.mock.calls.length).toBeLessThan(200)
    expect(column.mock.calls.length).toBeLessThan(400)
    wrapper.unmount()
  })

  it('cycles between distant generated errors with bounded virtual-source reads', async () => {
    const invalidCells = new Set(['125000:1111', '875000:98765'])
    const row = vi.fn(
      (index: number) =>
        new Proxy(
          { id: index },
          {
            get(target, key, receiver) {
              if (typeof key === 'string' && key.startsWith('value_'))
                return invalidCells.has(`${target.id}:${key.slice(6)}`)
                  ? ''
                  : 'valid'
              return Reflect.get(target, key, receiver)
            },
          },
        ),
    )
    const column = vi.fn((index: number) => ({
      key: String(index),
      field: `value_${index}`,
      width: 140,
    }))
    const wrapper = mount(Table, {
      attachTo: document.body,
      props: {
        virtualSource: {
          rowCount: 1_000_000,
          columnCount: 100_000,
          row,
          column,
          columnWidth: 140,
        },
        rowKey: 'id',
        virtualConfig: { height: 200, horizontal: true },
        validationRules: {
          value_1111: { required: true },
          value_98765: { required: true },
        },
      },
    })
    await flushPromises()

    const result: TableValidationResult = await wrapper.vm.validate({
      rows: [125_000, 875_000],
      columns: [1_111, 98_765],
      scrollToError: false,
    })
    await flushPromises()
    expect(
      result.errors.map((error) => [error.rowIndex, error.columnIndex]),
    ).toEqual([
      [125_000, 1_111],
      [875_000, 98_765],
    ])
    expect(wrapper.get('.s-table__validation-navigator').text()).toContain(
      '1 of 2',
    )
    const next = () =>
      wrapper
        .get('.s-table__validation-navigation-action[aria-label="Next error"]')
        .trigger('click')
    const previous = () =>
      wrapper
        .get(
          '.s-table__validation-navigation-action[aria-label="Previous error"]',
        )
        .trigger('click')
    const expectFocusedCell = (rowIndex: number, columnIndex: number) => {
      const cell = wrapper.get(
        `[data-row-key="${rowIndex}"] [role="cell"][data-column-index="${columnIndex}"]`,
      )
      expect(document.activeElement).toBe(cell.element)
      expect(wrapper.findAll('.s-table__data-row').length).toBeLessThan(20)
    }

    await next()
    await flushPromises()
    expectFocusedCell(875_000, 98_765)
    expect(
      document.querySelector('.s-table__validation-popover')?.parentElement,
    ).toBe(wrapper.get('.s-table__validation-overlay-host').element)
    expect(wrapper.get('.s-table__validation-navigator').text()).toContain(
      '2 of 2',
    )

    await next()
    await flushPromises()
    expectFocusedCell(125_000, 1_111)
    expect(wrapper.get('.s-table__validation-navigator').text()).toContain(
      '1 of 2',
    )

    await previous()
    await flushPromises()
    expectFocusedCell(875_000, 98_765)
    expect(wrapper.get('.s-table__validation-navigator').text()).toContain(
      '2 of 2',
    )
    expect(row.mock.calls.length).toBeLessThan(500)
    expect(column.mock.calls.length).toBeLessThan(1_000)
    wrapper.unmount()
  })
})
