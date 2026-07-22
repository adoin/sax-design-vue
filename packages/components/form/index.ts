import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Form from './src/form.vue'
import FormItem from './src/form-item.vue'
import FormGroup from './src/form-group.vue'

export const SForm = withInstall(Form, { FormItem, FormGroup })
export const SFormItem = withNoopInstall(FormItem)
export const SFormGroup = withNoopInstall(FormGroup)
export default SForm

export * from './src/form'
export * from './src/form-item'
export * from './src/form-group'
