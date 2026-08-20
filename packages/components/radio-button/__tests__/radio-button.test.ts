import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RadioButton from '../src/radio-button.vue'

describe('RadioButton', () => {
  it('renders an explicit radio indicator and active state', () => {
    const wrapper = mount(RadioButton, {
      props: {
        modelValue: 'team',
        value: 'team',
        label: 'Team',
        description: 'Shared workspace',
      },
    })

    expect(wrapper.classes()).toContain('is-active')
    expect(wrapper.get('input').element.checked).toBe(true)
    expect(wrapper.get('.s-radio-button__indicator').exists()).toBe(true)
    expect(wrapper.text()).toContain('Shared workspace')
  })

  it('emits model and change events when selected', async () => {
    const wrapper = mount(RadioButton, {
      props: { modelValue: 'starter', value: 'team' },
    })

    await wrapper.get('input').setValue(true)

    expect(wrapper.emitted('update:modelValue')).toEqual([['team']])
    expect(wrapper.emitted('change')).toEqual([['team']])
  })

  it('keeps disabled buttons non-interactive', () => {
    const wrapper = mount(RadioButton, {
      props: { value: 'team', disabled: true },
    })

    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.get('input').attributes()).toHaveProperty('disabled')
  })
})
