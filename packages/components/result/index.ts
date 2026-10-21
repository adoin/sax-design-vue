import { withInstall } from '@vuesax-alpha/utils'
import Result from './src/result.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SResult: SFCWithInstall<typeof Result> = withInstall(Result)
export default SResult

export * from './src/result'
