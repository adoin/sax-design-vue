import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TimeSelect from '../src/time-select.vue'

const SelectStub = defineComponent({
  name: 'SSelect',
  props: {
    modelValue: String,
    loading: Boolean,
    label: String,
    labelFloat: Boolean,
    placeholder: String,
    shape: String,
  },
  emits: ['update:modelValue', 'change', 'blur', 'focus'],
  template: '<div class="select-stub"><slot /></div>',
})

describe('TimeSelect input presentation', () => {
  it('inherits the Select loading state', () => {
    const wrapper = mount(TimeSelect, {
      props: { loading: true, modelValue: '10:00' },
      global: { stubs: { SSelect: SelectStub, SOption: true } },
    })
    expect(wrapper.getComponent(SelectStub).props('loading')).toBe(true)
    wrapper.unmount()
  })
  it('passes persistent and floating label props to Select', () => {
    const wrapper = mount(TimeSelect, {
      props: {
        label: 'Start time',
        labelFloat: true,
        placeholder: 'Select time',
        shape: 'square',
      },
      global: {
        stubs: {
          SSelect: SelectStub,
          SOption: true,
        },
      },
    })

    expect(wrapper.getComponent(SelectStub).props()).toMatchObject({
      label: 'Start time',
      labelFloat: true,
      placeholder: 'Select time',
      shape: 'square',
    })
  })
})
