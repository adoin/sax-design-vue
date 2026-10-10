import { buildProps } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type StreamingText from './streaming-text.vue'

export const streamingTextProps = buildProps({
  text: { type: String, default: '' },
  interval: { type: Number, default: 18 },
  paused: Boolean,
  animate: { type: Boolean, default: true },
  streaming: Boolean,
} as const)
export const streamingTextEmits = {
  finish: () => true,
}
export type StreamingTextProps = ExtractPropTypes<typeof streamingTextProps>
export type StreamingTextInstance = InstanceType<typeof StreamingText>
