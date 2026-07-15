import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import List from './src/list.vue'
import ListItem from './src/list-item.vue'
import ListHeader from './src/list-header.vue'

export const SList = withInstall(List, {
  ListItem,
  ListHeader,
})
export const SListItem = withNoopInstall(ListItem)
export const SListHeader = withNoopInstall(ListHeader)
export default SList

export * from './src/list'
export * from './src/list-item'
export * from './src/list-header'
