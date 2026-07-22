import { buildProps } from '@vuesax-alpha/utils'
import type { ExtractPropTypes, PropType } from 'vue'
import type Empty from './empty.vue'

export const emptyProps = buildProps({
  image: String,
  imageSize: {
    type: [Number, String] as PropType<number | string>,
  },
  description: String,
} as const)

export type EmptyProps = ExtractPropTypes<typeof emptyProps>
export type EmptyInstance = InstanceType<typeof Empty>
