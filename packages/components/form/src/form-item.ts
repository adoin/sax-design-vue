import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type { FormItemSpan, FormRule } from './form'
import type { FormItemRenderOptions } from './renderer'
import type FormItem from './form-item.vue'

export const formItemProps = buildProps({
  label: String,
  title: String,
  prop: String,
  field: String,
  id: String,
  description: String,
  rules: { type: definePropType<FormRule | FormRule[]>([Object, Array]) },
  required: Boolean,
  labelWidth: { type: definePropType<string | number>([String, Number]) },
  labelPosition: {
    type: String,
    values: ['left', 'right', 'top'] as const,
  },
  span: {
    type: definePropType<FormItemSpan>([Number, Object]),
    default: 24,
  },
  vertical: Boolean,
  nested: Boolean,
  align: {
    type: String,
    values: ['left', 'center', 'right'] as const,
    default: 'left',
  },
  reserveErrorSpace: { type: Boolean, default: undefined },
  disabled: { type: Boolean, default: undefined },
  readonly: { type: Boolean, default: undefined },
  itemRender: {
    type: definePropType<FormItemRenderOptions>(Object),
  },
} as const)

export type FormItemProps = ExtractPropTypes<typeof formItemProps>
export type FormItemInstance = InstanceType<typeof FormItem>
