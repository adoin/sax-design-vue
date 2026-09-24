import { h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ConfigProvider from '../../config-provider/src/config-provider'
import AnchorRouteBoundary from '../src/anchor-route-boundary.vue'
import Anchor from '../src/anchor.vue'
import { resolveAnchorNavigation } from '../src/anchor-router'
import {
  advanceAnchorRouteBoundaryIntent,
  createAnchorRouteBoundaryIntent,
  isAnchorRouteBoundaryCoolingDown,
  isNestedAnchorRouteBoundaryScroller,
  markAnchorRouteBoundaryNavigation,
  resetAnchorRouteBoundaryNavigation,
} from '../src/anchor-route-boundary-intent'
import type { AnchorActiveStrategy, AnchorItem } from '../src/anchor'

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
  it('classifies each href without a navigation mode', () => {
    expect(
      resolveAnchorNavigation(
        '/guide.html#api',
        'http://localhost/guide.html#intro',
      ),
    ).toEqual({ kind: 'hash', hash: '#api' })
    expect(
      resolveAnchorNavigation(
        '/guide/data.html#first',
        'http://localhost/guide.html',
      ),
    ).toEqual({ kind: 'route' })
    expect(
      resolveAnchorNavigation(
        'https://example.com/guide',
        'http://localhost/guide.html',
      ),
    ).toEqual({ kind: 'native' })
  })

  it('keeps the route marker when no local hash is active', () => {
    const wrapper = mount(Anchor, {
      props: {
        router: {
          currentRoute: ref({ path: '/guide/data' }),
          push: vi.fn(),
        },
        routeBoundary: false,
        items: [{ href: '/guide/data', title: 'Data' }],
      },
    })
    expect(wrapper.findAll('.s-anchor__active-icon')).toHaveLength(1)
    expect(
      wrapper
        .find('.s-anchor__item[aria-current="page"] .s-anchor__active-icon')
        .exists(),
    ).toBe(true)
    wrapper.unmount()
  })
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
      props: { items: routeItems, router },
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

  it('prefetches only adjacent route modules when explicitly enabled', async () => {
    vi.useFakeTimers()
    const currentRoute = ref({ path: '/guide/selection' })
    const prefetch = vi.fn()
    const router = {
      currentRoute,
      push: vi.fn(),
      prefetch,
    }
    const routeItems: AnchorItem[] = [
      { href: '/guide/data', title: 'Data' },
      { href: '/guide/selection', title: 'Selection' },
      { href: '/guide/sorting', title: 'Sorting' },
      { href: '/guide/summary', title: 'Summary' },
    ]
    const wrapper = mount(Anchor, {
      props: { items: routeItems, router },
    })

    await vi.runAllTimersAsync()
    expect(prefetch).not.toHaveBeenCalled()

    await wrapper.setProps({ routePrefetch: true })
    await vi.runAllTimersAsync()
    expect(prefetch.mock.calls.map(([href]) => href)).toEqual([
      '/guide/data',
      '/guide/sorting',
    ])

    currentRoute.value = { path: '/guide/sorting' }
    await wrapper.vm.$nextTick()
    await vi.runAllTimersAsync()
    expect(prefetch.mock.calls.map(([href]) => href)).toEqual([
      '/guide/data',
      '/guide/sorting',
      '/guide/summary',
    ])
    wrapper.unmount()
  })

  it('inherits route prefetching globally and lets a local false disable it', async () => {
    vi.useFakeTimers()
    const prefetch = vi.fn()
    const router = {
      currentRoute: ref({ path: '/guide/selection' }),
      push: vi.fn(),
      prefetch,
    }
    const routeItems: AnchorItem[] = [
      { href: '/guide/data', title: 'Data' },
      { href: '/guide/selection', title: 'Selection' },
      { href: '/guide/sorting', title: 'Sorting' },
    ]
    const inherited = mount(ConfigProvider, {
      props: { anchor: { router, routePrefetch: true } },
      slots: {
        default: () => h(Anchor, { items: routeItems }),
      },
    })

    await vi.runAllTimersAsync()
    expect(prefetch.mock.calls.map(([href]) => href)).toEqual([
      '/guide/data',
      '/guide/sorting',
    ])
    inherited.unmount()
    prefetch.mockClear()

    const disabled = mount(ConfigProvider, {
      props: { anchor: { router, routePrefetch: true } },
      slots: {
        default: () => h(Anchor, { items: routeItems, routePrefetch: false }),
      },
    })
    await vi.runAllTimersAsync()
    expect(prefetch).not.toHaveBeenCalled()
    disabled.unmount()
  })

  it('prefers an exact hash route when sibling items share one pathname', async () => {
    const currentRoute = ref({
      path: '/guide.html',
      fullPath: '/guide.html#api',
    })
    const wrapper = mount(Anchor, {
      props: {
        router: { currentRoute, push: vi.fn(), replace: vi.fn() },
        items: [
          {
            title: 'Examples',
            collapsible: true,
            children: [
              { href: '/guide/data.html', title: 'Data' },
              { href: '/guide/query.html', title: 'Query' },
            ],
          },
          {
            href: '/guide.html#api',
            title: 'API',
            boundary: true,
            children: [{ href: '#api-props', title: 'Props' }],
          },
        ],
      },
    })
    expect(
      wrapper.get('.s-anchor__item[aria-current="page"]').attributes('href'),
    ).toBe('/guide.html#api')
    expect(
      wrapper
        .findAll('.s-anchor-route-boundary__link')
        .map((item) => item.attributes('href')),
    ).toEqual(['/guide/query.html'])
    expect(wrapper.findAll('.s-anchor__item')[0].element.tagName).toBe('SPAN')
    expect(
      wrapper
        .findAll('.s-anchor__item')
        .some((item) => item.attributes('href') === '#api-props'),
    ).toBe(true)

    currentRoute.value = {
      path: '/guide/query.html',
      fullPath: '/guide/query.html',
    }
    await wrapper.vm.$nextTick()
    expect(
      wrapper
        .findAll('.s-anchor-route-boundary__link')
        .map((item) => item.attributes('href')),
    ).toEqual(['/guide/data.html', '/guide.html#api'])
    wrapper.unmount()
  })

  it('updates hash headings without losing the active route', async () => {
    const container = document.createElement('div')
    Object.defineProperties(container, {
      clientHeight: { value: 200 },
      scrollHeight: { value: 1000, configurable: true },
    })
    const overview = document.createElement('h2')
    overview.id = 'router-overview'
    const detail = document.createElement('h2')
    detail.id = 'router-detail'
    let detailTop = 300
    vi.spyOn(overview, 'getBoundingClientRect').mockReturnValue({
      top: 60,
    } as DOMRect)
    vi.spyOn(detail, 'getBoundingClientRect').mockImplementation(
      () => ({ top: detailTop }) as DOMRect,
    )
    document.body.append(overview, detail)

    const wrapper = mount(Anchor, {
      props: {
        router: {
          currentRoute: ref({ path: '/guide/selection' }),
          push: vi.fn(),
        },
        getContainer: () => container,
        items: [
          { href: '/guide/data', title: 'Data' },
          {
            href: '/guide/selection',
            title: 'Selection',
            children: [
              { href: '#router-overview', title: 'Overview' },
              { href: '#router-detail', title: 'Detail' },
            ],
          },
          { href: '/guide/sorting', title: 'Sorting' },
        ],
      },
    })
    const link = (href: string) =>
      wrapper
        .findAll('.s-anchor__item')
        .find((item) => item.attributes('href') === href)!

    container.dispatchEvent(new Event('scrollend'))
    await wrapper.vm.$nextTick()

    expect(link('/guide/selection').attributes('aria-current')).toBe('page')
    expect(link('#router-overview').attributes('aria-current')).toBe('location')
    expect(wrapper.findAll('.s-anchor__active-icon')).toHaveLength(1)
    expect(
      link('/guide/selection').find('.s-anchor__active-icon').exists(),
    ).toBe(false)
    expect(
      link('#router-overview').find('.s-anchor__active-icon').exists(),
    ).toBe(true)
    detailTop = 80
    container.dispatchEvent(new Event('scroll'))
    container.dispatchEvent(new Event('scrollend'))
    await wrapper.vm.$nextTick()
    expect(link('/guide/selection').attributes('aria-current')).toBe('page')
    expect(link('#router-detail').attributes('aria-current')).toBe('location')
    expect(link('#router-overview').attributes('aria-current')).toBeUndefined()
    expect(wrapper.findAll('.s-anchor__active-icon')).toHaveLength(1)
    expect(link('#router-detail').find('.s-anchor__active-icon').exists()).toBe(
      true,
    )

    wrapper.unmount()
    overview.remove()
    detail.remove()
  })

  it('selects the last mounted hash at the window page bottom', async () => {
    const scroller = document.scrollingElement || document.documentElement
    const oldScrollHeight = Object.getOwnPropertyDescriptor(
      scroller,
      'scrollHeight',
    )
    const oldScrollTop = scroller.scrollTop
    Object.defineProperty(scroller, 'scrollHeight', {
      value: 1000,
      configurable: true,
    })
    vi.stubGlobal('innerHeight', 300)
    const first = document.createElement('h2')
    first.id = 'router-window-first'
    const last = document.createElement('h2')
    last.id = 'router-window-last'
    vi.spyOn(first, 'getBoundingClientRect').mockReturnValue({
      top: 60,
    } as DOMRect)
    vi.spyOn(last, 'getBoundingClientRect').mockReturnValue({
      top: 260,
    } as DOMRect)
    document.body.append(first, last)

    const wrapper = mount(Anchor, {
      props: {
        router: { currentRoute: ref({ path: '/guide/data' }), push: vi.fn() },
        items: [
          {
            href: '/guide/data',
            title: 'Data',
            children: [
              { href: '#router-window-first', title: 'First' },
              { href: '#router-window-last', title: 'Last' },
            ],
          },
          { href: '/guide/selection', title: 'Selection' },
        ],
      },
    })
    const link = (href: string) =>
      wrapper
        .findAll('.s-anchor__item')
        .find((item) => item.attributes('href') === href)!

    scroller.scrollTop = 400
    window.dispatchEvent(new Event('scrollend'))
    await wrapper.vm.$nextTick()
    expect(link('#router-window-first').attributes('aria-current')).toBe(
      'location',
    )
    expect(
      link('#router-window-last').attributes('aria-current'),
    ).toBeUndefined()

    scroller.scrollTop = 700
    window.dispatchEvent(new Event('scrollend'))
    await wrapper.vm.$nextTick()
    expect(link('/guide/data').attributes('aria-current')).toBe('page')
    expect(link('#router-window-last').attributes('aria-current')).toBe(
      'location',
    )
    expect(
      link('#router-window-first').attributes('aria-current'),
    ).toBeUndefined()

    wrapper.unmount()
    first.remove()
    last.remove()
    scroller.scrollTop = oldScrollTop
    if (oldScrollHeight)
      Object.defineProperty(scroller, 'scrollHeight', oldScrollHeight)
    else Reflect.deleteProperty(scroller, 'scrollHeight')
  })

  it('enters the previous route at its end only for boundary wheel navigation', async () => {
    const container = document.createElement('div')
    Object.defineProperties(container, {
      clientHeight: { value: 200 },
      scrollHeight: { value: 1000, configurable: true },
    })
    const scrollTo = vi.fn((options?: ScrollToOptions | number, y?: number) => {
      container.scrollTop =
        typeof options === 'number' ? y || 0 : options?.top || 0
    })
    container.scrollTo = scrollTo
    const lastHeading = document.createElement('h2')
    lastHeading.id = 'router-data-last'
    vi.spyOn(lastHeading, 'getBoundingClientRect').mockReturnValue({
      top: 90,
    } as DOMRect)
    document.body.append(lastHeading)
    const currentRoute = ref({ path: '/guide/selection' })
    const push = vi.fn((href: string) => {
      currentRoute.value = { path: href }
    })
    const wrapper = mount(Anchor, {
      props: {
        router: { currentRoute, push },
        getContainer: () => container,
        items: [
          {
            href: '/guide/data',
            title: 'Data',
            children: [{ href: '#router-data-last', title: 'Last heading' }],
          },
          { href: '/guide/selection', title: 'Selection' },
        ],
      },
    })
    wrapper.findComponent(AnchorRouteBoundary).vm.$emit('navigate', {
      href: '/guide/data',
      title: 'Data',
      direction: 'previous',
      trigger: 'wheel',
      event: new WheelEvent('wheel', { cancelable: true }),
    })
    await new Promise((resolve) => setTimeout(resolve, 70))

    expect(push).toHaveBeenCalledWith('/guide/data')
    expect(scrollTo).toHaveBeenCalledWith({ top: 800, behavior: 'auto' })
    const links = wrapper.findAll('.s-anchor__item')
    expect(
      links
        .find((link) => link.attributes('href') === '/guide/data')
        ?.attributes('aria-current'),
    ).toBe('page')
    expect(
      links
        .find((link) => link.attributes('href') === '#router-data-last')
        ?.attributes('aria-current'),
    ).toBe('location')

    Object.defineProperty(container, 'scrollHeight', {
      value: 1200,
      configurable: true,
    })
    await new Promise((resolve) => setTimeout(resolve, 70))
    expect(scrollTo).toHaveBeenCalledWith({ top: 1000, behavior: 'auto' })
    container.dispatchEvent(new WheelEvent('wheel', { deltaY: -120 }))
    Object.defineProperty(container, 'scrollHeight', {
      value: 1400,
      configurable: true,
    })
    await new Promise((resolve) => setTimeout(resolve, 70))
    expect(scrollTo).not.toHaveBeenCalledWith({ top: 1200, behavior: 'auto' })

    currentRoute.value = { path: '/guide/selection' }
    await wrapper.vm.$nextTick()
    const scrollCalls = scrollTo.mock.calls.length
    wrapper.findComponent(AnchorRouteBoundary).vm.$emit('navigate', {
      href: '/guide/data',
      title: 'Data',
      direction: 'previous',
      trigger: 'click',
      event: new MouseEvent('click', { button: 0, cancelable: true }),
    })
    await new Promise((resolve) => setTimeout(resolve, 70))
    expect(scrollTo).toHaveBeenCalledTimes(scrollCalls)

    wrapper.unmount()
    lastHeading.remove()
  })

  it('keeps the first hash stable while a forward route entry settles', async () => {
    const container = document.createElement('div')
    Object.defineProperties(container, {
      clientHeight: { value: 600 },
      scrollHeight: { value: 1600 },
    })
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      bottom: 600,
    } as DOMRect)
    const first = document.createElement('h2')
    first.id = 'router-next-first'
    const second = document.createElement('h2')
    second.id = 'router-next-second'
    let firstTop = 120
    let secondTop = 310
    vi.spyOn(first, 'getBoundingClientRect').mockImplementation(
      () => ({ top: firstTop }) as DOMRect,
    )
    vi.spyOn(second, 'getBoundingClientRect').mockImplementation(
      () => ({ top: secondTop }) as DOMRect,
    )
    document.body.append(first, second)
    const currentRoute = ref({ path: '/guide/previous' })
    const push = vi.fn((href: string) => {
      currentRoute.value = { path: href }
    })
    const wrapper = mount(Anchor, {
      props: {
        activeStrategy: 'visible-section',
        router: { currentRoute, push },
        getContainer: () => container,
        items: [
          { href: '/guide/previous', title: 'Previous' },
          {
            href: '/guide/next',
            title: 'Next',
            children: [
              { href: '#router-next-first', title: 'First' },
              { href: '#router-next-second', title: 'Second' },
            ],
          },
        ],
      },
    })
    const activeHash = () =>
      wrapper
        .findAll('.s-anchor__item[aria-current="location"]')
        .map((item) => item.attributes('href'))

    container.scrollTop = 1000
    wrapper.findComponent(AnchorRouteBoundary).vm.$emit('navigate', {
      href: '/guide/next',
      title: 'Next',
      direction: 'next',
      trigger: 'wheel',
      event: new WheelEvent('wheel', { cancelable: true }),
    })
    await wrapper.vm.$nextTick()
    container.dispatchEvent(new Event('scrollend'))
    await wrapper.vm.$nextTick()
    expect(push).toHaveBeenCalledWith('/guide/next')
    expect(activeHash()).toEqual([])
    expect(
      wrapper
        .findAll('.s-anchor__item[aria-current="page"]')
        .map((item) => item.attributes('href')),
    ).toEqual(['/guide/next'])

    container.scrollTop = 0
    container.dispatchEvent(new Event('scrollend'))
    await wrapper.vm.$nextTick()
    expect(activeHash()).toEqual(['#router-next-first'])

    container.scrollTop = 20
    firstTop = 100
    secondTop = 290
    container.dispatchEvent(new Event('scrollend'))
    await wrapper.vm.$nextTick()
    expect(activeHash()).toEqual(['#router-next-first'])

    container.scrollTop = 140
    firstTop = -20
    secondTop = 170
    container.dispatchEvent(new Event('scrollend'))
    await wrapper.vm.$nextTick()
    expect(activeHash()).toEqual(['#router-next-second'])

    wrapper.unmount()
    first.remove()
    second.remove()
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
        default: () => h(Anchor, { items: routeItems }),
      },
    })
    await wrapper.vm.$nextTick()

    expect(
      wrapper.get('.s-anchor-route-boundary__link').attributes('href'),
    ).toBe('/guide/data')
  })

  it('resolves active strategy and heading offset from global then local settings', async () => {
    const localStrategy = ref<AnchorActiveStrategy | undefined>()
    const localOffset = ref<number | undefined>()
    const container = document.createElement('div')
    Object.defineProperties(container, {
      clientHeight: { value: 600 },
      scrollHeight: { value: 1400 },
    })
    container.scrollTop = 150
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      bottom: 600,
    } as DOMRect)
    const first = document.createElement('h2')
    first.id = 'router-strategy-first'
    const last = document.createElement('h2')
    last.id = 'router-strategy-last'
    vi.spyOn(first, 'getBoundingClientRect').mockReturnValue({
      top: -200,
    } as DOMRect)
    vi.spyOn(last, 'getBoundingClientRect').mockReturnValue({
      top: 220,
    } as DOMRect)
    document.body.append(first, last)
    const routeItems: AnchorItem[] = [
      {
        href: '/guide/data',
        title: 'Data',
        children: [
          { href: '#router-strategy-first', title: 'First' },
          { href: '#router-strategy-last', title: 'Last' },
        ],
      },
      { href: '/guide/selection', title: 'Selection' },
    ]
    const wrapper = mount(ConfigProvider, {
      props: {
        anchor: { activeStrategy: 'visible-section', activeOffset: 130 },
      },
      slots: {
        default: () =>
          h(Anchor, {
            router: {
              currentRoute: ref({ path: '/guide/data' }),
              push: vi.fn(),
            },
            getContainer: () => container,
            items: routeItems,
            activeStrategy: localStrategy.value,
            activeOffset: localOffset.value,
          }),
      },
    })
    const activeHash = () =>
      wrapper
        .findAll('.s-anchor__item[aria-current="location"]')
        .map((item) => item.attributes('href'))

    container.dispatchEvent(new Event('scrollend'))
    await wrapper.vm.$nextTick()
    expect(activeHash()).toEqual(['#router-strategy-last'])

    localStrategy.value = 'heading'
    await wrapper.vm.$nextTick()
    container.dispatchEvent(new Event('scrollend'))
    await wrapper.vm.$nextTick()
    expect(activeHash()).toEqual(['#router-strategy-first'])

    localOffset.value = 260
    await wrapper.vm.$nextTick()
    container.dispatchEvent(new Event('scrollend'))
    await wrapper.vm.$nextTick()
    expect(activeHash()).toEqual(['#router-strategy-last'])

    localStrategy.value = undefined
    localOffset.value = undefined
    await wrapper.setProps({
      anchor: { activeStrategy: 'heading', activeOffset: 130 },
    })
    container.dispatchEvent(new Event('scrollend'))
    await wrapper.vm.$nextTick()
    expect(activeHash()).toEqual(['#router-strategy-first'])

    wrapper.unmount()
    first.remove()
    last.remove()
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
