import { createVNode, render } from 'vue'
import { SConfigProvider } from '@vuesax-alpha/components/config-provider'
import { isClient } from '@vuesax-alpha/utils'
import IconPickerConstructor from './icon-picker.vue'
import type { IconPickerOptions } from './icon-picker'
import type { SFCInstallWithContext } from '@vuesax-alpha/utils'

import '../style'

export interface IconPickerFn {
  (options?: IconPickerOptions): Promise<string | undefined>
}

let closeActive: (() => void) | undefined

const iconPicker = ((options: IconPickerOptions = {}) => {
  if (!isClient) return Promise.resolve(undefined)

  closeActive?.()
  const container = document.createElement('div')
  document.body.appendChild(container)

  return new Promise<string | undefined>((resolve) => {
    let result: string | undefined
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
    const { locale, ...dialogOptions } = options
    const vm = createVNode(
      SConfigProvider,
      { locale },
      {
        default: () =>
          createVNode(IconPickerConstructor, {
            ...dialogOptions,
            locale,
            onConfirm: (svg: string) => (result = svg),
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
