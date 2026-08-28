import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Switch from '../src/switch.vue'

describe('Switch', () => {
  it.each(['classic', 'soft', 'icon', 'text'] as const)(
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
})
