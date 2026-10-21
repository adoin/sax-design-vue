import { withInstall } from '@vuesax-alpha/utils'
import FocusTrap from './src/focus-trap.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SFocusTrap: SFCWithInstall<typeof FocusTrap> =
  withInstall(FocusTrap)
export default SFocusTrap

export * from './src/focus-trap'
