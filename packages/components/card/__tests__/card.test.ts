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

    expect(wrapper.find('.s-card__header').exists()).toBe(true)
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

  it('uses the simple default layout by default', () => {
    const wrapper = mount(Card, { props: { title: 'Surface' } })
    const card = wrapper.get('.s-card')

    expect(wrapper.get('.s-card-content').classes()).toContain('type-default')
    expect(card.element.tagName).toBe('ARTICLE')
    expect(card.classes()).toEqual(expect.arrayContaining(['s-card']))
    expect(card.attributes('style')).toContain('--sax-color')
    expect(card.attributes('role')).toBeUndefined()
    expect(card.attributes('tabindex')).toBeUndefined()
    expect(wrapper.get('.s-card__header .s-card__title-text').text()).toBe(
      'Surface',
    )
    expect(wrapper.find('.s-card__effect').exists()).toBe(false)
  })

  it('preserves the explicit classic preset DOM structure', () => {
    const wrapper = mount(Card, {
      props: { type: 'classic', title: 'Surface' },
    })
    const card = wrapper.get('.s-card')

    expect(wrapper.get('.s-card-content').classes()).toContain('type-classic')
    expect(card.element.tagName).toBe('DIV')
    expect(card.attributes('style')).toBeUndefined()
    expect(card.classes()).not.toContain('is-has-media')
  })

  it('combines layout, hover, color, and shape props independently', () => {
    const wrapper = mount(Card, {
      props: {
        orientation: 'horizontal',
        hoverEffect: 'glow',
        shape: 'square',
        color: 'success',
      },
    })
    const card = wrapper.get('.s-card')

    expect(wrapper.get('.s-card-content').classes()).toContain('type-default')
    expect(wrapper.get('.s-card-content').classes()).toContain('is-horizontal')
    expect(card.classes()).toEqual(
      expect.arrayContaining(['is-hover-glow', 'is-square']),
    )
    expect(card.attributes('style')).toContain('--sax-color')
    expect(card.attributes('style')).toContain('--sax-success')
  })

  it('keeps media-first content while arranging it horizontally', () => {
    const wrapper = mount(Card, {
      props: {
        type: 'classic',
        orientation: 'horizontal',
        hoverEffect: 'lift',
      },
      slots: { img: '<img alt="Preview" />' },
    })

    expect(wrapper.get('.s-card-content').classes()).toContain('type-classic')
    expect(wrapper.get('.s-card-content').classes()).toContain('is-horizontal')
    expect(wrapper.get('.s-card').element.tagName).toBe('DIV')
    expect(wrapper.get('.s-card').classes()).toEqual(
      expect.arrayContaining(['is-hover-lift', 'is-has-media']),
    )
  })

  it.each([
    'default',
    'classic',
    'overlay',
    'split',
    'frosted',
    'reveal',
    'profile',
    'metric',
    'article',
  ] as const)('supports horizontal arrangement for %s content', (type) => {
    const wrapper = mount(Card, {
      props: { type, orientation: 'horizontal' },
    })

    expect(wrapper.get('.s-card-content').classes()).toContain('is-horizontal')
  })

  it('keeps the profile avatar slot in a horizontal layout', () => {
    const wrapper = mount(Card, {
      props: { type: 'profile', orientation: 'horizontal' },
      slots: { img: '<img alt="Portrait" />' },
    })

    expect(wrapper.get('.s-card-content').classes()).toContain('is-horizontal')
    expect(wrapper.get('.s-card__img img').attributes('alt')).toBe('Portrait')
  })

  it('maps numeric compatibility aliases to named presets', () => {
    const wrapper = mount(Card, { props: { type: 4 } })

    expect(wrapper.get('.s-card-content').classes()).toContain('type-frosted')
    expect(wrapper.get('.s-card').classes()).not.toContain('s-card--4')
  })

  it.each([
    'default',
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

  it('keeps textures independent from layout presets', () => {
    const wrapper = mount(Card, {
      props: { type: 'metric', texture: 'liquid-glass' },
    })

    expect(wrapper.get('.s-card-content').classes()).toContain('type-metric')
    expect(wrapper.get('.s-card').classes()).toContain(
      'is-texture-liquid-glass',
    )
    expect(
      wrapper.get('.s-card__texture--liquid-glass').attributes(),
    ).toHaveProperty('aria-hidden', 'true')
  })

  it('creates an isolated optical displacement filter for each liquid glass card', () => {
    const wrapper = mount({
      components: { Card },
      template:
        '<div><Card texture="liquid-glass" /><Card texture="liquid-glass" /></div>',
    })
    const filters = wrapper.findAll('filter')
    const cards = wrapper.findAll('.s-card')
    const ids = filters.map((filter) => filter.attributes('id'))

    expect(filters).toHaveLength(2)
    expect(new Set(ids).size).toBe(2)
    filters.forEach((filter) => {
      expect(filter.find('[result="noise"]').exists()).toBe(true)
      expect(filter.find('[stdDeviation="4"]').exists()).toBe(true)
      expect(filter.find('[scale="48"]').exists()).toBe(true)
    })
    cards.forEach((card, index) => {
      expect(card.attributes('style')).toContain(
        `--sax-card-liquid-filter: url(#${ids[index]})`,
      )
    })
  })

  it('uses the alternate specular SVG graph for liquid glass 2', () => {
    const wrapper = mount({
      components: { Card },
      template:
        '<div><Card texture="liquid-glass-2" /><Card texture="liquid-glass-2" /></div>',
    })
    const filters = wrapper.findAll('filter')
    const cards = wrapper.findAll('.s-card')
    const ids = filters.map((filter) => filter.attributes('id'))

    expect(filters).toHaveLength(2)
    expect(new Set(ids).size).toBe(2)
    filters.forEach((filter) => {
      expect(filter.find('[result="mapped"]').exists()).toBe(true)
      expect(filter.find('[result="specular-light"]').exists()).toBe(true)
      expect(filter.find('[scale="150"]').exists()).toBe(true)
    })
    cards.forEach((card, index) => {
      expect(card.classes()).toContain('is-texture-liquid-glass-2')
      expect(card.attributes('style')).toContain(
        `--sax-card-liquid-filter: url(#${ids[index]})`,
      )
    })
  })

  it('combines texture and effect layers without replacing either one', () => {
    const wrapper = mount(Card, {
      props: { texture: 'liquid-glass', effect: 'gradient-glow' },
    })
    const card = wrapper.get('.s-card')

    expect(card.classes()).toEqual(
      expect.arrayContaining([
        'is-texture-liquid-glass',
        'is-effect-gradient-glow',
      ]),
    )
    expect(wrapper.find('.s-card__texture--liquid-glass').exists()).toBe(true)
    expect(wrapper.find('.s-card__effect--gradient-glow').exists()).toBe(true)
  })

  it('tracks the pointer locally for the spotlight effect', async () => {
    const wrapper = mount(Card, { props: { effect: 'spotlight' } })
    const card = wrapper.get('.s-card')
    vi.spyOn(card.element, 'getBoundingClientRect').mockReturnValue({
      left: 10,
      top: 20,
      width: 300,
      height: 180,
      right: 310,
      bottom: 200,
      x: 10,
      y: 20,
      toJSON: () => ({}),
    })

    card.element.dispatchEvent(
      new MouseEvent('pointermove', {
        bubbles: true,
        clientX: 90,
        clientY: 75,
      }),
    )
    await new Promise((resolve) => setTimeout(resolve, 30))

    expect(card.attributes('style')).toContain('--sax-card-spotlight-x: 80px')
    expect(card.attributes('style')).toContain('--sax-card-spotlight-y: 55px')
    expect(wrapper.find('.s-card__effect--spotlight').exists()).toBe(true)
  })

  it('derives a local edge angle for the gradient glow effect', async () => {
    const wrapper = mount(Card, { props: { effect: 'gradient-glow' } })
    const card = wrapper.get('.s-card')
    vi.spyOn(card.element, 'getBoundingClientRect').mockReturnValue({
      left: 10,
      top: 20,
      width: 300,
      height: 180,
      right: 310,
      bottom: 200,
      x: 10,
      y: 20,
      toJSON: () => ({}),
    })

    card.element.dispatchEvent(
      new MouseEvent('pointermove', {
        bubbles: true,
        clientX: 300,
        clientY: 110,
      }),
    )
    await new Promise((resolve) => setTimeout(resolve, 30))

    expect(card.attributes('style')).toContain('--sax-card-glow-angle: 90deg')
    expect(wrapper.find('.s-card__effect--gradient-glow').exists()).toBe(true)
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
      props: { type: 'classic' },
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
