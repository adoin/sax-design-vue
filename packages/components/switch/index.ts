import { withInstall } from '@vuesax-alpha/utils'
import Switch from './src/switch.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SSwitch: SFCWithInstall<typeof Switch> = withInstall(Switch)
export default SSwitch

export * from './src/switch'
