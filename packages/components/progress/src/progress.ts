import { buildProps } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type Progress from './progress.vue'

export const progressProps = buildProps({
  height: {
    type: [Number, String],
    default: 5,
  },
  indeterminate: Boolean,
  percent: {
    type: Number,
    default: 0,
  },
  color: {
    type: String,
    default: 'primary',
  },
} as const)

export type ProgressProps = ExtractPropTypes<typeof progressProps>
export type ProgressInstance = InstanceType<typeof Progress>
