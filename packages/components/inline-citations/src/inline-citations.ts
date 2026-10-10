import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type InlineCitations from './inline-citations.vue'
import type { AgentSource } from '../../ai-editor/src/agent-shared/types'

export const inlineCitationsProps = buildProps({
  sources: { type: definePropType<AgentSource[]>(Array), default: () => [] },
  label: String,
  disabled: Boolean,
} as const)
export const inlineCitationsEmits = {
  open: () => true,
  'source-click': (source: AgentSource) => !!source,
}
export type InlineCitationsProps = ExtractPropTypes<typeof inlineCitationsProps>
export type InlineCitationsInstance = InstanceType<typeof InlineCitations>
