import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import Card from '../src/card.vue'

describe('Card content', () => {
  it('renders title and text props with card content classes', () => {
    const wrapper = mount(Card, {
      props: {
        title: 'Trendy clothing',
        text: 'A concise card description.',
      },
    })

    expect(wrapper.get('.s-card__title-text').text()).toBe('Trendy clothing')
    expect(wrapper.get('.s-card__description').text()).toBe(
      'A concise card description.',
    )
  })

  it('renders a title prop without requiring body text', () => {
    const wrapper = mount(Card, { props: { title: 'Title only' } })

    expect(wrapper.find('.s-card__text').exists()).toBe(true)
    expect(wrapper.get('.s-card__title-text').text()).toBe('Title only')
  })

  it('gives named slots precedence over content props', () => {
    const wrapper = mount(Card, {
      props: {
        title: 'Prop title',
        text: 'Prop text',
      },
      slots: {
        title: '<h2 class="slot-title">Slot title</h2>',
        text: '<p class="slot-text">Slot text</p>',
      },
    })

    expect(wrapper.get('.slot-title').text()).toBe('Slot title')
    expect(wrapper.get('.slot-text').text()).toBe('Slot text')
    expect(wrapper.find('.s-card__title-text').exists()).toBe(false)
    expect(wrapper.find('.s-card__description').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Prop title')
    expect(wrapper.text()).not.toContain('Prop text')
  })

  it('uses the classic preset by default and preserves its DOM structure', () => {
    const wrapper = mount(Card, { props: { title: 'Surface' } })
    const card = wrapper.get('.s-card')

    expect(wrapper.get('.s-card-content').classes()).toContain('type-classic')
    expect(card.element.tagName).toBe('DIV')
    expect(card.classes()).toEqual(['s-card'])
    expect(card.attributes('style')).toBeUndefined()
    expect(card.attributes('role')).toBeUndefined()
    expect(card.attributes('tabindex')).toBeUndefined()
  })

  it('combines visual, layout, hover, color, and shape props independently', () => {
    const wrapper = mount(Card, {
      props: {
        variant: 'soft',
        orientation: 'horizontal',
        hoverEffect: 'glow',
        shape: 'square',
        color: 'success',
      },
    })
    const card = wrapper.get('.s-card')

    expect(wrapper.get('.s-card-content').classes()).toContain('is-horizontal')
    expect(card.classes()).toEqual(
      expect.arrayContaining(['s-card--soft', 'is-hover-glow', 'is-square']),
    )
    expect(card.attributes('style')).toContain('--sax-color')
    expect(card.attributes('style')).toContain('--sax-success')
  })

  it('maps numeric compatibility aliases to named presets', () => {
    const wrapper = mount(Card, { props: { type: 4 } })

    expect(wrapper.get('.s-card-content').classes()).toContain('type-frosted')
    expect(wrapper.get('.s-card').classes()).not.toContain('s-card--elevated')
  })

  it.each([
    'classic',
    'overlay',
    'split',
    'frosted',
    'reveal',
    'profile',
    'metric',
    'article',
  ] as const)('renders the %s named preset', (type) => {
    const wrapper = mount(Card, { props: { type } })

    expect(wrapper.get('.s-card-content').classes()).toContain(`type-${type}`)
  })

  it('uses structured slots for the new complete presets', () => {
    const wrapper = mount(Card, {
      props: { type: 'profile', title: 'Maya', subtitle: 'Designer' },
      slots: {
        media: '<img class="profile-media" alt="" />',
        default: '<div class="profile-stats">Stats</div>',
        actions: '<button class="profile-action">Follow</button>',
      },
    })

    expect(wrapper.get('.s-card').element.tagName).toBe('ARTICLE')
    expect(wrapper.find('.profile-media').exists()).toBe(true)
    expect(wrapper.find('.profile-stats').exists()).toBe(true)
    expect(wrapper.find('.profile-action').exists()).toBe(true)
    expect(wrapper.get('.s-card__subtitle').text()).toBe('Designer')
  })

  it('supports keyboard-accessible interactive cards', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Card, {
      props: { interactive: true },
      attrs: { onClick },
    })
    const card = wrapper.get('.s-card')

    expect(card.attributes('role')).toBe('button')
    expect(card.attributes('tabindex')).toBe('0')

    await card.trigger('keydown', { key: 'Enter' })
    await card.trigger('keydown', { key: ' ' })
    expect(onClick).toHaveBeenCalledTimes(2)
  })

  it('emits controlled selection updates and exposes pressed state', async () => {
    const wrapper = mount(Card, {
      props: { selectable: true, selected: false },
    })
    const card = wrapper.get('.s-card')

    expect(card.attributes('aria-pressed')).toBe('false')
    await card.trigger('click')
    expect(wrapper.emitted('update:selected')).toEqual([[true]])
    expect(wrapper.emitted('select')?.[0]?.[0]).toBe(true)

    await wrapper.setProps({ selected: true })
    expect(card.attributes('aria-pressed')).toBe('true')
    expect(card.classes()).toContain('is-selected')
  })

  it('renders an inert, stable loading skeleton', () => {
    const wrapper = mount(Card, {
      props: { loading: true, title: 'Loading content' },
    })
    const card = wrapper.get('.s-card')

    expect(card.attributes('aria-busy')).toBe('true')
    expect(card.attributes('aria-disabled')).toBe('true')
    expect(card.attributes('tabindex')).toBeUndefined()
    expect(wrapper.find('.s-card__loading').exists()).toBe(true)
    expect(wrapper.findAll('.s-card__skeleton')).toHaveLength(4)
  })

  it('supports modern structural slots and compatibility aliases', () => {
    const wrapper = mount(Card, {
      props: { variant: 'elevated' },
      slots: {
        header: '<strong class="header-slot">Header</strong>',
        extra: '<span class="extra-slot">Extra</span>',
        media: '<img class="media-slot" alt="" />',
        default: '<p class="body-slot">Body</p>',
        actions: '<button class="actions-slot">Action</button>',
      },
    })

    expect(wrapper.find('.header-slot').exists()).toBe(true)
    expect(wrapper.find('.extra-slot').exists()).toBe(true)
    expect(wrapper.find('.media-slot').exists()).toBe(true)
    expect(wrapper.find('.body-slot').exists()).toBe(true)
    expect(wrapper.find('.actions-slot').exists()).toBe(true)
  })

  it('keeps the legacy buttons slot in its original direct wrapper', () => {
    const wrapper = mount(Card, {
      slots: {
        buttons: '<button class="legacy-button">Action</button>',
      },
    })

    const buttonWrapper = wrapper.get('.s-card__button')
    expect(buttonWrapper.find('.legacy-button').exists()).toBe(true)
    expect(buttonWrapper.element.parentElement).toBe(
      wrapper.get('.s-card').element,
    )
  })
})
