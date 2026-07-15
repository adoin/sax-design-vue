import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Chip from './src/chip.vue'
import Chips from './src/chips.vue'

export const SChip = withInstall(Chip)
export const SChips = withNoopInstall(Chips)
export default SChip

export * from './src/chip'
export * from './src/chips'
