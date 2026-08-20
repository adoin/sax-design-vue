import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LayoutAside from '../src/aside.vue'
import LayoutContainer from '../src/container.vue'
import LayoutHeader from '../src/header.vue'
import Layout from '../src/layout.vue'

describe('Layout', () => {
  it('builds a semantic application shell from named slots', () => {
    const wrapper = mount(Layout, {
      props: {
        asideWidth: 216,
        gap: 20,
        padding: 24,
        minHeight: '80dvh',
      },
      slots: {
        header: 'Workspace header',
        aside: 'Navigation',
        default: 'Main content',
        footer: 'Workspace footer',
      },
    })

    expect(wrapper.find('header').text()).toBe('Workspace header')
    expect(wrapper.find('aside').text()).toBe('Navigation')
    expect(wrapper.find('main').text()).toBe('Main content')
    expect(wrapper.find('footer').text()).toBe('Workspace footer')
    expect(wrapper.find('aside').attributes('style')).toContain('width: 216px')
    expect(wrapper.attributes('style')).toContain('--s-layout-gap: 20px')
    expect(wrapper.attributes('style')).toContain('--s-layout-padding: 24px')
    expect(wrapper.attributes('style')).toContain(
      '--s-layout-min-height: 80dvh',
    )
  })

  it('does not render wrappers for omitted regions', () => {
    const wrapper = mount(Layout, {
      slots: { default: 'Only main content' },
    })

    expect(wrapper.find('header').exists()).toBe(false)
    expect(wrapper.find('aside').exists()).toBe(false)
    expect(wrapper.find('main').exists()).toBe(true)
    expect(wrapper.find('footer').exists()).toBe(false)
  })

  it('exposes aside placement and page behavior as classes', () => {
    const wrapper = mount(Layout, {
      props: {
        asidePosition: 'end',
        responsive: false,
        stickyHeader: true,
        stickyHeaderOffset: 72,
      },
      slots: { header: 'Header', aside: 'Aside', default: 'Main' },
    })

    expect(wrapper.classes()).toContain('s-layout--end')
    expect(wrapper.classes()).toContain('is-sticky-header')
    expect(wrapper.classes()).not.toContain('is-responsive')
    expect(wrapper.find('header').classes()).toContain('is-sticky')
    expect(wrapper.find('header').attributes('style')).toContain(
      '--s-layout-header-sticky-offset: 72px',
    )
  })
})

describe('Layout composition primitives', () => {
  it('supports gap, wrapping, alignment, and distribution', () => {
    const wrapper = mount(LayoutContainer, {
      props: {
        direction: 'vertical',
        gap: 12,
        wrap: true,
        align: 'center',
        justify: 'space-between',
      },
    })

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        's-layout-container--vertical',
        'is-wrap',
        'is-align-center',
        'is-justify-space-between',
      ]),
    )
    expect(wrapper.attributes('style')).toContain(
      '--s-layout-container-gap: 12px',
    )
  })

  it('normalizes numeric section sizes and padding', () => {
    const wrapper = mount(LayoutAside, {
      props: { size: 180, padding: 0 },
    })

    expect(wrapper.attributes('style')).toContain('width: 180px')
    expect(wrapper.attributes('style')).toContain('padding: 0px')
  })

  it('attaches collapsible outside content to the aside surface', async () => {
    const wrapper = mount(LayoutAside, {
      props: { outsidePosition: 'start' },
      slots: {
        default: 'Navigation',
        outside: '<button type="button">Theme</button>',
      },
    })

    expect(wrapper.classes()).toContain('is-with-outside')
    expect(wrapper.classes()).toContain('is-outside-start')
    expect(wrapper.find('.s-layout-aside__content').text()).toBe('Navigation')
    expect(wrapper.find('.s-layout-aside__outside button').text()).toBe('Theme')

    const toggle = wrapper.get('.s-layout-aside__outside-toggle')
    expect(toggle.attributes('aria-label')).toBe('Collapse attached tools')
    expect(toggle.attributes('aria-expanded')).toBe('true')

    await toggle.trigger('click')

    expect(wrapper.get('.s-layout-aside__outside').classes()).toContain(
      'is-collapsed',
    )
    expect(
      wrapper.get('.s-layout-aside__outside-content').attributes('aria-hidden'),
    ).toBe('true')
    expect(toggle.attributes('aria-label')).toBe('Expand attached tools')
    expect(toggle.attributes('aria-expanded')).toBe('false')
    expect(wrapper.emitted('update:outsideCollapsed')).toEqual([[true]])
    expect(wrapper.emitted('outside-collapse')).toEqual([[true]])
  })

  it('can render outside content without the built-in collapse control', () => {
    const wrapper = mount(LayoutAside, {
      props: { outsideCollapsible: false },
      slots: { outside: 'Persistent tools' },
    })

    expect(wrapper.find('.s-layout-aside__outside-toggle').exists()).toBe(false)
    expect(wrapper.get('.s-layout-aside__outside-content').text()).toBe(
      'Persistent tools',
    )
  })

  it('forwards SLayout aside-outside content toward the main region', () => {
    const wrapper = mount(Layout, {
      props: { asidePosition: 'end' },
      slots: {
        aside: 'Navigation',
        'aside-outside': 'Tools',
        default: 'Content',
      },
    })

    expect(wrapper.find('.s-layout-aside').classes()).toContain(
      'is-outside-start',
    )
    expect(wrapper.find('.s-layout-aside__outside').text()).toBe('Tools')
  })

  it('forwards the attached tool collapse state from SLayout', async () => {
    const wrapper = mount(Layout, {
      slots: {
        aside: 'Navigation',
        'aside-outside': 'Tools',
        default: 'Content',
      },
    })

    await wrapper.get('.s-layout-aside__outside-toggle').trigger('click')

    expect(wrapper.emitted('update:asideOutsideCollapsed')).toEqual([[true]])
    expect(wrapper.emitted('aside-outside-collapse')).toEqual([[true]])
  })

  it('supports a standalone sticky header with an offset and z-index', () => {
    const wrapper = mount(LayoutHeader, {
      props: { sticky: true, stickyOffset: '4rem', zIndex: 30 },
      slots: { default: 'Sticky header' },
    })

    expect(wrapper.classes()).toContain('is-sticky')
    expect(wrapper.attributes('style')).toContain(
      '--s-layout-header-sticky-offset: 4rem',
    )
    expect(wrapper.attributes('style')).toContain(
      '--s-layout-header-z-index: 30',
    )
  })
})
