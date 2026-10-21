import { withInstall } from '@vuesax-alpha/utils'
import QuestionCard from './src/question-card.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SQuestionCard: SFCWithInstall<typeof QuestionCard> =
  withInstall(QuestionCard)
export default SQuestionCard
export * from './src/question-card'
