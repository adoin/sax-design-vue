import { withInstall } from '@vuesax-alpha/utils'
import CodeBlock from './src/code-block.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SCodeBlock: SFCWithInstall<typeof CodeBlock> =
  withInstall(CodeBlock)
export default SCodeBlock
export * from './src/code-block'
export type { AgentCodeToken } from './src/tokenize-code'
