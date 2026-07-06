import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Tabs from './src/tabs.vue'
import Tab from './src/tab.vue'

export const VsTabs = withInstall(Tabs, {
  Tab,
})
export const VsTab = withNoopInstall(Tab)
export default VsTabs

export * from './src/tabs'
export * from './src/tab'
