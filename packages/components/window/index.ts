import { withInstall } from '@vuesax-alpha/utils'
import Window from './src/window.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SWindow: SFCWithInstall<typeof Window> = withInstall(Window)
export default SWindow
export * from './src/window'
