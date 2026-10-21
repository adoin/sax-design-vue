import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import List from './src/list.vue'
import ListItem from './src/list-item.vue'
import ListHeader from './src/list-header.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SList: SFCWithInstall<
  typeof List,
  { ListItem: typeof ListItem; ListHeader: typeof ListHeader }
> = withInstall(List, {
  ListItem,
  ListHeader,
})
export const SListItem: SFCWithInstall<typeof ListItem> =
  withNoopInstall(ListItem)
export const SListHeader: SFCWithInstall<typeof ListHeader> =
  withNoopInstall(ListHeader)
export default SList

export * from './src/list'
export * from './src/list-item'
export * from './src/list-header'
