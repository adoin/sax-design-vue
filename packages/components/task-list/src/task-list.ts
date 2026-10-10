import { buildProps, definePropType } from '@vuesax-alpha/utils'
import { useShapeProp } from '@vuesax-alpha/hooks'
import type { ExtractPropTypes } from 'vue'
import type TaskList from './task-list.vue'
import type { AgentTask } from '../../ai-editor/src/agent-shared/types'

export const taskListProps = buildProps({
  shape: useShapeProp,
  tasks: { type: definePropType<AgentTask[]>(Array), default: () => [] },
  title: String,
  expanded: { type: Boolean, default: true },
  interactive: Boolean,
  disabled: Boolean,
} as const)
export const taskListEmits = {
  'update:expanded': (value: boolean) => typeof value === 'boolean',
  'task-click': (task: AgentTask) => !!task,
}
export type TaskListProps = ExtractPropTypes<typeof taskListProps>
export type TaskListInstance = InstanceType<typeof TaskList>
