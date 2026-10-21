import { withInstall } from '@vuesax-alpha/utils'
import VirtualList from './src/virtual-list.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SVirtualList: SFCWithInstall<typeof VirtualList> =
  withInstall(VirtualList)
export default SVirtualList

export * from './src/virtual-list'
