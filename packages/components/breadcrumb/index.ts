import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Breadcrumb from './src/breadcrumb.vue'
import BreadcrumbItem from './src/breadcrumb-item.vue'

export const VsBreadcrumb = withInstall(Breadcrumb, {
  BreadcrumbItem,
})
export const VsBreadcrumbItem = withNoopInstall(BreadcrumbItem)
export default VsBreadcrumb

export * from './src/breadcrumb'
export * from './src/breadcrumb-item'
