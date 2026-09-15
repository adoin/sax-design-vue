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

const readCloseDuration = () => {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue('--sax-motion-duration-quick')
    .trim()
  const duration = Number.parseFloat(value)
  if (!Number.isFinite(duration)) return 150
  return value.endsWith('ms') ? duration : duration * 1000
}

const normalizeOptions = (
  options: PromptBoxOptions | string = {},
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
          window.setTimeout(() => finish('close'), readCloseDuration())
        }
      },
      onAccept: () => {
        normalized.onAccept?.()
        window.setTimeout(() => finish('accept'), readCloseDuration())
      },
      onCancel: () => {
        normalized.onCancel?.()
        window.setTimeout(() => finish('cancel'), readCloseDuration())
      },
      onClose: () => {
        normalized.onClose?.()
        window.setTimeout(() => finish('close'), readCloseDuration())
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
