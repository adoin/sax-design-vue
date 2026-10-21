import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Collapse from './src/collapse.vue'
import CollapseItem from './src/collapse-item.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SCollapse: SFCWithInstall<
  typeof Collapse,
  { CollapseItem: typeof CollapseItem }
> = withInstall(Collapse, {
  CollapseItem,
})
export const SCollapseItem: SFCWithInstall<typeof CollapseItem> =
  withNoopInstall(CollapseItem)
export default SCollapse

export * from './src/collapse'
export * from './src/collapse-item'
