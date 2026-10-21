import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Layout from './src/layout.vue'
import LayoutContainer from './src/container.vue'
import LayoutHeader from './src/header.vue'
import LayoutAside from './src/aside.vue'
import LayoutBody from './src/body.vue'
import LayoutFooter from './src/footer.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SLayout: SFCWithInstall<
  typeof Layout,
  {
    LayoutContainer: typeof LayoutContainer
    LayoutHeader: typeof LayoutHeader
    LayoutAside: typeof LayoutAside
    LayoutBody: typeof LayoutBody
    LayoutFooter: typeof LayoutFooter
  }
> = withInstall(Layout, {
  LayoutContainer,
  LayoutHeader,
  LayoutAside,
  LayoutBody,
  LayoutFooter,
})

export const SLayoutContainer: SFCWithInstall<typeof LayoutContainer> =
  withNoopInstall(LayoutContainer)
export const SLayoutHeader: SFCWithInstall<typeof LayoutHeader> =
  withNoopInstall(LayoutHeader)
export const SLayoutAside: SFCWithInstall<typeof LayoutAside> =
  withNoopInstall(LayoutAside)
export const SLayoutBody: SFCWithInstall<typeof LayoutBody> =
  withNoopInstall(LayoutBody)
export const SLayoutFooter: SFCWithInstall<typeof LayoutFooter> =
  withNoopInstall(LayoutFooter)

export default SLayoutContainer

export * from './src/layout'
