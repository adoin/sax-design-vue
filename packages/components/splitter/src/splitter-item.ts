import { buildProps } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type SplitterItem from './splitter-item.vue'

export const splitterItemProps = buildProps({
  min: Number,
  max: Number,
  disabled: Boolean,
  useRest: Boolean,
} as const)

export type SplitterItemProps = ExtractPropTypes<typeof splitterItemProps>
export type SplitterItemInstance = InstanceType<typeof SplitterItem>
