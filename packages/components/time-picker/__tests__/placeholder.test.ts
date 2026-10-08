import { defineComponent, h, nextTick, shallowRef } from 'vue'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import TimePicker from '../src/time-picker.vue'
import DatePicker from '../../date-picker/src/date-picker.vue'
import Input from '../../input/src/input.vue'
import PlaceholderText from '../../base/src/placeholder-text.vue'
import type { TimePickerValue } from '../src/time-picker'

enableAutoUnmount(afterEach)
const PopperStub = defineComponent({
  name: 'SPopper',
  props: { visible: Boolean },
  emits: ['update:visible'],
  template:
    '<div><slot /><div v-if="visible" class="panel"><slot name="content" /></div></div>',
})
const ButtonStub = defineComponent({
  name: 'SButton',
  emits: ['click'],
  template: '<button @click="$emit(\'click\')"><slot /></button>',
})
const global = { stubs: { SPopper: PopperStub, SButton: ButtonStub } }
beforeEach(() => {
  vi.stubGlobal('matchMedia', () => ({ matches: true }))
})
afterEach(() => vi.unstubAllGlobals())

describe('Picker placeholder interaction', () => {
  it('keeps a time hint dissolved while editing the uncommitted panel time', async () => {
    const wrapper = mount(TimePicker, {
      attachTo: document.body,
      props: { placeholder: 'Choose time' },
      global,
    })
    const input = wrapper.getComponent(Input)
    const placeholder = input.getComponent(PlaceholderText)
    const original = input.get('input').element
    original.focus()
    wrapper.getComponent(PopperStub).vm.$emit('update:visible', true)
    await nextTick()
    wrapper.get('.s-time-panel__input-field').element.focus()
    await nextTick()
    await wrapper.get('.s-time-panel__input-field').setValue('01')
    expect(wrapper.emitted('blur')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(placeholder.props('dissolved')).toBe(true)
    expect(placeholder.element).toBe(
      input.getComponent(PlaceholderText).element,
    )
    expect(
      placeholder.get('.s-placeholder-text__dissolve').attributes('style'),
    ).toContain('opacity: 0')

    wrapper.getComponent(PopperStub).vm.$emit('update:visible', false)
    await nextTick()
    expect(placeholder.props('dissolved')).toBe(false)
  })

  it('retains floating time labels until the empty panel closes', async () => {
    const wrapper = mount(TimePicker, {
      props: { labelFloat: true, placeholder: 'Choose time' },
      global,
    })
    const input = wrapper.getComponent(Input)
    wrapper.getComponent(PopperStub).vm.$emit('update:visible', true)
    await nextTick()
    expect(input.get('.s-input__placeholder').classes()).toContain(
      's-input__placeholder--float-active',
    )
    wrapper.getComponent(PopperStub).vm.$emit('update:visible', false)
    await nextTick()
    expect(input.get('.s-input__placeholder').classes()).not.toContain(
      's-input__placeholder--float-active',
    )
  })

  it('does not restore a time hint after confirmation', async () => {
    const Host = defineComponent({
      setup() {
        const value = shallowRef<TimePickerValue>(null)
        return () =>
          h(TimePicker, {
            modelValue: value.value,
            'onUpdate:modelValue': (next) => {
              value.value = next
            },
            placeholder: 'Choose time',
          })
      },
    })
    const wrapper = mount(Host, { global })
    const picker = wrapper.getComponent(TimePicker)
    picker.getComponent(PopperStub).vm.$emit('update:visible', true)
    await nextTick()
    await picker
      .get('.s-time-picker__footer-actions button:last-child')
      .trigger('click')
    expect(picker.get('input').element.value).not.toBe('')
    expect(picker.getComponent(PlaceholderText).props('dissolved')).toBe(true)
    expect(picker.getComponent(PopperStub).props('visible')).toBe(false)
  })

  it.each(['date', 'datetime', 'daterange', 'datetimerange'] as const)(
    'keeps every %s hint dissolved while its panel is open',
    async (type) => {
      const wrapper = mount(DatePicker, {
        attachTo: document.body,
        props: { type },
        global,
      })
      const input = wrapper.getComponent(Input).get('input').element
      input.focus()
      wrapper.getComponent(PopperStub).vm.$emit('update:visible', true)
      await nextTick()
      input.blur()
      await nextTick()
      const placeholders = wrapper.findAllComponents(PlaceholderText)
      expect(placeholders).toHaveLength(type.endsWith('range') ? 2 : 1)
      expect(placeholders.every((hint) => hint.props('dissolved'))).toBe(true)
      wrapper.getComponent(PopperStub).vm.$emit('update:visible', false)
      await nextTick()
      expect(placeholders.every((hint) => !hint.props('dissolved'))).toBe(true)
    },
  )

  it('keeps the hint dissolved if the input still has focus when the panel closes', async () => {
    const wrapper = mount(TimePicker, { global })
    await wrapper.get('input').trigger('focus')
    const popper = wrapper.getComponent(PopperStub)
    popper.vm.$emit('update:visible', true)
    await nextTick()
    popper.vm.$emit('update:visible', false)
    await nextTick()
    expect(wrapper.getComponent(PlaceholderText).props('dissolved')).toBe(true)
    await wrapper.get('input').trigger('blur')
    expect(wrapper.getComponent(PlaceholderText).props('dissolved')).toBe(false)
  })

  it('does not share an open picker state with sibling pickers or ordinary inputs', async () => {
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h('div', [
            h(TimePicker),
            h(DatePicker),
            h(Input, { placeholder: 'Search' }),
          ]),
      }),
      { global },
    )
    wrapper
      .getComponent(TimePicker)
      .getComponent(PopperStub)
      .vm.$emit('update:visible', true)
    await nextTick()
    expect(
      wrapper
        .findAllComponents(PlaceholderText)
        .map((hint) => hint.props('dissolved')),
    ).toEqual([true, false, false])
  })

  it('does not dissolve independent inputs in a custom date panel footer', async () => {
    const wrapper = mount(DatePicker, {
      global,
      slots: { footer: () => h(Input, { placeholder: 'Notes' }) },
    })
    wrapper.getComponent(PopperStub).vm.$emit('update:visible', true)
    await nextTick()
    expect(
      wrapper
        .findAllComponents(PlaceholderText)
        .map((hint) => hint.props('dissolved')),
    ).toEqual([true, false])
  })
})
