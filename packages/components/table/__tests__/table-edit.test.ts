import { defineComponent, h, nextTick, ref } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Table from '../src/table.vue'
import TableColumnComponent from '../src/table-column.vue'
import { SSelect } from '../../select'
import { SDatePicker } from '../../date-picker'
import { SSwitch } from '../../switch'
import type {
  TableColumn,
  TableEditEndParams,
  TableEditSlotParams,
} from '../src/table'

const data = [
  {
    id: 1,
    name: 'Alpha',
    quantity: 2,
    date: '2026-09-04',
    active: true,
    status: 'open',
  },
  {
    id: 2,
    name: 'Beta',
    quantity: 3,
    date: '2026-09-05',
    active: false,
    status: 'done',
  },
]
const columns: TableColumn[] = [
  { field: 'name', title: 'Name', editor: true, width: 180, fixed: 'left' },
  {
    field: 'quantity',
    title: 'Quantity',
    editor: { type: 'number' },
    width: 140,
  },
  {
    field: 'status',
    title: 'Status',
    editor: {
      type: 'select',
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Done', value: 'done' },
      ],
    },
    width: 140,
  },
  { field: 'date', title: 'Date', editor: { type: 'date' }, width: 200 },
  {
    field: 'active',
    title: 'Active',
    editor: { type: 'switch' },
    width: 100,
    fixed: 'right',
  },
]
const scrollDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollTo',
)
const intoViewDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollIntoView',
)

describe('table editing integration', () => {
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
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: vi.fn(),
    })
  })
  afterEach(() => {
    for (const [name, descriptor] of [
      ['scrollTo', scrollDescriptor],
      ['scrollIntoView', intoViewDescriptor],
    ] as const) {
      if (descriptor)
        Object.defineProperty(HTMLElement.prototype, name, descriptor)
      else Reflect.deleteProperty(HTMLElement.prototype, name)
    }
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('keeps editing opt-in and commits a draft with Enter without mutating data', async () => {
    const wrapper = mount(Table, {
      attachTo: document.body,
      props: { data, columns },
    })
    const cell = wrapper
      .findAll('.s-table__data-row')[0]
      .get('[data-column-index="0"]')
    await cell.trigger('dblclick')
    expect(wrapper.find('.s-table__cell-editor').exists()).toBe(false)
    await wrapper.setProps({ editConfig: true })
    await cell.trigger('dblclick')
    await nextTick()
    const input = wrapper.get<HTMLInputElement>('.s-table__cell-editor input')
    expect(document.activeElement).toBe(input.element)
    await input.setValue('Changed')
    expect(data[0].name).toBe('Alpha')
    await input.trigger('keydown', { key: 'Enter', isComposing: true })
    expect(wrapper.find('.s-table__cell-editor').exists()).toBe(true)
    await input.trigger('keydown', { key: 'Enter' })
    await nextTick()
    expect(wrapper.find('.s-table__cell-editor').exists()).toBe(false)
    const result = wrapper.emitted('editCommit')![0][0] as TableEditEndParams
    expect(result.updatedRow.name).toBe('Changed')
    expect(data[0].name).toBe('Alpha')
    expect(document.activeElement).toBe(cell.element)
    await wrapper.setProps({ data: [result.updatedRow, data[1]] })
    expect(cell.text()).toBe('Changed')
    wrapper.unmount()
  })

  it('reuses select, date and switch controls in row mode and submits all changed fields', async () => {
    const wrapper = mount(Table, {
      props: { data, columns, editConfig: { mode: 'row', trigger: 'manual' } },
    })
    expect(await wrapper.vm.startEdit(0, 'name')).toBe(true)
    expect(wrapper.findAll('.s-table__cell-editor')).toHaveLength(5)
    expect(wrapper.getComponent(SSelect).props('label')).toBeFalsy()
    expect(
      wrapper.getComponent(SSelect).get('input').attributes('aria-label'),
    ).toBe('Status')
    expect(wrapper.getComponent(SDatePicker).props('label')).toBeFalsy()
    expect(
      wrapper.getComponent(SDatePicker).get('input').attributes('aria-label'),
    ).toBe('Date')
    await wrapper.get('.s-table__cell-editor input').setValue('Renamed')
    const quantity = wrapper.findAll('.s-table__cell-editor')[1].get('input')
    await quantity.setValue('12')
    wrapper.getComponent(SSelect).vm.$emit('update:modelValue', 'done')
    wrapper
      .getComponent(SDatePicker)
      .vm.$emit('update:modelValue', '2026-10-01')
    wrapper.getComponent(SSwitch).vm.$emit('update:modelValue', false)
    await nextTick()
    await wrapper
      .getComponent(SSelect)
      .get('input')
      .trigger('keydown', { key: 'Enter', ctrlKey: true })
    const result = wrapper.emitted('editCommit')![0][0] as TableEditEndParams
    expect(result.reason).toBe('enter')
    expect(result.updatedRow).toMatchObject({
      name: 'Renamed',
      quantity: 12,
      status: 'done',
      date: '2026-10-01',
      active: false,
    })
    expect(result.changes).toHaveLength(5)
    expect(data[0].quantity).toBe(2)
    wrapper.unmount()
  })

  it('opens the next cell after the parent accepts the previous immutable commit', async () => {
    const Host = defineComponent({
      setup() {
        const rows = ref([...data])
        return () =>
          h(Table, {
            data: rows.value,
            columns,
            editConfig: true,
            onEditCommit: (params: TableEditEndParams) => {
              rows.value = rows.value.map((row) =>
                row.id === params.rowKey
                  ? (params.updatedRow as (typeof data)[number])
                  : row,
              )
            },
          })
      },
    })
    const wrapper = mount(Host)
    const table = wrapper.getComponent(Table)
    await table.vm.startEdit(0, 'name')
    await wrapper.get('.s-table__cell-editor input').setValue('Saved name')
    await wrapper
      .findAll('.s-table__data-row')[0]
      .get('[data-column-index="1"]')
      .trigger('dblclick')
    await flushPromises()
    expect(table.vm.getEditRecord()?.column.field).toBe('quantity')
    expect(table.vm.getEditRecord()?.row.name).toBe('Saved name')
    expect(
      wrapper.get<HTMLInputElement>('.s-table__cell-editor input').element
        .value,
    ).toBe('2')
    wrapper.unmount()
  })

  it('supports declarative edit slots and keeps the display renderer independent', async () => {
    const wrapper = mount(Table, {
      props: { data, editConfig: true },
      slots: {
        default: () =>
          h(
            TableColumnComponent,
            { field: 'name', editor: true },
            {
              default: ({ value }: { value: unknown }) =>
                h('strong', `Display ${value}`),
              edit: (params: TableEditSlotParams) =>
                h('input', {
                  value: params.value,
                  onInput: (event: Event) =>
                    params.setValue((event.target as HTMLInputElement).value),
                }),
            },
          ),
      },
    })
    await nextTick()
    expect(wrapper.findAll('strong')[0].text()).toBe('Display Alpha')
    await wrapper
      .findAll('.s-table__data-cell')[0]
      .trigger('keydown', { key: 'F2' })
    await wrapper.get('.s-table__cell-editor input').setValue('Discard')
    await wrapper
      .get('.s-table__cell-editor input')
      .trigger('keydown', { key: 'Escape' })
    expect(wrapper.findAll('strong')[0].text()).toBe('Display Alpha')
    expect(wrapper.emitted('editCancel')![0][0]).toMatchObject({
      reason: 'escape',
    })
    wrapper.unmount()
  })

  it('preserves editor precedence and commits or cancels on query and page changes', async () => {
    const renderer = vi.fn((params: TableEditSlotParams) =>
      h('input', { value: params.value }),
    )
    const wrapper = mount(Table, {
      props: {
        data,
        columns: [{ ...columns[0], renderer: 'custom' }],
        renderers: { custom: { edit: renderer } },
        editConfig: { onContextChange: 'commit' },
      },
      slots: {
        'edit-name': (params: TableEditSlotParams) =>
          h('input', {
            class: 'override',
            value: params.value,
            onInput: (event: Event) =>
              params.setValue((event.target as HTMLInputElement).value),
          }),
      },
    })
    await wrapper.vm.startEdit(0, 0)
    expect(wrapper.find('input.override').exists()).toBe(true)
    expect(renderer).not.toHaveBeenCalled()
    await wrapper.get('input.override').setValue('Sorted')
    wrapper.vm.setSort([{ field: 'name', order: 'desc' }])
    await nextTick()
    expect(wrapper.emitted('editCommit')![0][0]).toMatchObject({
      reason: 'query',
    })
    await wrapper.setProps({ editConfig: true, pagerConfig: { pageSize: 1 } })
    await wrapper.vm.startEdit(0, 0)
    await wrapper.setProps({ pagerConfig: { pageSize: 1, currentPage: 2 } })
    expect(wrapper.emitted('editCancel')!.at(-1)![0]).toMatchObject({
      reason: 'page',
    })
    wrapper.unmount()
  })

  it('opens a bounded editor window in a million-row source and retains only touched fields', async () => {
    const row = vi.fn((index: number) => ({
      id: index,
      value: `Record ${index}`,
    }))
    const column = vi.fn((index: number): TableColumn => ({
      key: String(index),
      field: 'value',
      width: 140,
      editor: true,
    }))
    const wrapper = mount(Table, {
      props: {
        editConfig: { mode: 'row' },
        virtualConfig: { height: 200, horizontal: true },
        virtualSource: {
          rowCount: 1_000_000,
          columnCount: 100_000,
          row,
          column,
          columnWidth: 140,
          rowKey: (index) => `key-${index}`,
          fixedLeftCount: 1,
          fixedRightCount: 1,
        },
      },
    })
    await flushPromises()
    await wrapper.vm.startEdit(0, 0)
    const editors = wrapper.findAll('.s-table__cell-editor')
    expect(editors.length).toBeGreaterThan(1)
    expect(editors.length).toBeLessThan(15)
    await editors[0].get('input').setValue('Draft')
    expect(wrapper.vm.getEditRecord()?.changes).toHaveLength(1)
    expect(row.mock.calls.length).toBeLessThan(100)
    expect(column.mock.calls.length).toBeLessThan(300)
    await wrapper.vm.commitEdit()
    expect(wrapper.emitted('editCommit')![0][0]).toMatchObject({
      rowKey: 'key-0',
      updatedRow: { value: 'Draft' },
    })
    wrapper.unmount()
  })
})
