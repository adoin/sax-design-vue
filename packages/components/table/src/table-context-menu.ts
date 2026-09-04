import type { ContextMenuItem } from '@vuesax-alpha/components/context-menu'
import type {
  TableCellRenderParams,
  TableColumn,
  TableFooterCellRenderParams,
  TableRowKey,
} from './table'

export type TableContextMenuContext =
  | { area: 'header'; column: TableColumn; columnIndex: number; group: boolean }
  | ({ area: 'body'; rowKey: TableRowKey } & TableCellRenderParams)
  | ({ area: 'footer' } & TableFooterCellRenderParams)
export type TableContextMenuItems =
  ContextMenuItem[] | ((context: TableContextMenuContext) => ContextMenuItem[])
export interface TableContextMenuConfig {
  enabled?: boolean
  header?: TableContextMenuItems
  body?: TableContextMenuItems
  footer?: TableContextMenuItems
  minWidth?: number
  visibleMethod?: (context: TableContextMenuContext) => boolean
}
export interface TableContextMenuSelectParams {
  context: TableContextMenuContext
  item: ContextMenuItem
}
