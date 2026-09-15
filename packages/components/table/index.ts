import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Table from './src/table.vue'
import TableColumn from './src/table-column.vue'
import TableColumnConfig from './src/table-column-config.vue'
import type { SaxTableComponent } from './src/table'

export const STable = withInstall(Table as unknown as SaxTableComponent, {
  TableColumn,
  TableColumnConfig,
})
export default STable

export const STableColumn = withNoopInstall(TableColumn)
export const STableColumnConfig = withNoopInstall(TableColumnConfig)

export * from './src/table'
export * from './src/table-renderer'
export * from './src/utils'
export { createTableSvgChartAdapter } from './src/chart-svg-adapter'
