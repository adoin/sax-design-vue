import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Navbar from './src/navbar.vue'
import NavbarItem from './src/navbar-item.vue'
import NavbarGroup from './src/navbar-group.vue'

export const SNavbar = withInstall(Navbar, {
  NavbarItem,
  NavbarGroup,
})
export default SNavbar

export const SNavbarItem = withNoopInstall(NavbarItem)
export const SNavbarGroup = withNoopInstall(NavbarGroup)

export * from './src/navbar-group'
export * from './src/navbar-item'
export * from './src/navbar'
