import { withInstall } from '@vuesax-alpha/utils'
import Input from './src/input.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SInput: SFCWithInstall<typeof Input> = withInstall(Input)
export default SInput

export * from './src/input'
