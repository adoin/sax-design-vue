import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Textarea from '../src/textarea.vue'

describe('Textarea', () => {
  it('applies square geometry from the shape prop', () => {
    const wrapper = mount(Textarea, { props: { shape: 'square' } })

    expect(wrapper.classes()).toContain('is-square')
  })

  it('floats the label on focus and when a value is present', async () => {
    const wrapper = mount(Textarea, {
      props: {
        label: 'Description',
        modelValue: '',
      },
    })
    const textarea = wrapper.get('textarea')
    const label = wrapper.get('label')

    expect(wrapper.classes()).not.toContain('is-label-active')
    expect(label.attributes('for')).toBe(textarea.attributes('id'))

    await textarea.trigger('focus')
    expect(wrapper.classes()).toContain('is-label-active')

    await textarea.trigger('blur')
    expect(wrapper.classes()).not.toContain('is-label-active')

    await wrapper.setProps({ modelValue: 'Saved description' })
    expect(wrapper.classes()).toContain('is-label-active')
  })

  it('keeps a stable border and exposes a valid focus color', async () => {
    const wrapper = mount(Textarea, {
      props: {
        color: 'primary',
        modelValue: '',
      },
    })

    expect(wrapper.attributes('style')).toContain(
      '--sax-textarea-focus-color: hsl(var(--sax-primary))',
    )

    await wrapper.get('textarea').trigger('focus')
    expect(wrapper.attributes('style')).not.toContain('border:')
  })
})
