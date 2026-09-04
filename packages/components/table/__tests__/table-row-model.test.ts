import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Table from '../src/table.vue'

const rows = [
  { id: 1, name: 'A' },
  { id: 2, name: 'B' },
]
const columns = [{ field: 'name', title: 'Name' }]

describe('Table named row model', () => {
  it('uses row as the authoritative controlled model, including null', async () => {
    const wrapper = mount(Table, {
      props: { data: rows, columns, row: null, modelValue: rows[0] },
    })
    expect(wrapper.findAll('[aria-selected="true"]')).toHaveLength(0)
    await wrapper.findAll('.s-table__data-row')[1].trigger('click')
    expect(wrapper.emitted('update:row')?.[0]).toEqual([rows[1]])
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.findAll('[aria-selected="true"]')).toHaveLength(0)
    await wrapper.setProps({ row: rows[1] })
    expect(wrapper.vm.getSelectedRows()).toEqual([rows[1]])
    expect(
      wrapper.findAll('.s-table__data-row')[1].attributes('aria-selected'),
    ).toBe('true')
    wrapper.vm.clearSelection()
    expect(wrapper.emitted('update:row')?.[1]).toEqual([null])
    wrapper.unmount()
  })

  it('emits arrays for multiple selection without an initial write', async () => {
    const wrapper = mount(Table, {
      props: { data: rows, columns, row: [], multiple: true },
    })
    expect(wrapper.emitted('update:row')).toBeUndefined()
    await wrapper.findAll('.s-table__data-row')[0].trigger('click')
    expect(wrapper.emitted('update:row')?.[0]).toEqual([[rows[0]]])
    await wrapper.setProps({ row: [rows[0]] })
    await wrapper.findAll('.s-table__data-row')[1].trigger('click')
    expect(wrapper.emitted('update:row')?.[1]).toEqual([rows])
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('preserves legacy selection bindings while consumers migrate', async () => {
    const wrapper = mount(Table, {
      props: { data: rows, columns, modelValue: rows[0] },
    })
    expect(wrapper.vm.getSelectedRows()).toEqual([rows[0]])
    await wrapper.findAll('.s-table__data-row')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([rows[1]])
    expect(wrapper.emitted('update:row')?.[0]).toEqual([rows[1]])
    wrapper.unmount()
  })
})
