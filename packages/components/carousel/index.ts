import { withInstall } from '@vuesax-alpha/utils'
import Carousel from './src/carousel.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SCarousel: SFCWithInstall<typeof Carousel> = withInstall(Carousel)
export default SCarousel

export * from './src/carousel'
