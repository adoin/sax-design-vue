import { defineComponent, h, nextTick, onUnmounted, ref } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useGlobalConfig } from '@vuesax-alpha/hooks'
import Dialog from '../src/dialog.vue'
import ConfigProvider from '../../config-provider/src/config-provider'
import type { DialogExposes } from '../src/dialog'

const originalConfig = useGlobalConfig().value
beforeEach(() => {
  useGlobalConfig().value = {}
})

const settle = async () => {
  await nextTick()
  await flushPromises()
  await nextTick()
}
const wrappers: { unmount(): void }[] = []
const mountDialog = (props = {}, slots = {}) => {
  const wrapper = mount(Dialog, {
    attachTo: document.body,
    props: { modelValue: true, fullScreen: true, title: 'Draft', ...props },
    slots,
    global: { stubs: { transition: false } },
  })
  wrappers.push(wrapper)
  return wrapper
}
afterEach(async () => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount())
  for (const button of document.querySelectorAll<HTMLButtonElement>(
    '.s-dialog__dock-close, .s-dialog__close',
  ))
    button.click()
  await vi.waitFor(() =>
    expect(document.querySelectorAll('[data-s-dialog-host]')).toHaveLength(0),
  )
  await new Promise((resolve) => setTimeout(resolve, 220))
  useGlobalConfig().value = originalConfig
})

describe('Dialog minimization and ownership', () => {
  it.each([false, true])(
    'inherits shape and dialog defaults with global=%s',
    async (global) => {
      const wrapper = mount(ConfigProvider, {
        attachTo: document.body,
        props: { shape: 'square', dialog: { showClose: false } },
        slots: {
          default: () =>
            h(Dialog, {
              global,
              modelValue: true,
              fullScreen: true,
              title: 'Configured',
            }),
        },
      })
      wrappers.push(wrapper)
      await settle()
      expect(
        document
          .querySelector('.s-dialog-original')
          ?.classList.contains('s-dialog--square'),
      ).toBe(true)
      expect(document.querySelector('.s-dialog__close')).toBeNull()
      document.querySelector<HTMLButtonElement>('.s-dialog__minimize')!.click()
      await settle()
      expect(
        document
          .querySelector('.s-dialog__minimized')
          ?.classList.contains('is-square'),
      ).toBe(true)
      document
        .querySelector<HTMLButtonElement>('.s-dialog__dock-close')!
        .click()
      await vi.waitFor(() =>
        expect(document.querySelector('.s-dialog__minimized')).toBeNull(),
      )
    },
  )

  it('retains content state while minimized without closing the model', async () => {
    const unmounted = vi.fn()
    const Content = defineComponent({
      setup() {
        const count = ref(0)
        onUnmounted(unmounted)
        return () =>
          h(
            'button',
            { class: 'draft-counter', onClick: () => count.value++ },
            String(count.value),
          )
      },
    })
    const wrapper = mountDialog({}, { default: () => h(Content) })
    await settle()
    document.querySelector<HTMLButtonElement>('.draft-counter')!.click()
    document.querySelector<HTMLButtonElement>('.s-dialog__minimize')!.click()
    await settle()
    expect(
      document.querySelector<HTMLElement>('.s-dialog')!.style.display,
    ).toBe('none')
    expect(
      document.querySelector('.s-dialog__minimized')?.textContent,
    ).toContain('Draft')
    expect(unmounted).not.toHaveBeenCalled()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    document.querySelector<HTMLButtonElement>('.s-dialog__restore')!.click()
    await settle()
    expect(document.querySelector('.draft-counter')?.textContent).toBe('1')
    expect(document.querySelector('.s-dialog__minimized')).toBeNull()
  })

  it('removes a local minimized dialog with its owner', async () => {
    const wrapper = mountDialog()
    await settle()
    ;(wrapper.vm as unknown as DialogExposes).minimize()
    await settle()
    expect(document.querySelector('.s-dialog__minimized')).not.toBeNull()
    wrapper.unmount()
    wrappers.splice(wrappers.indexOf(wrapper), 1)
    await settle()
    expect(document.querySelector('.s-dialog__minimized')).toBeNull()
    expect(document.querySelector('.s-dialog__dock')).toBeNull()
  })

  it('keeps a global instance and callbacks alive, restores it, and disposes it on close', async () => {
    const onClosed = vi.fn()
    const cleanup = vi.fn()
    const Content = defineComponent({
      setup() {
        onUnmounted(cleanup)
        return () => h('div', 'Persisted content')
      },
    })
    const wrapper = mountDialog(
      { global: true, lockScroll: true, onClosed },
      { default: () => h(Content) },
    )
    await settle()
    ;(wrapper.vm as unknown as DialogExposes).minimize()
    await settle()
    wrapper.unmount()
    wrappers.splice(wrappers.indexOf(wrapper), 1)
    await settle()
    expect(cleanup).not.toHaveBeenCalled()
    document.querySelector<HTMLButtonElement>('.s-dialog__restore')!.click()
    await settle()
    expect(document.querySelector('.s-dialog-original')?.textContent).toContain(
      'Persisted content',
    )
    document.querySelector<HTMLButtonElement>('.s-dialog__close')!.click()
    await vi.waitFor(() => expect(onClosed).toHaveBeenCalledTimes(1))
    await vi.waitFor(() => expect(cleanup).toHaveBeenCalledTimes(1))
    expect(document.querySelector('[data-s-dialog-host]')).toBeNull()
    await vi.waitFor(() =>
      expect(document.body.classList.contains('s-popup-parent--hidden')).toBe(
        false,
      ),
    )
  })

  it('respects beforeClose on the bubble and removes unused hidden global hosts', async () => {
    const wrapper = mountDialog({
      global: true,
      beforeClose: (done: (cancel?: boolean) => void) => done(true),
    })
    await settle()
    ;(wrapper.vm as unknown as DialogExposes).minimize()
    await settle()
    document.querySelector<HTMLButtonElement>('.s-dialog__dock-close')!.click()
    await settle()
    expect(document.querySelector('.s-dialog__minimized')).not.toBeNull()
    await wrapper.setProps({ beforeClose: undefined })
    await settle()
    document.querySelector<HTMLButtonElement>('.s-dialog__dock-close')!.click()
    await vi.waitFor(() =>
      expect(document.querySelector('.s-dialog__minimized')).toBeNull(),
    )
    wrapper.unmount()
    wrappers.splice(wrappers.indexOf(wrapper), 1)
    const hidden = mountDialog({ global: true, modelValue: false })
    await settle()
    hidden.unmount()
    wrappers.splice(wrappers.indexOf(hidden), 1)
    await settle()
    expect(document.querySelectorAll('[data-s-dialog-host]')).toHaveLength(0)
  })

  it('keeps other dialogs locked and handles Escape after minimizing the top dialog', async () => {
    const first = mountDialog({ lockScroll: true, title: 'First' })
    const second = mountDialog({ lockScroll: true, title: 'Second' })
    await settle()
    ;(second.vm as unknown as DialogExposes).minimize()
    await settle()
    await new Promise((resolve) => setTimeout(resolve, 220))
    expect(document.body.classList.contains('s-popup-parent--hidden')).toBe(
      true,
    )
    document.dispatchEvent(
      new KeyboardEvent('keydown', { code: 'Escape', bubbles: true }),
    )
    await vi.waitFor(() =>
      expect((first.vm as unknown as DialogExposes).visible).toBe(false),
    )
    expect((second.vm as unknown as DialogExposes).minimized).toBe(true)
    await vi.waitFor(() =>
      expect(document.body.classList.contains('s-popup-parent--hidden')).toBe(
        false,
      ),
    )
  })
})
