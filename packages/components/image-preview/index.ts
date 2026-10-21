import { withInstall } from '@vuesax-alpha/utils'
import ImagePreview from './src/image-preview.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SImagePreview: SFCWithInstall<typeof ImagePreview> =
  withInstall(ImagePreview)
export default SImagePreview
export * from './src/image-preview'
