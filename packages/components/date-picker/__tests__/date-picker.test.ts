import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DatePicker from '../src/date-picker.vue'

const InputStub = defineComponent({
  name: 'SInput',
  inheritAttrs: false,
  props: {
    modelValue: [String, Number],
    label: String,
    labelFloat: Boolean,
    color: String,
    size: String,
    suffixIcon: String,
  },
  template: '<div class="input-stub" />',
})

const PopperStub = defineComponent({
  name: 'SPopper',
  inheritAttrs: false,
  props: { popperStyle: Object },
  template: '<div class="popper-stub"><slot /></div>',
})

const mountPicker = (props = {}) =>
  mount(DatePicker, {
    props,
    global: {
      stubs: {
        SInput: InputStub,
        SPopper: PopperStub,
      },
    },
  })

describe('DatePicker input presentation', () => {
  it('passes floating label, color, and size to its input', () => {
    const wrapper = mountPicker({
      label: 'Appointment date',
      labelFloat: true,
      color: '#123456',
      size: 'large',
    })
    const input = wrapper.getComponent(InputStub)

    expect(input.props()).toMatchObject({
      label: 'Appointment date',
      labelFloat: true,
      color: '#123456',
      size: 'large',
      suffixIcon: 'cb:calendar',
    })
    expect(wrapper.get('.s-date-picker').attributes('style')).toContain(
      '--sax-color: 18, 52, 86',
    )
    expect(wrapper.getComponent(PopperStub).props('popperStyle')).toMatchObject(
      {
        '--sax-color': '18, 52, 86',
      },
    )
  })

  it('uses independent floating labels for both range inputs', () => {
    const wrapper = mountPicker({
      type: 'daterange',
      labelFloat: true,
      startLabel: 'Start date',
      endLabel: 'End date',
      color: 'success',
      size: 'small',
    })
    const inputs = wrapper.findAllComponents(InputStub)

    expect(inputs).toHaveLength(2)
    expect(inputs.map((input) => input.props('label'))).toEqual([
      'Start date',
      'End date',
    ])
    for (const input of inputs) {
      expect(input.props()).toMatchObject({
        labelFloat: true,
        color: 'success',
        size: 'small',
        suffixIcon: 'cb:calendar',
      })
    }
  })
})
