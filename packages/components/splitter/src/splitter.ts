import { buildProps } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type Splitter from './splitter.vue'

export const splitterProps = buildProps({
  modelValue: { type: Number, default: 50 },
  direction: {
    type: String,
    values: ['horizontal', 'vertical'],
    default: 'horizontal',
  },
  min: { type: Number, default: 10 },
  max: { type: Number, default: 90 },
  disabled: Boolean,
} as const)

export const splitterEmits = {
  'update:modelValue': (value: number) => Number.isFinite(value),
  change: (value: number) => Number.isFinite(value),
}

export type SplitterProps = ExtractPropTypes<typeof splitterProps>
export type SplitterInstance = InstanceType<typeof Splitter>
