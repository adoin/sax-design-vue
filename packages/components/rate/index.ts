import { withInstall } from '@vuesax-alpha/utils'

import Rate from './src/rate.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SRate: SFCWithInstall<typeof Rate> = withInstall(Rate)
export default SRate

export * from './src/rate'
