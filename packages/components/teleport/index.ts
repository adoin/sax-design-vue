import { withInstall } from '@vuesax-alpha/utils'
import Teleport from './src/teleport.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const STeleport: SFCWithInstall<typeof Teleport> = withInstall(Teleport)

export default STeleport

export * from './src/teleport'
