import { h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Radio from '../src/radio.vue'

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

describe('Radio', () => {
  it('draws its active concentric circles independently from the input', () => {
    const wrapper = mount(Radio, {
      props: {
        modelValue: 'flip',
        value: 'flip',
        label: 'Flip',
      },
    })

    expect(wrapper.classes()).toContain('is-active')
    expect(wrapper.get('input').element.checked).toBe(true)
    expect(wrapper.get('input').classes()).toContain('s-radio__original')
    expect(wrapper.get('.s-radio').find('input').exists()).toBe(false)
    expect(wrapper.get('.s-radio__graphic').element.tagName).toBe('svg')
    expect(wrapper.get('.s-radio__surface').attributes()).toMatchObject({
      cx: '10',
      cy: '10',
    })
    expect(wrapper.get('.s-radio__dot').attributes()).toMatchObject({
      cx: '10',
      cy: '10',
    })
    expect(wrapper.get('.s-radio__label').text()).toBe('Flip')
  })

  it('emits model and change events when selected', async () => {
    const wrapper = mount(Radio, {
      props: {
        modelValue: 'default',
        value: 'flip',
      },
    })

    await wrapper.get('input').setValue(true)

    expect(wrapper.emitted('update:modelValue')).toEqual([['flip']])
    expect(wrapper.emitted('change')).toEqual([['flip']])
  })

  it('keeps disabled and loading radios non-interactive', () => {
    const disabled = mount(Radio, { props: { disabled: true } })
    const loading = mount(Radio, { props: { loading: true } })

    expect(disabled.classes()).toContain('is-disabled')
    expect(disabled.get('input').attributes()).toHaveProperty('disabled')
    expect(loading.classes()).toContain('is-loading')
    expect(loading.get('input').attributes('aria-busy')).toBe('true')
    expect(loading.get('input').attributes()).toHaveProperty('disabled')
    expect(loading.find('.s-radio__loading').exists()).toBe(false)
  })

  it('draws stroke svg geometry and exposes checked state to the icon slot', async () => {
    const wrapper = mount(Radio, {
      props: { modelValue: 'other', value: 'custom' },
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

    const icon = wrapper.get('.s-radio__custom-icon')
    expect(icon.attributes('data-animation')).toBe('draw')
    expect(icon.get('path').attributes()).toHaveProperty('data-sax-icon-draw')
    expect(icon.get('svg').attributes('data-checked')).toBe('false')

    await wrapper.setProps({ modelValue: 'custom' })
    expect(icon.get('svg').attributes('data-checked')).toBe('true')
    expect(wrapper.classes()).toContain('is-active')
  })

  it('falls back to pop animation for filled icons', async () => {
    const wrapper = mount(Radio, {
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
      wrapper.get('.s-radio__custom-icon').attributes('data-animation'),
    ).toBe('pop')
  })

  it('supports disabling custom icon motion', async () => {
    const wrapper = mount(Radio, {
      props: { iconAnimation: 'none' },
      slots: { icon: () => h('span', 'icon') },
    })

    await nextTick()

    expect(
      wrapper.get('.s-radio__custom-icon').attributes('data-animation'),
    ).toBe('none')
  })
})
