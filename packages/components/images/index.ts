import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Images from './src/images.vue'
import Image from './src/image.vue'

export const SImages = withInstall(Images, {
  Image,
})
export const SImage = withNoopInstall(Image)
export default SImages

export * from './src/images'
export * from './src/image'
