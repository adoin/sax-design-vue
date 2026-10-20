import { defineComponent, h, nextTick } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ConfigProvider from '../../config-provider/src/config-provider'
import Icon from '../src/icon.vue'
import { readMorphShapes } from '../src/morph/svg'
import { springProgress } from '../src/morph/svg-morpheus'
import type { SaxIconData } from '../src/icon'

vi.mock('../src/morph/svg', () => ({ readMorphShapes: vi.fn(() => []) }))
vi.mock('../src/morph/svg-morpheus', () => ({
  createMorpheusPlan: vi.fn(() => ({
    frame: (t: number) => `<path d="M${t} 0L2 2"/>`,
  })),
  springProgress: vi.fn((t: number) => t),
}))
const icon = (x: number): SaxIconData => ({
  attributes: { viewBox: '0 0 32 32' },
  body: `<path d="M${x} 0L10 10"/>`,
})
let clock = 0
let sequence = 0
let reduced = false
let media: EventTarget
let frames: Map<number, FrameRequestCallback>
beforeEach(() => {
  clock = 0
  reduced = false
  frames = new Map()
  media = new EventTarget()
  vi.spyOn(performance, 'now').mockImplementation(() => clock)
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frames.set(++sequence, callback)
    return sequence
  })
  vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id))
  vi.stubGlobal('matchMedia', () => media)
  Object.defineProperty(media, 'matches', {
    configurable: true,
    get: () => reduced,
  })
  vi.mocked(readMorphShapes).mockClear()
  vi.mocked(springProgress).mockImplementation((t) => t)
})
afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
const settleImports = async () => {
  await vi.dynamicImportSettled()
  await flushPromises()
}
const tick = async (time: number) => {
  clock = time
  const pending = [...frames.values()]
  frames.clear()
  pending.forEach((callback) => callback(time))
  await nextTick()
}

describe('Icon morph lifecycle', () => {
  it('restores exact artwork after settling while preserving completion timing', async () => {
    vi.mocked(springProgress).mockImplementation((t) => Math.min(1, t * 2))
    const wrapper = mount(Icon, {
      props: { iconData: icon(1), morph: { duration: 100 } },
    })
    await wrapper.setProps({ iconData: icon(2) })
    await settleImports()
    await tick(60)
    expect(wrapper.get('path').attributes('d')).toBe('M1 0L2 2')
    await tick(70)
    expect(wrapper.get('path').attributes('d')).toBe('M2 0L10 10')
    expect(wrapper.get('svg').attributes('viewBox')).toBe('0 0 32 32')
    expect(wrapper.emitted('morphEnd')).toBeUndefined()
    await tick(100)
    expect(wrapper.emitted('morphEnd')).toHaveLength(1)
    wrapper.unmount()
  })
  it('does not treat a moving crossing of the target as settled', async () => {
    vi.mocked(springProgress).mockImplementation(
      (t) => 1 + 0.1 * Math.sin((t - 0.5) * 10),
    )
    const wrapper = mount(Icon, {
      props: { iconData: icon(1), morph: { duration: 100 } },
    })
    await wrapper.setProps({ iconData: icon(2) })
    await settleImports()
    await tick(50)
    await tick(50)
    expect(wrapper.get('svg').attributes('viewBox')).toBe('0 0 24 24')
    expect(wrapper.emitted('morphEnd')).toBeUndefined()
    wrapper.unmount()
  })
  it('leaves SSR and initial render static', async () => {
    expect(
      await renderToString(h(Icon, { iconData: icon(1), morph: true })),
    ).toContain('M1 0L10 10')
    const wrapper = mount(Icon, { props: { iconData: icon(1), morph: true } })
    expect(wrapper.get('path').attributes('d')).toBe('M1 0L10 10')
    expect(frames.size).toBe(0)
    expect(readMorphShapes).not.toHaveBeenCalled()
    wrapper.unmount()
  })
  it('finishes on the exact target and emits one completion', async () => {
    const wrapper = mount(Icon, {
      props: { iconData: icon(1), morph: { duration: 100 } },
    })
    await wrapper.setProps({ iconData: icon(2) })
    await settleImports()
    expect(wrapper.emitted('morphStart')).toHaveLength(1)
    await tick(50)
    expect(wrapper.get('path').attributes('d')).toBe('M0.5 0L2 2')
    await tick(100)
    expect(wrapper.get('path').attributes('d')).toBe('M2 0L10 10')
    expect(wrapper.get('svg').attributes('viewBox')).toBe('0 0 32 32')
    expect(wrapper.emitted('morphEnd')).toHaveLength(1)
    expect(frames.size).toBe(0)
    wrapper.unmount()
  })
  it('continues from the displayed intermediate SVG and cancels on unmount', async () => {
    const wrapper = mount(Icon, {
      props: { iconData: icon(1), morph: { duration: 100 } },
    })
    await wrapper.setProps({ iconData: icon(2) })
    await settleImports()
    await tick(40)
    const current = wrapper.get('path').attributes('d')
    await wrapper.setProps({ iconData: icon(3) })
    await settleImports()
    expect(vi.mocked(readMorphShapes).mock.calls.at(-2)?.[0].body).toContain(
      `d="${current}"`,
    )
    expect(frames.size).toBe(1)
    wrapper.unmount()
    expect(frames.size).toBe(0)
    expect(wrapper.emitted('morphEnd')).toBeUndefined()
  })
  it('does not revive pending imports after unmount', async () => {
    const wrapper = mount(Icon, { props: { iconData: icon(1), morph: true } })
    await wrapper.setProps({ iconData: icon(2) })
    wrapper.unmount()
    await settleImports()
    expect(frames.size).toBe(0)
    expect(wrapper.emitted('morphStart')).toBeUndefined()
  })
  it('cancels a running animation when disabled and supports zero duration', async () => {
    const wrapper = mount(Icon, { props: { iconData: icon(1), morph: true } })
    await wrapper.setProps({ iconData: icon(2) })
    await settleImports()
    expect(frames.size).toBe(1)
    await wrapper.setProps({ morph: false })
    expect(frames.size).toBe(0)
    expect(wrapper.get('path').attributes('d')).toBe('M2 0L10 10')
    await wrapper.setProps({ morph: { duration: 0 }, iconData: icon(3) })
    await settleImports()
    expect(frames.size).toBe(0)
    expect(wrapper.get('path').attributes('d')).toBe('M3 0L10 10')
    expect(wrapper.emitted('morphEnd')).toBeUndefined()
    wrapper.unmount()
  })
  it('handles reduced motion and changing preferences while running', async () => {
    const wrapper = mount(Icon, { props: { iconData: icon(1), morph: true } })
    reduced = true
    await wrapper.setProps({ iconData: icon(2) })
    await settleImports()
    expect(frames.size).toBe(0)
    reduced = false
    await wrapper.setProps({ iconData: icon(3) })
    await settleImports()
    expect(frames.size).toBe(1)
    reduced = true
    media.dispatchEvent(new Event('change'))
    await nextTick()
    expect(frames.size).toBe(0)
    expect(wrapper.get('path').attributes('d')).toBe('M3 0L10 10')
    wrapper.unmount()
  })
  it('inherits global options and permits an explicit false override', async () => {
    const wrapper = mount(
      defineComponent({
        props: { value: { type: Number, default: 1 } },
        setup: (props) => () =>
          h(ConfigProvider, { icon: { morph: { duration: 100 } } }, () => [
            h(Icon, { iconData: icon(props.value) }),
            h(Icon, { iconData: icon(props.value), morph: false }),
          ]),
      }),
    )
    await wrapper.setProps({ value: 2 })
    await settleImports()
    const icons = wrapper.findAllComponents(Icon)
    expect(icons[0].emitted('morphStart')).toHaveLength(1)
    expect(icons[1].emitted('morphStart')).toBeUndefined()
    expect(icons[1].get('path').attributes('d')).toBe('M2 0L10 10')
    await tick(100)
    expect(frames.size).toBe(0)
    wrapper.unmount()
  })
  it('falls back to the exact target when SVG preparation fails', async () => {
    vi.mocked(readMorphShapes).mockImplementationOnce(() => {
      throw new Error('unsupported paint')
    })
    const wrapper = mount(Icon, { props: { iconData: icon(1), morph: true } })
    await wrapper.setProps({ iconData: icon(2) })
    await settleImports()
    expect(wrapper.get('path').attributes('d')).toBe('M2 0L10 10')
    expect(wrapper.attributes('data-morphing')).toBeUndefined()
    expect(frames.size).toBe(0)
    wrapper.unmount()
  })
})
