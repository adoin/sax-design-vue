import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Radio from './src/radio.vue'
import RadioGroup from './src/radio-group.vue'
import RadioGroupTabs from './src/radio-group-tabs.vue'

export const SRadio = withInstall(Radio, { RadioGroup, RadioGroupTabs })
export const SRadioGroup = withNoopInstall(RadioGroup)
export const SRadioGroupTabs = withNoopInstall(RadioGroupTabs)
export default SRadio

export * from './src/radio'
export * from './src/radio-group'
export * from './src/radio-group-tabs'
