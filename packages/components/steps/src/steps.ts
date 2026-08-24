import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type Steps from './steps.vue'

export type StepStatus =
  'wait' | 'process' | 'finish' | 'success' | 'error' | 'loading' | 'disabled'

export type StepsVariant = 'rail' | 'timeline'
export type StepsDirection = 'horizontal' | 'vertical'
export type StepsSize = 'small' | 'default' | 'large'

export interface StepItem {
  key?: string | number
  title: string
  description?: string
  meta?: string
  status?: StepStatus
  statusLabel?: string
  disabled?: boolean
  clickable?: boolean
  icon?: string
}

export interface StepSlotProps {
  item: StepItem
  index: number
  status: StepStatus
  statusLabel: string
  icon?: string
  active: boolean
  disabled: boolean
  interactive: boolean
}

export const stepsProps = buildProps({
  active: { type: Number, default: 0 },
  items: { type: definePropType<StepItem[]>(Array), default: () => [] },
  variant: {
    type: String,
    values: ['rail', 'timeline'],
    default: 'rail',
  },
  direction: {
    type: String,
    values: ['horizontal', 'vertical'],
  },
  size: {
    type: String,
    values: ['small', 'default', 'large'],
    default: 'default',
  },
  finishStatus: {
    type: String,
    values: [
      'wait',
      'process',
      'finish',
      'success',
      'error',
      'loading',
      'disabled',
    ],
    default: 'finish',
  },
  processStatus: {
    type: String,
    values: [
      'wait',
      'process',
      'finish',
      'success',
      'error',
      'loading',
      'disabled',
    ],
    default: 'process',
  },
  statusLabels: {
    type: definePropType<Partial<Record<StepStatus, string>>>(Object),
    default: () => ({}),
  },
  clickable: { type: Boolean, default: true },
  showProgress: { type: Boolean, default: true },
  showStepIndex: { type: Boolean, default: true },
  responsive: { type: Boolean, default: true },
  ariaLabel: String,
  simple: Boolean,
} as const)

export const stepsEmits = {
  click: (index: number, item: StepItem) => Number.isInteger(index) && !!item,
  change: (index: number, item: StepItem) => Number.isInteger(index) && !!item,
  'update:active': (index: number) => Number.isInteger(index),
}

export type StepsProps = ExtractPropTypes<typeof stepsProps>
export type StepsInstance = InstanceType<typeof Steps>
