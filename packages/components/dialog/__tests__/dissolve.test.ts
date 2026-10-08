import { h, nextTick } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useGlobalConfig } from '@vuesax-alpha/hooks'
import Dialog from '../src/dialog.vue'
import ConfigProvider from '../../config-provider/src/config-provider'
import type { DialogExposes } from '../src/dialog'

let clock = 0
let id = 0
let frames: Map<number, FrameRequestCallback>
let reduced = false
const originalConfig = useGlobalConfig().value
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
beforeEach(() => {
  useGlobalConfig().value = {}
  clock = 0
  id = 0
  reduced = false
  frames = new Map()
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
  await advance(clock + 16)
  await advance(clock + 16)
  useGlobalConfig().value = originalConfig
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
const create = (props = {}) => {
  const wrapper = mount(Dialog, {
    props: { modelValue: true, title: 'Dissolve', ...props },
    attachTo: document.body,
  })
  wrappers.push(wrapper)
  return wrapper
}

describe('Dialog surface dissolve', () => {
  it('allocates no particle graphs for 100 idle dialog instances or pending approval', async () => {
    const host = mount(
      {
        render: () =>
          h(
            'div',
            Array.from({ length: 100 }, () => h(Dialog, { modelValue: false })),
          ),
      },
      { attachTo: document.body },
    )
    wrappers.push(host)
    await settle()
    expect(
      document.querySelectorAll('filter[id^="sax-dialog-dissolve"]'),
    ).toHaveLength(0)
    let approve!: () => void
    const wrapper = create({
      beforeClose: () =>
        new Promise<void>((resolve) => {
          approve = resolve
        }),
    })
    const dialog = wrapper.vm as unknown as DialogExposes
    await settle()
    const closing = dialog.close()!
    await settle()
    expect(
      document.querySelectorAll('filter[id^="sax-dialog-dissolve"]'),
    ).toHaveLength(0)
    approve()
    await settle()
    expect(
      document.querySelectorAll('filter[id^="sax-dialog-dissolve"]'),
    ).toHaveLength(1)
    await advance(220)
    await expect(closing).resolves.toBe(true)
    expect(
      document.querySelectorAll('filter[id^="sax-dialog-dissolve"]'),
    ).toHaveLength(0)
  })
  it.each([60, 0])(
    'honors %sms and removes the mask without another transition tail',
    async (duration) => {
      const wrapper = mount(Dialog, {
        attachTo: document.body,
        props: { modelValue: true, closeAnimationDuration: duration },
        global: { stubs: { transition: false } },
      })
      wrappers.push(wrapper)
      const dialog = wrapper.vm as unknown as DialogExposes
      await settle()
      const mask = document.querySelector<HTMLElement>('.s-dialog')!
      expect(
        document.querySelectorAll('filter[id^="sax-dialog-dissolve"]'),
      ).toHaveLength(0)
      const closing = dialog.close()!
      await settle()
      if (duration) {
        await advance(duration - 1)
        expect(mask.isConnected).toBe(true)
        expect(dialog.visible).toBe(true)
        await advance(duration)
      }
      await expect(closing).resolves.toBe(true)
      expect(mask.isConnected).toBe(false)
      expect(wrapper.emitted('closed')).toHaveLength(1)
      expect(
        document.querySelectorAll('filter[id^="sax-dialog-dissolve"]'),
      ).toHaveLength(0)
    },
  )

  it('inherits animation opt-out from ConfigProvider', async () => {
    const wrapper = mount(ConfigProvider, {
      attachTo: document.body,
      props: { dialog: { closeAnimation: false } },
      slots: {
        default: () => h(Dialog, { modelValue: true, title: 'Configured' }),
      },
    })
    wrappers.push(wrapper)
    await settle()
    const dialog = wrapper.findComponent(Dialog).vm.$.exposed!
    await expect(dialog.close()).resolves.toBe(true)
    expect(dialog.visible.value).toBe(false)
  })
  it.each([false, true])(
    'filters only the approved close target (minimized: %s)',
    async (minimized) => {
      const wrapper = create({
        minimizable: true,
        beforeClose: () => Promise.resolve(),
      })
      const dialog = wrapper.vm as unknown as DialogExposes
      await settle()
      if (minimized) dialog.minimize()
      await settle()
      const surface = document.querySelector<HTMLElement>('.s-dialog')!
      const target = document.querySelector<HTMLElement>(
        minimized ? '.s-dialog__minimized' : '.s-dialog-original',
      )!
      const closing = dialog.close()!
      await settle()
      expect(target.style.filter).toContain('sax-dialog-dissolve')
      expect(target.inert).toBe(true)
      expect(surface.style.filter).toBe('')
      expect(surface.style.opacity).toBe('')
      await advance(160)
      expect(dialog.visible).toBe(true)
      expect(dialog.closePending).toBe(true)
      expect(
        Number(
          document
            .querySelector('[data-dissolve-threshold]')!
            .getAttribute('intercept'),
        ),
      ).toBeLessThan(1)
      await advance(220)
      await expect(closing).resolves.toBe(true)
      expect(dialog.visible).toBe(false)
    },
  )

  it('does not dissolve rejected closing, or explicit animation opt-out', async () => {
    const rejected = create({ beforeClose: () => Promise.reject('Keep it') })
    await settle()
    await expect(
      (rejected.vm as unknown as DialogExposes).close(),
    ).resolves.toBe(false)
    expect(
      document.querySelectorAll('filter[id^="sax-dialog-dissolve"]'),
    ).toHaveLength(0)
    expect(
      document.querySelector<HTMLElement>('.s-dialog-original')!.style.filter,
    ).toBe('')
    expect(
      document.querySelectorAll('filter[id^="sax-dialog-dissolve"]'),
    ).toHaveLength(0)
    rejected.unmount()
    wrappers.splice(wrappers.indexOf(rejected), 1)
    const disabled = create({ closeAnimation: false })
    await settle()
    await expect(
      (disabled.vm as unknown as DialogExposes).close(),
    ).resolves.toBe(true)
    expect((disabled.vm as unknown as DialogExposes).visible).toBe(false)
  })

  it('keeps instance filters separate and cancels stale exits on reopening', async () => {
    const first = create()
    const second = create({ global: true })
    const a = first.vm as unknown as DialogExposes
    await settle()
    expect(
      document.querySelectorAll('filter[id^="sax-dialog-dissolve"]'),
    ).toHaveLength(0)
    const closing = a.close()!
    await settle()
    const secondClose = (second.vm as unknown as DialogExposes).close()!
    await settle()
    const filters = [
      ...document.querySelectorAll('filter[id^="sax-dialog-dissolve"]'),
    ]
    expect(filters).toHaveLength(2)
    expect(new Set(filters.map((node) => node.id)).size).toBe(2)
    await advance(160)
    a.open()
    await settle()
    await expect(closing).resolves.toBe(false)
    expect(a.visible).toBe(true)
    expect(
      document.querySelector<HTMLElement>('.s-dialog-original')!.style.filter,
    ).toBe('')
    expect(filters[0].isConnected).toBe(false)
    await advance(480)
    await secondClose
    expect(
      document.querySelectorAll('filter[id^="sax-dialog-dissolve"]'),
    ).toHaveLength(0)
  })

  it('allows confirmation again when reopened during its dissolve', async () => {
    const wrapper = create({ showFooter: true, showConfirmButton: true })
    const dialog = wrapper.vm as unknown as DialogExposes
    await settle()
    const confirming = dialog.confirm()!
    await settle()
    await advance(100)
    dialog.open()
    await settle()
    await confirming
    expect(
      document.querySelector<HTMLButtonElement>('.s-dialog__actions button')!
        .disabled,
    ).toBe(false)
    const retry = dialog.confirm()!
    await settle()
    await advance(580)
    await retry
    expect(wrapper.emitted('confirm')).toHaveLength(2)
    expect(dialog.visible).toBe(false)
  })

  it('settles hidden-page closing at zero alpha', async () => {
    const wrapper = create()
    const dialog = wrapper.vm as unknown as DialogExposes
    await settle()
    const closing = dialog.close()!
    await settle()
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
    document.dispatchEvent(new Event('visibilitychange'))
    await settle()
    await expect(closing).resolves.toBe(true)
    expect(
      document.querySelector('filter[id^="sax-dialog-dissolve"]'),
    ).toBeNull()
  })
  it('cancels an in-flight dissolve on owner teardown', async () => {
    const wrapper = create()
    const dialog = wrapper.vm as unknown as DialogExposes
    await settle()
    const closing = dialog.close()!
    await settle()
    await advance(100)
    wrapper.unmount()
    wrappers.splice(wrappers.indexOf(wrapper), 1)
    await expect(closing).resolves.toBe(false)
    expect(
      document.querySelector('filter[id^="sax-dialog-dissolve"]'),
    ).toBeNull()
    await advance(600)
    await advance(616)
    expect(document.querySelector('.s-dialog-original')).toBeNull()
  })
})
