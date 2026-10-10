import { buildProps, definePropType } from '@vuesax-alpha/utils'
import { useShapeProp } from '@vuesax-alpha/hooks'
import type { ExtractPropTypes } from 'vue'
import type ChatHistory from './chat-history.vue'
import type { AgentHistoryMessage } from '../../ai-editor/src/agent-shared/types'

export const chatHistoryProps = buildProps({
  shape: useShapeProp,
  messages: {
    type: definePropType<AgentHistoryMessage[]>(Array),
    default: () => [],
  },
  modelValue: Boolean,
  activeId: String,
  label: String,
} as const)
export const chatHistoryEmits = {
  'update:modelValue': (value: boolean) => typeof value === 'boolean',
  select: (message: AgentHistoryMessage) => !!message,
}
export type ChatHistoryProps = ExtractPropTypes<typeof chatHistoryProps>
export type ChatHistoryInstance = InstanceType<typeof ChatHistory>
