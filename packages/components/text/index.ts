import { withInstall } from '@vuesax-alpha/utils'
import Text from './src/text.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SText: SFCWithInstall<typeof Text> = withInstall(Text)
export default SText

export * from './src/text'
