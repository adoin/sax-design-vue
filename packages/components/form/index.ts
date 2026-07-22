import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Form from './src/form.vue'
import FormItem from './src/form-item.vue'

export const SForm = withInstall(Form, { FormItem })
export const SFormItem = withNoopInstall(FormItem)
export default SForm

export * from './src/form'
export * from './src/form-item'
