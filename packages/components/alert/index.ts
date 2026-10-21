import { withInstall } from '@vuesax-alpha/utils'

import Alert from './src/alert.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SAlert: SFCWithInstall<typeof Alert> = withInstall(Alert)
export default SAlert

export * from './src/alert'
