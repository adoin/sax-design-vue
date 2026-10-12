import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type MessageScroller from './message-scroller.vue'
import type { AgentHistoryMessage } from '../../agent-editor/src/agent-shared/types'
export type MessageScrollerLoadMore = (
  signal: AbortSignal,
) => Promise<AgentHistoryMessage[]>

export const messageScrollerProps = buildProps({
  items: { type: definePropType<AgentHistoryMessage[]>(Array) },
  virtual: { type: Boolean, default: true },
  estimatedItemHeight: { type: Number, default: 96 },
  overscan: { type: Number, default: 5 },
  loadMore: { type: definePropType<MessageScrollerLoadMore>(Function) },
  hasMore: { type: Boolean, default: true },
  loadThreshold: { type: Number, default: 64 },
  height: { type: [String, Number], default: 360 },
  autoFollow: { type: Boolean, default: true },
  threshold: { type: Number, default: 48 },
  label: String,
} as const)
export const messageScrollerEmits = {
  'follow-change': (following: boolean) => typeof following === 'boolean',
  'reach-top': () => true,
  'update:items': (items: AgentHistoryMessage[]) => Array.isArray(items),
  'load-error': (error: unknown) => error !== undefined,
}
export type MessageScrollerProps = ExtractPropTypes<typeof messageScrollerProps>
export type MessageScrollerInstance = InstanceType<typeof MessageScroller>
