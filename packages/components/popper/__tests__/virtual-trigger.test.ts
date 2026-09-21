import { h, toRaw } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Popper from '../src/popper.vue'

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      disconnect() {}
    },
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

const anchor = (x: number) => ({
  getBoundingClientRect: vi.fn(() => ({
    x,
    y: 100,
    left: x,
    top: 100,
    right: x + 80,
    bottom: 120,
    width: 80,
    height: 20,
    toJSON: () => ({}),
  })),
})

describe('Popper virtual anchor', () => {
  it('treats ignored teleported descendants as part of one outside-click boundary', async () => {
    const ignored = document.createElement('button')
    ignored.className = 'shared-popper-boundary'
    document.body.append(ignored)
    const outside = document.createElement('button')
    document.body.append(outside)
    const wrapper = mount(Popper, {
      attachTo: document.body,
      props: {
        trigger: 'click',
        teleported: false,
        showAfter: 0,
        outsideClickIgnore: ['.shared-popper-boundary'],
      },
      slots: {
        default: () => h('button', 'Open'),
        content: () => h('div', 'Layer content'),
      },
    })

    await wrapper.get('button').trigger('click')
    await flushPromises()
    await vi.waitFor(() =>
      expect(wrapper.get('.s-popper').isVisible()).toBe(true),
    )

    ignored.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    ignored.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))
    await flushPromises()
    expect(wrapper.get('.s-popper').isVisible()).toBe(true)
    await new Promise((resolve) => setTimeout(resolve, 0))

    outside.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    outside.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))
    await flushPromises()
    await vi.waitFor(() =>
      expect(wrapper.get('.s-popper').isVisible()).toBe(false),
    )

    wrapper.unmount()
    ignored.remove()
    outside.remove()
  })

  it('can delegate outside-click ownership to another popper layer', async () => {
    const outside = document.createElement('button')
    document.body.append(outside)
    const wrapper = mount(Popper, {
      attachTo: document.body,
      props: {
        trigger: 'click',
        teleported: false,
        showAfter: 0,
        closeOnClickOutside: false,
      },
      slots: {
        default: () => h('button', 'Open'),
        content: () => h('div', 'Child layer content'),
      },
    })

    await wrapper.get('button').trigger('click')
    await flushPromises()
    await vi.waitFor(() =>
      expect(wrapper.get('.s-popper').isVisible()).toBe(true),
    )
    outside.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    outside.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))
    await flushPromises()
    expect(wrapper.get('.s-popper').isVisible()).toBe(true)

    wrapper.unmount()
    outside.remove()
  })

  it('immediately stops painting when a real virtual anchor is clipped', async () => {
    let intersection: IntersectionObserverCallback | undefined
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: IntersectionObserverCallback) {
          intersection = callback
        }
        observe() {}
        disconnect() {}
      },
    )
    const reference = document.createElement('button')
    document.body.append(reference)
    const wrapper = mount(Popper, {
      attachTo: document.body,
      props: {
        virtualTriggering: true,
        virtualRef: reference,
        visible: true,
        trigger: [],
        content: 'Clipped content',
        persistent: true,
        teleported: false,
      },
    })
    await flushPromises()

    intersection?.(
      [{ isIntersecting: false } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    )
    await wrapper.vm.$nextTick()
    expect(wrapper.get('.s-popper').attributes('style')).toContain(
      'visibility: hidden',
    )
    wrapper.unmount()
    reference.remove()
  })

  it('positions an initially open, slotless popper against its virtual reference', async () => {
    const reference = anchor(120)
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(Popper, {
      attachTo: document.body,
      props: {
        virtualTriggering: true,
        virtualRef: reference,
        visible: true,
        trigger: [],
        content: 'Full cell text',
        teleported: false,
      },
    })
    await flushPromises()
    expect(toRaw(wrapper.vm.triggerRef)).toBe(reference)
    expect(reference.getBoundingClientRect).toHaveBeenCalled()
    expect(wrapper.get('.s-popper').isVisible()).toBe(true)
    expect(wrapper.text()).toContain('Full cell text')
    expect(warn.mock.calls.flat().join(' ')).not.toContain('SOnlyChild')
    wrapper.unmount()
  })

  it('retargets the same open popper when a recycled cell reference changes', async () => {
    const first = anchor(120)
    const second = anchor(400)
    const wrapper = mount(Popper, {
      props: {
        virtualTriggering: true,
        virtualRef: first,
        visible: true,
        trigger: [],
        content: 'First',
        teleported: false,
      },
    })
    await flushPromises()
    await wrapper.setProps({ virtualRef: second, content: 'Second' })
    await flushPromises()
    expect(toRaw(wrapper.vm.triggerRef)).toBe(second)
    expect(second.getBoundingClientRect).toHaveBeenCalled()
    expect(wrapper.findAll('.s-popper')).toHaveLength(1)
    expect(wrapper.text()).toContain('Second')
    wrapper.unmount()
  })

  it('skips viewport positioning while a persistent popper is closed', async () => {
    const reference = anchor(120)
    const wrapper = mount(Popper, {
      props: {
        virtualTriggering: true,
        virtualRef: reference,
        visible: false,
        trigger: [],
        content: 'Persistent content',
        persistent: true,
        teleported: false,
      },
    })
    await flushPromises()
    reference.getBoundingClientRect.mockClear()
    window.dispatchEvent(new Event('scroll'))
    await flushPromises()
    expect(reference.getBoundingClientRect).not.toHaveBeenCalled()

    await wrapper.setProps({ visible: true })
    await flushPromises()
    expect(reference.getBoundingClientRect).toHaveBeenCalled()
    reference.getBoundingClientRect.mockClear()
    window.dispatchEvent(new Event('scroll'))
    await flushPromises()
    expect(reference.getBoundingClientRect).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('keeps real slot anchors and click triggers working across virtual mode changes', async () => {
    const reference = anchor(120)
    const wrapper = mount(Popper, {
      attachTo: document.body,
      props: {
        trigger: 'click',
        content: 'Content',
        teleported: false,
        showAfter: 0,
      },
      slots: { default: () => h('button', 'Open') },
    })
    await flushPromises()
    expect(wrapper.vm.triggerRef).toBe(wrapper.get('button').element)
    await wrapper.get('button').trigger('click')
    await flushPromises()
    await vi.waitFor(() =>
      expect(wrapper.get('.s-popper').isVisible()).toBe(true),
    )
    await wrapper.setProps({ virtualTriggering: true, virtualRef: reference })
    await flushPromises()
    expect(wrapper.find('button').exists()).toBe(false)
    expect(toRaw(wrapper.vm.triggerRef)).toBe(reference)
    await wrapper.setProps({ virtualTriggering: false })
    await flushPromises()
    expect(wrapper.vm.triggerRef).toBe(wrapper.get('button').element)
    wrapper.unmount()
  })

  it('peeks through the floating layer and restores opacity from the content', async () => {
    const wrapper = mount(Popper, {
      attachTo: document.body,
      props: {
        trigger: 'click',
        teleported: false,
        showAfter: 0,
        translucent: true,
        visible: true,
      },
      slots: {
        default: () => h('button', 'Open'),
        content: () => h('div', 'Peeking content'),
      },
    })
    await flushPromises()
    const layer = wrapper.get('.s-popper')
    expect(layer.classes()).toContain('is-translucent')
    await layer.trigger('mouseenter')
    expect(wrapper.emitted('update:translucent')?.[0]).toEqual([false])
    wrapper.unmount()
  })

  it('shows a close control when outside clicks do not dismiss the layer', async () => {
    const wrapper = mount(Popper, {
      attachTo: document.body,
      props: {
        trigger: 'click',
        teleported: false,
        showAfter: 0,
        closeOnClickOutside: false,
      },
      slots: {
        default: () => h('button', 'Open'),
        content: () => h('div', 'Pinned content'),
      },
    })
    await wrapper.get('button').trigger('click')
    await flushPromises()
    const layer = wrapper.get('.s-popper')
    expect(layer.classes()).toContain('is-closeable')
    expect(layer.isVisible()).toBe(true)
    await wrapper.get('.s-popper__close').trigger('click')
    await flushPromises()
    await vi.waitFor(() => expect(layer.isVisible()).toBe(false))
    wrapper.unmount()
  })

  it('can keep an open popper when its reference leaves the viewport', async () => {
    let intersection: IntersectionObserverCallback | undefined
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: IntersectionObserverCallback) {
          intersection = callback
        }
        observe() {}
        disconnect() {}
      },
    )
    const reference = document.createElement('button')
    document.body.append(reference)
    const wrapper = mount(Popper, {
      attachTo: document.body,
      props: {
        virtualTriggering: true,
        virtualRef: reference,
        visible: true,
        trigger: [],
        content: 'Pinned content',
        persistent: true,
        teleported: false,
        closeOnReferenceHidden: false,
      },
    })
    await flushPromises()
    intersection?.(
      [{ isIntersecting: false } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    )
    await wrapper.vm.$nextTick()
    expect(wrapper.get('.s-popper').isVisible()).toBe(true)
    expect(wrapper.get('.s-popper').attributes('style') ?? '').not.toContain(
      'visibility: hidden',
    )
    wrapper.unmount()
    reference.remove()
  })
})
