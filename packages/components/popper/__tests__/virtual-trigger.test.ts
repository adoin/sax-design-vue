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
})
