import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type RadioGroup from './radio-group.vue'

export type RadioValue = string | number | boolean
export interface RadioOption {
  label: string
  value: RadioValue
  disabled?: boolean
}

export const radioGroupProps = buildProps({
  modelValue: {
    type: definePropType<RadioValue>([String, Number, Boolean]),
    default: '',
  },
  options: { type: definePropType<RadioOption[]>(Array), default: () => [] },
  disabled: Boolean,
  type: {
    type: String,
    values: ['default', 'button'] as const,
    default: 'default',
  },
  name: { type: String, default: '' },
} as const)

export const radioGroupEmits = {
  'update:modelValue': (value: RadioValue) => value !== null,
  change: (value: RadioValue) => value !== null,
}

export type RadioGroupProps = ExtractPropTypes<typeof radioGroupProps>
export type RadioGroupInstance = InstanceType<typeof RadioGroup>
