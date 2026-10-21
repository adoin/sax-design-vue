import { withInstall } from '@vuesax-alpha/utils'
import ImageGeneration from './src/image-generation.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SImageGeneration: SFCWithInstall<typeof ImageGeneration> =
  withInstall(ImageGeneration)
export default SImageGeneration
export * from './src/image-generation'
