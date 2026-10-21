import { withInstall } from '@vuesax-alpha/utils'
import Spacer from './src/spacer.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SSpacer: SFCWithInstall<typeof Spacer> = withInstall(Spacer)
export default SSpacer

export * from './src/spacer'
