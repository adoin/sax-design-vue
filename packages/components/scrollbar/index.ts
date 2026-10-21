import { withInstall } from '@vuesax-alpha/utils'

import Scrollbar from './src/scrollbar.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SScrollbar: SFCWithInstall<typeof Scrollbar> =
  withInstall(Scrollbar)
export default SScrollbar

export * from './src/util'
export * from './src/scrollbar'
export * from './src/thumb'
