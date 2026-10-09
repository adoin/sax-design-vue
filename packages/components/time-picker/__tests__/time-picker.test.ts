import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TimePicker from '../src/time-picker.vue'

const InputStub = defineComponent({
  name: 'SInput',
  inheritAttrs: false,
  props: {
    modelValue: [String, Number],
    loading: Boolean,
    label: String,
    labelFloat: Boolean,
    color: String,
    size: String,
    shape: String,
    suffixIcon: String,
  },
  emits: ['update:modelValue'],
  template: '<div class="input-stub" />',
})

const PopperStub = defineComponent({
  name: 'SPopper',
  inheritAttrs: false,
  props: { popperStyle: Object, visible: Boolean },
  emits: ['update:visible'],
  template: '<div class="popper-stub"><slot /><slot name="content" /></div>',
})

const ButtonStub = defineComponent({
  name: 'SButton',
  emits: ['click'],
  template:
    '<button class="button-stub" @click="$emit(\'click\')"><slot /></button>',
})

const mountPicker = (props = {}) =>
  mount(TimePicker, {
    props,
    global: {
      stubs: {
        SInput: InputStub,
        SPopper: PopperStub,
        SButton: ButtonStub,
        STimePanel: true,
      },
    },
  })

describe('TimePicker input presentation', () => {
  it('only connects a time constraint when a disabled callback is configured', async () => {
    const wrapper = mountPicker()
    const panel = wrapper.getComponent({ name: 'STimePanel' })
    expect(panel.props('disabledDate')).toBeUndefined()
    await wrapper.setProps({ disabledHours: () => [1] })
    expect(typeof panel.props('disabledDate')).toBe('function')
    expect(panel.props('disabledDate')(new Date(2026, 9, 9, 1))).toBe(true)
    expect(panel.props('disabledDate')(new Date(2026, 9, 9, 2))).toBe(false)
    await wrapper.setProps({ disabledHours: undefined })
    expect(panel.props('disabledDate')).toBeUndefined()
    wrapper.unmount()
  })
  it('forwards loading and prevents confirmation and clearing during loading', async () => {
    const wrapper = mountPicker({
      loading: true,
      modelValue: '12:00:00',
      valueFormat: 'HH:mm:ss',
    })
    expect(wrapper.getComponent(InputStub).props('loading')).toBe(true)
    expect(wrapper.getComponent(InputStub).props('suffixIcon')).toBeUndefined()
    for (const button of wrapper.findAllComponents(ButtonStub))
      button.vm.$emit('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await wrapper.setProps({ loading: false })
    expect(wrapper.getComponent(InputStub).props('modelValue')).toBe('12:00:00')
    wrapper.unmount()
  })
  it('shares floating label, color, and size with its trigger and panel', () => {
    const wrapper = mountPicker({
      label: 'Start time',
      labelFloat: true,
      color: '#654321',
      size: 'small',
      shape: 'square',
    })
    const input = wrapper.getComponent(InputStub)

    expect(input.props()).toMatchObject({
      label: 'Start time',
      labelFloat: true,
      color: '#654321',
      size: 'small',
      shape: 'square',
      suffixIcon: 'cb:time',
    })
    expect(wrapper.get('.s-time-picker').attributes('style')).toContain(
      '--sax-color: 30deg 50.746% 26.275%',
    )
    expect(wrapper.get('.s-time-picker').classes()).toContain('is-square')
    expect(wrapper.getComponent(PopperStub).props('popperStyle')).toMatchObject(
      {
        '--sax-color': '30deg 50.746% 26.275%',
      },
    )
  })

  it('renders an absolute value in the configured timezone', () => {
    const wrapper = mountPicker({
      modelValue: Date.UTC(2026, 7, 5, 6, 0, 22),
      timezone: 'Asia/Shanghai',
    })

    expect(wrapper.getComponent(InputStub).props('modelValue')).toBe('14:00:22')
  })

  it('uses the primary theme color by default', () => {
    const wrapper = mountPicker()

    expect(wrapper.get('.s-time-picker').attributes('style')).toContain(
      '--sax-color: var(--sax-primary)',
    )
  })

  it('stages the current time when autoApplyNow is disabled', async () => {
    const wrapper = mountPicker({ autoApplyNow: false })
    const popper = wrapper.getComponent(PopperStub)

    popper.vm.$emit('update:visible', true)
    await wrapper.vm.$nextTick()
    await wrapper.findAll('.button-stub')[0].trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(popper.props('visible')).toBe(true)
  })
})
