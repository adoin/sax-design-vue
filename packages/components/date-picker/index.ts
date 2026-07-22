import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import DatePicker from './src/date-picker.vue'
import DatePanel from './src/date-panel.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SDatePicker: SFCWithInstall<typeof DatePicker> = withInstall(
  DatePicker,
  { DatePanel },
)
export const SDatePanel = withNoopInstall(DatePanel)

export default SDatePicker

export * from './src/date-picker'
