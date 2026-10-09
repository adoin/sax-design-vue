import { defineComponent, h, nextTick, shallowRef } from 'vue'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { renderToString } from 'vue/server-renderer'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import NoticeBar from '../src/notice-bar.vue'

enableAutoUnmount(afterEach)
beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal('IntersectionObserver', undefined)
  vi.stubGlobal('matchMedia', () => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(false)
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(180)
  vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockImplementation(
    function (this: HTMLElement) {
      return (this.textContent?.length ?? 0) > 40 ? 400 : 120
    },
  )
})
afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
const settle = async (time = 40) => {
  await nextTick()
  await vi.advanceTimersByTimeAsync(time)
  await nextTick()
}

describe('NoticeBar', () => {
  it('pauses outside the viewport, honors a motion override and removes playback observers', async () => {
    let observed: (
      entries: Array<{ isIntersecting: boolean }>,
    ) => void = () => {}
    const disconnect = vi.fn()
    const preference = {
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }
    vi.stubGlobal('matchMedia', () => preference)
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: typeof observed) {
          observed = callback
        }
        observe = vi.fn()
        disconnect = disconnect
      },
    )
    const wrapper = mount(NoticeBar, {
      props: { items: ['One', 'Two'], interval: 1000, reducedMotion: false },
    })
    await settle(1100)
    expect(wrapper.vm.paused).toBe(true)
    expect(wrapper.vm.activeIndex).toBe(0)
    observed([{ isIntersecting: true }])
    await settle(1100)
    expect(wrapper.vm.activeIndex).toBe(1)
    expect(wrapper.classes()).toContain('is-motion-forced')
    await wrapper.setProps({ reducedMotion: undefined })
    await settle()
    expect(wrapper.vm.paused).toBe(true)
    expect(wrapper.classes()).toContain('is-reduced-motion')
    observed([{ isIntersecting: false }])
    await wrapper.setProps({ reducedMotion: false })
    await settle(1100)
    expect(wrapper.vm.activeIndex).toBe(1)
    wrapper.unmount()
    await settle()
    expect(disconnect).toHaveBeenCalled()
    expect(preference.removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    )
    expect(vi.getTimerCount()).toBe(0)
  })
  it('copies rich notice markup without mounting a second Vue child or duplicating SVG IDs', async () => {
    let mounts = 0
    const Child = defineComponent({
      setup: () => {
        mounts++
        return () =>
          h('span', [
            h('strong', 'Rich content '.repeat(10)),
            h('svg', [
              h('defs', [h('linearGradient', { id: 'notice-paint' })]),
              h('path', { fill: 'url(#notice-paint)' }),
            ]),
          ])
      },
    })
    const wrapper = mount(NoticeBar, { slots: { default: () => h(Child) } })
    await settle()
    expect(wrapper.vm.scrolling).toBe(true)
    expect(mounts).toBe(1)
    const copy = wrapper.get('.s-notice-bar__copy')
    expect(copy.text()).toContain('Rich content')
    const gradient = copy.get('linearGradient').attributes('id')
    expect(gradient).not.toBe('notice-paint')
    expect(copy.get('path').attributes('fill')).toBe(`url(#${gradient})`)
    await wrapper.setProps({ speed: 72 })
    await settle()
    wrapper.vm.reset()
    await settle()
    expect(mounts).toBe(1)
  })
  it('keeps short text stationary and preserves legacy close/click behavior', async () => {
    const wrapper = mount(NoticeBar, {
      props: { content: 'Short notice', closable: true },
    })
    await settle()
    expect(wrapper.vm.scrolling).toBe(false)
    expect(wrapper.attributes('style')).toContain(
      '--sax-notice-color: var(--sax-css-info)',
    )
    expect(wrapper.find('.s-notice-bar__copy').exists()).toBe(false)
    await wrapper.get('.s-notice-bar__body').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
    await wrapper.get('button[aria-label="Close"]').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('click')).toHaveLength(1)
    expect(wrapper.vm.visible).toBe(false)
    wrapper.vm.open()
    await settle()
    expect(wrapper.vm.visible).toBe(true)
  })

  it('supports controlled visibility and current notice without mutating props', async () => {
    const visible = shallowRef(true)
    const index = shallowRef(0)
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(NoticeBar, {
            modelValue: visible.value,
            activeIndex: index.value,
            items: ['First', 'Second'],
            autoplay: false,
            closable: true,
            'onUpdate:modelValue': (value: boolean) => {
              visible.value = value
            },
            'onUpdate:activeIndex': (value: number) => {
              index.value = value
            },
          }),
      }),
    )
    await settle()
    const bar = wrapper.getComponent(NoticeBar)
    bar.vm.next()
    await settle()
    expect(index.value).toBe(1)
    expect(bar.text()).toContain('Second')
    expect(bar.emitted('change')?.at(-1)).toEqual([1, { content: 'Second' }])
    bar.vm.close()
    await settle()
    expect(visible.value).toBe(false)
    bar.vm.open()
    await settle()
    expect(visible.value).toBe(true)
  })

  it('cycles notices, pauses for hover/focus/manual requests, and clears timers', async () => {
    const wrapper = mount(NoticeBar, {
      props: { items: ['One', 'Two', 'Three'], interval: 1000 },
    })
    await settle()
    expect(wrapper.attributes('aria-live')).toBe('off')
    await settle(1000)
    expect(wrapper.vm.activeIndex).toBe(1)
    await wrapper.trigger('mouseenter')
    await settle(2200)
    expect(wrapper.vm.activeIndex).toBe(1)
    await wrapper.trigger('mouseleave')
    await settle(1000)
    expect(wrapper.vm.activeIndex).toBe(2)
    await wrapper.trigger('focusin')
    await settle(2000)
    expect(wrapper.vm.activeIndex).toBe(2)
    await wrapper.trigger('focusout', { relatedTarget: null })
    wrapper.vm.pause()
    await settle(1500)
    expect(wrapper.vm.activeIndex).toBe(2)
    wrapper.vm.resume()
    await settle(1000)
    expect(wrapper.vm.activeIndex).toBe(0)
    wrapper.unmount()
    await settle(60)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('uses accessible navigation and stops autoplay at the end when looping is disabled', async () => {
    const wrapper = mount(NoticeBar, {
      props: {
        items: ['One', 'Two'],
        interval: 500,
        loop: false,
        showNavigation: true,
        showIndicator: true,
      },
    })
    await settle()
    expect(
      wrapper
        .get('button[aria-label="Previous notice"]')
        .attributes('disabled'),
    ).toBeDefined()
    await settle(600)
    expect(wrapper.vm.activeIndex).toBe(1)
    expect(wrapper.get('.s-notice-bar__indicator').text()).toBe('2 / 2')
    expect(
      wrapper.get('button[aria-label="Next notice"]').attributes('disabled'),
    ).toBeDefined()
    await settle(1200)
    expect(wrapper.vm.activeIndex).toBe(1)
    await wrapper.get('button[aria-label="Previous notice"]').trigger('click')
    await settle()
    expect(wrapper.vm.activeIndex).toBe(0)
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('measures overflow, uses seamless hidden copies and distinguishes seconds from pixel speed', async () => {
    const wrapper = mount(NoticeBar, {
      props: { content: 'Long notice '.repeat(10), duration: 12, gap: 32 },
    })
    await settle()
    expect(wrapper.vm.scrolling).toBe(true)
    expect(wrapper.attributes('style')).toContain(
      '--sax-notice-distance: -432px',
    )
    expect(wrapper.attributes('style')).toContain('--sax-notice-duration: 12s')
    expect(wrapper.get('.s-notice-bar__copy').attributes('aria-hidden')).toBe(
      'true',
    )
    expect(wrapper.get('.s-notice-bar__copy').attributes('inert')).toBeDefined()
    await wrapper.setProps({ speed: 72 })
    await settle()
    expect(wrapper.attributes('style')).toContain('--sax-notice-duration: 6s')
    await wrapper.setProps({ wrapable: true })
    await settle()
    expect(wrapper.vm.scrolling).toBe(false)
  })

  it('lets an overflowing notice finish a reading cycle before autoplay advances', async () => {
    const wrapper = mount(NoticeBar, {
      props: {
        items: ['Long notice '.repeat(10), 'Short'],
        speed: 72,
        delay: 1000,
        interval: 1000,
      },
    })
    await settle()
    expect(wrapper.vm.scrolling).toBe(true)
    await settle(6000)
    expect(wrapper.vm.activeIndex).toBe(0)
    await settle(1100)
    expect(wrapper.vm.activeIndex).toBe(1)
  })

  it('preserves fixed slots/actions and safe native links while disabling only the item link', async () => {
    const wrapper = mount(NoticeBar, {
      props: {
        items: [
          { content: 'Read details', href: '#details', target: '_blank' },
        ],
        closable: true,
      },
      slots: {
        icon: () => h('span', 'Custom icon'),
        prefix: () => h('span', 'Prefix'),
        suffix: () => h('span', 'Suffix'),
        actions: () => h('button', 'Action'),
        'close-icon': () => h('span', 'Custom close'),
      },
    })
    await settle()
    expect(wrapper.get('a').attributes('rel')).toBe('noopener noreferrer')
    expect(wrapper.text()).toContain('Custom icon')
    expect(wrapper.text()).toContain('Custom close')
    await wrapper.get('.s-notice-bar__actions button').trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
    await wrapper.setProps({
      items: [{ content: 'Disabled link', href: '#details', disabled: true }],
    })
    await settle()
    expect(wrapper.find('a').exists()).toBe(false)
    expect(wrapper.get('.s-notice-bar__body').attributes('aria-disabled')).toBe(
      'true',
    )
  })

  it('renders scoped content and keeps native keyboard semantics for clickable notices', async () => {
    const wrapper = mount(NoticeBar, {
      props: { items: ['One', 'Two'], autoplay: false, clickable: true },
      slots: {
        content: ({ item, index }) => h('strong', `${index}:${item.content}`),
      },
    })
    await settle()
    expect(wrapper.get('button.s-notice-bar__body').text()).toBe('0:One')
    wrapper.vm.next()
    await settle()
    expect(wrapper.get('strong').text()).toBe('1:Two')
  })

  it('respects reduced motion, hidden pages and item removal', async () => {
    const wrapper = mount(NoticeBar, {
      props: {
        items: ['One', 'Two', 'Three'],
        activeIndex: 2,
        showIndicator: true,
      },
    })
    await settle()
    await wrapper.setProps({ items: ['Only'] })
    await settle()
    expect(wrapper.emitted('update:activeIndex')?.at(-1)).toEqual([0])
    await wrapper.setProps({
      activeIndex: 0,
      items: ['One', 'Two'],
      reducedMotion: true,
      interval: 500,
    })
    await settle(1600)
    expect(wrapper.vm.paused).toBe(true)
    expect(wrapper.emitted('update:activeIndex')).toHaveLength(1)
    await wrapper.setProps({ reducedMotion: false })
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
    document.dispatchEvent(new Event('visibilitychange'))
    await settle(1500)
    expect(wrapper.vm.paused).toBe(true)
  })

  it('renders on the server without starting timers and preserves semantic color/shape', async () => {
    const html = await renderToString(
      h(NoticeBar, {
        type: 'warning',
        shape: 'square',
        content: 'Maintenance',
        items: ['One', 'Two'],
      }),
    )
    expect(html).toContain('is-square')
    expect(html).toContain('var(--sax-css-warn')
    expect(vi.getTimerCount()).toBe(0)
  })
})
