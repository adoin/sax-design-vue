import { withInstall } from '@vuesax-alpha/utils'
import TaskList from './src/task-list.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const STaskList: SFCWithInstall<typeof TaskList> = withInstall(TaskList)
export default STaskList
export * from './src/task-list'
