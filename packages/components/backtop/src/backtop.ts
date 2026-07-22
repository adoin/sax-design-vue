import { buildProps } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type Backtop from './backtop.vue'

export const backtopProps = buildProps({
  target: String,
  visibilityHeight: {
    type: Number,
    default: 200,
  },
  right: {
    type: Number,
    default: 40,
  },
  bottom: {
    type: Number,
    default: 40,
  },
  behavior: {
    type: String,
    values: ['auto', 'smooth'] as const,
    default: 'smooth',
  },
} as const)

export const backtopEmits = {
  click: (event: MouseEvent) => event instanceof MouseEvent,
}

export type BacktopProps = ExtractPropTypes<typeof backtopProps>
export type BacktopInstance = InstanceType<typeof Backtop>
