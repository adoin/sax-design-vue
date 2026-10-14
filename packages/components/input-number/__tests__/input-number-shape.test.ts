import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import InputNumber from '../src/input-number.vue'

describe('InputNumber shape', () => {
  it('commits the configured clear fallback through the native input', async () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: 5, valueOnClear: 0 },
    })
    await wrapper.get('input').setValue('')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([0])
  })
  it('uses keyboard-operable step buttons and disables them at bounds', async () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: 3, min: 3, max: 4, label: 'Quantity' },
    })
    expect(
      wrapper.get('button.s-input-number__decrease').attributes('disabled'),
    ).toBeDefined()
    const increase = wrapper.get('button.s-input-number__increase')
    expect(increase.attributes('aria-label')).toBe('Quantity +')
    await increase.trigger('keydown', { key: ' ' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([4])
    await wrapper.setProps({ modelValue: 4 })
    expect(increase.attributes('disabled')).toBeDefined()
  })
  it('applies square geometry to the composed number field', () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: 3, shape: 'square' },
    })

    expect(wrapper.classes()).toContain('is-square')
    expect(wrapper.getComponent({ name: 'SInput' }).props('shape')).toBe(
      'square',
    )
  })
})
