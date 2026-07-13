import { buildProps, isBoolean, isString } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type Textarea from './textarea.vue'

export const textareaProps = buildProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: null,
  },
  color: {
    type: String,
    default: 'primary',
  },
  counter: {
    type: [Number, String],
    default: null,
  },
  counterDanger: Boolean,
  height: {
    type: String,
    default: null,
  },
  width: {
    type: String,
    default: null,
  },
} as const)

export const textareaEmits = {
  'update:modelValue': (val: string) => isString(val),
  'update:counterDanger': (val: boolean) => isBoolean(val),
  input: (val: string) => isString(val),
  focus: (evt: FocusEvent) => evt instanceof FocusEvent,
  blur: (evt: FocusEvent) => evt instanceof FocusEvent,
}

export type TextareaProps = ExtractPropTypes<typeof textareaProps>
export type TextareaInstance = InstanceType<typeof Textarea>
