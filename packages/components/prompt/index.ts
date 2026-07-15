import { withInstall, withInstallFunction } from '@vuesax-alpha/utils'
import Prompt from './src/prompt.vue'
import promptBox from './src/prompt-box'

export const SPrompt = withInstall(Prompt)
export const SPromptBox = withInstallFunction(promptBox, '$prompt')
export default SPrompt

export * from './src/prompt'
export * from './src/prompt-box'
