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
const advance = async (time: number) => {
  clock = time
  const pending = [...frames.values()]
  frames.clear()
  pending.forEach((callback) => callback(time))
  await nextTick()
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

describe('Lazy instance placeholder dissolve', () => {
  it('starts during the first 80ms and releases its graph after completion', async () => {
    const wrapper = mount(Input, { props: { placeholder: 'Search' } })
    expect(wrapper.find('filter').exists()).toBe(false)
    await wrapper.get('input').trigger('focus')
    expect(frames.size).toBe(1)
    expect(wrapper.get('filter').attributes()).toMatchObject({
      x: '0%',
      y: '0%',
      width: '100%',
      height: '100%',
    })
    const threshold = wrapper.get('[data-dissolve-threshold]').element
    await advance(16)
    expect(number(threshold, 'intercept')).toBeLessThan(1)
    await advance(80)
    expect(
      number(threshold, 'slope') * 0.4 + number(threshold, 'intercept'),
    ).toBeLessThan(1)
    await advance(480)
    expect(wrapper.find('filter').exists()).toBe(false)
    expect(frames.size).toBe(0)
    expect(
      wrapper.get('.s-placeholder-text__dissolve').attributes('style'),
    ).toContain('opacity: 0')
  })

  it('creates a new graph for aggregation and returns to ordinary text', async () => {
    const wrapper = mount(Placeholder, {
      props: { text: 'Search', dissolved: false },
    })
    expect(wrapper.find('filter').exists()).toBe(false)
    await wrapper.setProps({ dissolved: true })
    const first = wrapper.get('filter').element
    await advance(480)
    expect(wrapper.find('filter').exists()).toBe(false)
    await wrapper.setProps({ dissolved: false })
    const next = wrapper.get('filter').element
    expect(next).not.toBe(first)
    expect(wrapper.get('[data-dissolve-alpha]').attributes('slope')).toBe('0')
    await advance(1130)
    expect(wrapper.find('filter').exists()).toBe(false)
    expect(
      wrapper.get('.s-placeholder-text__dissolve').attributes('style') || '',
    ).not.toContain('url(')
  })

  it('reverses using the same live graph and does not reset progress', async () => {
    const wrapper = mount(Placeholder, {
      props: { text: 'Search', dissolved: false },
    })
    await wrapper.setProps({ dissolved: true })
    await advance(160)
    const filter = wrapper.get('filter').element
    const threshold = wrapper.get('[data-dissolve-threshold]')
    const before = threshold.attributes('intercept')
    await wrapper.setProps({ dissolved: false })
    expect(wrapper.get('filter').element).toBe(filter)
    expect(threshold.attributes('intercept')).toBe(before)
    expect(frames.size).toBe(1)
    await advance(810)
    expect(wrapper.find('filter').exists()).toBe(false)
    expect(frames.size).toBe(0)
  })

  it('keeps 500 idle placeholders free of filter graphs and animation frames', async () => {
    const Host = defineComponent({
      props: { active: { type: Number, default: -1 } },
      setup: (props) => () =>
        h(
          'div',
          Array.from({ length: 500 }, (_, index) =>
            h(Placeholder, {
              text: String(index),
              dissolved: index === props.active,
            }),
          ),
        ),
    })
    const wrapper = mount(Host)
    expect(wrapper.findAll('filter')).toHaveLength(0)
    expect(frames.size).toBe(0)
    await wrapper.setProps({ active: 27 })
    expect(wrapper.findAll('filter')).toHaveLength(1)
    await advance(480)
    expect(wrapper.findAll('filter')).toHaveLength(0)
    expect(frames.size).toBe(0)
  })

  it('cancels frames and removes listeners on owner teardown', async () => {
    const wrapper = mount(Placeholder, {
      attachTo: document.body,
      props: { text: 'Search', dissolved: false },
    })
    const remove = vi.spyOn(document, 'removeEventListener')
    await wrapper.setProps({ dissolved: true })
    const id = wrapper.get('filter').attributes('id')!
    wrapper.unmount()
    expect(frames.size).toBe(0)
    expect(document.querySelector(`[id="${id}"]`)).toBeNull()
    expect(
      remove.mock.calls.filter(([name]) => name === 'visibilitychange'),
    ).toHaveLength(1)
  })

  it('allocates no graph for reduced motion and releases one if the preference changes', async () => {
    reduceMotion = true
    const wrapper = mount(Placeholder, {
      props: { text: 'Search', dissolved: false },
    })
    await wrapper.setProps({ dissolved: true })
    expect(wrapper.find('filter').exists()).toBe(false)
    expect(frames.size).toBe(0)
    reduceMotion = false
    await wrapper.setProps({ dissolved: false })
    expect(wrapper.find('filter').exists()).toBe(true)
    await advance(160)
    reduceMotion = true
    mediaChange?.()
    await nextTick()
    expect(wrapper.find('filter').exists()).toBe(false)
    expect(frames.size).toBe(0)
  })

  it('does not allocate graphs for occupied, float-label, or hidden fields', async () => {
    const occupied = mount(Input, {
      props: { placeholder: 'Name', modelValue: 'Alice' },
    })
    expect(occupied.find('filter').exists()).toBe(false)
    const floating = mount(Input, {
      props: { placeholder: 'Name', labelFloat: true },
    })
    await floating.get('input').trigger('focus')
    expect(floating.find('filter').exists()).toBe(false)
    const hidden = mount(Placeholder, {
      props: { text: 'Name', dissolved: false, hidden: true },
    })
    await hidden.setProps({ dissolved: true })
    expect(hidden.find('filter').exists()).toBe(false)
    expect(frames.size).toBe(0)
  })

  it('hydrates without server-side filter graphs or initial animation', async () => {
    const Host = defineComponent({
      setup: () => () =>
        h('div', [
          h(Placeholder, { text: 'First', dissolved: false }),
          h(Placeholder, { text: 'Second', dissolved: true }),
        ]),
    })
    const server = createSSRApp(Host)
    const html = await renderToString(server)
    expect(html).not.toContain('<filter')
    const container = document.createElement('div')
    container.innerHTML = html
    document.body.append(container)
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const client = createSSRApp(Host)
    try {
      client.mount(container)
      await nextTick()
      expect(container.querySelectorAll('filter')).toHaveLength(0)
      expect(warn).not.toHaveBeenCalled()
      expect(frames.size).toBe(0)
    } finally {
      client.unmount()
      container.remove()
    }
  })

  it('releases deactivated graphs and restores a settled cached state', async () => {
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
    await wrapper.setProps({ active: true })
    await advance(160)
    expect(frames.size).toBe(1)
    await wrapper.setProps({ shown: false })
    expect(frames.size).toBe(0)
    await wrapper.setProps({ shown: true, active: false })
    expect(wrapper.find('filter').exists()).toBe(false)
    expect(frames.size).toBe(0)
  })
})
