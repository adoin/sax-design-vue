import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Tabs from './src/tabs.vue'
import Tab from './src/tab.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const STabs: SFCWithInstall<typeof Tabs, { Tab: typeof Tab }> =
  withInstall(Tabs, {
    Tab,
  })
export const STab: SFCWithInstall<typeof Tab> = withNoopInstall(Tab)
export default STabs

export * from './src/tabs'
export * from './src/tab'
export type {
  TabsRenderMode,
  TabLabelExtraSlotParams,
  TabValue,
  TabsSortDetail,
} from './src/constants'
