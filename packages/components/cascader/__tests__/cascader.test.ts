import { defineComponent, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import Cascader from '../src/cascader.vue'
import { SHOW_CHILD } from '../src/cascader'
import type { CascaderOption } from '../src/cascader'

const PopperStub = defineComponent({
  name: 'SPopper',
  props: {
    visible: Boolean,
  },
  emits: ['update:visible'],
  setup(_, { expose }) {
    expose({ updatePopper: () => undefined })
  },
  template:
    '<div class="popper-stub"><slot /><div v-if="visible" class="popper-content"><slot name="content" /></div></div>',
})

const mountCascader = (props: Record<string, unknown>) =>
  mount(Cascader, {
    props: { defaultOpen: true, teleported: false, ...props },
    global: {
      stubs: {
        SPopper: PopperStub,
        SIcon: { template: '<i class="icon-stub" />' },
      },
    },
  })

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      { value: 'hangzhou', label: 'Hangzhou' },
      { value: 'ningbo', label: 'Ningbo' },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [{ value: 'nanjing', label: 'Nanjing' }],
  },
]

describe('Cascader', () => {
  it('applies square geometry to the trigger', () => {
    const wrapper = mountCascader({ modelValue: [], options, shape: 'square' })

    expect(wrapper.get('.s-cascader').classes()).toContain('is-square')
  })

  it('selects a leaf path and returns the selected option path', async () => {
    const wrapper = mountCascader({ modelValue: [], options })

    await wrapper.findAll('.s-cascader__option')[0].trigger('click')
    await nextTick()
    await wrapper
      .findAll('.s-cascader__menu')[1]
      .findAll('button')[0]
      .trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
      ['zhejiang', 'hangzhou'],
    ])
    expect(wrapper.emitted('change')?.at(-1)?.[1]).toEqual([
      options[0],
      options[0].children[0],
    ])
  })

  it('supports custom option field names', async () => {
    const wrapper = mountCascader({
      modelValue: [],
      fieldNames: { value: 'id', label: 'name', children: 'items' },
      options: [
        {
          id: 1,
          name: 'Engineering',
          items: [{ id: 2, name: 'Frontend' }],
        },
      ],
    })

    expect(wrapper.text()).toContain('Engineering')
    await wrapper.get('.s-cascader__option').trigger('click')
    await nextTick()
    await wrapper.findAll('.s-cascader__menu')[1].get('button').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[1, 2]])
  })

  it('filters and highlights full option paths', async () => {
    const wrapper = mountCascader({ modelValue: [], options, showSearch: true })
    await wrapper.get('.s-cascader__search-input').setValue('hang')
    await nextTick()

    expect(wrapper.findAll('.s-cascader__search-option')).toHaveLength(1)
    expect(wrapper.get('.s-cascader__highlight').text()).toBe('Hang')
    expect(wrapper.get('.s-cascader__search-option').text()).toContain(
      'Zhejiang / Hangzhou',
    )
  })

  it('selects the active search result with the keyboard', async () => {
    const wrapper = mountCascader({ modelValue: [], options, showSearch: true })
    const input = wrapper.get('.s-cascader__search-input')

    await input.setValue('ning')
    await input.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
      ['zhejiang', 'ningbo'],
    ])
  })

  it('cascades multiple selection and can emit child paths', async () => {
    const wrapper = mountCascader({
      modelValue: [],
      options,
      multiple: true,
      showCheckedStrategy: SHOW_CHILD,
    })

    await wrapper.findAll('.s-cascader__option')[0].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
      [
        ['zhejiang', 'hangzhou'],
        ['zhejiang', 'ningbo'],
      ],
    ])
  })

  it('loads an empty non-leaf option once', async () => {
    const lazyOptions: CascaderOption[] = [
      { value: 'async', label: 'Async', isLeaf: false },
    ]
    const loadData = vi.fn(async (path: typeof lazyOptions) => {
      path[0].children = [{ value: 'loaded', label: 'Loaded' }]
    })
    const wrapper = mountCascader({
      modelValue: [],
      options: lazyOptions,
      loadData,
    })

    await wrapper.get('.s-cascader__option').trigger('click')
    await nextTick()

    expect(loadData).toHaveBeenCalledTimes(1)
    expect(wrapper.text()).toContain('Loaded')
  })

  it('emits controlled open and clear events', async () => {
    const wrapper = mountCascader({
      modelValue: ['jiangsu', 'nanjing'],
      options,
      open: true,
      allowClear: true,
    })

    await wrapper.get('.s-cascader__clear').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[]])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })
})
