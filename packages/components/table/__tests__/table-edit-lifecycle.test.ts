import { defineComponent, h, nextTick, reactive, ref } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Table from '../src/table.vue'
import TableColumn from '../src/table-column.vue'
import type { TableRow } from '../src/table'

const columns = [{ field: 'name', title: 'Name', editor: true, width: 180 }]
const scrollDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollTo',
)
const intoViewDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollIntoView',
)

describe('table edit lifecycle across data and view changes', () => {
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

  it('cancels a same-key row replacement inside the same array and never commits a removed row', async () => {
    const data = reactive([
      { id: 1, name: 'First' },
      { id: 2, name: 'Second' },
    ])
    const wrapper = mount(Table, {
      props: { data, columns, editConfig: { onContextChange: 'commit' } },
    })
    await wrapper.vm.startEdit(0, 0)
    await wrapper.get('.s-table__cell-editor input').setValue('Draft')
    data[0] = { id: 1, name: 'External' }
    await nextTick()
    expect(wrapper.vm.getEditRecord()).toBeNull()
    expect(wrapper.emitted('editCancel')!.at(-1)![0]).toMatchObject({
      reason: 'data',
    })
    expect(wrapper.emitted('editCommit')).toBeUndefined()
    expect(data[0].name).toBe('External')
    await wrapper.vm.startEdit(0, 0)
    data.splice(0, 1)
    await nextTick()
    expect(wrapper.vm.getEditRecord()).toBeNull()
    expect(wrapper.emitted('editCancel')!.at(-1)![0]).toMatchObject({
      reason: 'view',
    })
    expect(wrapper.emitted('editCommit')).toBeUndefined()
    wrapper.unmount()
  })

  it('keeps drafts across sibling lazy loading, updates row coordinates, and cancels hidden descendants', async () => {
    const data = reactive([
      { id: 1, name: 'Lazy', hasChildren: true },
      { id: 2, name: 'Active' },
    ])
    const child = reactive({ id: 3, name: 'Loaded' })
    const wrapper = mount(Table, {
      props: {
        data,
        columns: [{ ...columns[0], treeNode: true }],
        editConfig: true,
        treeConfig: { hasChildren: 'hasChildren', load: async () => [child] },
      },
    })
    await wrapper.vm.startEdit(1, 0)
    await wrapper.get('.s-table__cell-editor input').setValue('Preserved')
    await wrapper.vm.toggleRowExpand(data[0], true)
    await flushPromises()
    expect(wrapper.vm.getEditRecord()).toMatchObject({
      rowKey: 2,
      rowIndex: 2,
      updatedRow: { name: 'Preserved' },
    })
    expect(wrapper.emitted('editCancel')).toBeUndefined()
    wrapper.vm.cancelEdit()
    await wrapper.vm.startEdit(child, 'name')
    await wrapper.get('.s-table__cell-editor input').setValue('Hidden draft')
    wrapper.vm.setExpandedKeys([])
    await flushPromises()
    expect(wrapper.vm.getEditRecord()).toBeNull()
    expect(wrapper.emitted('editCancel')!.at(-1)![0]).toMatchObject({
      reason: 'view',
      rowKey: 3,
    })
    expect(child.name).toBe('Loaded')
    wrapper.unmount()
  })

  it('honors controlled query acceptance and observes in-place filter changes before view removal', async () => {
    const filters = reactive<Record<string, string[]>>({})
    const wrapper = mount(Table, {
      props: {
        data: [
          { id: 1, name: 'One' },
          { id: 2, name: 'Two' },
        ],
        columns: [{ ...columns[0], filters: [{ label: 'Two', value: 'Two' }] }],
        filters,
        editConfig: { onContextChange: 'commit' },
      },
    })
    await wrapper.vm.startEdit(0, 0)
    await wrapper.get('.s-table__cell-editor input').setValue('Saved')
    wrapper.vm.setFilters({ name: ['Two'] })
    await nextTick()
    expect(wrapper.vm.getEditRecord()?.updatedRow.name).toBe('Saved')
    filters.name = ['Two']
    await flushPromises()
    expect(wrapper.emitted('editCommit')![0][0]).toMatchObject({
      reason: 'query',
      updatedRow: { name: 'Saved' },
    })
    expect(wrapper.emitted('editCancel')).toBeUndefined()
    expect(wrapper.vm.getEditRecord()).toBeNull()
    wrapper.unmount()
  })

  it('commits on accepted page changes and cancels on declarative column changes', async () => {
    const field = ref('name')
    const Host = defineComponent({
      setup: () => () =>
        h(
          Table,
          {
            data: [
              { id: 1, name: 'One', other: 'Else' },
              { id: 2, name: 'Two' },
            ],
            editConfig: { onContextChange: 'cancel' },
          },
          {
            default: () => h(TableColumn, { field: field.value, editor: true }),
          },
        ),
    })
    const host = mount(Host)
    const table = host.getComponent(Table)
    await nextTick()
    await table.vm.startEdit(0, 0)
    field.value = 'other'
    await flushPromises()
    expect(table.vm.getEditRecord()).toBeNull()
    expect(table.emitted('editCancel')!.at(-1)![0]).toMatchObject({
      reason: 'columns',
    })
    host.unmount()
    const wrapper = mount(Table, {
      props: {
        data: [
          { id: 1, name: 'One' },
          { id: 2, name: 'Two' },
        ],
        columns,
        editConfig: { onContextChange: 'commit' },
        pagerConfig: { currentPage: 1, pageSize: 1 },
      },
    })
    await wrapper.vm.startEdit(0, 0)
    await wrapper.get('.s-table__cell-editor input').setValue('Page draft')
    await wrapper.setProps({ pagerConfig: { currentPage: 2, pageSize: 1 } })
    expect(wrapper.emitted('editCommit')!.at(-1)![0]).toMatchObject({
      reason: 'page',
      rowKey: 1,
    })
    expect(wrapper.vm.getEditRecord()).toBeNull()
    wrapper.unmount()
  })

  it.each(['keep', 'cancel', 'commit'] as const)(
    'applies %s when a virtual editor is actually unmounted',
    async (onScroll) => {
      const data = Array.from({ length: 100 }, (_, id) => ({
        id,
        name: `Row ${id}`,
      }))
      const wrapper = mount(Table, {
        props: {
          data,
          columns,
          editConfig: { onScroll },
          virtualConfig: { height: 200, rowHeight: 50 },
        },
      })
      await flushPromises()
      await wrapper.vm.startEdit(0, 0)
      await wrapper.get('.s-table__cell-editor input').setValue('Virtual draft')
      await flushPromises()
      wrapper.vm.scrollToRow(99)
      await flushPromises()
      expect(wrapper.find('.s-table__cell-editor').exists()).toBe(false)
      if (onScroll === 'keep') {
        expect(wrapper.vm.getEditRecord()?.updatedRow.name).toBe(
          'Virtual draft',
        )
        await wrapper.vm.startEdit(0, 0)
        await flushPromises()
        expect(
          wrapper.get<HTMLInputElement>('.s-table__cell-editor input').element
            .value,
        ).toBe('Virtual draft')
      } else {
        expect(wrapper.vm.getEditRecord()).toBeNull()
        expect(
          wrapper
            .emitted(onScroll === 'commit' ? 'editCommit' : 'editCancel')!
            .at(-1)![0],
        ).toMatchObject({ reason: 'scroll' })
      }
      expect(data[0].name).toBe('Row 0')
      wrapper.unmount()
    },
  )

  it('invalidates a generated row outside changed bounds without scanning the source', async () => {
    const source = reactive({
      rowCount: 1_000_000,
      columnCount: 100_000,
      row: vi.fn((id: number): TableRow => ({ id, name: 'Generated' })),
      column: vi.fn((index: number) => ({ ...columns[0], key: String(index) })),
      columnWidth: 180,
    })
    const wrapper = mount(Table, {
      props: {
        virtualSource: source,
        virtualConfig: { height: 200, horizontal: true },
        editConfig: true,
      },
    })
    await flushPromises()
    await wrapper.vm.startEdit(10, 0)
    await flushPromises()
    expect(wrapper.vm.getEditRecord()?.rowKey).toBe(10)
    source.rowCount = 5
    await flushPromises()
    expect(wrapper.vm.getEditRecord()).toBeNull()
    expect(wrapper.emitted('editCancel')!.at(-1)![0]).toMatchObject({
      reason: 'view',
    })
    expect(source.row.mock.calls.length).toBeLessThan(200)
    wrapper.unmount()
  })
})
