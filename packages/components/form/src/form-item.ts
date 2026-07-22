import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type { FormRule } from './form'
import type FormItem from './form-item.vue'

export const formItemProps = buildProps({
  label: String,
  prop: String,
  rules: { type: definePropType<FormRule | FormRule[]>([Object, Array]) },
  required: Boolean,
  labelWidth: { type: [String, Number] as any },
} as const)

export type FormItemProps = ExtractPropTypes<typeof formItemProps>
export type FormItemInstance = InstanceType<typeof FormItem>
