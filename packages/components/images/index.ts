import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Images from './src/images.vue'
import Image from './src/image.vue'

export const VsImages = withInstall(Images, {
  Image,
})
export const VsImage = withNoopInstall(Image)
export default VsImages

export * from './src/images'
export * from './src/image'
