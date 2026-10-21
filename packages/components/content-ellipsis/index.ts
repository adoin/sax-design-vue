import { withInstall } from '@vuesax-alpha/utils'
import ContentEllipsis from './src/content-ellipsis.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SContentEllipsis: SFCWithInstall<typeof ContentEllipsis> =
  withInstall(ContentEllipsis)
export default SContentEllipsis

export * from './src/content-ellipsis'
