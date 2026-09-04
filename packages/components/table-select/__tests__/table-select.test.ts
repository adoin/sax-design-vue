import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TableSelect from '../src/table-select.vue'
import type { Slot } from 'vue'

const PopperStub = defineComponent({
  name: 'SPopper',
  props: {
    visible: Boolean,
    teleported: Boolean,
    placement: String,
    showArrow: Boolean,
    appendTo: [String, Object],
    offset: [Number, Object],
    zIndex: Number,
    popperClass: [String, Array, Object],
    popperStyle: [String, Array, Object],
  },
  emits: ['update:visible'],
  template: `
    <div class="popper-stub">
      <div class="popper-trigger-stub" @click="$emit('update:visible', !visible)"><slot /></div>
      <div v-if="visible" class="popper-content-stub"><slot name="content" /></div>
    </div>
  `,
})

const baseData = [
  { id: 'alpha', name: 'Alpha', status: 'online' },
  { id: 'beta', name: 'Beta', status: 'offline' },
]
const baseColumns = [
  { field: 'name', title: 'Name' },
  { field: 'status', title: 'Status' },
]

const mountTableSelect = (
  props: Record<string, unknown> = {},
  slots: Record<string, Slot> = {},
) =>
  mount(TableSelect, {
    props: {
      data: baseData,
      columns: baseColumns,
      labelKey: 'name',
      ...props,
    },
    slots,
    global: {
      stubs: {
        SPopper: PopperStub,
        SIcon: {
          props: ['name'],
          template: '<i class="icon-stub" :data-name="name" />',
        },
        IconLoading: { template: '<i class="loading-stub" />' },
      },
    },
  })

describe('TableSelect', () => {
  it('uses the shared teleported popper by default', () => {
    const wrapper = mountTableSelect()
    const popper = wrapper.getComponent(PopperStub)

    expect(popper.props('teleported')).toBe(true)
    expect(popper.props('placement')).toBe('bottom-start')
    expect(popper.props('showArrow')).toBe(false)
  })

  it('forwards square geometry to the trigger and popup surface', () => {
    const wrapper = mountTableSelect({ shape: 'square' })
    const popperClass = wrapper.getComponent(PopperStub).props('popperClass')

    expect(wrapper.get('.s-table-select').classes()).toContain('is-square')
    expect(popperClass).toContain('is-square')
  })

  it('renders the selected row by its stable key', () => {
    const wrapper = mountTableSelect({ modelValue: 'beta' })

    expect(wrapper.get('.s-table-select__value').text()).toBe('Beta')
  })

  it('forwards columns and scoped cell slots to Table', async () => {
    const wrapper = mountTableSelect(
      {},
      {
        'cell-name': ({ row }: { row: Record<string, unknown> }) => [
          h('strong', { class: 'custom-name' }, String(row.name)),
        ],
      },
    )

    await wrapper.get('.s-table-select__trigger').trigger('click')

    expect(wrapper.getComponent({ name: 'STable' }).props('columns')).toEqual(
      baseColumns,
    )
    expect(wrapper.findAll('.custom-name')).toHaveLength(2)
    expect(wrapper.findAll('.custom-name')[0].text()).toBe('Alpha')
  })

  it('emits the row key and closes after selection', async () => {
    const wrapper = mountTableSelect()

    await wrapper.get('.s-table-select__trigger').trigger('click')
    await wrapper.findAll('.s-table__data-row')[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['beta'])
    expect(wrapper.emitted('change')?.at(-1)?.[1]).toEqual(baseData[1])
    expect(wrapper.find('.popper-content-stub').exists()).toBe(false)
  })

  it('keeps non-selectable tree parents open for expansion', async () => {
    const data = [
      {
        id: 'root',
        name: 'Root',
        children: [{ id: 'child', name: 'Child' }],
      },
    ]
    const wrapper = mountTableSelect({
      data,
      columns: [{ field: 'name', title: 'Name', treeNode: true }],
      treeConfig: { children: 'children', expandOnClickRow: true },
      selectable: (row: Record<string, unknown>) => !row.children,
    })

    await wrapper.get('.s-table-select__trigger').trigger('click')
    await wrapper.get('.s-table__data-row').trigger('click')
    await nextTick()

    expect(wrapper.find('.popper-content-stub').exists()).toBe(true)
    expect(wrapper.findAll('.s-table__data-row')).toHaveLength(2)

    await wrapper.findAll('.s-table__data-row')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['child'])
  })

  it('forwards large-data virtualization to Table', async () => {
    const virtualConfig = {
      height: 280,
      estimateSize: 36,
      overscan: 6,
      dynamic: true,
    }
    const wrapper = mountTableSelect({
      data: Array.from({ length: 10_000 }, (_, index) => ({
        id: `row-${index + 1}`,
        name: `Row ${index + 1}`,
      })),
      columns: [{ field: 'name', title: 'Name' }],
      virtualConfig,
    })

    await wrapper.get('.s-table-select__trigger').trigger('click')

    expect(
      wrapper.getComponent({ name: 'STable' }).props('virtualConfig'),
    ).toEqual(virtualConfig)
  })
})
