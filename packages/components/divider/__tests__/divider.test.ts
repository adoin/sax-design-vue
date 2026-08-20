import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Divider from '../src/divider.vue'

describe('Divider', () => {
  it('renders a horizontal separator by default', () => {
    const wrapper = mount(Divider)

    expect(wrapper.classes()).toContain('s-divider--horizontal')
    expect(wrapper.attributes('role')).toBe('separator')
    expect(wrapper.attributes('aria-orientation')).toBe('horizontal')
    expect(wrapper.findAll('.s-divider__border')).toHaveLength(2)
  })

  it('renders a single inline border in vertical mode', () => {
    const wrapper = mount(Divider, {
      props: { direction: 'vertical' },
      slots: { default: 'Ignored label' },
    })

    expect(wrapper.classes()).toContain('s-divider--vertical')
    expect(wrapper.attributes('aria-orientation')).toBe('vertical')
    expect(wrapper.findAll('.s-divider__border')).toHaveLength(1)
    expect(wrapper.find('.s-divider__border').classes()).toContain(
      'is-vertical',
    )
    expect(wrapper.text()).toBe('')
  })

  it('applies line thickness and style to a vertical divider', () => {
    const wrapper = mount(Divider, {
      props: {
        direction: 'vertical',
        borderHeight: '2px',
        borderStyle: 'dashed',
        color: '#245cff',
      },
    })

    const borderStyle = wrapper.find('.s-divider__border').attributes('style')
    expect(borderStyle).toContain('border-inline-start-width: 2px')
    expect(borderStyle).toContain('border-inline-start-style: dashed')
    expect(borderStyle).toContain('border-inline-start-color: rgb(36, 92, 255)')
  })
})
