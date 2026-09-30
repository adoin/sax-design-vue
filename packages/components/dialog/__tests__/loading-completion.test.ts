import { nextTick } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Dialog from '../src/dialog.vue'
import type { DialogExposes } from '../src/dialog'

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
const step = async (milliseconds = 40) => {
  clock += milliseconds
  const callbacks = [...frames.values()]
  frames.clear()
  callbacks.forEach((callback) => callback(clock))
  await settle()
}
const advance = async (count: number) => {
  for (let i = 0; i < count; i++) await step()
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
  vi.stubGlobal('cancelAnimationFrame', (id: number) => {
    frames.delete(id)
  })
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
const mountDialog = (props = {}) => {
  const wrapper = mount(Dialog, {
    attachTo: document.body,
    props: {
      modelValue: true,
      title: 'Motion',
      closeAnimation: false,
      ...props,
    },
  })
  wrappers.push(wrapper)
  return wrapper.vm as unknown as DialogExposes
}

describe('Dialog loading completion', () => {
  it.each([false, true])(
    'finishes the lead-in then clears four points before closing (minimized: %s)',
    async (minimized) => {
      let approve!: () => void
      const dialog = mountDialog({
        minimizable: true,
        beforeClose: () =>
          new Promise<void>((resolve) => {
            approve = resolve
          }),
      })
      await settle()
      if (minimized) dialog.minimize()
      await settle()
      const selector = minimized
        ? '.s-dialog__dock-close .s-logo-loading'
        : '.s-dialog__close .s-logo-loading'
      const closing = dialog.close()!
      await settle()
      await step()
      expect(document.querySelector(selector)?.getAttribute('data-phase')).toBe(
        'starting',
      )
      approve()
      await settle()
      expect(dialog.visible).toBe(true)
      expect(dialog.closePending).toBe(true)
      await advance(25)
      expect(document.querySelector(selector)?.getAttribute('data-phase')).toBe(
        'stopping',
      )
      expect(dialog.visible).toBe(true)
      // The compact tail is 550 / 2.5 = 220ms, not the logo restoration's 1360ms.
      await advance(4)
      expect(dialog.visible).toBe(true)
      await advance(2)
      expect(document.querySelector(selector)?.getAttribute('data-phase')).toBe(
        'idle',
      )
      expect(dialog.visible).toBe(true)
      await advance(1)
      expect(dialog.visible).toBe(true)
      await advance(1)
      await expect(closing).resolves.toBe(true)
      expect(dialog.visible).toBe(false)
    },
  )

  it('keeps the confirmation button alive through its full loader restoration', async () => {
    let approve!: () => void
    const dialog = mountDialog({
      showFooter: true,
      showConfirmButton: true,
      beforeConfirm: () =>
        new Promise<void>((resolve) => {
          approve = resolve
        }),
    })
    await settle()
    const confirming = dialog.confirm()!
    await settle()
    await step()
    expect(
      document
        .querySelector('.s-button .s-logo-loading')
        ?.getAttribute('data-phase'),
    ).toBe('starting')
    approve()
    await settle()
    expect(dialog.visible).toBe(true)
    expect(
      document.querySelector<HTMLButtonElement>('.s-dialog__actions button')
        ?.disabled,
    ).toBe(true)
    await advance(25)
    expect(
      document
        .querySelector('.s-button .s-logo-loading')
        ?.getAttribute('data-phase'),
    ).toBe('stopping')
    expect(dialog.visible).toBe(true)
    await advance(36)
    await confirming
    expect(dialog.visible).toBe(false)
  })

  it('skips a loader that has not painted for instant approval and adds no reduced-motion wait', async () => {
    const instant = mountDialog({ beforeClose: () => Promise.resolve() })
    await settle()
    await expect(instant.close()).resolves.toBe(true)
    expect(instant.visible).toBe(false)
    const instantConfirm = mountDialog({
      showFooter: true,
      showConfirmButton: true,
    })
    await settle()
    await instantConfirm.confirm()
    expect(instantConfirm.visible).toBe(false)
    reduced = true
    let approve!: () => void
    const dialog = mountDialog({
      beforeClose: () =>
        new Promise<void>((resolve) => {
          approve = resolve
        }),
    })
    await settle()
    const closing = dialog.close()!
    await settle()
    await step()
    expect(dialog.visible).toBe(true)
    approve()
    await settle()
    await expect(closing).resolves.toBe(true)
    expect(dialog.visible).toBe(false)
  })
  it('does not hang an approved close when the page becomes hidden during restoration', async () => {
    let approve!: () => void
    const dialog = mountDialog({
      beforeClose: () =>
        new Promise<void>((resolve) => {
          approve = resolve
        }),
    })
    await settle()
    const closing = dialog.close()!
    await settle()
    await step()
    approve()
    await settle()
    expect(dialog.visible).toBe(true)
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
    document.dispatchEvent(new Event('visibilitychange'))
    await settle()
    await expect(closing).resolves.toBe(true)
    expect(dialog.visible).toBe(false)
  })
})
