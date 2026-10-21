import { withInstall } from '@vuesax-alpha/utils'
import Countdown from './src/countdown.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SCountdown: SFCWithInstall<typeof Countdown> =
  withInstall(Countdown)
export default SCountdown
export * from './src/countdown'
