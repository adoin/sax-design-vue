import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Breadcrumb from './src/breadcrumb.vue'
import BreadcrumbItem from './src/breadcrumb-item.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SBreadcrumb: SFCWithInstall<
  typeof Breadcrumb,
  { BreadcrumbItem: typeof BreadcrumbItem }
> = withInstall(Breadcrumb, {
  BreadcrumbItem,
})
export const SBreadcrumbItem: SFCWithInstall<typeof BreadcrumbItem> =
  withNoopInstall(BreadcrumbItem)
export default SBreadcrumb

export * from './src/breadcrumb'
export * from './src/breadcrumb-item'
