import { withInstall } from '@vuesax-alpha/utils'
import Empty from './src/empty.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SEmpty: SFCWithInstall<typeof Empty> = withInstall(Empty)
export default SEmpty

export * from './src/empty'
