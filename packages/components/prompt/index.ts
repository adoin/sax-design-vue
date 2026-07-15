import { withInstall, withInstallFunction } from '@vuesax-alpha/utils'
import Prompt from './src/prompt.vue'
import promptBox from './src/prompt-box'

export const VsPrompt = withInstall(Prompt)
export const VsPromptBox = withInstallFunction(promptBox, '$prompt')
export default VsPrompt

export * from './src/prompt'
export * from './src/prompt-box'
