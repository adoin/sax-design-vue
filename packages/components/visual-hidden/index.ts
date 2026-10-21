import { withInstall } from '@vuesax-alpha/utils'
import VisualHidden from './src/visual-hidden.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SVisualHidden: SFCWithInstall<typeof VisualHidden> =
  withInstall(VisualHidden)
export default SVisualHidden

export * from './src/visual-hidden'
