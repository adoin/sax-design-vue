import { nextTick } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Notification from '../src/notification.vue'
import notify from '../src/notify'

let clock = 0
let id = 0
let frames: Map<number, FrameRequestCallback>
let reduced = false
const wrappers: ReturnType<typeof mount>[] = []
const settle = async () => {
  await nextTick()
  await flushPromises()
  await nextTick()
}
const advance = async (time: number) => {
  clock = time
  const pending = [...frames.values()]
  frames.clear()
  pending.forEach((callback) => callback(time))
  await settle()
}
const filters = () =>
  document.querySelectorAll('filter[id^="sax-notification-dissolve"]')
const create = (props = {}) => {
  const wrapper = mount(Notification, {
    props: { duration: 0, title: 'Notice', content: 'Saved', ...props },
    attachTo: document.body,
    global: { stubs: { transition: false } },
  })
  wrappers.push(wrapper)
  return wrapper
}
beforeEach(() => {
  clock = 0
  id = 0
  reduced = false
  frames = new Map()
  vi.useFakeTimers({
    toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'],
  })
  vi.spyOn(window.performance, 'now').mockImplementation(() => clock)
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frames.set(++id, callback)
    return id
  })
  vi.stubGlobal('cancelAnimationFrame', (key: number) => frames.delete(key))
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
  document
    .querySelectorAll('[id*="notification-container"]')
    .forEach((el) => el.replaceChildren())
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('Notification particle close', () => {
  it('allocates only during close, filters only the notification and completes once', async () => {
    const onClose = vi.fn()
    const onClick = vi.fn()
    const wrapper = create({ onClose, onClick })
    const sibling = create()
    await settle()
    expect(filters()).toHaveLength(0)
    await wrapper.find('button').trigger('click')
    await settle()
    const target = wrapper.find('.s-notification').element as HTMLElement
    expect(filters()).toHaveLength(1)
    expect(target.inert).toBe(true)
    expect(target.style.filter).toContain('sax-notification-dissolve')
    expect((sibling.element as HTMLElement).style.filter).toBe('')
    expect(onClick).not.toHaveBeenCalled()
    await wrapper.find('button').trigger('click')
    expect(onClose).not.toHaveBeenCalled()
    await advance(219)
    expect(target.style.display).not.toBe('none')
    await advance(220)
    expect(target.style.display).toBe('none')
    expect(filters()).toHaveLength(0)
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('destroy')).toHaveLength(1)
  })
  it('allows the close button to reject without allocating a filter', async () => {
    const wrapper = create({ onClickClose: () => false })
    await settle()
    await wrapper.find('button').trigger('click')
    expect(filters()).toHaveLength(0)
    expect(wrapper.vm.visible).toBe(true)
  })
  it.each([{ closeAnimation: false }, { closeAnimationDuration: 0 }])(
    'skips disabled motion %j',
    async (props) => {
      const onClose = vi.fn()
      const wrapper = create({ ...props, onClose })
      await settle()
      await wrapper.vm.close()
      await settle()
      expect(filters()).toHaveLength(0)
      expect(wrapper.vm.visible).toBe(false)
      expect(onClose).toHaveBeenCalledTimes(1)
    },
  )
  it('skips reduced motion without allocating a graph', async () => {
    reduced = true
    const wrapper = create()
    await settle()
    await wrapper.vm.close()
    await settle()
    expect(filters()).toHaveLength(0)
    expect(wrapper.vm.visible).toBe(false)
  })
  it('uses the same timeline for auto expiry and creates independent filter IDs', async () => {
    const first = create({
      duration: 100,
      closeAnimationDuration: 80,
      progressAuto: true,
    })
    const second = create({ closeAnimationDuration: 80 })
    await settle()
    await vi.advanceTimersByTimeAsync(100)
    second.vm.close()
    await settle()
    expect(filters()).toHaveLength(2)
    expect(new Set([...filters()].map((filter) => filter.id)).size).toBe(2)
    await advance(80)
    expect(first.vm.visible).toBe(false)
    expect(second.vm.visible).toBe(false)
    expect(filters()).toHaveLength(0)
    expect(vi.getTimerCount()).toBe(0)
  })
  it('cancels on reopen and allows a new close without stale callbacks', async () => {
    const onClose = vi.fn()
    const wrapper = create({ onClose })
    await settle()
    const closing = wrapper.vm.close()
    await settle()
    wrapper.vm.open()
    await settle()
    await closing
    expect(filters()).toHaveLength(0)
    expect(wrapper.vm.visible).toBe(true)
    expect((wrapper.element as HTMLElement).inert).toBeFalsy()
    expect((wrapper.element as HTMLElement).style.opacity).toBe('')
    expect(onClose).not.toHaveBeenCalled()
    const secondClose = wrapper.vm.close()
    await settle()
    await advance(220)
    await secondClose
    expect(onClose).toHaveBeenCalledTimes(1)
  })
  it('cleans up a pending timeline and timer on owner teardown', async () => {
    const onClose = vi.fn()
    const wrapper = create({ duration: 2000, progressAuto: true, onClose })
    await settle()
    const closing = wrapper.vm.close()
    await settle()
    wrapper.unmount()
    await closing
    await settle()
    expect(filters()).toHaveLength(0)
    expect(vi.getTimerCount()).toBe(0)
    expect(onClose).not.toHaveBeenCalled()
  })
  it('unmounts imperative instances after their close callback', async () => {
    const onClose = vi.fn()
    const handle = notify({
      duration: 0,
      closeAnimationDuration: 80,
      title: 'Imperative',
      onClose,
    })
    await settle()
    const target = document.querySelector('.s-notification')!
    expect(target).not.toBeNull()
    expect(filters()).toHaveLength(0)
    handle.close()
    await settle()
    expect(filters()).toHaveLength(1)
    await advance(80)
    expect(target.isConnected).toBe(false)
    expect(filters()).toHaveLength(0)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
