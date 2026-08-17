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
