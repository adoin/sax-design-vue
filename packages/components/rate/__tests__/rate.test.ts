import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import Rate from '../src/rate.vue'

describe('Rate', () => {
  it.each(['small', 'default', 'large'] as const)(
    'clips a full-size overlay at its midpoint for %s',
    (size) => {
      const wrapper = mount(Rate, {
        props: { modelValue: 2.5, allowHalf: true, size },
      })
      const decimal = wrapper.get('.s-rate__decimal')
      expect((decimal.element as HTMLElement).style.clipPath).toBe(
        'inset(0 50% 0 0)',
      )
      expect((decimal.element as HTMLElement).style.width).toBe('')
      wrapper.unmount()
    },
  )

  it('preserves the fractional proportion for a read-only score', () => {
    const wrapper = mount(Rate, { props: { modelValue: 2.25, disabled: true } })
    expect(
      (wrapper.get('.s-rate__decimal').element as HTMLElement).style.clipPath,
    ).toBe('inset(0 75% 0 0)')
    wrapper.unmount()
  })
  it('renders built-in star assets without runtime icon configuration', () => {
    const wrapper = mount(Rate, { props: { modelValue: 3 } })

    expect(wrapper.findAll('.s-rate__item')).toHaveLength(5)
    expect(wrapper.findAll('.s-rate__item svg')).toHaveLength(5)
    expect(wrapper.findAll('.s-rate__icon.is-active')).toHaveLength(3)
  })

  it('uses the stable item box when hovering either half of a star', async () => {
    const wrapper = mount(Rate, {
      props: { modelValue: 0, allowHalf: true },
    })
    const firstItem = wrapper.find('.s-rate__item')
    const firstIcon = firstItem.find('.s-rate__icon')

    vi.spyOn(firstItem.element, 'getBoundingClientRect').mockReturnValue({
      left: 100,
    } as DOMRect)
    Object.defineProperty(firstIcon.element, 'clientWidth', {
      configurable: true,
      value: 20,
    })

    await firstItem.trigger('mousemove', { clientX: 105 })
    expect(wrapper.attributes('aria-valuenow')).toBe('0.5')
    expect(firstItem.find('.s-rate__decimal').exists()).toBe(true)
    expect(firstItem.findAll('svg')).toHaveLength(2)

    await firstItem.trigger('mousemove', { clientX: 115 })
    expect(wrapper.attributes('aria-valuenow')).toBe('1')
    expect(firstItem.find('.s-rate__decimal').exists()).toBe(false)
  })
})
