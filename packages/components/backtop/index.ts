import { withInstall } from '@vuesax-alpha/utils'
import Backtop from './src/backtop.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SBacktop: SFCWithInstall<typeof Backtop> = withInstall(Backtop)
export default SBacktop

export * from './src/backtop'
