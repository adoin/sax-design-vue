import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type QuestionCard from './question-card.vue'
import type {
  AgentAnswer,
  AgentQuestion,
} from '../../ai-editor/src/agent-shared/types'

export const questionCardProps = buildProps({
  questions: {
    type: definePropType<AgentQuestion[]>(Array),
    default: () => [],
  },
  modelValue: { type: definePropType<AgentAnswer[]>(Array), default: () => [] },
  activeIndex: { type: Number, default: 0 },
  title: String,
  disabled: Boolean,
} as const)
export const questionCardEmits = {
  'update:modelValue': (answers: AgentAnswer[]) => Array.isArray(answers),
  'update:activeIndex': (index: number) => Number.isInteger(index),
  submit: (answers: AgentAnswer[]) => Array.isArray(answers),
  skip: (question: AgentQuestion) => !!question,
}
export type QuestionCardProps = ExtractPropTypes<typeof questionCardProps>
export type QuestionCardInstance = InstanceType<typeof QuestionCard>
