import { buildProps } from '@vuesax-alpha/utils'
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
} as const)

export type ResultProps = ExtractPropTypes<typeof resultProps>
export type ResultInstance = InstanceType<typeof Result>
