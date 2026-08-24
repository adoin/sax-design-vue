import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Navbar from '../src/navbar.vue'
import NavbarGroup from '../src/navbar-group.vue'
import NavbarItem from '../src/navbar-item.vue'

describe('Navbar', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the composable regions and surface options', () => {
    const wrapper = mount(Navbar, {
      props: {
        variant: 'floating',
        position: 'sticky',
        size: 'spacious',
        blurred: true,
        contentWidth: 1080,
        gap: 20,
      },
      slots: {
        brand: '<strong>Brand</strong>',
        default: '<span>Navigation</span>',
        actions: '<button>Action</button>',
      },
    })

    expect(wrapper.element.tagName).toBe('HEADER')
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        's-navbar--floating',
        's-navbar--spacious',
        'is-sticky',
        'is-blurred',
      ]),
    )
    expect(wrapper.find('nav').attributes('aria-label')).toBe(
      'Primary navigation',
    )
    expect(wrapper.text()).toContain('BrandNavigationAction')
    expect(wrapper.attributes('style')).toContain(
      '--sax-navbar-content-width: 1080px',
    )
    expect(wrapper.attributes('style')).toContain('--sax-navbar-gap: 20px')
  })

  it('keeps legacy slots compatible and updates the active item', async () => {
    const wrapper = mount(Navbar, {
      props: { modelValue: 'home' },
      slots: {
        left: '<span>Legacy brand</span>',
        default: () => h(NavbarItem, { id: 'docs' }, () => 'Docs'),
        right: '<span>Legacy actions</span>',
      },
    })

    await wrapper.find('.s-navbar-item').trigger('click')

    expect(wrapper.text()).toContain('Legacy brand')
    expect(wrapper.text()).toContain('Legacy actions')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['docs'])
  })

  it('provides a keyboard-accessible grouped navigation trigger', async () => {
    const wrapper = mount(Navbar, {
      slots: {
        default: () =>
          h(NavbarGroup, null, {
            default: () => 'Product',
            items: () =>
              h(NavbarItem, { id: 'components' }, () => 'Components'),
          }),
      },
    })
    const trigger = wrapper.find('.s-navbar-group__trigger')

    expect(trigger.attributes('aria-expanded')).toBe('false')
    await trigger.trigger('click')
    expect(trigger.attributes('aria-expanded')).toBe('true')

    await trigger.trigger('keydown', { key: 'Escape' })
    expect(trigger.attributes('aria-expanded')).toBe('false')
  })

  it('keeps a hovered group open while the pointer crosses into its items', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Navbar, {
      slots: {
        default: () =>
          h(NavbarGroup, null, {
            default: () => 'Social',
            items: () => h(NavbarItem, { id: 'github' }, () => 'Github'),
          }),
      },
    })
    const group = wrapper.find('.s-navbar-group')
    const trigger = wrapper.find('.s-navbar-group__trigger')
    const items = wrapper.find('.s-navbar-group__items')

    await group.trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(100)
    expect(trigger.attributes('aria-expanded')).toBe('true')

    await group.trigger('mouseleave')
    await vi.advanceTimersByTimeAsync(80)
    await items.trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(160)
    expect(trigger.attributes('aria-expanded')).toBe('true')

    await wrapper.find('.s-navbar-item').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['github'])

    await group.trigger('mouseleave')
    await vi.advanceTimersByTimeAsync(160)
    expect(trigger.attributes('aria-expanded')).toBe('false')
  })
})
