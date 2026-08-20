import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Layout from './src/layout.vue'
import LayoutContainer from './src/container.vue'
import LayoutHeader from './src/header.vue'
import LayoutAside from './src/aside.vue'
import LayoutBody from './src/body.vue'
import LayoutFooter from './src/footer.vue'

export const SLayout = withInstall(Layout, {
  LayoutContainer,
  LayoutHeader,
  LayoutAside,
  LayoutBody,
  LayoutFooter,
})

export const SLayoutContainer = withNoopInstall(LayoutContainer)
export const SLayoutHeader = withNoopInstall(LayoutHeader)
export const SLayoutAside = withNoopInstall(LayoutAside)
export const SLayoutBody = withNoopInstall(LayoutBody)
export const SLayoutFooter = withNoopInstall(LayoutFooter)

export default SLayoutContainer

export * from './src/layout'
