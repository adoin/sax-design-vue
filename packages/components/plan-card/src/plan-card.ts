import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type PlanCard from './plan-card.vue'
import type { AgentTask } from '../../agent-editor/src/agent-shared/types'

export const planCardProps = buildProps({
  title: { type: String, default: '' },
  description: String,
  tasks: { type: definePropType<AgentTask[]>(Array), default: () => [] },
  content: String,
  expanded: Boolean,
  status: {
    type: definePropType<'pending' | 'approved' | 'rejected'>(String),
    default: 'pending',
  },
  autoApprove: {
    type: Number,
    default: 0,
    validator: (value: number) => Number.isFinite(value) && value >= 0,
  },
  disabled: Boolean,
} as const)
export const planCardEmits = {
  'update:expanded': (value: boolean) => typeof value === 'boolean',
  approve: () => true,
  'auto-approve': () => true,
  'cancel-auto-approve': () => true,
  reject: () => true,
  download: () => true,
}
export type PlanCardProps = ExtractPropTypes<typeof planCardProps>
export type PlanCardInstance = InstanceType<typeof PlanCard>
