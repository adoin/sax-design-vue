import { createVNode, render } from 'vue'
import { isClient, isString } from '@vuesax-alpha/utils'
import PromptConstructor from './prompt.vue'
import type { PromptProps } from './prompt'
import type { SFCInstallWithContext } from '@vuesax-alpha/utils'

import '../style'

export type PromptBoxAction = 'accept' | 'cancel' | 'close'

export type PromptBoxOptions = Partial<
  Pick<
    PromptProps,
    | 'title'
    | 'text'
    | 'type'
    | 'color'
    | 'acceptText'
    | 'cancelText'
    | 'buttonAccept'
    | 'buttonCancel'
    | 'closeIcon'
    | 'iconPack'
    | 'isValid'
    | 'buttonsHidden'
  >
> & {
  onAccept?: () => void
  onCancel?: () => void
  onClose?: () => void
}

export interface PromptBoxFn {
  (options?: PromptBoxOptions | string): Promise<PromptBoxAction>
  alert: (text: string, title?: string) => Promise<PromptBoxAction>
  confirm: (text: string, title?: string) => Promise<true>
}

const TRANSITION_MS = 250

const normalizeOptions = (
  options: PromptBoxOptions | string = {}
): PromptBoxOptions =>
  isString(options) ? { text: options, type: 'alert' } : options

const promptBox = ((options?: PromptBoxOptions | string) => {
  if (!isClient) return Promise.resolve('close' as PromptBoxAction)

  const normalized = normalizeOptions(options)
  const container = document.createElement('div')
  document.body.appendChild(container)

  let settled = false

  return new Promise<PromptBoxAction>((resolve) => {
    const finish = (action: PromptBoxAction) => {
      if (settled) return
      settled = true
      render(null, container)
      container.remove()
      resolve(action)
    }

    const props = {
      ...normalized,
      modelValue: true,
      'onUpdate:modelValue': (visible: boolean) => {
        if (!visible) {
          window.setTimeout(() => finish('close'), TRANSITION_MS)
        }
      },
      onAccept: () => {
        normalized.onAccept?.()
        window.setTimeout(() => finish('accept'), TRANSITION_MS)
      },
      onCancel: () => {
        normalized.onCancel?.()
        window.setTimeout(() => finish('cancel'), TRANSITION_MS)
      },
      onClose: () => {
        normalized.onClose?.()
        window.setTimeout(() => finish('close'), TRANSITION_MS)
      },
    }

    const vm = createVNode(PromptConstructor, props)
    const context = (promptBox as SFCInstallWithContext<PromptBoxFn>)._context
    if (context) {
      vm.appContext = context
    }
    render(vm, container)
  })
}) as PromptBoxFn

promptBox.alert = (text: string, title = 'Notice') =>
  promptBox({ text, title, type: 'alert' })

promptBox.confirm = (text: string, title = 'Confirm') =>
  promptBox({ text, title, type: 'confirm' }).then((action) => {
    if (action === 'accept') return true as const
    return Promise.reject(action)
  })

export default promptBox
