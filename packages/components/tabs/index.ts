import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Tabs from './src/tabs.vue'
import Tab from './src/tab.vue'

export const STabs = withInstall(Tabs, {
  Tab,
})
export const STab = withNoopInstall(Tab)
export default STabs

export * from './src/tabs'
export * from './src/tab'
