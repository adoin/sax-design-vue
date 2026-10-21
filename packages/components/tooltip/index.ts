import { withInstall } from '@vuesax-alpha/utils'
import Tooltip from './src/tooltip.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const STooltip: SFCWithInstall<typeof Tooltip> = withInstall(Tooltip)
export default STooltip

export * from './src/tooltip'
