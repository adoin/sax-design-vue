import { withInstall } from '@vuesax-alpha/utils'
import InputNumber from './src/input-number.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SInputNumber: SFCWithInstall<typeof InputNumber> =
  withInstall(InputNumber)
export default SInputNumber

export * from './src/input-number'
