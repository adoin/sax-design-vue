import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Table from './src/table.vue'
import TableColumn from './src/table-column.vue'

export const STable = withInstall(Table, {
  TableColumn,
})
export default STable

export const STableColumn = withNoopInstall(TableColumn)

export * from './src/table'
export * from './src/utils'
