import { withInstall } from '@vuesax-alpha/utils'
import Card from './src/card.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SCard: SFCWithInstall<typeof Card> = withInstall(Card)
export default SCard

export * from './src/card'
