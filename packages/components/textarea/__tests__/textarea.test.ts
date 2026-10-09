import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Textarea from '../src/textarea.vue'
import ControlLoading from '../../icon/src/control-loading.vue'

describe('Textarea', () => {
  it.each(['loading', 'disabled'] as const)(
    'preserves content and blocks commits while %s',
    async (state) => {
      const wrapper = mount(Textarea, {
        props: {
          modelValue: '  Saved text  ',
          trim: true,
          immediate: false,
          [state]: true,
        },
      })
      const textarea = wrapper.get<HTMLTextAreaElement>('textarea')
      expect(textarea.element.disabled).toBe(true)
      expect(textarea.element.value).toBe('  Saved text  ')
      expect(wrapper.classes()).toContain(`is-${state}`)
      if (state === 'loading') {
        expect(wrapper.classes()).not.toContain('is-disabled')
        expect(wrapper.find('.s-control-loading').exists()).toBe(true)
        expect(wrapper.attributes('aria-busy')).toBe('true')
      }
      textarea.element.dispatchEvent(new Event('input'))
      textarea.element.dispatchEvent(new Event('change'))
      textarea.element.dispatchEvent(new FocusEvent('blur'))
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect(wrapper.emitted('change')).toBeUndefined()
      await wrapper.setProps({ [state]: false })
      if (state === 'loading') {
        expect(textarea.element.disabled).toBe(true)
        wrapper.getComponent(ControlLoading).vm.$emit('restored')
        await wrapper.vm.$nextTick()
      }
      expect(textarea.element.disabled).toBe(false)
      await textarea.setValue('New text')
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['New text'])
      wrapper.unmount()
    },
  )

  it('defers controlled updates until an IME composition ends', async () => {
    const wrapper = mount(Textarea, { props: { modelValue: 'old' } })
    const textarea = wrapper.get<HTMLTextAreaElement>('textarea')

    await textarea.trigger('compositionstart')
    textarea.element.value = '中文草稿'
    await textarea.trigger('input', { isComposing: true })
    await wrapper.setProps({ modelValue: 'stale' })

    expect(textarea.element.value).toBe('中文草稿')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await textarea.trigger('compositionend')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['中文草稿'])
  })

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
      '--sax-textarea-focus-color: var(--sax-css-primary)',
    )

    await wrapper.get('textarea').trigger('focus')
    expect(wrapper.attributes('style')).not.toContain('border:')
  })
})
