import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import List from './src/list.vue'
import ListItem from './src/list-item.vue'

export const VsList = withInstall(List, {
  ListItem,
})
export const VsListItem = withNoopInstall(ListItem)
export default VsList

export * from './src/list'
export * from './src/list-item'
