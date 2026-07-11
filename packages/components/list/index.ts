import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import List from './src/list.vue'
import ListItem from './src/list-item.vue'
import ListHeader from './src/list-header.vue'

export const VsList = withInstall(List, {
  ListItem,
  ListHeader,
})
export const VsListItem = withNoopInstall(ListItem)
export const VsListHeader = withNoopInstall(ListHeader)
export default VsList

export * from './src/list'
export * from './src/list-item'
export * from './src/list-header'
