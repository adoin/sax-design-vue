import { withInstall } from '@vuesax-alpha/utils'
import TimeSelect from './src/time-select.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const STimeSelect: SFCWithInstall<typeof TimeSelect> =
  withInstall(TimeSelect)

export default STimeSelect

export * from './src/time-select'
