import { withInstall } from '@vuesax-alpha/utils'
import Message from './src/message.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SMessage: SFCWithInstall<typeof Message> = withInstall(Message)
export default SMessage
export * from './src/message'
