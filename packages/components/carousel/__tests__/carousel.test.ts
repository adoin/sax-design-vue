import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Carousel from '../src/carousel.vue'

const items = [
  { name: 'first', title: 'First' },
  { name: 'disabled', title: 'Disabled', disabled: true },
  { name: 'last', title: 'Last' },
]

const mountCarousel = (props = {}) =>
  mount(Carousel, {
    props: {
      items,
      autoplay: false,
      arrow: 'never',
      ...props,
    },
    slots: {
      item: ({ item }: { item: (typeof items)[number] }) => item.title,
    },
  })

const createPointerEvent = (type: string) => {
  const event = new Event(type, { bubbles: true, cancelable: true })
  Object.defineProperties(event, {
    pointerId: { value: 1 },
    pointerType: { value: 'mouse' },
    isPrimary: { value: true },
    clientX: { value: 120 },
    clientY: { value: 80 },
  })
  return event
}

describe('Carousel effects and navigation', () => {
  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  it('renders the unified deck effect with layered transforms', () => {
    const wrapper = mountCarousel({ effect: 'deck' })

    expect(wrapper.classes()).toContain('s-carousel--effect-deck')
    expect(wrapper.classes()).toContain('is-layered')
    expect(
      wrapper.findAll('.s-carousel__item')[1].attributes('style'),
    ).toContain('0, -48px)')
  })

  it('keeps previous and next items on opposite sides of the active item', () => {
    const wrapper = mountCarousel({ effect: 'deck' })
    const renderedItems = wrapper.findAll('.s-carousel__item')

    expect(renderedItems[1].attributes('style')).toContain('44%')
    expect(renderedItems[2].attributes('style')).toContain('-44%')
    expect(renderedItems[1].attributes('style')).toContain('scale(0.86)')
    expect(renderedItems[1].attributes('style')).toContain('center center')
    expect(renderedItems[2].attributes('style')).toContain('center center')
  })

  it('limits deck layers and applies blur only when configured', () => {
    const layeredItems = Array.from({ length: 5 }, (_, index) => ({
      name: `item-${index}`,
      title: `Item ${index}`,
    }))
    const crisp = mountCarousel({
      effect: 'deck',
      deckVisible: 1,
      items: layeredItems,
    })
    const soft = mountCarousel({
      effect: 'deck',
      deckVisible: 2,
      deckBlur: true,
      items: layeredItems,
    })

    expect(crisp.findAll('.s-carousel__item')[2].attributes('style')).toContain(
      'opacity: 0',
    )
    expect(
      crisp.findAll('.s-carousel__item')[1].attributes('style'),
    ).not.toContain('blur(')
    expect(crisp.findAll('.s-carousel__item')[1].attributes('style')).toContain(
      'opacity: 1',
    )
    expect(soft.findAll('.s-carousel__item')[1].attributes('style')).toContain(
      'blur(1.6px)',
    )
  })

  it('shares the configured radius through one component CSS variable', () => {
    const rounded = mountCarousel({ radius: 18 })
    const square = mountCarousel({ radius: false })

    expect(rounded.attributes('style')).toContain('--s-carousel-radius: 18px')
    expect(square.attributes('style')).toContain('--s-carousel-radius: 0px')
  })

  it('renders a separate large focus card above an evenly divided ring', () => {
    const wrapper = mountCarousel({
      effect: 'orbit',
      depth: 180,
      items: Array.from({ length: 4 }, (_, index) => ({
        name: `orbit-${index}`,
        title: `Orbit ${index}`,
      })),
    })
    const renderedItems = wrapper.findAll(
      '.s-carousel__item:not(.s-carousel__orbit-placeholder):not(.is-virtual-edge)',
    )

    expect(wrapper.classes()).toContain('s-carousel--effect-orbit')
    expect(
      wrapper.find('.s-carousel__track').attributes('style'),
    ).toBeUndefined()
    expect(wrapper.find('.s-carousel__orbit-focus-card').exists()).toBe(true)
    expect(wrapper.find('.s-carousel__orbit-focus-card').text()).toContain(
      'Orbit 0',
    )
    expect(renderedItems[1].classes()).toContain('is-active')
    expect(renderedItems[1].attributes('style')).toContain(
      'translate3d(-50%, -12%, 0)',
    )
    expect(renderedItems[1].attributes('style')).toContain('rotateY(0deg)')
    expect(renderedItems[1].attributes('style')).toContain('scale(0.72)')
    expect(renderedItems[0].attributes('style')).toContain('rotateY(-72deg)')
    expect(renderedItems[2].attributes('style')).toContain('rotateY(72deg)')
    expect(renderedItems[2].attributes('style')).not.toContain('filter:')
    expect(wrapper.find('.s-carousel__orbit-placeholder').exists()).toBe(true)
  })

  it('updates the independent orbit focus card with the active item', async () => {
    const wrapper = mountCarousel({
      effect: 'orbit',
      items: Array.from({ length: 4 }, (_, index) => ({
        name: `orbit-${index}`,
        title: `Orbit ${index}`,
      })),
    })

    ;(wrapper.vm as unknown as { next: () => void }).next()
    await wrapper.vm.$nextTick()

    expect(
      wrapper
        .findAll('.s-carousel__orbit-focus-card')
        .some((card) => card.text().includes('Orbit 1')),
    ).toBe(true)
  })

  it('clones fewer than four orbit items to an even whole-circle multiple', () => {
    const wrapper = mountCarousel({
      effect: 'orbit',
      items: [
        { name: 'one', title: 'One' },
        { name: 'two', title: 'Two' },
        { name: 'three', title: 'Three' },
      ],
    })
    const renderedItems = wrapper.findAll(
      '.s-carousel__item:not(.s-carousel__orbit-placeholder):not(.is-virtual-edge)',
    )

    expect(renderedItems).toHaveLength(6)
    expect(
      renderedItems.filter((item) => item.classes('is-active')),
    ).toHaveLength(1)
    expect(renderedItems[1].attributes('style')).toContain(
      'rotateY(-51.42857142857143deg)',
    )
    expect(renderedItems[5].attributes('style')).toContain(
      'rotateY(154.28571428571428deg)',
    )
    expect(wrapper.find('.s-carousel__orbit-placeholder').exists()).toBe(true)
  })

  it('renders an outlined placeholder when an even real set is exhausted', () => {
    const wrapper = mountCarousel({
      effect: 'orbit',
      items: [
        { name: 'one', title: 'One' },
        { name: 'two', title: 'Two' },
      ],
    })
    const renderedItems = wrapper.findAll(
      '.s-carousel__item:not(.s-carousel__orbit-placeholder):not(.is-virtual-edge)',
    )
    const transforms = renderedItems.map((item) => item.attributes('style'))
    const placeholder = wrapper.find('.s-carousel__orbit-placeholder')

    expect(renderedItems).toHaveLength(4)
    expect(transforms.some((style) => style.includes('rotateY(-72deg)'))).toBe(
      true,
    )
    expect(transforms.some((style) => style.includes('rotateY(72deg)'))).toBe(
      true,
    )
    expect(transforms.every((style) => !style.includes('rotateY(90deg)'))).toBe(
      true,
    )
    expect(wrapper.findAll('.s-carousel__item-content')).toHaveLength(6)
    expect(placeholder.exists()).toBe(true)
    expect(placeholder.attributes('aria-hidden')).toBe('true')
    expect(placeholder.find('.s-carousel__item-content').exists()).toBe(false)
  })

  it('moves exhausted even sets through buffered placeholder edges', async () => {
    const wrapper = mountCarousel({
      effect: 'orbit',
      orbitMaxVisible: 10,
      items: Array.from({ length: 10 }, (_, index) => ({
        name: `orbit-${index}`,
        title: `Orbit ${index}`,
      })),
    })
    const sourceSix = wrapper
      .findAll('[data-carousel-index="6"]')
      .filter((item) => item.classes('s-carousel__item'))
    const outgoingItem = sourceSix.find(
      (item) => !item.classes('is-virtual-edge'),
    )
    const incomingItem = sourceSix.find((item) =>
      item.classes('is-virtual-edge'),
    )

    expect(wrapper.findAll('.s-carousel__item')).toHaveLength(13)
    expect(wrapper.findAll('.s-carousel__item.is-virtual-edge')).toHaveLength(2)
    expect(wrapper.find('.s-carousel__orbit-placeholder').exists()).toBe(true)
    expect(outgoingItem?.attributes('style')).not.toContain('opacity: 0;')
    expect(incomingItem?.attributes('style')).toContain('opacity: 0')

    ;(wrapper.vm as unknown as { next: () => void }).next()
    await wrapper.vm.$nextTick()

    expect(outgoingItem?.classes()).toContain('is-virtual-edge')
    expect(incomingItem?.classes()).not.toContain('is-virtual-edge')
    expect(outgoingItem?.attributes('style')).toContain('opacity: 0')
    expect(incomingItem?.attributes('style')).not.toContain('opacity: 0;')

    ;(wrapper.vm as unknown as { prev: () => void }).prev()
    await wrapper.vm.$nextTick()

    expect(outgoingItem?.classes()).not.toContain('is-virtual-edge')
    expect(incomingItem?.classes()).toContain('is-virtual-edge')
  })

  it('keeps shared orbit cards on a continuous angle when moving next', async () => {
    const wrapper = mountCarousel({
      effect: 'orbit',
      orbitAngle: 45,
      items: Array.from({ length: 8 }, (_, index) => ({
        name: `orbit-${index}`,
        title: `Orbit ${index}`,
      })),
    })

    const sourceTwoBefore = wrapper
      .findAll('.s-carousel__item')
      .find((item) => item.attributes('data-carousel-index') === '2')
    expect(sourceTwoBefore?.attributes('style')).toContain('rotateY(90deg)')
    expect(wrapper.find('.s-carousel__orbit-placeholder').exists()).toBe(false)

    ;(wrapper.vm as unknown as { next: () => void }).next()
    await wrapper.vm.$nextTick()

    const sourceTwoAfter = wrapper
      .findAll('.s-carousel__item')
      .find((item) => item.attributes('data-carousel-index') === '2')
    expect(sourceTwoAfter?.attributes('style')).toContain('rotateY(45deg)')
  })

  it('virtualizes large orbit data and shifts one item per navigation', async () => {
    const wrapper = mountCarousel({
      effect: 'orbit',
      orbitMaxVisible: 10,
      items: Array.from({ length: 100 }, (_, index) => ({
        name: `orbit-${index}`,
        title: `Orbit ${index}`,
      })),
    })
    const renderedIndexes = () =>
      wrapper
        .findAll('.s-carousel__item:not(.s-carousel__orbit-placeholder)')
        .map((item) => Number(item.attributes('data-carousel-index')))
    const visibleIndexes = () =>
      wrapper
        .findAll(
          '.s-carousel__item:not(.s-carousel__orbit-placeholder):not(.is-virtual-edge)',
        )
        .map((item) => Number(item.attributes('data-carousel-index')))

    expect(renderedIndexes()).toEqual([
      94, 95, 96, 97, 98, 99, 0, 1, 2, 3, 4, 5, 6,
    ])
    expect(visibleIndexes()).toEqual([95, 96, 97, 98, 99, 0, 1, 2, 3, 4, 5])
    expect(wrapper.find('.s-carousel__orbit-placeholder').exists()).toBe(false)
    const exitingItem = wrapper
      .findAll('.s-carousel__item')
      .find((item) => item.attributes('data-carousel-index') === '95')
    const enteringItem = wrapper
      .findAll('.s-carousel__item')
      .find((item) => item.attributes('data-carousel-index') === '6')

    expect(exitingItem?.classes()).not.toContain('is-virtual-edge')
    expect(enteringItem?.classes()).toContain('is-virtual-edge')

    ;(wrapper.vm as unknown as { next: () => void }).next()
    await wrapper.vm.$nextTick()

    expect(renderedIndexes()).toEqual([
      95, 96, 97, 98, 99, 0, 1, 2, 3, 4, 5, 6, 7,
    ])
    expect(visibleIndexes()).toEqual([96, 97, 98, 99, 0, 1, 2, 3, 4, 5, 6])
    expect(exitingItem?.classes()).toContain('is-virtual-edge')
    expect(enteringItem?.classes()).not.toContain('is-virtual-edge')
    expect(exitingItem?.attributes('style')).toContain('opacity: 0')
    expect(enteringItem?.attributes('style')).not.toContain('opacity: 0;')

    ;(wrapper.vm as unknown as { prev: () => void }).prev()
    await wrapper.vm.$nextTick()

    expect(visibleIndexes()).toEqual([95, 96, 97, 98, 99, 0, 1, 2, 3, 4, 5])
    expect(exitingItem?.classes()).not.toContain('is-virtual-edge')
    expect(enteringItem?.classes()).toContain('is-virtual-edge')
  })

  it('renders a three-sided prism around one shared rotation axis', () => {
    const wrapper = mountCarousel({ effect: 'prism', depth: 170 })
    const renderedItems = wrapper.findAll('.s-carousel__item')

    expect(wrapper.classes()).toContain('s-carousel--effect-prism')
    expect(
      wrapper.find('.s-carousel__track').attributes('style'),
    ).toBeUndefined()
    expect(renderedItems[0].attributes('style')).toContain('rotateY(0deg)')
    expect(renderedItems[1].attributes('style')).toContain('rotateY(120deg)')
    expect(renderedItems[2].attributes('style')).toContain('rotateY(240deg)')
    expect(
      renderedItems.every((item) =>
        item.attributes('style').includes('rotateX(-7deg)'),
      ),
    ).toBe(true)
    expect(renderedItems[0].attributes('style')).toContain('brightness(1)')
    expect(
      renderedItems.every((item) =>
        item.attributes('style').includes('scale(0.78)'),
      ),
    ).toBe(true)
  })

  it('keeps every prism face on the same continuous rotation path', async () => {
    const wrapper = mountCarousel({
      effect: 'prism',
      depth: 170,
      items: Array.from({ length: 3 }, (_, index) => ({
        name: `prism-${index}`,
        title: `Prism ${index}`,
      })),
    })

    ;(wrapper.vm as unknown as { next: () => void }).next()
    await wrapper.vm.$nextTick()

    const renderedItems = wrapper.findAll('.s-carousel__item')
    expect(renderedItems[0].attributes('style')).toContain('rotateY(-120deg)')
    expect(renderedItems[1].attributes('style')).toContain('rotateY(0deg)')
    expect(renderedItems[2].attributes('style')).toContain('rotateY(120deg)')
  })

  it('rotates a clicked prism side through the same path as its arrow', async () => {
    const prismItems = Array.from({ length: 3 }, (_, index) => ({
      name: `prism-${index}`,
      title: `Prism ${index}`,
    }))
    const nextWrapper = mountCarousel({
      effect: 'prism',
      depth: 170,
      items: prismItems,
    })

    await nextWrapper.findAll('.s-carousel__item')[1].trigger('click')

    const nextItems = nextWrapper.findAll('.s-carousel__item')
    expect(nextWrapper.emitted('update:modelValue')).toEqual([[1]])
    expect(nextItems[0].attributes('style')).toContain('rotateY(-120deg)')
    expect(nextItems[1].attributes('style')).toContain('rotateY(0deg)')
    expect(nextItems[2].attributes('style')).toContain('rotateY(120deg)')

    const previousWrapper = mountCarousel({
      effect: 'prism',
      depth: 170,
      items: prismItems,
    })

    await previousWrapper.findAll('.s-carousel__item')[2].trigger('click')

    const previousItems = previousWrapper.findAll('.s-carousel__item')
    expect(previousWrapper.emitted('update:modelValue')).toEqual([[2]])
    expect(previousItems[0].attributes('style')).toContain('rotateY(120deg)')
    expect(previousItems[1].attributes('style')).toContain('rotateY(240deg)')
    expect(previousItems[2].attributes('style')).toContain('rotateY(360deg)')
  })

  it('keeps prism transitions enabled for a pointer click without dragging', async () => {
    const wrapper = mountCarousel({
      effect: 'prism',
      depth: 170,
      draggable: true,
      items: Array.from({ length: 3 }, (_, index) => ({
        name: `prism-${index}`,
        title: `Prism ${index}`,
      })),
    })
    const side = wrapper.findAll('.s-carousel__item')[1]

    side.element.dispatchEvent(createPointerEvent('pointerdown'))
    await wrapper.vm.$nextTick()

    expect(wrapper.classes()).not.toContain('is-dragging')

    side.element.dispatchEvent(createPointerEvent('pointerup'))
    await wrapper.vm.$nextTick()

    expect(wrapper.classes()).not.toContain('is-dragging')
    expect(wrapper.emitted('update:modelValue')).toEqual([[1]])
    expect(side.attributes('style')).toContain('rotateY(0deg)')
  })

  it('skips disabled items and emits the complete change lifecycle', async () => {
    vi.useFakeTimers()
    const wrapper = mountCarousel({ transitionDuration: 300 })

    ;(wrapper.vm as unknown as { next: () => void }).next()
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('before-change')).toEqual([[2, 0]])
    expect(wrapper.emitted('update:modelValue')).toEqual([[2]])
    expect(wrapper.emitted('change')).toEqual([[2, 0]])
    expect(wrapper.emitted('after-change')).toBeUndefined()

    vi.advanceTimersByTime(300)
    expect(wrapper.emitted('after-change')).toEqual([[2, 0]])
  })

  it('supports named imperative navigation', async () => {
    const wrapper = mountCarousel()

    ;(
      wrapper.vm as unknown as {
        setActiveItem: (value: string) => void
      }
    ).setActiveItem('last')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toEqual([[2]])
    expect(wrapper.findAll('.s-carousel__item')[2].classes()).toContain(
      'is-active',
    )
  })

  it('switches indicators on hover when configured', async () => {
    const wrapper = mountCarousel({ trigger: 'hover' })

    await wrapper.findAll('.s-carousel__indicator')[2].trigger('mouseenter')

    expect(wrapper.emitted('update:modelValue')).toEqual([[2]])
  })

  it('keeps controls clickable when dragging is enabled', async () => {
    const wrapper = mountCarousel({ draggable: true, arrow: 'always' })

    await wrapper.find('.s-carousel__arrow-next').trigger('pointerdown')
    await wrapper.find('.s-carousel__arrow-next').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[2]])
  })

  it('activates a visible layered item when it is clicked', async () => {
    const wrapper = mountCarousel({
      effect: 'deck',
      items: [
        { name: 'first', title: 'First' },
        { name: 'second', title: 'Second' },
        { name: 'third', title: 'Third' },
      ],
    })

    await wrapper.findAll('.s-carousel__item')[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[1]])
    expect(wrapper.findAll('.s-carousel__item')[1].classes()).toContain(
      'is-active',
    )
  })

  it('supports keyboard navigation for the configured direction', async () => {
    const wrapper = mountCarousel({ direction: 'vertical' })

    await wrapper.trigger('keydown', { key: 'ArrowDown' })

    expect(wrapper.emitted('update:modelValue')).toEqual([[2]])
  })

  it('stops at the boundary when loop is disabled', async () => {
    const wrapper = mountCarousel({
      loop: false,
      modelValue: 2,
      arrow: 'always',
    })

    expect(wrapper.find('.s-carousel__arrow-next').attributes()).toHaveProperty(
      'disabled',
    )
    ;(wrapper.vm as unknown as { next: () => void }).next()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('change')).toBeUndefined()
  })
})
