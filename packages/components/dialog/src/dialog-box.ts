import { createVNode, nextTick, render } from 'vue'
import { isClient } from '@vuesax-alpha/utils'
import DialogSurface from './dialog-surface.vue'
import type { AppContext, VNodeChild } from 'vue'
import type { DialogProps } from './dialog'

export type DialogBoxAction = 'confirm' | 'cancel' | 'close'
export type DialogBoxOptions = Partial<
  Omit<
    DialogProps,
    'modelValue' | 'global' | 'content' | 'confirmClosable' | 'cancelClosable'
  >
> & {
  content?: string | number | (() => VNodeChild)
  onConfirmError?: (error: unknown) => void
  onConfirm?: () => void
  onCancel?: () => void
  onClose?: () => void
}
export interface DialogBoxFn {
  (options?: DialogBoxOptions | string): Promise<DialogBoxAction>
  alert: (
    content: string,
    title?: string,
    options?: DialogBoxOptions,
  ) => Promise<DialogBoxAction>
  confirm: (
    content: string,
    title?: string,
    options?: DialogBoxOptions,
  ) => Promise<true>
  _context?: AppContext | null
}

const dialogBox: DialogBoxFn = ((options: DialogBoxOptions | string = {}) => {
  if (!isClient) return Promise.resolve('close' as DialogBoxAction)
  const normalized =
    typeof options === 'string' ? { content: options } : options
  const { content, onConfirm, onCancel, onClose, beforeClose, ...settings } =
    normalized
  const host = document.createElement('div')
  host.dataset.sDialogService = ''
  document.body.appendChild(host)
  let action: DialogBoxAction = 'close'
  let settled = false
  return new Promise<DialogBoxAction>((resolve) => {
    const finish = () => {
      if (settled) return
      settled = true
      nextTick(() => {
        render(null, host)
        host.remove()
        resolve(action)
        if (action === 'confirm') onConfirm?.()
        else if (action === 'cancel') onCancel?.()
        else onClose?.()
      })
    }
    const vnode = createVNode(
      DialogSurface,
      {
        showFooter: true,
        showConfirmButton: true,
        showCancelButton: true,
        lockScroll: true,
        ...settings,
        modelValue: true,
        global: false,
        confirmClosable: true,
        cancelClosable: true,
        content: typeof content === 'function' ? undefined : content,
        beforeClose: beforeClose
          ? (done: (cancel?: boolean) => void) =>
              beforeClose((cancel) => {
                if (cancel) action = 'close'
                done(cancel)
              })
          : undefined,
        onConfirm: () => {
          action = 'confirm'
        },
        onCancel: () => {
          action = 'cancel'
        },
        onClosed: finish,
      },
      typeof content === 'function' ? { default: content } : undefined,
    )
    if (dialogBox._context) vnode.appContext = dialogBox._context
    try {
      render(vnode, host)
    } catch (error) {
      render(null, host)
      host.remove()
      throw error
    }
  })
}) as DialogBoxFn

dialogBox.alert = (content, title, options = {}) =>
  dialogBox({ ...options, content, title, showCancelButton: false })
dialogBox.confirm = (content, title, options = {}) =>
  dialogBox({ ...options, content, title }).then((action) => {
    if (action === 'confirm') return true as const
    return Promise.reject(action)
  })
export default dialogBox
