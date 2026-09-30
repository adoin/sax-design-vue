import { KeepAlive, createSSRApp, defineComponent, h, nextTick } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Placeholder from '../src/input-placeholder.vue'
import Input from '../src/input.vue'

enableAutoUnmount(afterEach)
let clock = 0
let sequence = 0
let frames: Map<number, FrameRequestCallback>
let reduceMotion = false
let mediaChange: (() => void) | undefined
const advance = (time: number) => {
  clock = time
  const pending = [...frames.values()]
  frames.clear()
  pending.forEach((callback) => callback(time))
}
const number = (element: Element, name: string) =>
  Number(element.getAttribute(name))

beforeEach(() => {
  clock = 0
  sequence = 0
  frames = new Map()
  reduceMotion = false
  mediaChange = undefined
  vi.spyOn(window.performance, 'now').mockImplementation(() => clock)
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
    frames.set(++sequence, callback)
    return sequence
  })
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
    frames.delete(id)
  })
  vi.stubGlobal('matchMedia', () => ({
    get matches() {
      return reduceMotion
    },
    addEventListener: (_: string, callback: () => void) => {
      mediaChange = callback
    },
    removeEventListener: vi.fn(),
  }))
})
afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('Instance placeholder dissolve', () => {
  it('keeps the complete resting state and fully dissolves then aggregates', async () => {
    const wrapper = mount(Placeholder, {
      props: { text: 'Search', dissolved: false },
    })
    const threshold = wrapper.get('[data-dissolve-threshold]').element
    const displacement = wrapper.get('feDisplacementMap').element
    const alpha = wrapper.get('[data-dissolve-alpha]').element
    expect(number(threshold, 'intercept')).toBe(1)
    expect(number(displacement, 'scale')).toBe(0)
    expect(number(alpha, 'slope')).toBe(1)
    expect(frames.size).toBe(0)
    await wrapper.setProps({ dissolved: true })
    advance(475)
    expect(number(threshold, 'intercept')).toBeLessThan(1)
    expect(number(displacement, 'scale')).toBeGreaterThan(0)
    advance(950)
    expect(number(alpha, 'slope')).toBe(0)
    expect(frames.size).toBe(0)
    await wrapper.setProps({ dissolved: false })
    advance(1900)
    expect(number(threshold, 'intercept')).toBe(1)
    expect(number(displacement, 'scale')).toBe(0)
    expect(number(alpha, 'slope')).toBe(1)
    expect(frames.size).toBe(0)
  })

  it('reverses from the current progress without resetting or leaving two loops', async () => {
    const wrapper = mount(Placeholder, {
      props: { text: 'Search', dissolved: false },
    })
    const threshold = wrapper.get('[data-dissolve-threshold]')
    await wrapper.setProps({ dissolved: true })
    advance(475)
    const before = threshold.attributes('intercept')
    await wrapper.setProps({ dissolved: false })
    expect(threshold.attributes('intercept')).toBe(before)
    expect(frames.size).toBe(1)
    advance(950)
    expect(threshold.attributes('intercept')).toBe('1')
    expect(frames.size).toBe(0)
  })

  it('gives sibling instances separate IDs and mutable graphs', async () => {
    const Host = defineComponent({
      props: { active: Boolean },
      setup: (props) => () =>
        h('div', [
          h(Placeholder, { text: 'First', dissolved: props.active }),
          h(Placeholder, { text: 'Second', dissolved: false }),
        ]),
    })
    const wrapper = mount(Host, { props: { active: false } })
    const filters = wrapper.findAll('filter')
    expect(filters[0].attributes('id')).not.toBe(filters[1].attributes('id'))
    await wrapper.setProps({ active: true })
    advance(475)
    expect(
      number(filters[0].get('[data-dissolve-threshold]').element, 'intercept'),
    ).toBeLessThan(1)
    expect(
      number(filters[1].get('[data-dissolve-threshold]').element, 'intercept'),
    ).toBe(1)
    expect(wrapper.find('[data-sax-svg-filters]').exists()).toBe(false)
  })

  it('cancels the timeline and removes local filters on unmount', async () => {
    const wrapper = mount(Placeholder, {
      attachTo: document.body,
      props: { text: 'Search', dissolved: false },
    })
    const id = wrapper.get('filter').attributes('id')!
    await wrapper.setProps({ dissolved: true })
    expect(frames.size).toBe(1)
    wrapper.unmount()
    expect(frames.size).toBe(0)
    expect(document.querySelector(`[id="${id}"]`)).toBeNull()
  })

  it('settles instantly in reduced motion and when the preference changes mid-flight', async () => {
    const wrapper = mount(Placeholder, {
      props: { text: 'Search', dissolved: false },
    })
    await wrapper.setProps({ dissolved: true })
    advance(475)
    reduceMotion = true
    mediaChange?.()
    expect(wrapper.get('[data-dissolve-alpha]').attributes('slope')).toBe('0')
    expect(frames.size).toBe(0)
    await wrapper.setProps({ dissolved: false })
    expect(
      wrapper.get('[data-dissolve-threshold]').attributes('intercept'),
    ).toBe('1')
    expect(frames.size).toBe(0)
  })

  it('does not animate initial occupied fields or float labels', async () => {
    const occupied = mount(Input, {
      props: { placeholder: 'Name', modelValue: 'Alice' },
    })
    expect(occupied.get('.s-input__placeholder').classes()).toContain(
      's-input__placeholder--hidden',
    )
    expect(occupied.get('[data-dissolve-alpha]').attributes('slope')).toBe('0')
    expect(frames.size).toBe(0)
    const floating = mount(Input, {
      props: { placeholder: 'Name', labelFloat: true },
    })
    await floating.get('input').trigger('focus')
    expect(floating.find('filter').exists()).toBe(false)
    expect(frames.size).toBe(0)
  })

  it('preserves server IDs during hydration with no initial animation', async () => {
    const Host = defineComponent({
      setup: () => () =>
        h('div', [
          h(Placeholder, { text: 'First', dissolved: false }),
          h(Placeholder, { text: 'Second', dissolved: true }),
        ]),
    })
    const server = createSSRApp(Host)
    server.config.idPrefix = 'search'
    const html = await renderToString(server)
    const container = document.createElement('div')
    container.innerHTML = html
    document.body.append(container)
    const ids = [...container.querySelectorAll('filter')].map(
      (element) => element.id,
    )
    expect(new Set(ids).size).toBe(2)
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const client = createSSRApp(Host)
    client.config.idPrefix = 'search'
    try {
      client.mount(container)
      await nextTick()
      expect(
        [...container.querySelectorAll('filter')].map((element) => element.id),
      ).toEqual(ids)
      expect(warn).not.toHaveBeenCalled()
      expect(frames.size).toBe(0)
    } finally {
      client.unmount()
      container.remove()
    }
  })

  it('stops work when cached content is deactivated and restores a settled state', async () => {
    const Host = defineComponent({
      props: { shown: Boolean, active: Boolean },
      setup: (props) => () =>
        h(KeepAlive, null, {
          default: () =>
            props.shown
              ? h(Placeholder, { text: 'Search', dissolved: props.active })
              : null,
        }),
    })
    const wrapper = mount(Host, { props: { shown: true, active: false } })
    const id = wrapper.get('filter').attributes('id')
    await wrapper.setProps({ active: true })
    advance(475)
    expect(frames.size).toBe(1)
    await wrapper.setProps({ shown: false })
    expect(frames.size).toBe(0)
    await wrapper.setProps({ shown: true, active: false })
    expect(wrapper.get('filter').attributes('id')).toBe(id)
    expect(
      wrapper.get('[data-dissolve-threshold]').attributes('intercept'),
    ).toBe('1')
    expect(frames.size).toBe(0)
  })
})
