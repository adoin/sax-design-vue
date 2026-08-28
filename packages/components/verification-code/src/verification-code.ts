import { UPDATE_MODEL_EVENT } from '@vuesax-alpha/constants'
import { buildProps, isString } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type VerificationCode from './verification-code.vue'

export const verificationCodeProps = buildProps({
  modelValue: {
    type: String,
    default: '',
  },
  length: {
    type: Number,
    default: 6,
  },
  variant: {
    type: String,
    values: ['soft', 'capsule', 'underline'] as const,
    default: 'soft',
  },
  mode: {
    type: String,
    values: ['numeric', 'alphanumeric'] as const,
    default: 'numeric',
  },
  mask: {
    type: [Boolean, String],
    default: false,
  },
  status: {
    type: String,
    values: ['default', 'error', 'success'] as const,
    default: 'default',
  },
  disabled: Boolean,
  readonly: Boolean,
  autocomplete: {
    type: String,
    default: 'one-time-code',
  },
} as const)

export const verificationCodeEmits = {
  [UPDATE_MODEL_EVENT]: (value: string) => isString(value),
  input: (value: string) => isString(value),
  change: (value: string) => isString(value),
  complete: (value: string) => isString(value),
  focus: (event: FocusEvent) => event instanceof FocusEvent,
  blur: (event: FocusEvent) => event instanceof FocusEvent,
}

export type VerificationCodeProps = ExtractPropTypes<
  typeof verificationCodeProps
>
export type VerificationCodeInstance = InstanceType<typeof VerificationCode>
