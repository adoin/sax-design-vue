import { buildProps } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type Watermark from './watermark.vue'
export const watermarkProps = buildProps({
  content: { type: String, required: true },
  gap: { type: Number, default: 96 },
  opacity: { type: Number, default: 0.12 },
  rotate: { type: Number, default: -18 },
  mode: {
    type: String,
    values: ['visible', 'blind', 'both'] as const,
    default: 'visible',
  },
  blindContent: { type: String },
  blindStrength: { type: Number, default: 2 },
  fontSize: { type: Number, default: 13 },
  color: { type: String },
  zIndex: { type: Number, default: 10 },
} as const)
export type WatermarkProps = ExtractPropTypes<typeof watermarkProps>
export type WatermarkInstance = InstanceType<typeof Watermark>
