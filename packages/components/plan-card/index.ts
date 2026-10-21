import { withInstall } from '@vuesax-alpha/utils'
import PlanCard from './src/plan-card.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SPlanCard: SFCWithInstall<typeof PlanCard> = withInstall(PlanCard)
export default SPlanCard
export * from './src/plan-card'
