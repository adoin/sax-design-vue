import { buildProps } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type Image from './image.vue'

export const imageProps = buildProps({
  src: {
    type: String,
    default: null,
  },
} as const)

export type ImageProps = ExtractPropTypes<typeof imageProps>
export type ImageInstance = InstanceType<typeof Image>
