import {
  buildProps,
  definePropType,
  isArray,
  isBoolean,
} from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type CheckboxButton from './checkbox-button.vue'

export type CheckboxButtonValue = string | number
export type CheckboxButtonModel = boolean | CheckboxButtonValue[]

export const checkboxButtonProps = buildProps({
  modelValue: {
    type: definePropType<CheckboxButtonModel>([Boolean, Array]),
    default: false,
  },
  value: {
    type: definePropType<CheckboxButtonValue>([String, Number]),
    default: '',
  },
  label: { type: String, default: '' },
  disabled: Boolean,
} as const)

export const checkboxButtonEmits = {
  'update:modelValue': (value: CheckboxButtonModel) =>
    isBoolean(value) || isArray(value),
  change: (value: CheckboxButtonModel) => isBoolean(value) || isArray(value),
}

export type CheckboxButtonProps = ExtractPropTypes<typeof checkboxButtonProps>
export type CheckboxButtonInstance = InstanceType<typeof CheckboxButton>
