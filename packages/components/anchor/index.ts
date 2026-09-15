import { withInstall } from '@vuesax-alpha/utils'
import Anchor from './src/anchor.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SAnchor: SFCWithInstall<typeof Anchor> = withInstall(Anchor)
export default SAnchor

export * from './src/anchor'
