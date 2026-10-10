import { withInstall } from '@vuesax-alpha/utils'
import CodeBlock from './src/code-block.vue'
export const SCodeBlock = withInstall(CodeBlock)
export default SCodeBlock
export * from './src/code-block'
export type { AgentCodeToken } from './src/tokenize-code'
