import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Select from './src/select.vue'
import Option from './src/option.vue'
import OptionGroup from './src/option-group.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SSelect: SFCWithInstall<
  typeof Select,
  { Option: typeof Option; OptionGroup: typeof OptionGroup }
> = withInstall(Select, {
  Option,
  OptionGroup,
})
export default SSelect

export const SOption: SFCWithInstall<typeof Option> = withNoopInstall(Option)
export const SOptionGroup: SFCWithInstall<typeof OptionGroup> =
  withNoopInstall(OptionGroup)

export * from './src/option-group'
export * from './src/option'
export * from './src/select'
