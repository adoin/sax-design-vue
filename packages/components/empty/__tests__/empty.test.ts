import { KeepAlive, defineComponent, h, nextTick, shallowRef } from 'vue'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { renderToString } from 'vue/server-renderer'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Empty from '../src/empty.vue'

enableAutoUnmount(afterEach)
let observers: Array<{
  notify: (entries: Array<{ isIntersecting: boolean }>) => void
  observe: ReturnType<typeof vi.fn>
  disconnect: ReturnType<typeof vi.fn>
}>
beforeEach(() => {
  observers = []
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe = vi.fn()
      disconnect = vi.fn()
      constructor(
        public notify: (entries: Array<{ isIntersecting: boolean }>) => void,
      ) {
        observers.push(this)
      }
    },
  )
})
afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('Empty illustration', () => {
  it('stops on the open pose after the sparkle and can replay when re-enabled', async () => {
    const wrapper = mount(Empty)
    const svg = wrapper.get('svg').element as SVGSVGElement
    svg.pauseAnimations = vi.fn()
    svg.setCurrentTime = vi.fn()
    observers[0].notify([{ isIntersecting: true }])
    await nextTick()
    expect(wrapper.find('animate[data-empty-completion]').exists()).toBe(true)
    wrapper
      .get('animate[data-empty-completion]')
      .element.dispatchEvent(new Event('endEvent'))
    await nextTick()
    expect(wrapper.find('animate').exists()).toBe(false)
    expect(wrapper.find('.s-empty__surprise').exists()).toBe(false)
    expect(svg.pauseAnimations).toHaveBeenCalled()
    const openPose = wrapper.get('.s-empty__flap-back path').attributes('d')
    await wrapper.setProps({ animated: false })
    await wrapper.setProps({ animated: true })
    expect(wrapper.find('animate[data-empty-completion]').exists()).toBe(true)
    expect(wrapper.get('.s-empty__flap-back path').attributes('d')).toBe(
      openPose,
    )
  })
  it('controls the native SVG clock and removes motion for reduced-motion preferences', async () => {
    let changed = () => {}
    const preference = {
      matches: false,
      addEventListener: vi.fn((_name: string, listener: () => void) => {
        changed = listener
      }),
      removeEventListener: vi.fn(),
    }
    vi.stubGlobal('matchMedia', () => preference)
    const wrapper = mount(Empty)
    const svg = wrapper.get('svg').element as SVGSVGElement
    svg.pauseAnimations = vi.fn()
    svg.unpauseAnimations = vi.fn()
    svg.setCurrentTime = vi.fn()
    observers[0].notify([{ isIntersecting: true }])
    await nextTick()
    expect(svg.unpauseAnimations).toHaveBeenCalled()
    expect(wrapper.find('animate').exists()).toBe(true)
    preference.matches = true
    changed()
    await nextTick()
    expect(svg.pauseAnimations).toHaveBeenCalled()
    expect(svg.setCurrentTime).toHaveBeenCalledWith(0)
    expect(wrapper.find('animate').exists()).toBe(false)
    preference.matches = false
    changed()
    await nextTick()
    expect(wrapper.find('animate').exists()).toBe(true)
    await wrapper.setProps({ animated: false })
    expect(wrapper.find('animate').exists()).toBe(false)
    wrapper.unmount()
    expect(preference.removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    )
  })
  it('uses decorative inline SVG while preserving description and action slots', () => {
    const wrapper = mount(Empty, {
      props: { description: 'No records' },
      slots: { default: () => h('button', 'Create record') },
    })
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.get('svg').attributes('aria-hidden')).toBe('true')
    expect(wrapper.get('svg').attributes('focusable')).toBe('false')
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('No records')
    expect(wrapper.get('button').text()).toBe('Create record')
  })

  it('preserves image and CSS/numeric image-size and skips built-in animation resources', async () => {
    const wrapper = mount(Empty, {
      props: { image: '/custom.svg', imageSize: 144 },
    })
    expect(wrapper.get('img').attributes('src')).toBe('/custom.svg')
    expect(wrapper.find('.s-empty__illustration').exists()).toBe(false)
    expect(wrapper.get('.s-empty__image').attributes('style')).toContain(
      'width: 144px',
    )
    expect(observers).toHaveLength(0)
    await wrapper.setProps({ imageSize: '8rem' })
    expect(wrapper.get('.s-empty__image').attributes('style')).toContain(
      'height: 8rem',
    )
    await wrapper.setProps({ image: undefined })
    expect(wrapper.find('.s-empty__illustration').exists()).toBe(true)
    expect(observers).toHaveLength(1)
    await wrapper.setProps({ image: '/replacement.svg' })
    expect(observers[0].disconnect).toHaveBeenCalledOnce()
  })

  it('lets image and description slots override their props without creating a scene', () => {
    const wrapper = mount(Empty, {
      props: { image: '/unused.svg', description: 'Unused description' },
      slots: {
        image: () => h('span', { class: 'custom-art' }, 'Custom art'),
        description: () => h('strong', 'Custom description'),
      },
    })
    expect(wrapper.get('.custom-art').text()).toBe('Custom art')
    expect(wrapper.text()).toContain('Custom description')
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('svg').exists()).toBe(false)
    expect(observers).toHaveLength(0)
  })

  it('keeps paint IDs unique within an app and stable between SSR and client rendering', async () => {
    const Scene = defineComponent({
      setup: () => () => h('div', [h(Empty), h(Empty)]),
    })
    const html = await renderToString(h(Scene))
    const serverIds = [...html.matchAll(/id="(s-empty-[^"]+)"/g)].map(
      (match) => match[1],
    )
    const wrapper = mount(Scene)
    const clientIds = wrapper
      .findAll('svg defs [id]')
      .map((node) => node.attributes('id'))
    expect(clientIds).toEqual(serverIds)
    expect(new Set(clientIds).size).toBe(clientIds.length)
    for (const node of wrapper.findAll('[fill^="url"], [clip-path^="url"]')) {
      const value = node.attributes('fill') || node.attributes('clip-path')
      expect(clientIds).toContain(value?.slice(5, -1))
    }
  })

  it('pauses offscreen/hidden scenes, resumes safely, and removes listeners on teardown', async () => {
    const remove = vi.spyOn(document, 'removeEventListener')
    const wrapper = mount(Empty)
    const svg = () => wrapper.get('.s-empty__illustration')
    expect(svg().classes()).toContain('is-paused')
    observers[0].notify([{ isIntersecting: true }])
    await nextTick()
    expect(svg().classes()).not.toContain('is-paused')
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden')
    document.dispatchEvent(new Event('visibilitychange'))
    await nextTick()
    expect(svg().classes()).toContain('is-paused')
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible')
    document.dispatchEvent(new Event('visibilitychange'))
    await nextTick()
    expect(svg().classes()).not.toContain('is-paused')
    await wrapper.setProps({ animated: false })
    expect(svg().classes()).not.toContain('is-animated')
    await wrapper.setProps({ animated: true })
    observers[0].notify([{ isIntersecting: false }])
    await nextTick()
    expect(svg().classes()).toContain('is-paused')
    wrapper.unmount()
    expect(observers[0].disconnect).toHaveBeenCalledOnce()
    expect(remove).toHaveBeenCalledWith(
      'visibilitychange',
      expect.any(Function),
    )
  })

  it('pauses a cached scene during KeepAlive deactivation and resumes on activation', async () => {
    const visible = shallowRef(true)
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(KeepAlive, null, {
            default: () => (visible.value ? h(Empty) : h('div')),
          }),
      }),
    )
    observers[0].notify([{ isIntersecting: true }])
    await nextTick()
    const empty = wrapper.getComponent(Empty)
    visible.value = false
    await nextTick()
    expect(empty.get('svg').classes()).toContain('is-paused')
    visible.value = true
    await nextTick()
    expect(empty.get('svg').classes()).not.toContain('is-paused')
  })
})
