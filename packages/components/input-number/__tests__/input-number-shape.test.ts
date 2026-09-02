import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import InputNumber from '../src/input-number.vue'

describe('InputNumber shape', () => {
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
