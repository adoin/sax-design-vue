import { h, nextTick, ref } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Table from '../src/table.vue'
import TableColumn from '../src/table-column.vue'
import type { TableExposes, TableGroupConfig } from '../src/table'

const rows = [
  { id: 1, team: 'A', hours: 3 },
  { id: 2, team: 'B', hours: 5 },
  { id: 3, team: 'A', hours: 7 },
]
const columns = [
  { field: 'team', width: 150, fixed: 'left' as const },
  { field: 'hours', width: 150, editor: true },
]
const config: TableGroupConfig = {
  fields: ['team'],
  aggregates: [{ key: 'hours', field: 'hours', method: 'sum' }],
  subtotal: true,
  summary: true,
}
const wrappers: { unmount(): void }[] = []
const intoView = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollIntoView',
)
const setup = (props = {}, slots = {}) => {
  const wrapper = mount(Table, {
    attachTo: document.body,
    props: { data: rows, columns, rowKey: 'id', groupConfig: config, ...props },
    slots,
  })
  wrappers.push(wrapper)
  return wrapper
}
const settle = async () => {
  await nextTick()
  await flushPromises()
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
  await nextTick()
}
beforeEach(() => {
  for (const key of ['clientWidth', 'offsetWidth'] as const)
    vi.spyOn(HTMLElement.prototype, key, 'get').mockReturnValue(600)
  for (const key of ['clientHeight', 'offsetHeight'] as const)
    vi.spyOn(HTMLElement.prototype, key, 'get').mockReturnValue(200)
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  )
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: () => {},
  })
})
afterEach(() => {
  if (intoView)
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', intoView)
  else Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView')
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount())
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('Table group integration', () => {
  it.each(['cancel', 'commit'] as const)(
    'applies the %s edit policy when a group collapses',
    async (policy) => {
      const wrapper = setup({ editConfig: { onContextChange: policy } })
      const vm = wrapper.vm as unknown as TableExposes
      await vm.startEdit(0, 1)
      await settle()
      await wrapper.get('[data-row-key="1"] input').setValue('8')
      await vm.setGroupExpandedKeys([])
      await settle()
      expect(vm.getEditRecord()).toBeNull()
      if (policy === 'commit') {
        expect(wrapper.emitted('editCommit')?.[0][0]).toMatchObject({
          rowKey: 1,
          updatedRow: { hours: '8' },
        })
        expect(wrapper.emitted('editCancel')).toBeUndefined()
      } else {
        expect(wrapper.emitted('editCancel')?.[0][0]).toMatchObject({
          rowKey: 1,
          reason: 'view',
        })
        expect(wrapper.emitted('editCommit')).toBeUndefined()
      }
      expect(rows[0].hours).toBe(3)
    },
  )

  it('keeps lazy tree branches in their root group without loading collapsed groups', async () => {
    const parent = { id: 1, team: 'A', hours: 3, lazy: true }
    const load = vi.fn(async () => [{ id: 11, team: 'B', hours: 2 }])
    const wrapper = setup({
      data: [parent, rows[1], rows[2]],
      columns: [{ ...columns[0], treeNode: true }, columns[1]],
      treeConfig: { hasChildren: 'lazy', load },
      virtualConfig: { height: 200, dynamic: true },
    })
    const vm = wrapper.vm as unknown as TableExposes
    await settle()
    await vm.setGroupExpandedKeys([])
    expect(load).not.toHaveBeenCalled()
    await vm.setGroupExpandedKeys(vm.getGroups().map((group) => group.key))
    await settle()
    await wrapper
      .get('[data-row-key="1"] button[aria-expanded]')
      .trigger('click')
    await settle()
    expect(load).toHaveBeenCalledTimes(1)
    expect(parent).not.toHaveProperty('children')
    expect(vm.getGroups()[0]).toMatchObject({
      value: 'A',
      rowCount: 3,
      aggregates: { hours: 12 },
    })
    expect(vm.getGroupSummary()).toEqual({ hours: 17 })
    await wrapper
      .get('[data-row-key="1"] button[aria-expanded]')
      .trigger('click')
    await settle()
    expect(vm.getGroupSummary()).toEqual({ hours: 15 })
  })

  it('renders grouped data, subtotals and summary through configured columns', async () => {
    const wrapper = setup()
    await settle()
    expect(wrapper.findAll('.s-table__group-row')).toHaveLength(2)
    expect(
      wrapper
        .findAll('.s-table__data-row')
        .map((row) => row.attributes('data-row-key')),
    ).toEqual(['1', '3', '2'])
    expect(
      wrapper.findAll('.s-table__group-subtotal').map((row) => row.text()),
    ).toEqual(['10', '5'])
    expect(wrapper.get('.s-table__group-summary').text()).toBe('15')
    expect(
      (wrapper.vm as unknown as TableExposes).getGroupSummary().hours,
    ).toBe(15)
    expect(wrapper.get('[role="table"]').attributes('aria-rowcount')).toBe('9')
  })

  it('keeps group controls out of row selection and displays fully collapsed groups', async () => {
    const wrapper = setup()
    await wrapper.findAll('.s-table__group-toggle')[0].trigger('click')
    await settle()
    expect(
      wrapper
        .findAll('.s-table__data-row')
        .map((row) => row.attributes('data-row-key')),
    ).toEqual(['2'])
    expect(wrapper.emitted('rowClick')).toBeUndefined()
    const vm = wrapper.vm as unknown as TableExposes
    await vm.setGroupExpandedKeys([])
    expect(wrapper.findAll('.s-table__group-row')).toHaveLength(2)
    expect(wrapper.findAll('.s-table__data-row')).toHaveLength(0)
    expect(wrapper.find('.s-table__data-empty').exists()).toBe(false)
    expect(wrapper.get('.s-table__group-summary').text()).toBe('15')
  })

  it('respects controlled expansion and allows localized group slots', async () => {
    const expanded = ref<string[]>([])
    const wrapper = setup(
      { groupExpandedKeys: expanded.value },
      { 'group-header': ({ group }: any) => h('span', `Team ${group.label}`) },
    )
    const vm = wrapper.vm as unknown as TableExposes
    const key = vm.getGroups()[0].key
    expect(await vm.toggleGroup(key, true)).toBe(false)
    expect(wrapper.findAll('.s-table__data-row')).toHaveLength(0)
    await wrapper.setProps({
      'onUpdate:groupExpandedKeys': (keys: string[]) =>
        wrapper.setProps({ groupExpandedKeys: keys }),
    })
    expect(await vm.toggleGroup(key, true)).toBe(true)
    expect(wrapper.findAll('.s-table__data-row')).toHaveLength(2)
    expect(wrapper.get('.s-table__group-row').text()).toContain('Team A')
  })

  it('shares declarative columns and edits the original grouped record', async () => {
    const wrapper = setup(
      { columns: [], editConfig: true },
      { default: () => columns.map((column) => h(TableColumn, column)) },
    )
    await settle()
    const cell = wrapper.get('[data-row-key="3"] [data-column-index="1"]')
    await cell.trigger('dblclick')
    await settle()
    await cell.get('input').setValue('9')
    const vm = wrapper.vm as unknown as TableExposes
    await vm.commitEdit()
    expect(wrapper.emitted('editCommit')?.[0][0]).toMatchObject({
      rowKey: 3,
      rowIndex: 2,
      updatedRow: { hours: '9' },
    })
    expect(rows[2].hours).toBe(7)
  })

  it('groups the current page and keeps the optional filtered summary separate', async () => {
    const wrapper = setup({
      pagerConfig: { pageSize: 2, currentPage: 1 },
      groupConfig: { ...config, summaryScope: 'filtered' },
    })
    expect(wrapper.findAll('.s-table__data-row')).toHaveLength(2)
    expect(
      wrapper.findAll('.s-table__group-subtotal').map((row) => row.text()),
    ).toEqual(['3', '5'])
    expect(wrapper.get('.s-table__group-summary').text()).toBe('15')
    await wrapper.setProps({ pagerConfig: { pageSize: 2, currentPage: 2 } })
    expect(
      wrapper
        .findAll('.s-table__data-row')
        .map((row) => row.attributes('data-row-key')),
    ).toEqual(['3'])
    expect(wrapper.get('.s-table__group-subtotal').text()).toBe('7')
  })

  it('maps virtual generated rows through collapsed ranges without scanning the source', async () => {
    const row = vi.fn((index: number) => ({
      id: index,
      team: `Row ${index}`,
      hours: index,
    }))
    const wrapper = setup({
      data: [],
      virtualSource: {
        rowCount: 1_000_000,
        columnCount: 2,
        columnWidth: 150,
        row,
        rowKey: (index: number) => index,
        column: (index: number) => columns[index],
      },
      groupConfig: {
        mode: 'remote',
        remote: {
          groups: [
            {
              key: 'first',
              field: 'team',
              value: 'First',
              rowStart: 0,
              rowCount: 500_000,
            },
            {
              key: 'last',
              field: 'team',
              value: 'Last',
              rowStart: 500_000,
              rowCount: 500_000,
            },
          ],
        },
      },
      virtualConfig: { height: 200, dynamic: true },
    })
    const vm = wrapper.vm as unknown as TableExposes
    await vm.toggleGroup('first', false)
    const virtual = wrapper.findComponent({ name: 'SVirtualList' })
    expect(virtual.props('count')).toBe(500_002)
    expect(virtual.props('itemAt')(2).flatRow.row.id).toBe(500_000)
    expect(virtual.props('itemAt')(500_001).flatRow.row.id).toBe(999_999)
    expect(row.mock.calls.length).toBeLessThan(150)
    await vm.toggleGroup('last', false)
    expect(wrapper.findComponent({ name: 'SVirtualList' }).props('count')).toBe(
      2,
    )
  })

  it('clears hidden source addresses and rejects editing collapsed members', async () => {
    const wrapper = setup({
      data: [],
      virtualSource: {
        rowCount: 100_000,
        columnCount: 2,
        columnWidth: 150,
        row: (index: number) => ({ id: index, team: 'A', hours: index }),
        rowKey: (index: number) => index,
        column: (index: number) => columns[index],
      },
      groupConfig: {
        mode: 'remote',
        remote: {
          groups: [
            {
              key: 'all',
              field: 'team',
              value: 'A',
              rowStart: 0,
              rowCount: 100_000,
            },
          ],
        },
      },
      virtualConfig: { height: 200, dynamic: true },
      keyboardConfig: { rowIndexOf: Number },
      activeCell: { rowKey: 0, columnKey: '1' },
      editConfig: true,
    })
    const vm = wrapper.vm as unknown as TableExposes
    await settle()
    await vm.setGroupExpandedKeys([])
    await settle()
    expect(wrapper.emitted('update:activeCell')).toContainEqual([null])
    expect(await vm.startEdit(0, 1)).toBe(false)
    expect(wrapper.emitted('editStart')).toBeUndefined()
    await vm.setGroupExpandedKeys(['all'])
    expect(await vm.startEdit(0, 1)).toBe(true)
  })
})
