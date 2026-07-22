import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Radio from './src/radio.vue'
import RadioGroup from './src/radio-group.vue'

export const SRadio = withInstall(Radio, { RadioGroup })
export const SRadioGroup = withNoopInstall(RadioGroup)
export default SRadio

export * from './src/radio'
export * from './src/radio-group'
