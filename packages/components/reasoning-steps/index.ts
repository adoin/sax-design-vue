import { withInstall } from '@vuesax-alpha/utils'
import ReasoningSteps from './src/reasoning-steps.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SReasoningSteps: SFCWithInstall<typeof ReasoningSteps> =
  withInstall(ReasoningSteps)
export default SReasoningSteps
export * from './src/reasoning-steps'
