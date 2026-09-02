import { buildProps, definePropType } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type Image from './image.vue'

export const imageProps = buildProps({
  src: {
    type: String,
    default: '',
  },
  alt: { type: String, default: '' },
  fit: {
    type: String,
    values: ['fill', 'contain', 'cover', 'none', 'scale-down'] as const,
    default: 'cover',
  },
  position: { type: String, default: 'center' },
  width: { type: definePropType<string | number>([String, Number]) },
  height: { type: definePropType<string | number>([String, Number]) },
  aspectRatio: {
    type: definePropType<string | number>([String, Number]),
    default: 1,
  },
  loading: {
    type: String,
    values: ['eager', 'lazy'] as const,
    default: 'eager',
  },
  decoding: {
    type: String,
    values: ['auto', 'sync', 'async'] as const,
    default: 'auto',
  },
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
