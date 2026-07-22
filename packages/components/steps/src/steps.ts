import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type Steps from './steps.vue'

export type StepStatus = 'wait' | 'process' | 'finish' | 'error'

export interface StepItem {
  title: string
  description?: string
  status?: StepStatus
  disabled?: boolean
}

export const stepsProps = buildProps({
  active: { type: Number, default: 0 },
  items: { type: definePropType<StepItem[]>(Array), default: () => [] },
  direction: {
    type: String,
    values: ['horizontal', 'vertical'],
    default: 'horizontal',
  },
  finishStatus: {
    type: String,
    values: ['wait', 'process', 'finish', 'error'],
    default: 'finish',
  },
  processStatus: {
    type: String,
    values: ['wait', 'process', 'finish', 'error'],
    default: 'process',
  },
  simple: Boolean,
} as const)

export const stepsEmits = {
  click: (index: number, item: StepItem) => Number.isInteger(index) && !!item,
}

export type StepsProps = ExtractPropTypes<typeof stepsProps>
export type StepsInstance = InstanceType<typeof Steps>
