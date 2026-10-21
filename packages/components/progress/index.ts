import { withInstall } from '@vuesax-alpha/utils'
import Progress from './src/progress.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SProgress: SFCWithInstall<typeof Progress> = withInstall(Progress)
export default SProgress

export * from './src/progress'
