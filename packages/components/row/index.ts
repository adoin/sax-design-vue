import { withInstall } from '@vuesax-alpha/utils'
import Row from './src/row.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SRow: SFCWithInstall<typeof Row> = withInstall(Row)
export default SRow

export * from './src/row'
