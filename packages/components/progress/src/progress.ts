import { buildProps, definePropType } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type Progress from './progress.vue'

export const progressTextures = ['none', 'bubbles', 'waves', 'sparkle'] as const
export type ProgressTexture = (typeof progressTextures)[number] | 'default'

export const progressProps = buildProps({
  height: {
    type: [Number, String],
    default: 5,
  },
  indeterminate: Boolean,
  percent: {
    type: Number,
    default: 0,
  },
  color: {
    type: String,
    default: 'primary',
  },
  texture: {
    type: definePropType<ProgressTexture>(String),
    values: [...progressTextures, 'default'] as const,
    default: 'none',
  },
  textureAnimated: { type: Boolean, default: true },
  textureDuration: {
    type: Number,
    default: 2000,
    validator: (value: number) => Number.isFinite(value) && value >= 0,
  },
  textureOpacity: {
    type: Number,
    default: 0.6,
    validator: (value: number) =>
      Number.isFinite(value) && value >= 0 && value <= 1,
  },
} as const)

export type ProgressProps = ExtractPropTypes<typeof progressProps>
export type ProgressInstance = InstanceType<typeof Progress>
