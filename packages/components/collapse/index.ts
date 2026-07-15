import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Collapse from './src/collapse.vue'
import CollapseItem from './src/collapse-item.vue'

export const SCollapse = withInstall(Collapse, {
  CollapseItem,
})
export const SCollapseItem = withNoopInstall(CollapseItem)
export default SCollapse

export * from './src/collapse'
export * from './src/collapse-item'
