import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import Rate from '../src/rate.vue'
import { getRatePixelOffset } from '../src/use-rate-pixel-alignment'

describe('Rate', () => {
  it.each([0.75, 1, 1.25, 1.5, 2])(
    'aligns the star axis to physical pixels at ratio %s',
    (ratio) => {
      const center = 781.666687
      const offset = getRatePixelOffset(center, ratio)
      expect((center + offset) * ratio).toBeCloseTo(
        Math.round(center * ratio),
        8,
      )
      expect(Math.abs(offset) * ratio).toBeLessThanOrEqual(0.5)
    },
  )
  it('keeps the overlay fallback for custom icons', () => {
    const wrapper = mount(Rate, {
      props: {
        modelValue: 2.5,
        allowHalf: true,
        icons: ['cb:add', 'cb:add', 'cb:add'],
        voidIcon: 'cb:add',
      },
    })
    expect(
      (wrapper.get('.s-rate__decimal').element as HTMLElement).style.clipPath,
    ).toBe('inset(0 50% 0 0)')
    wrapper.unmount()
  })

  it.each(['small', 'default', 'large'] as const)(
    'splits a single star path at its SVG midpoint for %s',
    (size) => {
      const wrapper = mount(Rate, {
        props: { modelValue: 2.5, allowHalf: true, size },
      })
      const star = wrapper.findAll('.s-rate__item')[2]
      expect(star.findAll('svg')).toHaveLength(1)
      expect(star.findAll('path')).toHaveLength(1)
      expect(
        star.findAll('stop').map((stop) => stop.attributes('offset')),
      ).toEqual(['50%', '50%'])
      expect(star.get('linearGradient').attributes('x2')).toBe('1024')
      wrapper.unmount()
    },
  )

  it('preserves the fractional proportion for a read-only score', () => {
    const wrapper = mount(Rate, { props: { modelValue: 2.25, disabled: true } })
    expect(
      wrapper.findAll('stop').map((stop) => stop.attributes('offset')),
    ).toEqual(['25%', '25%'])
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
    expect(firstItem.find('linearGradient').exists()).toBe(true)
    expect(firstItem.findAll('svg')).toHaveLength(1)

    await firstItem.trigger('mousemove', { clientX: 115 })
    expect(wrapper.attributes('aria-valuenow')).toBe('1')
    expect(firstItem.find('.s-rate__decimal').exists()).toBe(false)
  })
})
