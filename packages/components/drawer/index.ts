import { withInstall } from '@vuesax-alpha/utils'
import Drawer from './src/drawer.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SDrawer: SFCWithInstall<typeof Drawer> = withInstall(Drawer)
export default SDrawer

export * from './src/drawer'
