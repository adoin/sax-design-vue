import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type Cascader from './cascader.vue'

export type CascaderValue = string | number
export interface CascaderOption {
  value: CascaderValue
  label: string
  children?: CascaderOption[]
  disabled?: boolean
}

export const cascaderProps = buildProps({
  modelValue: {
    type: definePropType<CascaderValue[]>(Array),
    default: () => [],
  },
  options: { type: definePropType<CascaderOption[]>(Array), default: () => [] },
  placeholder: { type: String, default: 'Select' },
  separator: { type: String, default: ' / ' },
  clearable: Boolean,
  disabled: Boolean,
  checkStrictly: Boolean,
} as const)

export const cascaderEmits = {
  'update:modelValue': (value: CascaderValue[]) => Array.isArray(value),
  change: (value: CascaderValue[], option: CascaderOption) =>
    Array.isArray(value) && !!option,
}

export type CascaderProps = ExtractPropTypes<typeof cascaderProps>
export type CascaderInstance = InstanceType<typeof Cascader>
