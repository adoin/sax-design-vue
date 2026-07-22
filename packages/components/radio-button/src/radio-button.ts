import { buildProps, isBoolean, isNumber, isString } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type RadioButton from './radio-button.vue'

export type RadioButtonValue = string | number | boolean

export const radioButtonProps = buildProps({
  modelValue: { type: [String, Number, Boolean], default: null },
  value: { type: [String, Number, Boolean], default: '' },
  label: { type: [String, Number], default: '' },
  disabled: Boolean,
  name: { type: String, default: '' },
} as const)

export const radioButtonEmits = {
  'update:modelValue': (value: RadioButtonValue) =>
    isString(value) || isNumber(value) || isBoolean(value),
  change: (value: RadioButtonValue) =>
    isString(value) || isNumber(value) || isBoolean(value),
}

export type RadioButtonProps = ExtractPropTypes<typeof radioButtonProps>
export type RadioButtonInstance = InstanceType<typeof RadioButton>
