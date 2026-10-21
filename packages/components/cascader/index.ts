import { withInstall } from '@vuesax-alpha/utils'
import Cascader from './src/cascader.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SCascader: SFCWithInstall<typeof Cascader> = withInstall(Cascader)
export default SCascader

export * from './src/cascader'
