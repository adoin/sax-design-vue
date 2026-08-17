import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Checkbox from './src/checkbox.vue'
import CheckboxGroup from './src/checkbox-group.vue'
import CheckboxGroupTabs from './src/checkbox-group-tabs.vue'

export const SCheckbox = withInstall(Checkbox, {
  CheckboxGroup,
  CheckboxGroupTabs,
})
export default SCheckbox

export const SCheckboxGroup = withNoopInstall(CheckboxGroup)
export const SCheckboxGroupTabs = withNoopInstall(CheckboxGroupTabs)

export * from './src/checkbox-group'
export * from './src/checkbox-group-tabs'
export * from './src/checkbox'
