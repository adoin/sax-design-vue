import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Table from './src/table.vue'
import TableColumn from './src/table-column.vue'
import TableColumnConfig from './src/table-column-config.vue'
import type { SaxTableComponent } from './src/table'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const STable: SFCWithInstall<
  SaxTableComponent,
  {
    TableColumn: typeof TableColumn
    TableColumnConfig: typeof TableColumnConfig
  }
> = withInstall(Table as unknown as SaxTableComponent, {
  TableColumn,
  TableColumnConfig,
})
export default STable

export const STableColumn: SFCWithInstall<typeof TableColumn> =
  withNoopInstall(TableColumn)
export const STableColumnConfig: SFCWithInstall<typeof TableColumnConfig> =
  withNoopInstall(TableColumnConfig)

export * from './src/table'
export * from './src/table-renderer'
export * from './src/utils'
export { createTableSvgChartAdapter } from './src/chart-svg-adapter'
