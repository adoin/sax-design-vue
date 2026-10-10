import { buildProps } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type MessageScroller from './message-scroller.vue'

export const messageScrollerProps = buildProps({
  height: { type: [String, Number], default: 360 },
  autoFollow: { type: Boolean, default: true },
  threshold: { type: Number, default: 48 },
  label: String,
} as const)
export const messageScrollerEmits = {
  'follow-change': (following: boolean) => typeof following === 'boolean',
  'reach-top': () => true,
}
export type MessageScrollerProps = ExtractPropTypes<typeof messageScrollerProps>
export type MessageScrollerInstance = InstanceType<typeof MessageScroller>
