import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ContentEllipsis from '../src/content-ellipsis.vue'

const stubIcon = { SIcon: { template: '<i class="icon-stub" />' } }

const mockHeights = (
  getContentHeight: () => number,
  limitHeight: number,
  hiddenFocus = false,
) => {
  const original = HTMLElement.prototype.getBoundingClientRect
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
    function (this: HTMLElement) {
      if (this.classList.contains('s-content-ellipsis__content')) {
        return { height: getContentHeight() } as DOMRect
      }
      if (this.classList.contains('s-content-ellipsis__limit')) {
        return { height: limitHeight } as DOMRect
      }
      if (
        hiddenFocus &&
        this.classList.contains('s-content-ellipsis__viewport')
      ) {
        return { bottom: limitHeight } as DOMRect
      }
      if (hiddenFocus && this.classList.contains('child-action')) {
        return { bottom: limitHeight + 40 } as DOMRect
      }
      return original.call(this)
    },
  )
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('ContentEllipsis', () => {
  it('keeps short arbitrary content visible without an action', async () => {
    vi.stubGlobal('ResizeObserver', undefined)
    mockHeights(() => 72, 160)
    const wrapper = mount(ContentEllipsis, {
      props: { collapsedHeight: 160 },
      slots: { default: '<button class="child-action">Edit item</button>' },
      global: { stubs: stubIcon },
    })
    await flushPromises()

    expect(wrapper.find('.child-action').exists()).toBe(true)
    expect(wrapper.find('.s-content-ellipsis__toggle').exists()).toBe(false)
    expect(
      wrapper.get('.s-content-ellipsis__viewport').attributes('style'),
    ).toContain('height: auto')
  })

  it('measures overflow and toggles while preserving slotted elements', async () => {
    vi.stubGlobal('ResizeObserver', undefined)
    mockHeights(() => 280, 120)
    const wrapper = mount(ContentEllipsis, {
      props: { collapsedHeight: '7.5rem' },
      slots: { default: '<button class="child-action">Edit item</button>' },
      global: { stubs: stubIcon },
    })
    await flushPromises()

    const child = wrapper.get('.child-action').element
    const viewport = wrapper.get('.s-content-ellipsis__viewport')
    const toggle = wrapper.get('.s-content-ellipsis__toggle')
    expect(
      wrapper.get('.s-content-ellipsis__limit').attributes('style'),
    ).toContain('height: 7.5rem')
    expect(viewport.attributes('style')).toContain('height: 120px')
    expect(viewport.classes()).toContain('is-clipped')
    expect(toggle.attributes('aria-controls')).toBe(viewport.attributes('id'))
    expect(toggle.attributes('aria-expanded')).toBe('false')

    await toggle.trigger('click')
    expect(wrapper.emitted('update:expanded')).toEqual([[true]])
    expect(wrapper.emitted('change')).toEqual([[true]])
    expect(viewport.attributes('style')).toContain('height: 280px')
    expect(viewport.classes()).not.toContain('is-clipped')
    expect(wrapper.get('.child-action').element).toBe(child)

    await wrapper.get('.s-content-ellipsis__toggle').trigger('click')
    expect(wrapper.emitted('change')).toEqual([[true], [false]])
    expect(viewport.attributes('style')).toContain('height: 120px')
  })

  it('responds when slotted content grows after mount', async () => {
    vi.stubGlobal('ResizeObserver', undefined)
    let fullHeight = 80
    mockHeights(() => fullHeight, 120)
    const wrapper = mount(ContentEllipsis, {
      props: { collapsedHeight: 120 },
      slots: { default: '<div>Changing content</div>' },
      global: { stubs: stubIcon },
    })
    await flushPromises()
    expect(wrapper.find('.s-content-ellipsis__toggle').exists()).toBe(false)

    fullHeight = 200
    window.dispatchEvent(new Event('resize'))
    await flushPromises()
    expect(wrapper.find('.s-content-ellipsis__toggle').exists()).toBe(true)
    expect(
      wrapper.get('.s-content-ellipsis__viewport').attributes('style'),
    ).toContain('height: 120px')
  })

  it('remeasures content through ResizeObserver', async () => {
    let notify!: ResizeObserverCallback
    class ResizeObserverStub {
      constructor(callback: ResizeObserverCallback) {
        notify = callback
      }
      observe() {}
      disconnect() {}
    }
    vi.stubGlobal('ResizeObserver', ResizeObserverStub)
    let fullHeight = 80
    mockHeights(() => fullHeight, 120)
    const wrapper = mount(ContentEllipsis, {
      props: { collapsedHeight: 120 },
      slots: { default: '<div>Loaded later</div>' },
      global: { stubs: stubIcon },
    })
    await flushPromises()
    expect(wrapper.find('.s-content-ellipsis__toggle').exists()).toBe(false)

    fullHeight = 220
    notify([], {} as ResizeObserver)
    await flushPromises()
    expect(wrapper.get('.s-content-ellipsis__toggle').text()).toContain(
      'Show more',
    )
  })

  it('reveals clipped controls when keyboard focus reaches them', async () => {
    vi.stubGlobal('ResizeObserver', undefined)
    mockHeights(() => 280, 120, true)
    const wrapper = mount(ContentEllipsis, {
      props: { collapsedHeight: 120 },
      slots: { default: '<button class="child-action">Edit item</button>' },
      global: { stubs: stubIcon },
    })
    await flushPromises()

    await wrapper.get('.child-action').trigger('focusin')
    expect(wrapper.emitted('update:expanded')).toEqual([[true]])
    expect(
      wrapper.get('.s-content-ellipsis__toggle').attributes('aria-expanded'),
    ).toBe('true')
  })
})
