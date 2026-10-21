import { withInstall } from '@vuesax-alpha/utils'
import Link from './src/link.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SLink: SFCWithInstall<typeof Link> = withInstall(Link)
export default SLink

export * from './src/link'
