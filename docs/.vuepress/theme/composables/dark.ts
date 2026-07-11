import { ref } from 'vue'
import { useDark, useToggle } from '@vueuse/core'

const isClient = typeof document !== 'undefined'

export const isDark = isClient
  ? useDark({
      storageKey: 'vuepress-color-scheme',
      attribute: 'class',
      valueDark: 'dark',
      valueLight: '',
    })
  : ref(false)

export const toggleDark: (value?: boolean) => boolean = isClient
  ? useToggle(isDark)
  : () => false
