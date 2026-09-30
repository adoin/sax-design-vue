import { withInstall } from '@vuesax-alpha/utils'
import TimePicker from './src/time-picker.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const STimePicker: SFCWithInstall<typeof TimePicker> =
  withInstall(TimePicker)

export default STimePicker

export * from './src/time-picker'
