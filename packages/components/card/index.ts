import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Card from './src/card.vue'
import CardGroup from './src/card-group.vue'

export const SCard = withInstall(Card, {
  CardGroup,
})
export default SCard

export const SCardGroup = withNoopInstall(CardGroup)

export * from './src/card-group'
export * from './src/card'
