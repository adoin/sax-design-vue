import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Icon from '../src/icon.vue'
import Close from '../src/close.vue'
import { closePath } from '../src/close-artwork'

describe('Icon rolling', () => {
  it('shares the soft close artwork between component and dynamic icon names', () => {
    const close = mount(Close, { props: { size: 14 } })
    const icon = mount(Icon, { props: { name: 'sax:close' } })
    expect(close.get('path').attributes('d')).toBe(closePath)
    expect(icon.get('path').attributes('d')).toBe(closePath)
    expect(close.attributes('viewBox')).toBe('0 0 24 24')
    expect(close.attributes('style')).toContain('width: 14px')
    close.unmount()
    icon.unmount()
  })
  it('renders a bundled component fallback without an external collection', () => {
    const name = ['cb', 'chevron-down'].join(':')
    const wrapper = mount(Icon, { props: { name } })

    expect(wrapper.get('svg').attributes('viewBox')).toBe('0 0 32 32')
    expect(wrapper.get('path').attributes('d')).toBe(
      'M16 22L6 12l1.4-1.4l8.6 8.6l8.6-8.6L26 12z',
    )
  })

  it('keeps explicit icon data above the bundled fallback', () => {
    const wrapper = mount(Icon, {
      props: {
        name: ['cb', 'chevron-down'].join(':'),
        iconData: {
          attributes: { viewBox: '0 0 8 8' },
          body: '<circle cx="4" cy="4" r="3"/>',
        },
      },
    })

    expect(wrapper.get('svg').attributes('viewBox')).toBe('0 0 8 8')
    expect(wrapper.get('circle').attributes('r')).toBe('3')
  })

  it('uses the stylesheet default duration for boolean rolling', () => {
    const wrapper = mount(Icon, {
      props: { rolling: true },
      slots: { default: '<svg />' },
    })

    expect(wrapper.classes()).toContain('is-rolling')
    expect(wrapper.attributes('style')).not.toContain(
      '--sax-icon-rolling-duration',
    )
  })

  it('writes numeric seconds to the rolling duration CSS variable', () => {
    const wrapper = mount(Icon, {
      props: { rolling: 1.8 },
      slots: { default: '<svg />' },
    })

    expect(wrapper.classes()).toContain('is-rolling')
    expect(wrapper.attributes('style')).toContain(
      '--sax-icon-rolling-duration: 1.8s',
    )
  })

  it('does not roll by default', () => {
    const wrapper = mount(Icon, { slots: { default: '<svg />' } })

    expect(wrapper.classes()).not.toContain('is-rolling')
  })
})
