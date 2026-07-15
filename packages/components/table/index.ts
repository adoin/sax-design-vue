import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Table from './src/table.vue'
import Td from './src/td.vue'
import Th from './src/th.vue'
import Tr from './src/tr.vue'

export const STable = withInstall(Table, {
  Td,
  Th,
  Tr,
})
export default STable

export const STd = withNoopInstall(Td)
export const STh = withNoopInstall(Th)
export const STr = withNoopInstall(Tr)

export * from './src/table'
export * from './src/utils'
