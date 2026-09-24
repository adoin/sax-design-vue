import type { TableRow, TableRowKey } from './table'

export type TableRowDropPosition = 'before' | 'inside' | 'after'
export type TableRowDropInsidePosition = 'first' | 'last'
export interface TableRowDragContext<Row extends object = TableRow> {
  row: Row
  rowKey: TableRowKey
  /** Index in the current flattened page. */
  rowIndex: number
  depth: number
  parentKey?: TableRowKey
  hasChildren: boolean
  expanded: boolean
  /** Number of currently loaded direct children. */
  childCount: number
}
export interface TableRowDropContext<
  Row extends object = TableRow,
> extends TableRowDragContext<Row> {
  targetRow: Row
  targetKey: TableRowKey
  targetIndex: number
  targetDepth: number
  targetParentKey?: TableRowKey
  targetHasChildren: boolean
  targetExpanded: boolean
  /** Number of currently loaded direct children on the target. */
  targetChildCount: number
  position: TableRowDropPosition
  /** Positions in the old and proposed destination sibling arrays. */
  oldIndex: number
  newIndex: number
  oldParentKey?: TableRowKey
  newParentKey?: TableRowKey
  newDepth: number
  /** Deepest loaded descendant depth relative to the dragged row. */
  subtreeDepth: number
  reparented: boolean
}
export interface TableRowReorderRequest<
  Row extends object = TableRow,
> extends TableRowDropContext<Row> {
  /** Accept this exact array; absent for generated sources. */
  data?: Row[]
  signal: AbortSignal
}
export interface TableRowDragTreeConfig {
  /** Allow before/after drops to move a row between different parents. */
  allowReparent?: boolean
  /** Allow the middle target zone to append/prepend the row as a child. */
  allowDropInside?: boolean
  /** Child insertion side for an inside drop; defaults to last. */
  insidePosition?: TableRowDropInsidePosition
  /** Maximum zero-based depth for the complete moved subtree. */
  maxDepth?: number
  /** Expand the destination after an accepted inside drop; defaults to true. */
  expandOnDrop?: boolean
}
export interface TableRowDragConfig<Row extends object = TableRow> {
  enabled?: boolean
  autoScroll?: boolean
  /** Edge zone in CSS pixels; defaults to 40. */
  scrollThreshold?: number
  /** Maximum auto-scroll distance per animation frame; defaults to 16. */
  scrollSpeed?: number
  /** Enable cross-parent and inside drops for local tree data. */
  tree?: boolean | TableRowDragTreeConfig
  draggableMethod?: (context: TableRowDragContext<Row>) => boolean
  dropMethod?: (context: TableRowDropContext<Row>) => boolean
  /** Required for generated sources. Honor signal before accepting a proposal. */
  apply?: (request: TableRowReorderRequest<Row>) => boolean | Promise<boolean>
}
export interface TableRowDragResult<Row extends object = TableRow> {
  applied: boolean
  reason?: 'disabled' | 'busy' | 'invalid' | 'empty' | 'rejected' | 'cancelled'
  request?: TableRowReorderRequest<Row>
  error?: unknown
}
