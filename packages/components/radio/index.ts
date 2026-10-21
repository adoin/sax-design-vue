import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Radio from './src/radio.vue'
import RadioGroup from './src/radio-group.vue'
import RadioGroupTabs from './src/radio-group-tabs.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SRadio: SFCWithInstall<
  typeof Radio,
  { RadioGroup: typeof RadioGroup; RadioGroupTabs: typeof RadioGroupTabs }
> = withInstall(Radio, { RadioGroup, RadioGroupTabs })
export const SRadioGroup: SFCWithInstall<typeof RadioGroup> =
  withNoopInstall(RadioGroup)
export const SRadioGroupTabs: SFCWithInstall<typeof RadioGroupTabs> =
  withNoopInstall(RadioGroupTabs)
export default SRadio

export * from './src/radio'
export * from './src/radio-group'
export * from './src/radio-group-tabs'
