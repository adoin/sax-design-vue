import { UPDATE_MODEL_EVENT } from '@vuesax-alpha/constants'
import { useColorProp } from '@vuesax-alpha/hooks'
import { buildProps, isBoolean } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type Prompt from './prompt.vue'

export const promptProps = buildProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  color: { ...useColorProp, default: 'primary' },
  buttonAccept: {
    type: String,
    values: [
      'default',
      'filled',
      'border',
      'flat',
      'floating',
      'gradient',
      'shadow',
      'relief',
      'transparent',
    ] as const,
    default: 'filled',
  },
  buttonCancel: {
    type: String,
    values: [
      'default',
      'border',
      'flat',
      'floating',
      'gradient',
      'shadow',
      'relief',
      'transparent',
    ] as const,
    default: 'flat',
  },
  isValid: {
    type: [Boolean, String],
    default: 'none',
  },
  buttonsHidden: Boolean,
  acceptText: String,
  cancelText: String,
  closeIcon: {
    type: String,
    default: 'cb:close',
  },
  text: {
    type: String,
    default: null,
  },
  title: String,
  type: {
    type: String,
    values: ['alert', 'confirm'],
    default: 'alert',
  },
} as const)

export const promptEmits = {
  [UPDATE_MODEL_EVENT]: (value: boolean) => isBoolean(value),
  accept: () => true,
  cancel: () => true,
  close: () => true,
}

export type PromptProps = ExtractPropTypes<typeof promptProps>
export type PromptInstance = InstanceType<typeof Prompt>
