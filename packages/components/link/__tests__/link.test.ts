import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Link from '../src/link.vue'

describe('Link', () => {
  it('uses the default underline without the slide modifier', () => {
    const wrapper = mount(Link)

    expect(wrapper.classes()).toContain('is-underline')
    expect(wrapper.classes()).not.toContain('is-underline-slide')
  })

  it.each(['slide', 'center', 'double', 'highlight'] as const)(
    'adds the %s underline modifier',
    (underlineEffect) => {
      const wrapper = mount(Link, {
        props: { underlineEffect },
      })

      expect(wrapper.classes()).toContain('is-underline')
      expect(wrapper.classes()).toContain(`is-underline-${underlineEffect}`)
    },
  )

  it('does not animate when underline is disabled', () => {
    const wrapper = mount(Link, {
      props: { underline: false, underlineEffect: 'slide' },
    })

    expect(wrapper.classes()).not.toContain('is-underline')
    expect(wrapper.classes()).not.toContain('is-underline-slide')
  })

  it('prevents disabled links from navigating or emitting clicks', async () => {
    const wrapper = mount(Link, {
      props: { disabled: true, href: 'https://example.com' },
    })

    await wrapper.trigger('click')

    expect(wrapper.attributes('href')).toBeUndefined()
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.emitted('click')).toBeUndefined()
  })
})
