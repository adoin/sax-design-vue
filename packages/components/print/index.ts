import { withInstall } from '@vuesax-alpha/utils'
import Print from './src/print.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SPrint: SFCWithInstall<typeof Print> = withInstall(Print)
export default SPrint
export * from './src/print'
