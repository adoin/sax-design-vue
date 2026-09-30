import { nextTick } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Radio from '../src/radio.vue'

let clock = 0
let nextId = 0
let frames: Map<number, FrameRequestCallback>
let reduced = false
const wrappers: ReturnType<typeof mount>[] = []
const settle = async () => {
  await nextTick()
  await flushPromises()
  await nextTick()
}
const advance = async (count: number) => {
  for (let i = 0; i < count; i++) {
    clock += 40
    const callbacks = [...frames.values()]
    frames.clear()
    callbacks.forEach((callback) => callback(clock))
    await settle()
  }
}
beforeEach(() => {
  clock = 0
  nextId = 0
  frames = new Map()
  reduced = false
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frames.set(++nextId, callback)
    return nextId
  })
  vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id))
  vi.stubGlobal('matchMedia', () => ({
    get matches() {
      return reduced
    },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
})
afterEach(async () => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount())
  await settle()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})
const mountRadio = () => {
  const wrapper = mount(Radio, {
    props: { modelValue: 'other', value: 'choice', loading: true },
  })
  wrappers.push(wrapper)
  return wrapper
}

describe('Radio compact loading completion', () => {
  it('finishes an early-stopped lead-in, clears four points and blocks selection until completion', async () => {
    const wrapper = mountRadio()
    await settle()
    const loader = wrapper.get('.s-logo-loading').element
    await advance(4)
    await wrapper.setProps({ loading: false })
    expect(wrapper.get('.s-logo-loading').attributes('data-phase')).toBe(
      'starting',
    )
    await wrapper.get('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await advance(21)
    expect(wrapper.get('.s-logo-loading').element).toBe(loader)
    expect(wrapper.get('.s-logo-loading').attributes('data-phase')).toBe(
      'stopping',
    )
    expect(wrapper.get('input').element.disabled).toBe(true)
    expect(wrapper.find('.s-radio__graphic').exists()).toBe(false)
    await advance(4)
    expect(wrapper.get('input').attributes('aria-busy')).toBe('true')
    await advance(2)
    expect(wrapper.find('.s-logo-loading').exists()).toBe(false)
    expect(wrapper.find('.s-radio__graphic').exists()).toBe(true)
    expect(wrapper.get('input').element.disabled).toBe(false)
    await wrapper.get('input').trigger('change')
    expect(wrapper.emitted('update:modelValue')).toEqual([['choice']])
  })

  it('resumes the same orbit if loading restarts during the compact tail', async () => {
    const wrapper = mountRadio()
    await settle()
    await advance(25)
    const loader = wrapper.get('.s-logo-loading').element
    await wrapper.setProps({ loading: false })
    await advance(2)
    await wrapper.setProps({ loading: true })
    expect(wrapper.get('.s-logo-loading').element).toBe(loader)
    expect(wrapper.get('.s-logo-loading').attributes('data-phase')).toBe(
      'running',
    )
    await wrapper.setProps({ loading: false })
    await advance(6)
    expect(wrapper.find('.s-logo-loading').exists()).toBe(false)
  })

  it('restores immediately with reduced motion', async () => {
    reduced = true
    const wrapper = mountRadio()
    await settle()
    await wrapper.setProps({ loading: false })
    await settle()
    expect(wrapper.find('.s-logo-loading').exists()).toBe(false)
    expect(wrapper.get('input').element.disabled).toBe(false)
  })
})
