import { withInstall } from '@vuesax-alpha/utils'
import ChatHistory from './src/chat-history.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SChatHistory: SFCWithInstall<typeof ChatHistory> =
  withInstall(ChatHistory)
export default SChatHistory
export * from './src/chat-history'
