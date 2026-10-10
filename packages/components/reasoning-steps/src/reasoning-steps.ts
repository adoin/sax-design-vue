import { buildProps, definePropType } from '@vuesax-alpha/utils'
import { useShapeProp } from '@vuesax-alpha/hooks'
import type { ExtractPropTypes } from 'vue'
import type ReasoningSteps from './reasoning-steps.vue'
import type {
  AgentSource,
  AgentTask,
} from '../../ai-editor/src/agent-shared/types'

export const reasoningStepsProps = buildProps({
  shape: useShapeProp,
  steps: { type: definePropType<AgentTask[]>(Array), default: () => [] },
  expanded: { type: Boolean, default: true },
  title: String,
  sources: { type: definePropType<AgentSource[]>(Array), default: () => [] },
} as const)
export const reasoningStepsEmits = {
  'update:expanded': (value: boolean) => typeof value === 'boolean',
  'step-click': (step: AgentTask) => !!step,
}
export type ReasoningStepsProps = ExtractPropTypes<typeof reasoningStepsProps>
export type ReasoningStepsInstance = InstanceType<typeof ReasoningSteps>
