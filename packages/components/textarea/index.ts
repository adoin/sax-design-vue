import { withInstall } from '@vuesax-alpha/utils'
import Textarea from './src/textarea.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const STextarea: SFCWithInstall<typeof Textarea> = withInstall(Textarea)
export default STextarea

export * from './src/textarea'
