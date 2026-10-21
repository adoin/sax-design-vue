import { withInstall } from '@vuesax-alpha/utils'
import Steps from './src/steps.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SSteps: SFCWithInstall<typeof Steps> = withInstall(Steps)
export default SSteps

export * from './src/steps'
