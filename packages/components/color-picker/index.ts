import { withInstall } from '@vuesax-alpha/utils'
import ColorPicker from './src/color-picker.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SColorPicker: SFCWithInstall<typeof ColorPicker> =
  withInstall(ColorPicker)
export default SColorPicker

export * from './src/color-picker'
