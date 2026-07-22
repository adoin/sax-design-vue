import { UPDATE_MODEL_EVENT } from '@vuesax-alpha/constants'
import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes, PropType } from 'vue'
import type Segmented from './segmented.vue'
export interface SegmentedOption {
  label: string
  value: string | number
  disabled?: boolean
}
export const segmentedProps = buildProps({
  modelValue: {
    type: [String, Number] as unknown as PropType<string | number>,
  },
  options: {
    type: definePropType<SegmentedOption[]>(Array),
    default: () => [],
  },
  disabled: Boolean,
} as const)
export const segmentedEmits = {
  [UPDATE_MODEL_EVENT]: (value: string | number) =>
    typeof value === 'string' || typeof value === 'number',
  change: (value: string | number) =>
    typeof value === 'string' || typeof value === 'number',
}
export type SegmentedProps = ExtractPropTypes<typeof segmentedProps>
export type SegmentedInstance = InstanceType<typeof Segmented>
