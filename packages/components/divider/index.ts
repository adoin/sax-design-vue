import { withInstall } from '@vuesax-alpha/utils'
import Divider from './src/divider.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SDivider: SFCWithInstall<typeof Divider> = withInstall(Divider)
export default SDivider

export * from './src/divider'
