import { withInstall } from '@vuesax-alpha/utils'
import VerificationCode from './src/verification-code.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SVerificationCode: SFCWithInstall<typeof VerificationCode> =
  withInstall(VerificationCode)
export default SVerificationCode
export * from './src/verification-code'
