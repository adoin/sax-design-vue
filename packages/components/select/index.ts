import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Select from './src/select.vue'
import Option from './src/option.vue'
import OptionGroup from './src/option-group.vue'

export const SSelect = withInstall(Select, {
  Option,
  OptionGroup,
})
export default SSelect

export const SOption = withNoopInstall(Option)
export const SOptionGroup = withNoopInstall(OptionGroup)

export * from './src/option-group'
export * from './src/option'
export * from './src/select'
