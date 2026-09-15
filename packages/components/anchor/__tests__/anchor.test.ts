import { h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ConfigProvider from '../../config-provider/src/config-provider'
import AnchorRouteBoundary from '../src/anchor-route-boundary.vue'
import Anchor from '../src/anchor.vue'
import {
  advanceAnchorRouteBoundaryIntent,
  createAnchorRouteBoundaryIntent,
  isAnchorRouteBoundaryCoolingDown,
  isNestedAnchorRouteBoundaryScroller,
  markAnchorRouteBoundaryNavigation,
  resetAnchorRouteBoundaryNavigation,
} from '../src/anchor-route-boundary-intent'
import type { AnchorItem } from '../src/anchor'

const items: AnchorItem[] = [
  {
    href: '#section',
    title: 'Section',
    collapsible: true,
    defaultCollapsed: true,
    children: [
      {
        href: '#example',
        title: 'Example',
        collapsible: true,
        defaultCollapsed: true,
        children: [
          { href: '#detail', title: 'Detail' },
          { href: '#detail-next', title: 'Next detail' },
        ],
      },
    ],
  },
]

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  resetAnchorRouteBoundaryNavigation()
})

describe('Anchor hierarchy', () => {
  it('renders cancellable page links and exposes page state', async () => {
    const routeItems: AnchorItem[] = [
      { href: '/components/table/row-selection.html', title: 'Selection' },
      {
        href: '/components/table/editing.html',
        title: 'Editing',
        disabled: true,
      },
    ]
    let routeEvent: MouseEvent | undefined
    const wrapper = mount(Anchor, {
      props: {
        items: routeItems,
        modelValue: '/components/table/row-selection.html',
        onClick: (_item, event) => {
          routeEvent = event
          event.preventDefault()
        },
      },
    })
    const links = wrapper.findAll('.s-anchor__item')

    expect(links[0].element.tagName).toBe('A')
    expect(links[0].attributes('href')).toBe(
      '/components/table/row-selection.html',
    )
    expect(links[0].attributes('aria-current')).toBe('page')
    expect(links[1].attributes('href')).toBeUndefined()
    expect(links[1].attributes('aria-disabled')).toBe('true')
    expect(links[1].attributes('tabindex')).toBe('-1')

    await links[0].trigger('click')
    expect(routeEvent).toBeInstanceOf(MouseEvent)
    expect(routeEvent?.defaultPrevented).toBe(true)
    expect(wrapper.emitted('click')?.[0]?.[0]).toEqual(routeItems[0])
    expect(wrapper.emitted('click')?.[0]?.[1]).toBe(routeEvent)
  })

  it('derives route boundaries and navigates through a local router', async () => {
    const currentRoute = ref({ path: '/guide/selection' })
    const router = {
      currentRoute,
      push: vi.fn(),
      replace: vi.fn(),
    }
    const routeItems: AnchorItem[] = [
      {
        href: '/guide',
        title: 'Guide',
        children: [
          { href: '/guide/data', title: 'Data' },
          { href: '/guide/selection', title: 'Selection' },
          { href: '/guide/sorting', title: 'Sorting' },
        ],
      },
    ]
    const wrapper = mount(Anchor, {
      props: { items: routeItems, mode: 'router', router },
    })
    await wrapper.vm.$nextTick()

    const boundaryLinks = wrapper.findAll('.s-anchor-route-boundary__link')
    expect(boundaryLinks.map((link) => link.attributes('href'))).toEqual([
      '/guide/data',
      '/guide/sorting',
    ])
    expect(wrapper.get('.s-anchor__item.is-active').attributes('href')).toBe(
      '/guide/selection',
    )

    await wrapper
      .findAll('.s-anchor__item')
      .find((link) => link.attributes('href') === '/guide/sorting')!
      .trigger('click')
    expect(router.push).toHaveBeenCalledWith('/guide/sorting')
    expect(router.replace).not.toHaveBeenCalled()

    currentRoute.value = { path: '/guide/sorting' }
    await wrapper.vm.$nextTick()
    expect(
      wrapper
        .findAll('.s-anchor-route-boundary__link')
        .map((link) => link.attributes('href')),
    ).toEqual(['/guide/selection'])

    await wrapper.setProps({ routeBoundary: false })
    expect(wrapper.find('.s-anchor-route-boundaries').exists()).toBe(false)
  })

  it('inherits the router from global Anchor configuration', async () => {
    const router = {
      currentRoute: ref({ path: '/guide/selection' }),
      push: vi.fn(),
    }
    const routeItems: AnchorItem[] = [
      { href: '/guide/data', title: 'Data' },
      { href: '/guide/selection', title: 'Selection' },
    ]
    const wrapper = mount(ConfigProvider, {
      props: { anchor: { router } },
      slots: {
        default: () => h(Anchor, { items: routeItems, mode: 'router' }),
      },
    })
    await wrapper.vm.$nextTick()

    expect(
      wrapper.get('.s-anchor-route-boundary__link').attributes('href'),
    ).toBe('/guide/data')
  })

  it('renders recursive levels and toggles collapsible items independently', async () => {
    const wrapper = mount(Anchor, { props: { items } })

    expect(
      wrapper.findAll('.s-anchor__item').map((item) => item.text()),
    ).toEqual(['Section'])
    await wrapper.get('.s-anchor__collapse').trigger('click')
    expect(
      wrapper.findAll('.s-anchor__item').map((item) => item.text()),
    ).toEqual(['Section', 'Example'])
    expect(wrapper.emitted('collapseChange')?.[0]).toEqual([items[0], false])
  })

  it('opens collapsed ancestors when a nested anchor becomes active', async () => {
    const wrapper = mount(Anchor, {
      props: { items, modelValue: '#detail' },
    })
    await wrapper.vm.$nextTick()

    expect(
      wrapper.findAll('.s-anchor__item').map((item) => item.text()),
    ).toEqual(['Section', 'Example', 'Detail', 'Next detail'])
    expect(wrapper.findAll('.s-anchor__item-label')).toHaveLength(4)
    expect(wrapper.findAll('.s-anchor__active-icon')).toHaveLength(1)
    expect(wrapper.get('.s-anchor__active-icon').element.tagName).toBe('SPAN')
    expect(wrapper.get('.s-anchor__active-icon > svg').element).toBeInstanceOf(
      SVGElement,
    )
    expect(
      wrapper
        .get('.s-anchor__active-icon path[fill="currentColor"]')
        .attributes('d'),
    ).toContain('M16 2A11.013')
    expect(
      wrapper.get('.s-anchor__item.is-active').attributes('aria-current'),
    ).toBe('location')
    expect(
      wrapper
        .get('.s-anchor__item.is-active-path:not(.is-active)')
        .find('.s-anchor__active-icon')
        .exists(),
    ).toBe(false)
    expect(wrapper.findAll('.s-anchor__group.is-nested')).toHaveLength(3)
    expect(
      wrapper.findAll('.s-anchor__group.is-branch-connection'),
    ).toHaveLength(1)
    expect(wrapper.findAll('.s-anchor__group.is-branch-closure')).toHaveLength(
      1,
    )
    expect(
      wrapper.get('.s-anchor__group.is-branch-connection').text(),
    ).toContain('Detail')
    expect(wrapper.get('.s-anchor__group.is-branch-closure').text()).toContain(
      'Next detail',
    )
  })

  it('resolves the active marker from global config and then the local slot', () => {
    const configured = mount(ConfigProvider, {
      props: { anchor: { activeIcon: 'bx:map' } },
      slots: {
        default: () => h(Anchor, { items, modelValue: '#detail' }),
      },
    })
    const configuredMarker = configured.get('.s-anchor__active-icon')
    expect(configuredMarker.find('path[d^="M16 2A11.013"]').exists()).toBe(
      false,
    )
    expect(configuredMarker.getComponent({ name: 'SIcon' }).props('name')).toBe(
      'bx:map',
    )
    configured.unmount()

    const slotted = mount(ConfigProvider, {
      props: { anchor: { activeIcon: 'bx:map' } },
      slots: {
        default: () =>
          h(
            Anchor,
            { items, modelValue: '#detail' },
            {
              'active-icon': ({ href }: { href: string }) =>
                h('span', { class: 'custom-marker', 'data-href': href }),
            },
          ),
      },
    })
    expect(slotted.find('.s-anchor__active-icon .s-icon').exists()).toBe(false)
    expect(
      slotted
        .get('.s-anchor__active-icon .custom-marker')
        .attributes('data-href'),
    ).toBe('#detail')
    slotted.unmount()
  })

  it('emits cancellable navigation from the route-boundary link', async () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    let routeEvent: MouseEvent | WheelEvent | undefined
    const wrapper = mount(AnchorRouteBoundary, {
      props: {
        previous: { href: '/previous.html', title: 'Previous section' },
        next: { href: '/next.html', title: 'Next section' },
        onNavigate: (params) => {
          routeEvent = params.event
          params.event.preventDefault()
        },
      },
    })
    const links = wrapper.findAll('.s-anchor-route-boundary__link')
    const progress = wrapper.findAll('.s-anchor-route-boundary__progress')
    expect(links).toHaveLength(2)
    expect(progress).toHaveLength(2)
    expect(progress.map((item) => item.attributes('aria-valuenow'))).toEqual([
      '0',
      '0',
    ])
    expect(
      wrapper.findAll('.s-anchor-route-boundary__progress-ring'),
    ).toHaveLength(2)
    expect(
      wrapper.findAll('.s-anchor-route-boundary__progress-track'),
    ).toHaveLength(2)
    expect(
      wrapper.findAll('.s-anchor-route-boundary__progress-value'),
    ).toHaveLength(2)
    expect(
      wrapper
        .findAll('.s-anchor-route-boundary__progress-value')
        .map((item) => item.attributes('style')),
    ).toEqual(['stroke-dashoffset: 1;', 'stroke-dashoffset: 1;'])
    await links[1].trigger('click')
    const navigation = wrapper.emitted('navigate')?.[0]?.[0] as {
      href: string
      direction: string
      trigger: string
      event: MouseEvent
    }
    expect(navigation.href).toBe('/next.html')
    expect(navigation.direction).toBe('next')
    expect(navigation.trigger).toBe('click')
    expect(navigation.event).toBe(routeEvent)
    expect(navigation.event.defaultPrevented).toBe(true)
    wrapper.unmount()
  })

  it('requires a new wheel gesture before advancing a route boundary', () => {
    let intent = createAnchorRouteBoundaryIntent(100)

    let result = advanceAnchorRouteBoundaryIntent(intent, {
      now: 200,
      delta: 120,
      threshold: 100,
      armDelay: 300,
    })
    expect(result.state.progress).toBe(0)
    expect(result.triggered).toBe(false)

    intent = result.state
    result = advanceAnchorRouteBoundaryIntent(intent, {
      now: 600,
      delta: 60,
      threshold: 100,
      armDelay: 300,
    })
    expect(result.state.progress).toBe(0.6)
    expect(result.triggered).toBe(false)

    result = advanceAnchorRouteBoundaryIntent(result.state, {
      now: 620,
      delta: 50,
      threshold: 100,
      armDelay: 300,
    })
    expect(result.state.progress).toBe(1)
    expect(result.triggered).toBe(true)

    resetAnchorRouteBoundaryNavigation()
    expect(isAnchorRouteBoundaryCoolingDown(1000, 1500)).toBe(false)
    markAnchorRouteBoundaryNavigation(1000)
    expect(isAnchorRouteBoundaryCoolingDown(1800, 1500)).toBe(true)
    expect(isAnchorRouteBoundaryCoolingDown(2500, 1500)).toBe(false)
  })

  it('cancels pending route intent when the wheel moves to a nested scroller', async () => {
    vi.useFakeTimers()
    const container = document.createElement('div')
    const nested = document.createElement('div')
    nested.style.overflowY = 'auto'
    Object.defineProperties(container, {
      clientHeight: { value: 100 },
      scrollHeight: { value: 1000 },
      scrollTop: { configurable: true, value: 900, writable: true },
    })
    Object.defineProperties(nested, {
      clientHeight: { value: 100 },
      scrollHeight: { value: 500 },
    })
    container.append(nested)
    document.body.append(container)

    const wrapper = mount(AnchorRouteBoundary, {
      attachTo: container,
      props: {
        next: { href: '/next.html', title: 'Next section' },
        threshold: 100,
        armDelay: 0,
        getContainer: () => container,
      },
    })
    await wrapper.vm.$nextTick()

    const pageWheel = (deltaY: number) =>
      container.dispatchEvent(
        new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY }),
      )
    const progressValue = () =>
      wrapper
        .get('.s-anchor-route-boundary__progress-value')
        .attributes('style')
    pageWheel(60)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('navigate')).toBeUndefined()
    expect(progressValue()).toContain('stroke-dashoffset: 0.4')

    const nestedWheel = new WheelEvent('wheel', {
      bubbles: true,
      cancelable: true,
      deltaY: 120,
    })
    vi.spyOn(nestedWheel, 'composedPath').mockReturnValue([
      nested,
      container,
      document,
      window,
    ])
    nested.dispatchEvent(nestedWheel)
    await wrapper.vm.$nextTick()
    expect(isNestedAnchorRouteBoundaryScroller(nestedWheel, container)).toBe(
      true,
    )
    expect(wrapper.emitted('navigate')).toBeUndefined()
    expect(progressValue()).toContain('stroke-dashoffset: 1')

    pageWheel(60)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('navigate')).toBeUndefined()
    expect(progressValue()).toContain('stroke-dashoffset: 0.4')
    pageWheel(50)
    await wrapper.vm.$nextTick()
    expect(progressValue()).toContain('stroke-dashoffset: 0')
    expect(wrapper.emitted('navigate')).toBeUndefined()
    await wrapper
      .get('.s-anchor-route-boundary__progress-value')
      .trigger('transitionend', { propertyName: 'stroke-dashoffset' })
    expect(wrapper.emitted('navigate')).toHaveLength(1)

    wrapper.unmount()
    container.remove()
  })
})
