import { buildProps, definePropType } from '@vuesax-alpha/utils'
import { useShapeProp } from '@vuesax-alpha/hooks'
import type { ExtractPropTypes } from 'vue'
import type PlanCard from './plan-card.vue'
import type { AgentTask } from '../../ai-editor/src/agent-shared/types'

export const planCardProps = buildProps({
  shape: useShapeProp,
  title: { type: String, default: '' },
  description: String,
  tasks: { type: definePropType<AgentTask[]>(Array), default: () => [] },
  content: String,
  expanded: Boolean,
  status: {
    type: definePropType<'pending' | 'approved' | 'rejected'>(String),
    default: 'pending',
  },
  disabled: Boolean,
} as const)
export const planCardEmits = {
  'update:expanded': (value: boolean) => typeof value === 'boolean',
  approve: () => true,
  reject: () => true,
  download: () => true,
}
export type PlanCardProps = ExtractPropTypes<typeof planCardProps>
export type PlanCardInstance = InstanceType<typeof PlanCard>
