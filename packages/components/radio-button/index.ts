import { withInstall } from '@vuesax-alpha/utils'
import RadioButton from './src/radio-button.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SRadioButton: SFCWithInstall<typeof RadioButton> =
  withInstall(RadioButton)
export default SRadioButton
export * from './src/radio-button'
