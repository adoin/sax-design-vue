import { withInstall } from '@vuesax-alpha/utils'
import DatePicker from './src/date-picker.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SDatePicker: SFCWithInstall<typeof DatePicker> =
  withInstall(DatePicker)

export default SDatePicker

export * from './src/date-picker'
