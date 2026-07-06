import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Collapse from './src/collapse.vue'
import CollapseItem from './src/collapse-item.vue'

export const VsCollapse = withInstall(Collapse, {
  CollapseItem,
})
export const VsCollapseItem = withNoopInstall(CollapseItem)
export default VsCollapse

export * from './src/collapse'
export * from './src/collapse-item'
