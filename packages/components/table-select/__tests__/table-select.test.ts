import { defineComponent, h, nextTick, shallowRef } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import TableSelect from '../src/table-select.vue'
import type { TableSelectExposes } from '../src/table-select'
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
  it('selects multiple flat rows, stays open, removes tags and clears to an array', async () => {
    const wrapper = mountTableSelect({
      multiple: true,
      modelValue: [],
      defaultOpen: true,
      clearable: true,
    })
    await wrapper.findAll('.s-table__data-row')[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['alpha']])
    await wrapper.setProps({ modelValue: ['alpha'] })
    await wrapper.findAll('.s-table__data-row')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
      ['alpha', 'beta'],
    ])
    expect(wrapper.find('.popper-content-stub').exists()).toBe(true)
    await wrapper.setProps({ modelValue: ['alpha', 'beta'] })
    expect(wrapper.findAll('.s-tag')).toHaveLength(2)
    await wrapper.findAll('.s-tag__close')[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['beta']])
    await wrapper.get('.s-table-select__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[]])
    wrapper.unmount()
  })

  it('links loaded tree descendants and shows indeterminate parents', async () => {
    const wrapper = mountTableSelect({
      multiple: true,
      checkedStrategy: 'all',
      modelValue: ['a'],
      defaultOpen: true,
      data: [
        {
          id: 'root',
          name: 'Root',
          children: [
            { id: 'a', name: 'A' },
            { id: 'b', name: 'B' },
            { id: 'disabled', name: 'Disabled', disabled: true },
          ],
        },
      ],
      columns: [{ field: 'name', treeNode: true }],
      treeConfig: { children: 'children', defaultExpandedKeys: ['root'] },
    })
    await nextTick()
    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    expect((checkboxes[0].element as HTMLInputElement).indeterminate).toBe(true)
    await checkboxes[0].setValue(true)
    const keys = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as string[]
    expect(new Set(keys)).toEqual(new Set(['root', 'a', 'b']))
    await wrapper.setProps({ modelValue: keys })
    expect(
      (wrapper.findAll('input[type="checkbox"]')[0].element as HTMLInputElement)
        .indeterminate,
    ).toBe(false)
    await wrapper.findAll('input[type="checkbox"]')[1].setValue(false)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['b']])
    wrapper.unmount()
  })

  it('supports independent tree checks and explicit close-on-select', async () => {
    const wrapper = mountTableSelect({
      multiple: true,
      checkStrictly: true,
      modelValue: [],
      closeOnSelect: true,
      defaultOpen: true,
      data: [
        {
          id: 'root',
          name: 'Root',
          children: [{ id: 'child', name: 'Child' }],
        },
      ],
      treeConfig: { children: 'children' },
    })
    await wrapper.findAll('.s-table__data-row')[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['root']])
    expect(wrapper.find('.popper-content-stub').exists()).toBe(false)
    wrapper.unmount()
  })

  it('resolves children supplied by the internal table lazy-load event', async () => {
    const root = { id: 'root', name: 'Root', leaf: false }
    const child = { id: 'child', name: 'Child' }
    const wrapper = mountTableSelect({
      multiple: true,
      modelValue: [],
      defaultOpen: true,
      data: [root],
      treeConfig: { children: 'children' },
    })
    const table = wrapper.findComponent({ name: 'STable' })
    table.vm.$emit('lazyLoad', root, [child])
    await nextTick()
    table.vm.$emit('rowClick', child, new MouseEvent('click'))
    expect(
      new Set(wrapper.emitted('update:modelValue')?.at(-1)?.[0] as string[]),
    ).toEqual(new Set(['child']))
    wrapper.unmount()
  })

  it.each([
    ['leaf', ['a', 'b']],
    ['all', ['root', 'a', 'b']],
    ['parent', ['root']],
  ] as const)(
    'projects %s keys while retaining tree content after reopening',
    async (strategy, expected) => {
      const wrapper = mountTableSelect({
        multiple: true,
        checkedStrategy: strategy,
        modelValue: [],
        defaultOpen: true,
        data: [
          {
            id: 'root',
            name: 'Root',
            children: [
              { id: 'a', name: 'A' },
              { id: 'b', name: 'B' },
            ],
          },
        ],
        columns: [{ field: 'name', treeNode: true }],
        treeConfig: { children: 'children', defaultExpandedKeys: ['root'] },
      })
      await nextTick()
      await wrapper.findAll('input[type="checkbox"]')[0].setValue(true)
      const keys = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as string[]
      expect(new Set(keys)).toEqual(new Set(expected))
      await wrapper.setProps({ modelValue: keys })
      expect(wrapper.findAll('.s-tag').map((tag) => tag.text())).toEqual(
        strategy === 'leaf'
          ? ['A', 'B']
          : strategy === 'parent'
            ? ['Root']
            : ['Root', 'A', '+1'],
      )
      wrapper.getComponent(PopperStub).vm.$emit('update:visible', false)
      await nextTick()
      wrapper.getComponent(PopperStub).vm.$emit('update:visible', true)
      await nextTick()
      expect(
        wrapper.findAll('.s-table__cell-content').map((cell) => cell.text()),
      ).toEqual(expect.arrayContaining(['Root', 'A', 'B']))
      expect(wrapper.find('.s-table__tree-toggle').exists()).toBe(true)
      expect(
        wrapper
          .findAll('.s-table__tree-leading')
          .slice(1)
          .every((node) => node.attributes('style')?.includes('20px')),
      ).toBe(true)
      await wrapper.findAll('input[type="checkbox"]')[1].setValue(false)
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['b']])
      wrapper.unmount()
    },
  )

  it('shows the shared loader and blocks popup opening without dropping its value', async () => {
    const wrapper = mountTableSelect({
      modelValue: 'alpha',
      loading: true,
      clearable: true,
    })
    expect(wrapper.find('.s-control-loading').exists()).toBe(true)
    expect(wrapper.find('.s-table-select__clear').exists()).toBe(false)
    await wrapper.get('.popper-trigger-stub').trigger('click')
    expect(wrapper.getComponent(PopperStub).props('visible')).toBe(false)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })
  it('exposes safe pre-mount methods and forwards tree, scrolling and measurement after opening', async () => {
    const parent = {
      id: 'root',
      name: 'Root',
      children: [{ id: 'child', name: 'Child' }],
    }
    const wrapper = mountTableSelect({
      data: [parent],
      columns: [{ field: 'name', treeNode: true }],
      rowKey: 'id',
      treeConfig: { children: 'children' },
    })
    const api = wrapper.vm as unknown as TableSelectExposes
    try {
      expect(api.measure()).toBeUndefined()
      expect(api.toggleRowExpand(parent, true)).toBeUndefined()
      expect(() => api.scrollToRow('child')).not.toThrow()
      api.setExpandedKeys(['root'])
      api.open()
      await nextTick()
      expect(wrapper.findAll('.s-table__data-row')).toHaveLength(1)
      const expanded = api.toggleRowExpand(parent, true)
      expect(expanded).toBeInstanceOf(Promise)
      await expanded
      await nextTick()
      expect(wrapper.findAll('.s-table__data-row')).toHaveLength(2)
      const scroll = vi.fn()
      Object.defineProperty(
        wrapper.findAll('.s-table__data-row')[1].element,
        'scrollIntoView',
        { value: scroll },
      )
      api.scrollToRow('child', 'center')
      expect(scroll).toHaveBeenCalledWith({ block: 'center' })
      const measured = api.measure()
      expect(measured).toBeInstanceOf(Promise)
      await measured
      api.setExpandedKeys([])
      await nextTick()
      expect(wrapper.findAll('.s-table__data-row')).toHaveLength(1)
      api.close()
      await nextTick()
      expect(wrapper.getComponent(PopperStub).props('visible')).toBe(false)
    } finally {
      wrapper.unmount()
    }
  })

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
    const columns = [
      { field: 'name', title: 'Name', slots: { default: 'cell-name' } },
      baseColumns[1],
    ]
    const wrapper = mountTableSelect(
      { columns },
      {
        'cell-name': ({ row }: { row: Record<string, unknown> }) => [
          h('strong', { class: 'custom-name' }, String(row.name)),
        ],
      },
    )

    await wrapper.get('.s-table-select__trigger').trigger('click')

    expect(wrapper.getComponent({ name: 'STable' }).props('columns')).toEqual(
      columns,
    )
    expect(wrapper.findAll('.custom-name')).toHaveLength(2)
    expect(wrapper.findAll('.custom-name')[0].text()).toBe('Alpha')
  })

  it.each([false, true])(
    'updates named table slots without remounting an open selector (virtual: %s)',
    async (virtual) => {
      const content = shallowRef<Record<string, Slot>>({})
      const geometry = virtual
        ? (
            [
              'clientWidth',
              'offsetWidth',
              'clientHeight',
              'offsetHeight',
            ] as const
          ).map((key) =>
            vi
              .spyOn(HTMLElement.prototype, key, 'get')
              .mockReturnValue(key.endsWith('Width') ? 600 : 180),
          )
        : []
      const root = mount(
        defineComponent({
          setup: () => () =>
            h(
              TableSelect,
              {
                data: baseData,
                columns: [
                  {
                    field: 'name',
                    title: 'Name',
                    slots: { default: 'person', header: 'heading' },
                  },
                ],
                open: true,
                virtualConfig: virtual
                  ? { height: 180, dynamic: true, horizontal: true }
                  : undefined,
              },
              content.value,
            ),
        }),
        { global: { stubs: { SPopper: PopperStub } } },
      )
      try {
        await flushPromises()
        expect(root.findAll('.s-table__data-row')).toHaveLength(2)
        const original = root.getComponent(TableSelect).vm.$.uid
        const seen: unknown[] = []
        content.value = {
          person: (params) => {
            seen.push(params)
            return [h('b', { class: 'late-cell' }, params.value)]
          },
          heading: ({ column }) => [
            h('b', { class: 'late-heading' }, column.title),
          ],
        }
        await flushPromises()
        expect(root.findAll('.late-cell').map((cell) => cell.text())).toEqual([
          'Alpha',
          'Beta',
        ])
        expect(seen[0]).toMatchObject({
          row: baseData[0],
          value: 'Alpha',
          rowIndex: 0,
          columnIndex: 0,
        })
        expect(root.get('.late-heading').text()).toBe('Name')
        content.value = {
          person: ({ value }) => [h('i', { class: 'replacement-cell' }, value)],
        }
        await flushPromises()
        expect(root.findAll('.replacement-cell')).toHaveLength(2)
        expect(root.find('.late-heading').exists()).toBe(false)
        content.value = {}
        await flushPromises()
        expect(root.find('.replacement-cell').exists()).toBe(false)
        expect(root.get('.s-table__data-cell').text()).toBe('Alpha')
        expect(root.getComponent(TableSelect).vm.$.uid).toBe(original)
      } finally {
        root.unmount()
        geometry.forEach((mock) => mock.mockRestore())
      }
    },
  )

  it('updates conditional affix slots while retaining the clear and dropdown actions', async () => {
    const enabled = shallowRef(false)
    const root = mount(
      defineComponent({
        setup: () => () =>
          h(
            TableSelect,
            {
              data: baseData,
              columns: baseColumns,
              modelValue: 'beta',
              clearable: true,
              open: true,
            },
            enabled.value
              ? {
                  prefix: () => h('b', 'Prefix'),
                  suffix: ({
                    open,
                    selectedRow,
                  }: {
                    open: boolean
                    selectedRow: (typeof baseData)[number]
                  }) => h('b', `${open}:${selectedRow.name}`),
                }
              : {},
          ),
      }),
      { global: { stubs: { SPopper: PopperStub } } },
    )
    try {
      enabled.value = true
      await nextTick()
      expect(root.get('.s-table-select__prefix').text()).toBe('Prefix')
      expect(root.get('.s-table-select__suffix').text()).toBe('true:Beta')
      expect(root.find('.s-table-select__clear').exists()).toBe(true)
      expect(root.find('.s-table-select__action').exists()).toBe(true)
      enabled.value = false
      await nextTick()
      expect(root.find('.s-table-select__prefix').exists()).toBe(false)
      expect(root.find('.s-table-select__suffix').exists()).toBe(false)
    } finally {
      root.unmount()
    }
  })

  it('renders affix icons supplied through the configuration objects', () => {
    const root = mountTableSelect({
      prefixConfig: { icon: 'cb:user' },
      suffixConfig: { icon: 'cb:checkmark' },
    })
    try {
      expect(
        root.get('.s-table-select__prefix .icon-stub').attributes('data-name'),
      ).toBe('cb:user')
      expect(
        root.get('.s-table-select__suffix .icon-stub').attributes('data-name'),
      ).toBe('cb:checkmark')
    } finally {
      root.unmount()
    }
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
