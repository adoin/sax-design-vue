import { defineComponent, onBeforeUnmount, renderSlot, watch } from 'vue'
import {
  applyThemeConfig,
  buildProps,
  definePropType,
} from '@vuesax-alpha/utils'
import { defaultNamespace, provideGlobalConfig } from '@vuesax-alpha/hooks'

import type { ExtractPropTypes } from 'vue'
import type { Language } from '@vuesax-alpha/locale'
import type { ColorProviderContext, ThemeConfig } from '@vuesax-alpha/constants'

export const configProviderProps = buildProps({
  /**
   * @description global Initial zIndex
   */
  zIndex: {
    type: Number,
  },
  /**
   * @description global component className prefix (cooperated with [$namespace](https://github.com/vuesax-alphax/vuesax-alpha/blob/main/packages/theme-chalk/src/mixins/config.scss#L1)) | ^[string]
   */
  namespace: {
    type: String,
    default: defaultNamespace,
  },
  color: {
    type: definePropType<ColorProviderContext>(Object),
  },
  theme: {
    type: definePropType<ThemeConfig>(Object),
  },
  /**
   * @description Locale Object
   */
  locale: {
    type: definePropType<Language>(Object),
  },
} as const)

export type ConfigProviderProps = ExtractPropTypes<typeof configProviderProps>

const ConfigProvider = defineComponent({
  name: 'SConfigProvider',
  props: configProviderProps,

  setup(props, { slots }) {
    const config = provideGlobalConfig(props)
    let restoreTheme: (() => void) | undefined

    if (typeof document !== 'undefined') {
      watch(
        () => props.theme,
        (theme) => {
          restoreTheme?.()
          restoreTheme = theme ? applyThemeConfig(theme) : undefined
        },
        { deep: true, immediate: true },
      )
    }

    onBeforeUnmount(() => restoreTheme?.())

    return () => renderSlot(slots, 'default', { config: config?.value })
  },
})

export type ConfigProviderInstance = InstanceType<typeof ConfigProvider>

export default ConfigProvider
