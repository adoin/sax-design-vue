import { withInstall } from '@vuesax-alpha/utils'
import Affix from './src/affix.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SAffix: SFCWithInstall<typeof Affix> = withInstall(Affix)
export default SAffix

export * from './src/affix'
