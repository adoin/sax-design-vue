import { withInstall } from '@vuesax-alpha/utils'
import MessageScroller from './src/message-scroller.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SMessageScroller: SFCWithInstall<typeof MessageScroller> =
  withInstall(MessageScroller)
export default SMessageScroller
export * from './src/message-scroller'
