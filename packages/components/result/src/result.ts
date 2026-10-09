import { buildProps } from '@vuesax-alpha/utils'
import { useSizeProp } from '@vuesax-alpha/hooks'
import type { ExtractPropTypes, PropType } from 'vue'
import type Result from './result.vue'

export const resultTypes = ['success', 'warning', 'error', 'info'] as const
export type ResultType = (typeof resultTypes)[number]

export const resultProps = buildProps({
  status: {
    type: String as PropType<ResultType>,
    values: resultTypes,
    default: 'info',
  },
  title: String,
  content: String,
  description: String,
  size: useSizeProp,
  layout: {
    type: String,
    values: ['vertical', 'horizontal'] as const,
    default: 'vertical',
  },
  animated: { type: Boolean, default: true },
} as const)

export type ResultProps = ExtractPropTypes<typeof resultProps>
export type ResultInstance = InstanceType<typeof Result>
