import { withInstall } from '@vuesax-alpha/utils'
import ControlGroup from './src/control-group.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SControlGroup: SFCWithInstall<typeof ControlGroup> =
  withInstall(ControlGroup)
export default SControlGroup

export * from './src/control-group'
