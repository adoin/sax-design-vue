import { withInstall } from '@vuesax-alpha/utils'
import InlineCitations from './src/inline-citations.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SInlineCitations: SFCWithInstall<typeof InlineCitations> =
  withInstall(InlineCitations)
export default SInlineCitations
export * from './src/inline-citations'
