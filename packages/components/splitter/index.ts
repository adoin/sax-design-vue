import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Splitter from './src/splitter.vue'
import SplitterItem from './src/splitter-item.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SSplitter: SFCWithInstall<
  typeof Splitter,
  { SplitterItem: typeof SplitterItem }
> = withInstall(Splitter, { SplitterItem })
export const SSplitterItem: SFCWithInstall<typeof SplitterItem> =
  withNoopInstall(SplitterItem)
export default SSplitter

export * from './src/splitter'
export * from './src/splitter-item'
