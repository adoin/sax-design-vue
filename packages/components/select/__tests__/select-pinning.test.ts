import { defineComponent, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import Select from '../src/select.vue'
import { sortOptionsByPinnedValues } from '../src/useSelectPinning'

const options = [
  { value: 'alpha', label: 'Alpha' },
  { value: 'beta', label: 'Beta' },
  { value: 'gamma', label: 'Gamma' },
]

const PopperStub = defineComponent({
  name: 'SPopper',
  setup(_, { expose }) {
    expose({
      contentRef: undefined,
      isFocusInsideContent: false,
      popperPlacement: 'bottom',
      updatePopper: () => undefined,
    })
  },
  template:
    '<div><slot /><div class="popper-content"><slot name="content" /></div></div>',
})

const mountSelect = () =>
  mount(Select, {
    props: {
      modelValue: '',
      pinKey: 'pinning-test',
      options,
    },
    global: {
      stubs: {
        SPopper: PopperStub,
        SScrollbar: { template: '<div><slot /></div>' },
        SIcon: { template: '<i />' },
        IconClose: { template: '<i />' },
        IconLoading: { template: '<i />' },
        SCollapseTransition: { template: '<div><slot /></div>' },
      },
    },
  })

afterEach(() => localStorage.clear())

describe('Select option pinning', () => {
  it('orders pinned values by pin order and keeps other options stable', () => {
    const ordered = sortOptionsByPinnedValues(
      options,
      ['gamma', 'alpha'],
      (option) => option.value,
    )

    expect(ordered.map((option) => option.value)).toEqual([
      'gamma',
      'alpha',
      'beta',
    ])
  })

  it('pins from the row action and persists the value locally', async () => {
    const wrapper = mountSelect()
    await nextTick()

    await wrapper.findAll('.s-select__pin')[1].trigger('click')
    await nextTick()

    expect(
      wrapper.findAll('.s-select__option').map((option) => option.text()),
    ).toEqual(['Beta', 'Alpha', 'Gamma'])
    expect(
      JSON.parse(localStorage.getItem('s-select-pinned-pinning-test')!),
    ).toEqual(['beta'])
    expect(wrapper.emitted('pin-change')?.at(-1)).toEqual([
      { value: 'beta', pinned: true, values: ['beta'] },
    ])
  })

  it('keeps keyboard highlight on the same option after reordering', async () => {
    const wrapper = mountSelect()
    await nextTick()

    await wrapper.findAll('.s-select__option')[1].trigger('mouseenter')
    await wrapper.findAll('.s-select__pin')[1].trigger('click')
    await nextTick()
    await wrapper.get('.s-select__input').trigger('keydown', { key: 'Enter' })
    await wrapper.get('.s-select__input').trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['beta'])
  })

  it('supports Ctrl+P for the currently highlighted option', async () => {
    const wrapper = mountSelect()
    await nextTick()

    await wrapper.findAll('.s-select__option')[2].trigger('mouseenter')
    await wrapper.get('.s-select__input').trigger('keydown', {
      key: 'p',
      ctrlKey: true,
    })
    await nextTick()

    expect(wrapper.findAll('.s-select__option')[0].text()).toBe('Gamma')
  })
})
