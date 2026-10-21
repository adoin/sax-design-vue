import { withInstall } from '@vuesax-alpha/utils'
import SvgFilterAnimation from './src/svg-filter-animation.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SSvgFilterAnimation: SFCWithInstall<typeof SvgFilterAnimation> =
  withInstall(SvgFilterAnimation)
