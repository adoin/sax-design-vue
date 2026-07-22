import { withInstall } from '@vuesax-alpha/utils'
import LayoutContainer from './src/container.vue'
import LayoutHeader from './src/header.vue'
import LayoutAside from './src/aside.vue'
import LayoutBody from './src/body.vue'
import LayoutFooter from './src/footer.vue'

export const SLayoutContainer = withInstall(LayoutContainer)
export const SLayoutHeader = withInstall(LayoutHeader)
export const SLayoutAside = withInstall(LayoutAside)
export const SLayoutBody = withInstall(LayoutBody)
export const SLayoutFooter = withInstall(LayoutFooter)

export default SLayoutContainer

export * from './src/layout'
