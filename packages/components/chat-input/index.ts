import { withInstall } from '@vuesax-alpha/utils'
import ChatInput from './src/chat-input.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SChatInput: SFCWithInstall<typeof ChatInput> =
  withInstall(ChatInput)
export default SChatInput
export * from './src/chat-input'
