import { withInstall } from '@vuesax-alpha/utils'
import Watermark from './src/watermark.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SWatermark: SFCWithInstall<typeof Watermark> =
  withInstall(Watermark)
export default SWatermark
export * from './src/watermark'
export { revealWatermark } from './src/reveal-watermark'
export type { WatermarkRevealOptions } from './src/reveal-watermark'
