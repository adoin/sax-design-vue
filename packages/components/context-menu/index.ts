import { withInstall } from '@vuesax-alpha/utils'
import ContextMenu from './src/context-menu.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SContextMenu: SFCWithInstall<typeof ContextMenu> =
  withInstall(ContextMenu)
export default SContextMenu
export * from './src/context-menu'
