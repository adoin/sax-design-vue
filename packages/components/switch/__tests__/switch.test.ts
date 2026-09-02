import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Switch from '../src/switch.vue'

describe('Switch', () => {
  it.each(['classic', 'soft', 'text'] as const)(
    'renders the %s structural variant',
    (variant) => {
      const wrapper = mount(Switch, {
        props: { modelValue: false, variant },
        global: {
          stubs: {
            IconCheck: true,
            IconClose: true,
            IconLoading: true,
          },
        },
      })

      expect(wrapper.classes()).toContain(`is-${variant}`)
      expect(wrapper.findAll('input[type="checkbox"]')).toHaveLength(1)
    },
  )

  it('emits one state change from the native checkbox', async () => {
    const wrapper = mount(Switch, { props: { modelValue: false } })

    await wrapper.get('input').setValue(true)

    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    expect(wrapper.emitted('change')).toEqual([[true]])
  })

  it('keeps both state labels in layout and only reveals the current one', () => {
    const wrapper = mount(Switch, {
      props: { modelValue: false },
      slots: {
        on: () => 'A much longer active label',
        off: () => 'Off',
      },
    })

    const labels = wrapper.findAll('.s-switch__label')
    expect(labels.map((label) => label.text())).toEqual([
      'A much longer active label',
      'Off',
    ])
    expect(labels[0].classes()).not.toContain('is-visible')
    expect(labels[1].classes()).toContain('is-visible')
  })

  it('uses the circle slot without a separate icon variant', () => {
    const wrapper = mount(Switch, {
      props: { modelValue: true },
      slots: {
        circle: () => h('span', { class: 'custom-circle-icon' }),
      },
    })

    expect(wrapper.classes()).toContain('is-classic')
    expect(wrapper.find('.custom-circle-icon').exists()).toBe(true)
  })

  it('replaces the thumb content while loading without disabled styling', () => {
    const wrapper = mount(Switch, {
      props: { modelValue: false, loading: true },
      slots: {
        circle: () => h('span', { class: 'custom-circle-icon' }),
      },
    })

    expect(wrapper.classes()).toContain('is-loading')
    expect(wrapper.classes()).not.toContain('is-disabled')
    expect(wrapper.get('input').attributes('disabled')).toBeDefined()
    expect(wrapper.find('.custom-circle-icon').exists()).toBe(false)
  })

  it('leaves indeterminate mode after the model enters a definite state', async () => {
    const wrapper = mount(Switch, {
      props: {
        modelValue: 'pending',
        indeterminate: true,
      },
    })

    expect(wrapper.classes()).toContain('is-indeterminate')
    expect(wrapper.get('input').attributes('aria-checked')).toBe('mixed')
    expect(
      (wrapper.get('input').element as HTMLInputElement).indeterminate,
    ).toBe(true)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await wrapper.get('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])

    await wrapper.setProps({ modelValue: true })
    expect(wrapper.classes()).not.toContain('is-indeterminate')
    expect(wrapper.classes()).toContain('is-checked')
    expect(wrapper.get('input').attributes('aria-checked')).toBeUndefined()
    expect(
      (wrapper.get('input').element as HTMLInputElement).indeterminate,
    ).toBe(false)
  })
})
