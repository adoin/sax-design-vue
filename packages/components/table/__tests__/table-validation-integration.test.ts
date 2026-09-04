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
})
