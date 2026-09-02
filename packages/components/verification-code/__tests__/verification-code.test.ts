import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import VerificationCode from '../src/verification-code.vue'

describe('VerificationCode', () => {
  it('applies square geometry to every visual cell', () => {
    const wrapper = mount(VerificationCode, { props: { shape: 'square' } })

    expect(wrapper.classes()).toContain('is-square')
  })

  it('uses one native input for every visual position', () => {
    const wrapper = mount(VerificationCode, {
      props: { modelValue: '123', length: 6 },
    })

    expect(wrapper.findAll('input')).toHaveLength(1)
    expect(wrapper.findAll('.s-verification-code__cell')).toHaveLength(6)
    expect(wrapper.findAll('.is-filled')).toHaveLength(3)
  })

  it('sanitizes numeric input and emits complete once filled', async () => {
    const wrapper = mount(VerificationCode, {
      props: { modelValue: '', length: 4 },
    })

    await wrapper.get('input').setValue('1a2-34')

    expect(wrapper.emitted('update:modelValue')).toEqual([['1234']])
    expect(wrapper.emitted('input')).toEqual([['1234']])
    expect(wrapper.emitted('complete')).toEqual([['1234']])
  })

  it('accepts English letters and digits in alphanumeric mode', async () => {
    const wrapper = mount(VerificationCode, {
      props: { modelValue: '', length: 6, mode: 'alphanumeric' },
    })

    await wrapper.get('input').setValue('A7-K9_q2')

    expect(wrapper.emitted('update:modelValue')).toEqual([['A7K9q2']])
    expect(wrapper.emitted('complete')).toEqual([['A7K9q2']])
    expect(wrapper.get('input').attributes('inputmode')).toBe('text')
    expect(wrapper.get('input').attributes('pattern')).toBe('[A-Za-z0-9]*')
  })

  it('supports masked capsule and semantic error states', () => {
    const wrapper = mount(VerificationCode, {
      props: {
        modelValue: '2580',
        length: 4,
        mask: true,
        variant: 'capsule',
        status: 'error',
      },
    })

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['is-capsule', 'is-error']),
    )
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
    expect(wrapper.findAll('.s-verification-code__cell')[0].text()).toBe('•')
  })
})
