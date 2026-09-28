import { h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Checkbox from '../src/checkbox.vue'

const originalGetTotalLength = Object.getOwnPropertyDescriptor(
  SVGElement.prototype,
  'getTotalLength',
)

beforeEach(() => {
  Object.defineProperty(SVGElement.prototype, 'getTotalLength', {
    configurable: true,
    value: vi.fn(() => 24),
  })
})

afterEach(() => {
  if (originalGetTotalLength) {
    Object.defineProperty(
      SVGElement.prototype,
      'getTotalLength',
      originalGetTotalLength,
    )
  } else {
    Reflect.deleteProperty(SVGElement.prototype, 'getTotalLength')
  }
})

describe('Checkbox custom icon animation', () => {
  it('retains the square loader until its exit completes and ignores stale completion', async () => {
    const wrapper = mount(Checkbox, {
      props: { loading: true, modelValue: true },
    })
    await wrapper.setProps({ loading: false })
    const loader = wrapper.getComponent({ name: 'IconLoading' })
    expect(wrapper.find('.s-icon-loading').exists()).toBe(true)
    loader.vm.$emit('phaseChange', 'stopping')
    await nextTick()
    expect(wrapper.classes()).toContain('is-loading-exiting')
    await wrapper.setProps({ loading: true })
    loader.vm.$emit('restored')
    await nextTick()
    expect(wrapper.find('.s-icon-loading').exists()).toBe(true)
    await wrapper.setProps({ loading: false })
    loader.vm.$emit('restored')
    await nextTick()
    expect(wrapper.find('.s-icon-loading').exists()).toBe(false)
    expect(wrapper.classes()).toContain('is-checked')
    wrapper.unmount()
  })

  it.each([false, true])(
    'preserves selection %s while loading and blocks changes',
    async (modelValue) => {
      const wrapper = mount(Checkbox, { props: { modelValue, loading: true } })
      const input = wrapper.get('input')
      expect(input.element.disabled).toBe(true)
      expect(input.attributes('aria-busy')).toBe('true')
      expect(input.element.checked).toBe(modelValue)
      expect(wrapper.find('.s-icon-loading').exists()).toBe(true)
      expect(
        wrapper.getComponent({ name: 'SLogoLoading' }).props('shape'),
      ).toBe('square')
      expect(wrapper.find('.s-icon-check').exists()).toBe(true)
      await input.setValue(!modelValue)
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect(wrapper.emitted('change')).toBeUndefined()
      await wrapper.setProps({ loading: false })
      expect(input.element.disabled).toBe(false)
      wrapper.unmount()
    },
  )

  it.each([false, true])(
    'renders mixed state independently of modelValue=%s',
    async (modelValue) => {
      const wrapper = mount(Checkbox, {
        props: { modelValue, indeterminate: true },
      })
      expect(wrapper.classes()).toContain('is-indeterminate')
      expect(wrapper.classes()).not.toContain('is-checked')
      expect(wrapper.get('input').element.indeterminate).toBe(true)
      expect(wrapper.get('input').attributes('aria-checked')).toBe('mixed')
      expect(wrapper.find('.s-checkbox__indeterminate rect').exists()).toBe(
        true,
      )
      await wrapper.setProps({ indeterminate: false })
      expect(wrapper.get('input').element.checked).toBe(modelValue)
      expect(wrapper.find('.s-checkbox__indeterminate').exists()).toBe(false)
      expect(wrapper.classes().includes('is-checked')).toBe(modelValue)
      wrapper.unmount()
    },
  )

  it('honors controlled false after a previous user selection', async () => {
    const wrapper = mount(Checkbox, { props: { modelValue: false } })
    const input = wrapper.get('input')
    await input.setValue(true)
    await wrapper.setProps({ modelValue: true })
    await wrapper.setProps({ modelValue: false })
    expect(input.element.checked).toBe(false)
    expect(input.attributes('aria-checked')).toBe('false')
    expect(wrapper.classes()).not.toContain('is-checked')
    wrapper.unmount()
  })

  it('draws stroke svg geometry and exposes checked state to the slot', async () => {
    const wrapper = mount(Checkbox, {
      props: { modelValue: false },
      slots: {
        icon: ({ checked }: { checked: boolean }) =>
          h(
            'svg',
            {
              'data-checked': String(checked),
              fill: 'none',
              stroke: 'currentColor',
            },
            [h('path', { d: 'M0 0 L10 10' })],
          ),
      },
    })

    await nextTick()
    await nextTick()

    const icon = wrapper.get('.s-checkbox__custom-icon')
    expect(icon.attributes('data-animation')).toBe('draw')
    expect(icon.get('path').attributes()).toHaveProperty(
      'data-sax-checkbox-draw',
    )
    expect(icon.get('svg').attributes('data-checked')).toBe('false')

    await wrapper.setProps({ modelValue: true })
    expect(icon.get('svg').attributes('data-checked')).toBe('true')
    expect(wrapper.classes()).toContain('is-checked')
  })

  it('falls back to pop animation for filled icons', async () => {
    const wrapper = mount(Checkbox, {
      slots: {
        icon: () =>
          h('svg', { fill: 'currentColor' }, [
            h('path', { d: 'M0 0 H10 V10 Z' }),
          ]),
      },
    })

    await nextTick()
    await nextTick()

    expect(
      wrapper.get('.s-checkbox__custom-icon').attributes('data-animation'),
    ).toBe('pop')
  })

  it('supports disabling custom icon motion', async () => {
    const wrapper = mount(Checkbox, {
      props: { iconAnimation: 'none' },
      slots: { icon: () => h('span', 'icon') },
    })

    await nextTick()

    expect(
      wrapper.get('.s-checkbox__custom-icon').attributes('data-animation'),
    ).toBe('none')
  })
})
