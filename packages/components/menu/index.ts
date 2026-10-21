import { withInstall } from '@vuesax-alpha/utils'
import Menu from './src/menu.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SMenu: SFCWithInstall<typeof Menu> = withInstall(Menu)
export default SMenu
export * from './src/menu'
