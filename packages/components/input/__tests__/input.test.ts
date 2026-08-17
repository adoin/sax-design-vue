import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Input from '../src/input.vue'

const mountInput = (props = {}) =>
  mount(Input, {
    props,
    global: {
      stubs: {
        SIcon: { template: '<i class="s-icon-stub" />' },
        SCollapseTransition: { template: '<div><slot /></div>' },
        IconClose: { template: '<i class="icon-close-stub" />' },
        IconLoading: { template: '<i class="icon-loading-stub" />' },
      },
    },
  })

describe('Input behavior', () => {
  it('updates immediately by default', async () => {
    const wrapper = mountInput({ modelValue: '' })
    await wrapper.get('input').setValue('Sax')

    expect(wrapper.emitted('update:modelValue')).toEqual([['Sax']])
    expect(wrapper.emitted('input')).toEqual([['Sax']])
  })

  it('shows the allow-clear action while active and clears the value', async () => {
    const wrapper = mountInput({ modelValue: 'Clear me', allowClear: true })
    const input = wrapper.get('input')

    expect(wrapper.find('[aria-label="Clear input"]').exists()).toBe(false)

    await wrapper.get('.s-input__wrapper').trigger('mouseenter')
    const clearButton = wrapper.get('[aria-label="Clear input"]')
    expect(clearButton.element.tagName).toBe('BUTTON')

    await clearButton.trigger('click')
    expect((input.element as HTMLInputElement).value).toBe('')
    expect(wrapper.emitted('update:modelValue')).toEqual([['']])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('supports clearing from the keyboard with Escape', async () => {
    const wrapper = mountInput({ modelValue: 'Clear me', allowClear: true })

    await wrapper.get('input').trigger('keydown', { key: 'Escape' })

    expect(wrapper.emitted('update:modelValue')).toEqual([['']])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('commits on change when immediate is false', async () => {
    const wrapper = mountInput({ modelValue: '', immediate: false })
    const input = wrapper.get('input')

    ;(input.element as HTMLInputElement).value = 'draft'
    await input.trigger('input')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await input.trigger('change')
    expect(wrapper.emitted('update:modelValue')).toEqual([['draft']])
  })

  it('keeps number input values within min and max', async () => {
    const wrapper = mountInput({
      modelValue: '',
      type: 'number',
      min: 1,
      max: 10,
    })
    const input = wrapper.get('input')

    await input.setValue('111')
    expect((input.element as HTMLInputElement).value).toBe('10')
    expect(wrapper.emitted('update:modelValue')).toEqual([['10']])
    expect(wrapper.emitted('input')).toEqual([['10']])

    await input.setValue('0')
    expect((input.element as HTMLInputElement).value).toBe('1')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['1'])

    await input.setValue('')
    expect((input.element as HTMLInputElement).value).toBe('')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([''])
  })

  it('emits search-click from Enter and the built-in action', async () => {
    const wrapper = mountInput({
      modelValue: 'calendar',
      type: 'search',
      controls: true,
    })

    await wrapper.get('input').trigger('keydown', { key: 'Enter' })
    await wrapper.get('.s-input__action--search').trigger('click')

    expect(wrapper.emitted('search-click')).toHaveLength(2)
    expect(wrapper.emitted('search-click')?.map(([value]) => value)).toEqual([
      'calendar',
      'calendar',
    ])
  })

  it('renders configured affix icons and size classes', () => {
    const wrapper = mountInput({
      prefixIcon: 'cb:search',
      suffixIcon: 'cb:user',
      size: 'large',
    })

    expect(wrapper.classes()).toContain('s-input--large')
    expect(wrapper.classes()).toContain('s-input--has-prefix-icon')
    expect(wrapper.classes()).toContain('s-input--has-suffix-icon')
    expect(wrapper.find('.s-input__prefix .s-icon-stub').exists()).toBe(true)
    expect(wrapper.find('.s-input__suffix .s-icon-stub').exists()).toBe(true)
  })

  it('keeps custom affix slots on the wider content spacing', () => {
    const wrapper = mount(Input, {
      slots: {
        prefix: '<span>USD</span>',
        suffix: '<span>kg</span>',
      },
    })

    expect(wrapper.classes()).toContain('s-input--has-prefix')
    expect(wrapper.classes()).toContain('s-input--has-suffix')
    expect(wrapper.classes()).not.toContain('s-input--has-prefix-icon')
    expect(wrapper.classes()).not.toContain('s-input--has-suffix-icon')
  })

  it('renders placeholder text in its truncation wrapper', () => {
    const placeholder = 'A long placeholder that must not cover the suffix'
    const wrapper = mountInput({
      placeholder,
      suffixIcon: 'cb:user',
    })

    expect(wrapper.classes()).toContain('s-input--has-suffix')
    expect(wrapper.get('.s-input__placeholder-text').text()).toBe(placeholder)
  })

  it('distinguishes a resting float label from an active float label', async () => {
    const wrapper = mountInput({
      modelValue: '',
      labelFloat: true,
      placeholder: 'Search keywords',
      prefixIcon: 'cb:search',
    })
    const placeholder = wrapper.get('.s-input__placeholder')

    expect(placeholder.classes()).toContain('s-input__placeholder--float')
    expect(placeholder.classes()).not.toContain(
      's-input__placeholder--float-active',
    )

    await wrapper.get('input').trigger('focus')
    expect(placeholder.classes()).toContain(
      's-input__placeholder--float-active',
    )

    await wrapper.get('input').trigger('blur')
    expect(placeholder.classes()).not.toContain(
      's-input__placeholder--float-active',
    )
  })

  it('renders the native word counter in the suffix area', () => {
    const wrapper = mountInput({
      modelValue: 'Sax',
      maxLength: 10,
      showWordCount: true,
    })

    expect(wrapper.classes()).toContain('s-input--has-count')
    expect(wrapper.get('.s-input__wrapper .s-input__count').text()).toBe(
      '3 / 10',
    )
    expect(wrapper.get('input').attributes('maxlength')).toBe('10')
  })

  it('uses a custom counter for both display and input limiting', async () => {
    const countUtf8Bytes = ({ value }: { value: string }) =>
      new TextEncoder().encode(value).length
    const wrapper = mountInput({
      modelValue: '',
      maxLength: 4,
      showWordCount: true,
      countMethod: countUtf8Bytes,
    })
    const input = wrapper.get('input')

    await input.setValue('A')
    expect((input.element as HTMLInputElement).value).toBe('A')
    expect(wrapper.get('.s-input__count').text()).toBe('1 / 4')

    await input.setValue('A你B')

    expect((input.element as HTMLInputElement).value).toBe('A你')
    expect(wrapper.emitted('update:modelValue')).toEqual([['A'], ['A你']])
    expect(wrapper.get('.s-input__count').text()).toBe('4 / 4')
    expect(input.attributes('maxlength')).toBeUndefined()
  })

  it('lets the suffix slot replace the default counter', () => {
    const wrapper = mount(Input, {
      props: { modelValue: 'Sax', showWordCount: true },
      slots: { suffix: '<span class="custom-suffix">custom</span>' },
    })

    expect(wrapper.get('.custom-suffix').text()).toBe('custom')
    expect(wrapper.find('.s-input__count').exists()).toBe(false)
  })

  it.each(['date', 'time'])('%s delegates to the dedicated picker', (type) => {
    const wrapper = mountInput({ type })

    expect(wrapper.get('input').attributes('type')).toBe('text')
  })

  it('clears the local value even before a deferred commit', async () => {
    const wrapper = mountInput({
      modelValue: 'old',
      immediate: false,
      clearable: true,
    })
    const input = wrapper.get('input')

    await input.trigger('focus')
    ;(input.element as HTMLInputElement).value = 'new'
    await input.trigger('input')
    await wrapper.get('.icon-close-stub').trigger('click')

    expect((input.element as HTMLInputElement).value).toBe('')
    expect(wrapper.emitted('update:modelValue')).toEqual([['']])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })
})
