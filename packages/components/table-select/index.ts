import { withInstall } from '@vuesax-alpha/utils'
import TableSelect from './src/table-select.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const STableSelect: SFCWithInstall<typeof TableSelect> =
  withInstall(TableSelect)
export default STableSelect

export * from './src/table-select'
