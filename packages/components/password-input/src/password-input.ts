import { buildProps } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type PasswordInput from './password-input.vue'

export const passwordInputProps = buildProps({
  modelValue: { type: String, default: '' },
  placeholder: String,
  disabled: Boolean,
  clearable: Boolean,
  showPassword: { type: Boolean, default: true },
  autocomplete: { type: String, default: 'current-password' },
} as const)

export const passwordInputEmits = {
  'update:modelValue': (value: string) => typeof value === 'string',
  change: (value: string) => typeof value === 'string',
  clear: () => true,
}

export type PasswordInputProps = ExtractPropTypes<typeof passwordInputProps>
export type PasswordInputInstance = InstanceType<typeof PasswordInput>
