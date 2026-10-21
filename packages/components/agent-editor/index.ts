import { withInstall } from '@vuesax-alpha/utils'
import AgentEditor from './src/agent-editor.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SAgentEditor: SFCWithInstall<typeof AgentEditor> =
  withInstall(AgentEditor)
export default SAgentEditor
export * from './src/agent-editor'
