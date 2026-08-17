import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { SelectOptionValue } from './tokens'

import type { ExtractPropTypes } from 'vue'
import type Option from './option.vue'

export const optionProps = buildProps({
  value: {
    type: definePropType<SelectOptionValue>([String, Number, Object]),
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
  },
  created: { type: Boolean, default: false },
  data: {
    type: definePropType<Record<string, unknown>>(Object),
  },
  /** Internal visual order used by data-driven Select options. */
  optionIndex: {
    type: Number,
    default: -1,
  },
} as const)

export type OptionProps = ExtractPropTypes<typeof optionProps>
export type OptionInstance = InstanceType<typeof Option>
