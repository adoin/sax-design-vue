import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Splitter from './src/splitter.vue'
import SplitterItem from './src/splitter-item.vue'

export const SSplitter = withInstall(Splitter, { SplitterItem })
export const SSplitterItem = withNoopInstall(SplitterItem)
export default SSplitter

export * from './src/splitter'
export * from './src/splitter-item'
