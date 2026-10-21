import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Checkbox from './src/checkbox.vue'
import CheckboxGroup from './src/checkbox-group.vue'
import CheckboxGroupTabs from './src/checkbox-group-tabs.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SCheckbox: SFCWithInstall<
  typeof Checkbox,
  {
    CheckboxGroup: typeof CheckboxGroup
    CheckboxGroupTabs: typeof CheckboxGroupTabs
  }
> = withInstall(Checkbox, {
  CheckboxGroup,
  CheckboxGroupTabs,
})
export default SCheckbox

export const SCheckboxGroup: SFCWithInstall<typeof CheckboxGroup> =
  withNoopInstall(CheckboxGroup)
export const SCheckboxGroupTabs: SFCWithInstall<typeof CheckboxGroupTabs> =
  withNoopInstall(CheckboxGroupTabs)

export * from './src/checkbox-group'
export * from './src/checkbox-group-tabs'
export * from './src/checkbox'
