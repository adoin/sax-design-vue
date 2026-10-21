import { withInstall } from '@vuesax-alpha/utils'
import TextEllipsis from './src/text-ellipsis.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const STextEllipsis: SFCWithInstall<typeof TextEllipsis> =
  withInstall(TextEllipsis)
export default STextEllipsis

export * from './src/text-ellipsis'
