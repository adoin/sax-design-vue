import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Chip from './src/chip.vue'
import Chips from './src/chips.vue'

export const VsChip = withInstall(Chip)
export const VsChips = withNoopInstall(Chips)
export default VsChip

export * from './src/chip'
export * from './src/chips'
