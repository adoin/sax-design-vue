import { withInstall } from '@vuesax-alpha/utils'
import Skeleton from './src/skeleton.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SSkeleton: SFCWithInstall<typeof Skeleton> = withInstall(Skeleton)
export default SSkeleton
export * from './src/skeleton'
