import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Checkbox from './src/checkbox.vue'
import CheckboxGroup from './src/checkbox-group.vue'

export const SCheckbox = withInstall(Checkbox, {
  CheckboxGroup,
})
export default SCheckbox

export const SCheckboxGroup = withNoopInstall(CheckboxGroup)

export * from './src/checkbox-group'
export * from './src/checkbox'
