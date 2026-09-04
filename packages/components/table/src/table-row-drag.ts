import type { TableRow, TableRowKey } from './table'

export type TableRowDropPosition = 'before' | 'after'
export interface TableRowDragContext<Row extends TableRow = TableRow> {
  row: Row
  rowKey: TableRowKey
  /** Index in the current flattened page. */
  rowIndex: number
}
export interface TableRowDropContext<
  Row extends TableRow = TableRow,
> extends TableRowDragContext<Row> {
  targetRow: Row
  targetKey: TableRowKey
  targetIndex: number
  position: TableRowDropPosition
}
export interface TableRowReorderRequest<
  Row extends TableRow = TableRow,
> extends TableRowDropContext<Row> {
  /** Positions in the source sibling array, independent of filtering/pagination. */
  oldIndex: number
  newIndex: number
  parentKey?: TableRowKey
  /** Accept this exact array; absent for generated sources. */
  data?: Row[]
  signal: AbortSignal
}
export interface TableRowDragConfig<Row extends TableRow = TableRow> {
  enabled?: boolean
  autoScroll?: boolean
  /** Edge zone in CSS pixels; defaults to 40. */
  scrollThreshold?: number
  /** Maximum auto-scroll distance per animation frame; defaults to 16. */
  scrollSpeed?: number
  checkMethod?: (context: TableRowDragContext<Row>) => boolean
  dropMethod?: (context: TableRowDropContext<Row>) => boolean
  /** Required for generated sources. Honor signal before accepting a proposal. */
  apply?: (request: TableRowReorderRequest<Row>) => boolean | Promise<boolean>
}
export interface TableRowDragResult<Row extends TableRow = TableRow> {
  applied: boolean
  reason?: 'disabled' | 'busy' | 'invalid' | 'empty' | 'rejected' | 'cancelled'
  request?: TableRowReorderRequest<Row>
  error?: unknown
}
