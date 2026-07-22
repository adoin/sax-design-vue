import { buildProps } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type Watermark from './watermark.vue'
export const watermarkProps = buildProps({
  content: { type: String, required: true },
  gap: { type: Number, default: 96 },
  opacity: { type: Number, default: 0.12 },
  rotate: { type: Number, default: -18 },
} as const)
export type WatermarkProps = ExtractPropTypes<typeof watermarkProps>
export type WatermarkInstance = InstanceType<typeof Watermark>
