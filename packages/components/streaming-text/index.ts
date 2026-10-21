import { withInstall } from '@vuesax-alpha/utils'
import StreamingText from './src/streaming-text.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SStreamingText: SFCWithInstall<typeof StreamingText> =
  withInstall(StreamingText)
export default SStreamingText
export * from './src/streaming-text'
