import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Form from './src/form.vue'
import FormItem from './src/form-item.vue'
import FormGroup from './src/form-group.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SForm: SFCWithInstall<typeof Form> & {
  FormItem: typeof FormItem
  FormGroup: typeof FormGroup
} = withInstall(Form, { FormItem, FormGroup })
export const SFormItem = withNoopInstall(FormItem)
export const SFormGroup: SFCWithInstall<typeof FormGroup> =
  withNoopInstall(FormGroup)
export default SForm

export * from './src/form'
export * from './src/form-item'
export * from './src/form-group'
export * from './src/form-validator'
export * from './src/renderer'
