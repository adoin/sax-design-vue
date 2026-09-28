import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Input from '../src/input.vue'

describe('Input native validation', () => {
  it.each(['email', 'url'] as const)(
    'reports %s on blur while preserving the entered text',
    async (type) => {
      const wrapper = mount(Input, {
        props: { type, modelValue: 'unfinished' },
      })
      expect(wrapper.find('[role="alert"]').exists()).toBe(false)
      await wrapper.get('input').trigger('blur')
      expect(wrapper.get('input').element.value).toBe('unfinished')
      expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
      expect(wrapper.findAll('[role="alert"]')).toHaveLength(1)
      await wrapper.setProps({
        modelValue:
          type === 'email' ? 'user@example.com' : 'https://example.com',
      })
      await nextTick()
      await nextTick()
      expect(wrapper.find('[role="alert"]').exists()).toBe(false)
      wrapper.unmount()
    },
  )

  it('allows optional empty values and unrestricted telephone formats', async () => {
    const wrapper = mount(Input, { props: { type: 'email', modelValue: '' } })
    expect(wrapper.vm.validate()).toBe(true)
    await wrapper.setProps({
      type: 'tel',
      modelValue: '+44 (0)20 1234 5678 ext 2',
    })
    expect(wrapper.vm.validate()).toBe(true)
    wrapper.unmount()
  })

  it('uses pattern, required, and a custom message, and skips disabled or readonly fields', async () => {
    const wrapper = mount(Input, {
      props: {
        type: 'tel',
        pattern: '[0-9]{3}',
        modelValue: 'abc',
        validationMessage: 'Three digits required',
      },
    })
    await wrapper.get('input').trigger('invalid')
    expect(wrapper.get('[role="alert"]').text()).toBe('Three digits required')
    wrapper.vm.clearValidate()
    await nextTick()
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    await wrapper.setProps({ modelValue: '', required: true })
    expect(wrapper.vm.validate()).toBe(false)
    await wrapper.setProps({ disabled: true })
    expect(wrapper.vm.validate()).toBe(true)
    await wrapper.setProps({ disabled: false, readonly: true })
    expect(wrapper.vm.validate()).toBe(true)
    wrapper.unmount()
  })
})
