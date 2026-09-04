import { UPDATE_MODEL_EVENT } from '@vuesax-alpha/constants'
import {
  buildProps,
  definePropType,
  isArray,
  isNumber,
  isObject,
  isString,
} from '@vuesax-alpha/utils'
import type { EmitFn } from '@vuesax-alpha/utils'
import type {
  CSSProperties,
  ExtractPropTypes,
  InjectionKey,
  VNodeChild,
} from 'vue'
import type Table from './table.vue'
import type {
  TableContextMenuConfig,
  TableContextMenuContext,
  TableContextMenuSelectParams,
} from './table-context-menu'
import type { TableActiveCell, TableKeyboardConfig } from './table-keyboard'
import type {
  TableCellRange,
  TableCellRangeBounds,
  TableCellRangeChange,
  TableRangeConfig,
} from './table-cell-range'
import type { TableMergeConfig } from './table-merge'
import type { TableGroupConfig, TableGroupNode } from './table-group'
import type {
  TableRowDragConfig,
  TableRowDragContext,
  TableRowDragResult,
  TableRowDropPosition,
} from './table-row-drag'
import type { TableHistoryConfig, TableHistoryState } from './table-history'
import type {
  TableChangeConfig,
  TableChangeRecords,
  TableDataMutation,
  TableDataMutationResult,
  TableDataPosition,
} from './table-changes'
import type { PaginationProps } from '@vuesax-alpha/components/pagination'
import type {
  TableEditConfig,
  TableEditEndParams,
  TableEditRecord,
  TableEditRenderer,
  TableEditorConfig,
} from './table-edit'
import type {
  TableValidateOptions,
  TableValidationConfig,
  TableValidationError,
  TableValidationResult,
  TableValidationRule,
  TableValidationRules,
} from './table-validation'
export * from './table-context-menu'
export * from './table-keyboard'
export * from './table-cell-range'
export * from './table-merge'
export * from './table-group'
export * from './table-row-drag'
export type { TableHistoryConfig, TableHistoryState } from './table-history'
export type {
  TableChangeConfig,
  TableChangeRecords,
  TableChangedRow,
  TableDataChangeRequest,
  TableDataFieldChange,
  TableDataFieldPatch,
  TableDataMutation,
  TableDataMutationResult,
  TableDataPosition,
} from './table-changes'
export * from './table-edit'
export type {
  TableValidateOptions,
  TableValidationConfig,
  TableValidationContext,
  TableValidationError,
  TableValidationResult,
  TableValidationRule,
  TableValidationRules,
  TableValidationType,
} from './table-validation'

export type TableRowKey = string | number
export type TableRow = Record<string, unknown>
export type TableModelValueType = string | number | object
export type TableAlign = 'left' | 'center' | 'right'
export type TableColumnType = 'seq' | 'checkbox' | 'radio' | 'expand'
export type TableColumnFixed = boolean | 'left' | 'right'
export interface TableColumnState {
  /** Column key, field, or @originalIndex; virtualSource uses its original index string. */
  key: string
  hidden?: boolean
  /** Zero-based position in the complete order, including hidden columns. */
  order?: number
  fixed?: TableColumnFixed
}
export interface TableColumnManagerConfig {
  enabled?: boolean
  /** Opt-in localStorage key. Controlled state is saved but never implicitly restored. */
  storageKey?: string
}
export type TableOverflow = boolean | 'ellipsis' | 'title' | 'tooltip'
export type TableSortOrder = 'asc' | 'desc'
export interface TableResizeConfig {
  enabled?: boolean
  minWidth?: number
  keyboardStep?: number
}
export type TableColumnWidths = Record<string, number>
export interface TableColumnResizeParams {
  column: TableColumn
  columnIndex: number
  columnKey: string
  width: number
  oldWidth: number
  source: 'pointer' | 'keyboard'
}
export interface TablePagerConfig {
  enabled?: boolean
  currentPage?: number
  pageSize?: number
  remote?: boolean
  total?: number
  pageSizes?: number[]
  layout?: PaginationProps['layout']
  pagerCount?: number
  hideOnSinglePage?: boolean
  disabled?: boolean
  shape?: PaginationProps['shape']
}
export interface TablePageChangeParams {
  currentPage: number
  pageSize: number
  total: number
  type: 'current' | 'size' | 'reset' | 'clamp'
}
export type TableSortComparator<Row extends TableRow = TableRow> = (
  a: unknown,
  b: unknown,
  rowA: Row,
  rowB: Row,
) => boolean | number
export type TableSortMethod<Row extends TableRow = TableRow> =
  'number' | 'string' | TableSortComparator<Row>
export interface TableSort {
  field: string
  order: TableSortOrder
}
export interface TableSortConfig {
  multiple?: boolean
  remote?: boolean
  defaultSort?: TableSort[]
}
export type TableFilterValue = string | number | boolean
export interface TableFilterOption {
  label: string
  value: TableFilterValue
  disabled?: boolean
}
export type TableFilters = Record<string, TableFilterValue[]>
export interface TableFilterConfig {
  remote?: boolean
  defaultFilters?: TableFilters
}
export interface TableFilterParams<Row extends TableRow = TableRow> {
  row: Row
  column: TableColumn<Row>
  value: unknown
  values: TableFilterValue[]
}
export interface TableFilterSlotParams<Row extends TableRow = TableRow> {
  column: TableColumn<Row>
  values: TableFilterValue[]
  setValues: (values: TableFilterValue[]) => void
  apply: () => void
  reset: () => void
  close: () => void
}
export interface TableSelectionConfig<Row extends TableRow = TableRow> {
  trigger?: 'row' | 'cell'
  reserve?: boolean
  showSelectAll?: boolean
  checkMethod?: (params: { row: Row; rowIndex: number }) => boolean
}

export interface TableColumnSlots {
  edit?: string
  default?: string
  header?: string
  footer?: string
  filter?: string
}

export interface TableFlatRow<Row extends TableRow = TableRow> {
  row: Row
  key: TableRowKey
  index: number
  depth: number
  parentKey?: TableRowKey
  hasChildren: boolean
  expanded: boolean
  loading: boolean
}

export interface TableDetailParams<Row extends TableRow = TableRow> {
  row: Row
  rowKey: TableRowKey
  rowIndex: number
}
export interface TableDetailLoadParams<
  Row extends TableRow = TableRow,
> extends TableDetailParams<Row> {
  signal: AbortSignal
}
export interface TableDetailConfig<Row extends TableRow = TableRow> {
  enabled?: boolean
  defaultExpandedKeys?: TableRowKey[]
  checkMethod?: (params: TableDetailParams<Row>) => boolean
  load?: (params: TableDetailLoadParams<Row>) => Promise<unknown>
}
export interface TableDetailSlotParams<
  Row extends TableRow = TableRow,
> extends TableDetailParams<Row> {
  loading: boolean
  data: unknown
  error: unknown
  reload: () => Promise<void>
  close: () => Promise<void>
}
export interface TableDetailExpandParams<
  Row extends TableRow = TableRow,
> extends TableDetailParams<Row> {
  expanded: boolean
}

export interface TableCellRenderParams<Row extends TableRow = TableRow> {
  row: Row
  column: TableColumn<Row>
  value: unknown
  rowIndex: number
  columnIndex: number
  depth: number
  expanded: boolean
  loading: boolean
  toggleExpand: (expanded?: boolean) => Promise<void>
}

export interface TableHeaderRenderParams<Row extends TableRow = TableRow> {
  column: TableColumn<Row>
  columnIndex: number
}

export type TableCellRenderer<Row extends TableRow = TableRow> = (
  params: TableCellRenderParams<Row>,
) => VNodeChild

export type TableHeaderRenderer<Row extends TableRow = TableRow> = (
  params: TableHeaderRenderParams<Row>,
) => VNodeChild

export interface TableFooterCellRenderParams<Row extends TableRow = TableRow> {
  /** The supplied footer record, independent of body rows. */
  row: TableRow
  column: TableColumn<Row>
  value: unknown
  rowIndex: number
  columnIndex: number
}

export type TableFooterRenderer<Row extends TableRow = TableRow> = (
  params: TableFooterCellRenderParams<Row>,
) => VNodeChild

export type TableFooterFormatter<Row extends TableRow = TableRow> = (
  params: TableFooterCellRenderParams<Row>,
) => string | number | null | undefined

export interface TableRenderer<Row extends TableRow = TableRow> {
  edit?: TableEditRenderer<Row>
  cell?: TableCellRenderer<Row>
  header?: TableHeaderRenderer<Row>
  footer?: TableFooterRenderer<Row>
}

export interface TableColumnOptions<Row extends TableRow = TableRow> {
  rules?: TableValidationRule<Row> | TableValidationRule<Row>[]
  editor?: boolean | TableEditorConfig<Row>
  edit?: TableEditRenderer<Row>
  /** Nested header groups. Only leaf columns render data cells. */
  children?: TableColumn<Row>[]
  type?: TableColumnType
  field?: string
  title?: string
  width?: number | string
  minWidth?: number | string
  resizable?: boolean
  /** Show a drag handle when rowDragConfig is enabled. */
  dragSort?: boolean
  align?: TableAlign
  footerAlign?: TableAlign
  fixed?: TableColumnFixed
  className?: string
  treeNode?: boolean
  sortable?: boolean
  sortMethod?: TableSortMethod<Row>
  filters?: TableFilterOption[]
  filterMultiple?: boolean
  filterMethod?: (params: TableFilterParams<Row>) => boolean
  showOverflow?: TableOverflow
  showHeaderOverflow?: TableOverflow
  showFooterOverflow?: TableOverflow
  slots?: TableColumnSlots
  renderer?: string | TableRenderer<Row> | TableCellRenderer<Row>
  cell?: TableCellRenderer<Row>
  header?: TableHeaderRenderer<Row>
  footer?: TableFooterRenderer<Row>
  footerFormatter?: TableFooterFormatter<Row>
}

export interface TableColumn<
  Row extends TableRow = TableRow,
> extends TableColumnOptions<Row> {
  key?: string
}

export interface TableRenderedColumnEntry<Row extends TableRow = TableRow> {
  kind: 'column'
  key: string
  column: TableColumn<Row>
  index: number
  style: CSSProperties
  ariaIndex?: number
  fixed?: 'left' | 'right'
  fixedBoundary?: boolean
}

export interface TableRenderedSpacerEntry {
  kind: 'spacer'
  key: string
  width: number
}

export type TableRenderedEntry<Row extends TableRow = TableRow> =
  TableRenderedColumnEntry<Row> | TableRenderedSpacerEntry

export interface TableColumnRegistration {
  register: (id: symbol, column: TableColumn) => void
  update: (id: symbol, column: TableColumn) => void
  unregister: (id: symbol) => void
}

export const tableColumnRegistrationKey: InjectionKey<TableColumnRegistration> =
  Symbol('tableColumnRegistration')

export interface TableTreeLoadParams<Row extends TableRow = TableRow> {
  row: Row
  rowKey: TableRowKey
}

export interface TableTreeConfig<Row extends TableRow = TableRow> {
  children?: string
  indent?: number
  expandAll?: boolean
  defaultExpandedKeys?: TableRowKey[]
  expandOnClickRow?: boolean
  hasChildren?: string | ((row: Row) => boolean)
  load?: (params: TableTreeLoadParams<Row>) => Promise<Row[]>
}

export interface TableVirtualConfig {
  enabled?: boolean
  height?: number | string
  estimateSize?: number
  overscan?: number
  dynamic?: boolean
  horizontal?: boolean
  columnOverscan?: number
}

export interface TableVirtualSource<Row extends TableRow = TableRow> {
  rowCount: number
  columnCount: number
  row: (index: number) => Row
  rowKey?: (index: number) => TableRowKey
  column: (index: number) => TableColumn<Row>
  columnWidth: number | ((index: number) => number)
  fixedLeftCount?: number
  fixedRightCount?: number
  /** Stable header row count, including the leaf row. */
  headerDepth?: number
  /** Ancestors of one generated leaf, from outermost to innermost. */
  headerPath?: (index: number) => TableHeaderGroup<Row>[]
}

export interface TableHeaderGroup<Row extends TableRow = TableRow> {
  key: string
  title?: string
  align?: TableAlign
  className?: string
  header?: TableHeaderRenderer<Row>
  slots?: TableColumnSlots
}

export type TableRowKeyGetter<Row extends TableRow = TableRow> =
  string | ((row: Row, index: number) => TableRowKey)

export type TableRowClass<Row extends TableRow = TableRow> =
  string | ((params: TableFlatRow<Row>) => string | string[] | undefined)

export const tableProps = buildProps({
  historyConfig: {
    type: definePropType<boolean | TableHistoryConfig>([Boolean, Object]),
    default: false,
  },
  changeConfig: {
    type: definePropType<boolean | TableChangeConfig>([Boolean, Object]),
    default: false,
  },
  validationRules: {
    type: definePropType<TableValidationRules>(Object),
    default: () => ({}),
  },
  validationConfig: {
    type: definePropType<boolean | TableValidationConfig>([Boolean, Object]),
    default: false,
  },
  editConfig: {
    type: definePropType<boolean | TableEditConfig>([Boolean, Object]),
    default: false,
  },
  rowDragConfig: {
    type: definePropType<boolean | TableRowDragConfig>([Boolean, Object]),
    default: false,
  },
  keyboardConfig: {
    type: definePropType<boolean | TableKeyboardConfig>([Boolean, Object]),
    default: false,
  },
  rangeConfig: {
    type: definePropType<boolean | TableRangeConfig>([Boolean, Object]),
    default: false,
  },
  cellRange: {
    type: definePropType<TableCellRange | null>(Object),
    default: undefined,
  },
  contextMenuConfig: {
    type: definePropType<boolean | TableContextMenuConfig>([Boolean, Object]),
    default: false,
  },
  mergeConfig: {
    type: definePropType<boolean | TableMergeConfig>([Boolean, Object]),
    default: false,
  },
  groupConfig: {
    type: definePropType<boolean | TableGroupConfig>([Boolean, Object]),
    default: false,
  },
  groupExpandedKeys: {
    type: definePropType<string[]>(Array),
    default: undefined,
  },
  activeCell: {
    type: definePropType<TableActiveCell | null>(Object),
    default: undefined,
  },
  detailConfig: {
    type: definePropType<boolean | TableDetailConfig>([Boolean, Object]),
    default: undefined,
  },
  detailExpandedKeys: {
    type: definePropType<TableRowKey[]>(Array),
    default: undefined,
  },
  footerData: {
    type: definePropType<TableRow[]>(Array),
    default: () => [],
  },
  footerRowKey: {
    type: definePropType<TableRowKeyGetter>([String, Function]),
    default: undefined,
  },
  showFooterOverflow: {
    type: definePropType<TableOverflow>([Boolean, String]),
    default: false,
  },
  columnManagerConfig: {
    type: definePropType<boolean | TableColumnManagerConfig>([Boolean, Object]),
    default: false,
  },
  columnState: {
    type: definePropType<TableColumnState[]>(Array),
    default: undefined,
  },
  highlight: {
    type: definePropType<TableRow | TableRow[] | null | undefined>([
      Object,
      Array,
    ]),
    default: undefined,
  },
  /** @deprecated Use highlight instead. */
  row: {
    type: definePropType<TableRow | TableRow[] | null>([Object, Array]),
    default: undefined,
  },
  // Compatibility for consumers predating the named row model.
  modelValue: {
    type: definePropType<TableModelValueType | TableModelValueType[] | null>([
      Array,
      String,
      Number,
      Object,
    ]),
    default: null,
  },
  data: {
    type: definePropType<TableRow[]>(Array),
    default: () => [],
  },
  columns: {
    type: definePropType<TableColumn[]>(Array),
    default: () => [],
  },
  resizeConfig: {
    type: definePropType<boolean | TableResizeConfig>([Boolean, Object]),
    default: false,
  },
  columnWidths: {
    type: definePropType<TableColumnWidths | undefined>(Object),
    default: undefined,
  },
  rowKey: {
    type: definePropType<TableRowKeyGetter>([String, Function]),
    default: 'id',
  },
  treeConfig: {
    type: definePropType<TableTreeConfig | undefined>(Object),
    default: undefined,
  },
  virtualConfig: {
    type: definePropType<boolean | TableVirtualConfig>([Boolean, Object]),
    default: false,
  },
  virtualSource: {
    type: definePropType<TableVirtualSource | undefined>(Object),
    default: undefined,
  },
  expandedKeys: {
    type: definePropType<TableRowKey[] | undefined>(Array),
    default: undefined,
  },
  renderers: {
    type: definePropType<Record<string, TableRenderer | TableCellRenderer>>(
      Object,
    ),
    default: () => ({}),
  },
  rowClass: {
    type: definePropType<TableRowClass>([String, Function]),
    default: '',
  },
  sortBy: {
    type: definePropType<TableSort[] | undefined>(Array),
    default: undefined,
  },
  sortConfig: {
    type: definePropType<TableSortConfig>(Object),
    default: () => ({}),
  },
  filters: {
    type: definePropType<TableFilters | undefined>(Object),
    default: undefined,
  },
  filterConfig: {
    type: definePropType<TableFilterConfig>(Object),
    default: () => ({}),
  },
  selectionConfig: {
    type: definePropType<TableSelectionConfig>(Object),
    default: () => ({}),
  },
  showOverflow: {
    type: definePropType<TableOverflow>([Boolean, String]),
    default: false,
  },
  pagerConfig: {
    type: definePropType<boolean | TablePagerConfig>([Boolean, Object]),
    default: false,
  },
  showHeaderOverflow: {
    type: definePropType<TableOverflow>([Boolean, String]),
    default: false,
  },
  emptyText: String,
  showHeader: { type: Boolean, default: true },
  striped: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
} as const)

export type TableProps = ExtractPropTypes<typeof tableProps>

export const tableEmits = {
  'update:cellRange': (range: TableCellRange | null) =>
    range === null || isObject(range),
  cellRangeChange: (change: TableCellRangeChange) => isObject(change),
  cellRangeError: (error: unknown) => error !== undefined,
  'update:groupExpandedKeys': (keys: string[]) => isArray(keys),
  groupExpand: (params: { group: TableGroupNode; expanded: boolean }) =>
    isObject(params),
  groupError: (error: unknown) => error !== undefined,
  contextMenuOpen: (context: TableContextMenuContext) => isObject(context),
  contextMenuClose: (context: TableContextMenuContext) => isObject(context),
  contextMenuSelect: (params: TableContextMenuSelectParams) => isObject(params),
  'update:activeCell': (cell: TableActiveCell | null) =>
    cell === null || isObject(cell),
  activeCellChange: (cell: TableActiveCell | null) =>
    cell === null || isObject(cell),
  rowDragStart: (context: TableRowDragContext) => isObject(context),
  rowDragEnd: (result: TableRowDragResult) => isObject(result),
  historyChange: (state: TableHistoryState) => isObject(state),
  'update:data': (data: TableRow[]) => isArray(data),
  changesChange: (version: number) => isNumber(version),
  dataChange: (operations: TableDataMutation[]) => isArray(operations),
  validation: (result: TableValidationResult) => isObject(result),
  editStart: (params: TableEditRecord) => isObject(params),
  editChange: (params: TableEditRecord) => isObject(params),
  editCommit: (params: TableEditEndParams) => isObject(params),
  editCancel: (params: TableEditEndParams) => isObject(params),
  'update:detailExpandedKeys': (keys: TableRowKey[]) => isArray(keys),
  detailExpand: (params: TableDetailExpandParams) => isObject(params),
  detailLoad: (params: TableDetailParams & { data: unknown }) =>
    isObject(params),
  detailLoadError: (params: TableDetailParams & { error: unknown }) =>
    isObject(params),
  'update:highlight': (value: TableRow | TableRow[] | null) =>
    value == null || isObject(value) || isArray(value),
  'update:columnState': (state: TableColumnState[]) => isArray(state),
  columnStateChange: (state: TableColumnState[]) => isArray(state),
  columnStorageError: (event: {
    operation: 'read' | 'write'
    error: unknown
  }) => isObject(event),
  'update:row': (value: TableRow | TableRow[] | null) =>
    value == null || isObject(value) || isArray(value),
  'update:columnWidths': (widths: TableColumnWidths) => isObject(widths),
  columnResize: (params: TableColumnResizeParams) => isObject(params),
  [UPDATE_MODEL_EVENT]: (value: unknown) =>
    value == null ||
    isArray(value) ||
    isString(value) ||
    isNumber(value) ||
    isObject(value),
  'update:expandedKeys': (keys: TableRowKey[]) => Array.isArray(keys),
  rowClick: (row: TableRow, event: MouseEvent) =>
    isObject(row) && event instanceof MouseEvent,
  cellClick: (params: TableCellRenderParams, event: MouseEvent) =>
    isObject(params) && event instanceof MouseEvent,
  footerCellClick: (params: TableFooterCellRenderParams, event: MouseEvent) =>
    isObject(params) && event instanceof MouseEvent,
  treeExpand: (row: TableRow, expanded: boolean) =>
    isObject(row) && typeof expanded === 'boolean',
  lazyLoad: (row: TableRow, children: TableRow[]) =>
    isObject(row) && Array.isArray(children),
  scroll: (event: Event) => event instanceof Event,
  'update:sortBy': (sorts: TableSort[]) => Array.isArray(sorts),
  sortChange: (sorts: TableSort[]) => Array.isArray(sorts),
  'update:filters': (filters: TableFilters) => isObject(filters),
  filterChange: (filters: TableFilters) => isObject(filters),
  selectionChange: (rows: TableRow[]) => Array.isArray(rows),
  'update:pagerConfig': (config: TablePagerConfig) => isObject(config),
  pageChange: (page: TablePageChangeParams) => isObject(page),
}

export type TableEmits = typeof tableEmits
export type TableEmitFn = EmitFn<TableEmits>

export interface TableExposes<Row extends TableRow = TableRow> {
  setCellRange: (range: TableCellRange | null) => Promise<boolean>
  clearCellRange: () => Promise<boolean>
  getCellRange: () => TableCellRange | null
  getCellRangeBounds: () => TableCellRangeBounds | null
  setGroupExpandedKeys: (keys: readonly string[]) => Promise<boolean>
  toggleGroup: (key: string, expanded?: boolean) => Promise<boolean>
  getGroups: () => readonly TableGroupNode[]
  getGroupSummary: () => Readonly<Record<string, unknown>>
  closeContextMenu: () => void
  /** Page row / resolved column indices; generated sources use absolute source indices. */
  setActiveCell: (rowIndex: number, columnIndex: number) => Promise<boolean>
  clearActiveCell: () => Promise<boolean>
  getActiveCell: () => TableActiveCell | null
  /** Current flattened-page indices, including when using a paginated generated source. */
  moveRow: (
    from: number,
    to: number,
    position?: TableRowDropPosition,
  ) => Promise<TableRowDragResult<Row>>
  cancelRowDrag: () => void
  undo: () => Promise<TableDataMutationResult>
  redo: () => Promise<TableDataMutationResult>
  clearHistory: () => void
  getHistoryState: () => TableHistoryState
  insertRows: (
    rows: Row[],
    position?: Partial<TableDataPosition>,
  ) => Promise<TableDataMutationResult>
  removeRows: (rowKeys: TableRowKey[]) => Promise<TableDataMutationResult>
  updateRow: (
    rowKey: TableRowKey,
    values: Record<string, unknown>,
  ) => Promise<TableDataMutationResult>
  revertChanges: (rowKeys?: TableRowKey[]) => Promise<TableDataMutationResult>
  getChangeRecords: () => TableChangeRecords<Row>
  acceptChanges: (version: number, rowKeys?: TableRowKey[]) => boolean
  resetChanges: () => void
  cancelDataChange: () => void
  validate: (
    options?: TableValidateOptions<Row>,
  ) => Promise<TableValidationResult<Row>>
  validateRow: (
    rowOrIndex: Row | number,
    options?: TableValidateOptions<Row>,
  ) => Promise<TableValidationResult<Row>>
  validateCell: (
    rowOrIndex: Row | number,
    columnOrIndex: TableColumn<Row> | string | number,
    options?: TableValidateOptions<Row>,
  ) => Promise<TableValidationResult<Row>>
  clearValidation: (rowKey?: TableRowKey, field?: string) => void
  cancelValidation: () => void
  getValidationErrors: () => TableValidationError<Row>[]
  scrollToValidationError: (
    error?: TableValidationError<Row>,
  ) => Promise<boolean>
  startEdit: (
    rowOrIndex: Row | number,
    columnOrIndex: TableColumn<Row> | string | number,
  ) => Promise<boolean>
  commitEdit: () => Promise<boolean>
  cancelEdit: () => void
  getEditRecord: () => TableEditRecord<Row> | null
  toggleRowDetail: (
    rowOrIndex: Row | number,
    expanded?: boolean,
  ) => Promise<void>
  setDetailExpandedKeys: (keys: TableRowKey[]) => void
  reloadRowDetail: (rowOrIndex: Row | number) => Promise<void>
  toggleRowExpand: (row: Row, expanded?: boolean) => Promise<void>
  setExpandedKeys: (keys: TableRowKey[]) => void
  scrollToRow: (
    rowOrIndex: Row | TableRowKey | number,
    align?: 'auto' | 'start' | 'center' | 'end',
  ) => void
  scrollToColumn: (
    columnOrIndex: TableColumn<Row> | string | number,
    align?: 'auto' | 'start' | 'center' | 'end',
  ) => void
  measure: () => void
  setSort: (sorts: TableSort[]) => void
  clearSort: () => void
  setFilters: (filters: TableFilters) => void
  clearFilters: () => void
  getSelectedRows: () => Row[]
  setSelectedRows: (rows: Row[]) => void
  clearSelection: () => void
  toggleRowSelection: (row: Row, selected?: boolean) => void
  selectAll: (selected?: boolean) => void
}

export type TableInstance = InstanceType<typeof Table> & TableExposes
