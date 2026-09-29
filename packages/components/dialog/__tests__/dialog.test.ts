import { defineComponent, h, nextTick, onUnmounted, ref } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useGlobalConfig } from '@vuesax-alpha/hooks'
import Dialog from '../src/dialog.vue'
import dialogBox from '../src/dialog-box'
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

  it('validates once before confirmation and allows a rejected attempt to retry', async () => {
    let resolve!: (value: boolean) => void
    const beforeConfirm = vi.fn(
      () =>
        new Promise<boolean>((done) => {
          resolve = done
        }),
    )
    const wrapper = mountDialog({
      fullScreen: false,
      showFooter: true,
      showConfirmButton: true,
      beforeConfirm,
    })
    await settle()
    const dialog = wrapper.vm as unknown as DialogExposes
    await wrapper.setProps({ confirmDisabled: true })
    await dialog.confirm()
    expect(beforeConfirm).not.toHaveBeenCalled()
    await wrapper.setProps({ confirmDisabled: false })
    const first = dialog.confirm()!
    const second = dialog.confirm()!
    expect(beforeConfirm).toHaveBeenCalledTimes(1)
    resolve(false)
    await Promise.all([first, second])
    expect(dialog.visible).toBe(true)
    expect(wrapper.emitted('confirm')).toBeUndefined()
    const retry = dialog.confirm()!
    resolve(true)
    await retry
    expect(wrapper.emitted('confirm')).toHaveLength(1)
    expect(dialog.visible).toBe(false)
  })

  it('ignores stale async confirmation after closing and reports validation errors', async () => {
    let resolve!: (value: boolean) => void
    const wrapper = mountDialog({
      beforeConfirm: () =>
        new Promise<boolean>((done) => {
          resolve = done
        }),
    })
    await settle()
    const dialog = wrapper.vm as unknown as DialogExposes
    const pending = dialog.confirm()!
    dialog.close()
    resolve(true)
    await pending
    expect(wrapper.emitted('confirm')).toBeUndefined()
    const error = new Error('Validation failed')
    await wrapper.setProps({ modelValue: false })
    await wrapper.setProps({
      modelValue: true,
      beforeConfirm: () => Promise.reject(error),
    })
    await settle()
    await dialog.confirm()
    expect(wrapper.emitted('confirmError')?.at(-1)).toEqual([error])
    expect(dialog.visible).toBe(true)
  })

  it('resolves imperative results after disposal and rejects cancelled confirmation', async () => {
    const accepted = dialogBox({ title: 'Service test', content: 'Continue?' })
    await settle()
    const buttons = document.querySelectorAll<HTMLButtonElement>(
      '.s-dialog__actions button',
    )
    buttons[buttons.length - 1].click()
    await expect(accepted).resolves.toBe('confirm')
    expect(document.querySelector('[data-s-dialog-service]')).toBeNull()
    const cancelled = dialogBox
      .confirm('Continue?', 'Cancel test')
      .catch((action) => action)
    await settle()
    document
      .querySelector<HTMLButtonElement>('.s-dialog__actions button')!
      .click()
    await expect(cancelled).resolves.toBe('cancel')
    expect(document.querySelector('[data-s-dialog-service]')).toBeNull()
  })

  it('does not resolve an imperative confirmation when beforeClose denies it', async () => {
    let allowed = false
    const result = dialogBox({ beforeClose: (done) => done(!allowed) })
    await settle()
    const buttons = document.querySelectorAll<HTMLButtonElement>(
      '.s-dialog__actions button',
    )
    buttons[buttons.length - 1].click()
    await settle()
    expect(document.querySelector('[data-s-dialog-service]')).not.toBeNull()
    expect(document.querySelector('.s-dialog-original')).not.toBeNull()
    allowed = true
    document.querySelector<HTMLButtonElement>('.s-dialog__close')!.click()
    await expect(result).resolves.toBe('close')
    expect(document.querySelector('[data-s-dialog-service]')).toBeNull()
  })

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
