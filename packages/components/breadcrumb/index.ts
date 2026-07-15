import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Breadcrumb from './src/breadcrumb.vue'
import BreadcrumbItem from './src/breadcrumb-item.vue'

export const SBreadcrumb = withInstall(Breadcrumb, {
  BreadcrumbItem,
})
export const SBreadcrumbItem = withNoopInstall(BreadcrumbItem)
export default SBreadcrumb

export * from './src/breadcrumb'
export * from './src/breadcrumb-item'
