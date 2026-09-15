import type { VNodeChild } from 'vue'
import type {
  TableCellRenderParams,
  TableColumn,
  TableRow,
  TableRowKey,
} from './table'

export type TableEditMode = 'cell' | 'row'
export type TableEditReason =
  | 'api'
  | 'enter'
  | 'escape'
  | 'switch'
  | 'query'
  | 'page'
  | 'columns'
  | 'scroll'
  | 'data'
  | 'view'
  | 'disabled'
  | 'conflict'
  | 'unmount'
export interface TableEditContext<
  Row extends object = TableRow,
> extends TableCellRenderParams<Row> {
  rowKey: TableRowKey
  columnKey: string
}
export interface TableEditorConfig<Row extends object = TableRow> {
  type?: 'input' | 'number' | 'select' | 'date' | 'switch'
  props?: Record<string, unknown>
  options?: Array<Record<string, unknown>>
  editableMethod?: (params: TableEditContext<Row>) => boolean
}
export interface TableEditConfig<Row extends object = TableRow> {
  enabled?: boolean
  mode?: TableEditMode
  trigger?: 'click' | 'dblclick' | 'manual'
  editableMethod?: (params: TableEditContext<Row>) => boolean
  onSwitch?: 'commit' | 'cancel'
  onContextChange?: 'commit' | 'cancel'
  onScroll?: 'keep' | 'commit' | 'cancel'
}
export interface TableEditChange<Row extends object = TableRow> {
  field: string
  column: TableColumn<Row>
  columnKey: string
  oldValue: unknown
  value: unknown
}
export interface TableEditRecord<
  Row extends object = TableRow,
> extends TableEditContext<Row> {
  mode: TableEditMode
  changes: TableEditChange<Row>[]
  updatedRow: Row
}
export interface TableEditEndParams<
  Row extends object = TableRow,
> extends TableEditRecord<Row> {
  reason: TableEditReason
}
export interface TableEditSlotParams<
  Row extends object = TableRow,
> extends TableEditContext<Row> {
  mode: TableEditMode
  error?: string
  validating?: boolean
  draftRow: Row
  setValue: (value: unknown) => void
  commit: () => Promise<boolean>
  cancel: () => void
}
export type TableEditRenderer<Row extends object = TableRow> = (
  params: TableEditSlotParams<Row>,
) => VNodeChild
