import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Divider from '../src/divider.vue'

describe('Divider', () => {
  it('renders a horizontal separator by default', () => {
    const wrapper = mount(Divider)

    expect(wrapper.classes()).toContain('s-divider--horizontal')
    expect(wrapper.attributes('role')).toBe('separator')
    expect(wrapper.attributes('aria-orientation')).toBe('horizontal')
    expect(wrapper.findAll('.s-divider__border')).toHaveLength(1)
    expect(wrapper.find('.s-divider__text').exists()).toBe(false)
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

    const style = wrapper.attributes('style')
    expect(style).toContain('--s-divider-line-width: 2px')
    expect(style).toContain('--s-divider-line-style: dashed')
    expect(style).toContain('--s-divider-accent: hsl(')
  })

  it('lays out labelled dividers without a white backing surface', () => {
    const wrapper = mount(Divider, {
      props: { position: 'left', gap: '18px' },
      slots: { default: 'Section title' },
    })

    expect(wrapper.classes()).toContain('s-divider--plain')
    expect(wrapper.classes()).toContain('s-divider--left')
    expect(wrapper.findAll('.s-divider__border')).toHaveLength(1)
    expect(wrapper.find('.s-divider__text').text()).toBe('Section title')
    expect(wrapper.attributes('style')).toContain('--s-divider-gap: 18px')
    expect(wrapper.find('.s-divider__text').attributes('style')).toBeUndefined()
  })

  it('keeps label treatment, accent and custom surface independent', () => {
    const wrapper = mount(Divider, {
      props: {
        variant: 'soft',
        color: 'warning',
        background: '#e9f1ff',
        labelColor: '#234e90',
      },
      slots: { default: 'Notes' },
    })

    expect(wrapper.classes()).toContain('s-divider--soft')
    expect(wrapper.classes()).toContain('is-colored')
    expect(wrapper.classes()).toContain('is-custom-background')
    expect(wrapper.attributes('style')).toContain(
      '--s-divider-accent: var(--sax-css-warn)',
    )
    expect(wrapper.attributes('style')).toContain('--s-divider-background:')
    expect(wrapper.attributes('style')).toContain('--s-divider-label-color:')
  })

  it('chooses a readable foreground for named label surfaces', () => {
    const wrapper = mount(Divider, {
      props: { background: 'primary' },
      slots: { default: 'Active' },
    })

    expect(wrapper.attributes('style')).toContain(
      '--s-divider-label-color: var(--sax-css-white)',
    )
    expect(wrapper.findAll('.s-divider__border')).toHaveLength(2)
  })

  it('keeps bright semantic solid labels readable in both themes', () => {
    const success = mount(Divider, {
      props: { variant: 'solid', color: 'success' },
      slots: { default: 'Success' },
    })
    const danger = mount(Divider, {
      props: { variant: 'solid', color: 'danger' },
      slots: { default: 'Danger' },
    })

    expect(success.attributes('style')).toContain(
      '--s-divider-label-color: var(--sax-css-dark)',
    )
    expect(danger.classes()).toContain('is-solid-danger')
    expect(danger.attributes('style')).toContain(
      '--s-divider-label-color: var(--sax-css-white)',
    )
  })

  it('chooses black or white automatically for literal label backgrounds', () => {
    const light = mount(Divider, {
      props: { background: '#edf1ff' },
      slots: { default: 'Light surface' },
    })
    const dark = mount(Divider, {
      props: { background: 'rgb(20, 24, 36)' },
      slots: { default: 'Dark surface' },
    })
    const hsl = mount(Divider, {
      props: { background: 'hsl(221deg 53% 22%)' },
      slots: { default: 'HSL surface' },
    })

    expect(light.attributes('style')).toContain(
      '--s-divider-label-color: var(--sax-css-black)',
    )
    expect(dark.attributes('style')).toContain(
      '--s-divider-label-color: var(--sax-css-white)',
    )
    expect(hsl.attributes('style')).toContain(
      '--s-divider-label-color: var(--sax-css-white)',
    )
  })
})
