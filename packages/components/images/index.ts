import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Images from './src/images.vue'
import Image from './src/image.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SImages: SFCWithInstall<typeof Images, { Image: typeof Image }> =
  withInstall(Images, {
    Image,
  })
export const SImage: SFCWithInstall<typeof Image> = withNoopInstall(Image)
export default SImages

export * from './src/images'
export * from './src/image'
