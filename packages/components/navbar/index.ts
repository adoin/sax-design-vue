import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Navbar from './src/navbar.vue'
import NavbarItem from './src/navbar-item.vue'
import NavbarGroup from './src/navbar-group.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SNavbar: SFCWithInstall<
  typeof Navbar,
  { NavbarItem: typeof NavbarItem; NavbarGroup: typeof NavbarGroup }
> = withInstall(Navbar, {
  NavbarItem,
  NavbarGroup,
})
export default SNavbar

export const SNavbarItem: SFCWithInstall<typeof NavbarItem> =
  withNoopInstall(NavbarItem)
export const SNavbarGroup: SFCWithInstall<typeof NavbarGroup> =
  withNoopInstall(NavbarGroup)

export * from './src/navbar-group'
export * from './src/navbar-item'
export * from './src/navbar'
