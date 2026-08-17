import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TimePicker from '../src/time-picker.vue'

const InputStub = defineComponent({
  name: 'SInput',
  inheritAttrs: false,
  props: {
    modelValue: [String, Number],
    label: String,
    labelFloat: Boolean,
    color: String,
    size: String,
  },
  template: '<div class="input-stub" />',
})

const PopperStub = defineComponent({
  name: 'SPopper',
  inheritAttrs: false,
  props: { popperStyle: Object },
  template: '<div class="popper-stub"><slot /></div>',
})

describe('TimePicker input presentation', () => {
  it('shares floating label, color, and size with its trigger and panel', () => {
    const wrapper = mount(TimePicker, {
      props: {
        label: 'Start time',
        labelFloat: true,
        color: '#654321',
        size: 'small',
      },
      global: {
        stubs: {
          SInput: InputStub,
          SPopper: PopperStub,
        },
      },
    })
    const input = wrapper.getComponent(InputStub)

    expect(input.props()).toMatchObject({
      label: 'Start time',
      labelFloat: true,
      color: '#654321',
      size: 'small',
    })
    expect(wrapper.get('.s-time-picker').attributes('style')).toContain(
      '--sax-color: 101, 67, 33',
    )
    expect(wrapper.getComponent(PopperStub).props('popperStyle')).toMatchObject(
      {
        '--sax-color': '101, 67, 33',
      },
    )
  })
})
