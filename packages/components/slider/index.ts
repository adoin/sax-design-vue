import { withInstall } from '@vuesax-alpha/utils'
import Slider from './src/slider.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SSlider: SFCWithInstall<typeof Slider> = withInstall(Slider)
export default SSlider

export * from './src/slider'
