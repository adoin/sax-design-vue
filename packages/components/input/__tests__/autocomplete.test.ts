import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Input from '../src/input.vue'

const PopperStub = defineComponent({
  props: { visible: Boolean },
  template: '<div><slot /><slot v-if="visible" name="content" /></div>',
})
const createInput = (props = {}, slots = {}) =>
  mount(Input, {
    props,
    slots,
    global: {
      stubs: { SPopper: PopperStub, SIcon: true, SCollapseTransition: true },
    },
  })

describe('Input component autocomplete', () => {
  it('disables native completion even for legacy browser tokens', () => {
    const wrapper = createInput({ autocomplete: 'on', autoComplete: 'email' })
    expect(wrapper.get('input').attributes('autocomplete')).toBe('off')
    expect(wrapper.get('input').attributes('role')).toBeUndefined()
    wrapper.unmount()
  })

  it('matches labels and descriptions, limits suggestions, and exposes combobox state', async () => {
    const wrapper = createInput({
      autocomplete: [
        { value: 'one', label: 'Alpha', description: 'First' },
        { value: 'two', label: 'Beta', description: 'Alpha family' },
        'Alpha third',
      ],
      autocompleteLimit: 2,
    })
    const input = wrapper.get('input')
    await input.trigger('focus')
    await input.setValue('alpha')
    expect(wrapper.findAll('[role="option"]').map((row) => row.text())).toEqual(
      ['AlphaFirst', 'BetaAlpha family'],
    )
    expect(input.attributes('role')).toBe('combobox')
    expect(input.attributes('aria-expanded')).toBe('true')
    expect(wrapper.get('mark').text()).toBe('Alpha')
    wrapper.unmount()
  })

  it('skips disabled suggestions and commits a keyboard selection with immediate=false', async () => {
    const wrapper = createInput({
      autocomplete: [
        { value: 'blocked', disabled: true },
        { value: 'Sax', label: 'Sax Design' },
      ],
      immediate: false,
      type: 'search',
      controls: true,
    })
    const input = wrapper.get('input')
    await input.trigger('focus')
    await input.trigger('keydown', { key: 'ArrowDown' })
    const activeId = input.attributes('aria-activedescendant')
    expect(wrapper.get(`[id="${activeId}"]`).text()).toBe('Sax Design')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toEqual([['Sax']])
    expect(wrapper.emitted('change')).toEqual([['Sax']])
    expect(wrapper.emitted('autocomplete-select')).toEqual([
      [{ value: 'Sax', label: 'Sax Design' }],
    ])
    expect(wrapper.emitted('search-click')).toBeUndefined()
    expect(input.attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })

  it('closes on Escape without clearing and reopens with an arrow key', async () => {
    const wrapper = createInput({
      autocomplete: ['Sax'],
      modelValue: 'S',
      allowClear: true,
    })
    const input = wrapper.get('input')
    await input.trigger('focus')
    await input.trigger('keydown', { key: 'Escape' })
    expect(input.attributes('aria-expanded')).toBe('false')
    expect(wrapper.emitted('clear')).toBeUndefined()
    await input.trigger('keydown', { key: 'ArrowUp' })
    expect(input.attributes('aria-expanded')).toBe('true')
    await input.trigger('keydown', { key: 'Tab' })
    expect(input.attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })

  it('waits for IME completion and closes on blur or loading', async () => {
    const wrapper = createInput({
      autocomplete: ['上海'],
      autocompleteMinLength: 1,
    })
    const input = wrapper.get<HTMLInputElement>('input')
    await input.trigger('focus')
    expect(input.attributes('aria-expanded')).toBe('false')
    await input.trigger('compositionstart')
    input.element.value = '上'
    await input.trigger('input', { isComposing: true })
    await input.trigger('keydown', { key: 'Enter', isComposing: true })
    expect(input.attributes('aria-expanded')).toBe('false')
    expect(wrapper.emitted('autocomplete-select')).toBeUndefined()
    await input.trigger('compositionend')
    expect(input.attributes('aria-expanded')).toBe('true')
    await wrapper.setProps({ loading: true })
    expect(input.attributes('aria-expanded')).toBe('false')
    await wrapper.setProps({ loading: false })
    await input.trigger('blur')
    expect(input.attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })

  it('selects by pointer, allows custom content, and keeps free input', async () => {
    const wrapper = createInput(
      { autocomplete: ['Alpha'] },
      {
        'autocomplete-option': '<strong>Custom suggestion</strong>',
      },
    )
    const input = wrapper.get<HTMLInputElement>('input')
    await input.trigger('focus')
    await wrapper.get('[role="option"]').trigger('click')
    expect(input.element.value).toBe('Alpha')
    await input.setValue('Unlisted')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['Unlisted'])
    expect(input.attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })
})
