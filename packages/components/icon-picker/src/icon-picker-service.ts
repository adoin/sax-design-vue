import { createVNode, render } from 'vue'
import { SConfigProvider } from '@vuesax-alpha/components/config-provider'
import { isClient } from '@vuesax-alpha/utils'
import IconPickerConstructor from './icon-picker.vue'
import type {
  IconPickerCodeOptions,
  IconPickerCodeResult,
  IconPickerOptions,
  IconPickerResult,
  IconPickerSelection,
  IconPickerSvgOptions,
} from './icon-picker'
import type { SFCInstallWithContext } from '@vuesax-alpha/utils'

import '../style'

export interface IconPickerFn {
  (options: IconPickerCodeOptions): Promise<IconPickerCodeResult | undefined>
  (options?: IconPickerSvgOptions): Promise<string | undefined>
  (options: IconPickerOptions): Promise<IconPickerResult | undefined>
}

let closeActive: (() => void) | undefined

const iconPicker = ((options: IconPickerOptions = {}) => {
  if (!isClient) return Promise.resolve(undefined)

  closeActive?.()
  const container = document.createElement('div')
  document.body.appendChild(container)

  return new Promise<IconPickerResult | undefined>((resolve) => {
    let result: IconPickerResult | undefined
    let settled = false

    const finish = () => {
      if (settled) return
      settled = true
      if (closeActive === finish) closeActive = undefined
      render(null, container)
      container.remove()
      resolve(result)
    }

    closeActive = finish
    const { locale, output = 'svg', ...dialogOptions } = options
    const vm = createVNode(
      SConfigProvider,
      { locale },
      {
        default: () =>
          createVNode(IconPickerConstructor, {
            ...dialogOptions,
            locale,
            output,
            onConfirm: (selection: IconPickerSelection) => {
              result =
                output === 'code'
                  ? {
                      code: selection.code,
                      color: selection.color,
                      size: selection.size,
                    }
                  : selection.svg
            },
            onCancel: () => (result = undefined),
            onClosed: finish,
          }),
      },
    )
    const context = (iconPicker as SFCInstallWithContext<IconPickerFn>)._context
    if (context) vm.appContext = context
    render(vm, container)
  })
}) as IconPickerFn

export default iconPicker
