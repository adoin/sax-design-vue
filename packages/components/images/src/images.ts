import { buildProps } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type Images from './images.vue'

export const imagesProps = buildProps({
  hover: {
    type: String,
    values: ['none', 'default', 'blur', 'zoom', 'dark', 'scale', 'curtain'],
    default: 'none',
  },
  alternating: Boolean,
  notBorderRadius: Boolean,
  notMargin: Boolean,
} as const)

export type ImagesProps = ExtractPropTypes<typeof imagesProps>
export type ImagesInstance = InstanceType<typeof Images>
