import { withInstall } from '@vuesax-alpha/utils'
import Popper from './src/popper.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SPopper: SFCWithInstall<typeof Popper> = withInstall(Popper)
export default SPopper

export * from './src/popper'
export * from './src/trigger'
export * from './src/content'

export type { Placement as PopperPlacement } from '@vuesax-alpha/hooks/use-floating/vue'
