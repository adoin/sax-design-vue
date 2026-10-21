import { withInstall } from '@vuesax-alpha/utils'
import Popconfirm from './src/popconfirm.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SPopconfirm: SFCWithInstall<typeof Popconfirm> =
  withInstall(Popconfirm)
export default SPopconfirm

export * from './src/popconfirm'
