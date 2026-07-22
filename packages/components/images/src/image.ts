import { buildProps, definePropType } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type Image from './image.vue'

export const imageProps = buildProps({
  src: {
    type: String,
    default: null,
  },
  alt: { type: String, default: '' },
  fit: {
    type: String,
    values: ['fill', 'contain', 'cover', 'none', 'scale-down'] as const,
    default: 'cover',
  },
  width: { type: definePropType<string | number>([String, Number]) },
  height: { type: definePropType<string | number>([String, Number]) },
  previewSrcList: { type: definePropType<string[]>(Array), default: () => [] },
  initialIndex: { type: Number, default: 0 },
  preview: Boolean,
} as const)

export const imageEmits = {
  load: (event: Event) => event instanceof Event,
  error: (event: Event) => event instanceof Event,
  preview: () => true,
}

export type ImageProps = ExtractPropTypes<typeof imageProps>
export type ImageInstance = InstanceType<typeof Image>
