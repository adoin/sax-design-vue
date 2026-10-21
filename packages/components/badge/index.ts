import { withInstall } from '@vuesax-alpha/utils'
import Badge from './src/badge.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SBadge: SFCWithInstall<typeof Badge> = withInstall(Badge)
export default SBadge

export * from './src/badge'
