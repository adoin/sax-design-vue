import type { ContextMenuItem } from '@vuesax-alpha/components/context-menu'
import type {
  TableCellRenderParams,
  TableColumn,
  TableFooterCellRenderParams,
  TableRow,
  TableRowKey,
} from './table'

export type TableContextMenuContext<Row extends object = TableRow> =
  | {
      area: 'header'
      column: TableColumn<Row>
      columnIndex: number
      group: boolean
    }
  | ({ area: 'body'; rowKey: TableRowKey } & TableCellRenderParams<Row>)
  | ({ area: 'footer' } & TableFooterCellRenderParams<Row>)
export type TableContextMenuItems<Row extends object = TableRow> =
  | ContextMenuItem[]
  | ((context: TableContextMenuContext<Row>) => ContextMenuItem[])
export interface TableContextMenuConfig<Row extends object = TableRow> {
  enabled?: boolean
  header?: TableContextMenuItems<Row>
  body?: TableContextMenuItems<Row>
  footer?: TableContextMenuItems<Row>
  minWidth?: number
  visibleMethod?: (context: TableContextMenuContext<Row>) => boolean
}
export interface TableContextMenuSelectParams<Row extends object = TableRow> {
  context: TableContextMenuContext<Row>
  item: ContextMenuItem
}
