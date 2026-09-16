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
  PublicProps,
  VNode,
  VNodeChild,
} from 'vue'
import type Table from './table.vue'
import type { FieldPath, Recordable } from '../../types'
import type {
  TableChartConfig,
  TableChartOptions,
  TableChartResult,
  TableChartState,
} from './table-chart'
import type {
  TableFindConfig,
  TableFindNavigateOptions,
  TableFindOptions,
  TableFindQuery,
  TableFindResult,
  TableFindState,
  TableReplaceOptions,
  TableReplaceResult,
} from './table-find'
import type {
  TableClipboardConfig,
  TableClipboardData,
  TableClipboardOptions,
  TableClipboardResult,
  TableCopyOptions,
} from './table-clipboard'
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
import type { TableFooterConfig } from './table-footer-config'
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
import type { FormModel } from '@vuesax-alpha/components/form'
import type {
  TableBusinessExposes,
  TableProxyConfig,
  TableProxyResult,
  TableProxyState,
  TableQueryConfig,
  TableQueryContext,
  TableToolbarConfig,
} from './table-business'
import type {
  TableEditConfig,
  TableEditEndParams,
  TableEditRecord,
  TableEditRenderer,
  TableEditSlotParams,
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
export * from './table-clipboard'
export * from './table-find'
export * from './table-chart'
export * from './table-context-menu'
export * from './table-keyboard'
export * from './table-cell-range'
export * from './table-merge'
export * from './table-group'
export * from './table-footer-config'
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
export * from './table-business'
export type { TableGlobalConfig } from './table-global-config'
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
/** Dynamic fallback used when an application does not supply its own row type. */
export type TableRow = Recordable
export type TableModelValueType = string | number | object
export type TableAlign = 'left' | 'center' | 'right'
export type TableColumnType = 'seq' | 'checkbox' | 'radio' | 'expand'
export type TableColumnFixed = boolean | 'left' | 'right'
export interface TableColumnPlacement {
  /** Parent group key; null places the node at the root level. */
  parentKey: string | null
  /** Zero-based position among the parent's direct children. */
  index: number
}
export interface TableColumnState {
  /** Leaf or group key; virtualSource uses its original index string. */
  key: string
  hidden?: boolean
  /** Zero-based position in the complete order, including hidden columns. */
  order?: number
  fixed?: TableColumnFixed
  /** Optional hierarchy override. Omit it to retain the declared parent. */
  placement?: TableColumnPlacement
}
export type TableOverflow = boolean | 'ellipsis' | 'title' | 'tooltip'
export type TableSortOrder = 'asc' | 'desc'
export interface TableResizeConfig {
  enabled?: boolean
  minWidth?: number
  keyboardStep?: number
}
export type TableColumnWidths = Record<string, number>
export interface TableColumnResizeParams<Row extends object = TableRow> {
  column: TableColumn<Row>
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
export type TableSortComparator<Row extends object = TableRow> = (
  a: unknown,
  b: unknown,
  rowA: Row,
  rowB: Row,
) => boolean | number
export type TableSortMethod<Row extends object = TableRow> =
  'number' | 'string' | TableSortComparator<Row>
export interface TableSort<Row extends object = TableRow> {
  field: FieldPath<Row>
  order: TableSortOrder
}
export interface TableSortConfig<Row extends object = TableRow> {
  multiple?: boolean
  remote?: boolean
  defaultSort?: TableSort<Row>[]
}
export type TableFilterValue = TableModelValueType | boolean | Date | null
export interface TableFilterOption {
  label: string
  value: TableFilterValue
  disabled?: boolean
}
export type TableFilters<Row extends object = TableRow> = Partial<
  Record<FieldPath<Row>, TableFilterValue[]>
>
export interface TableFilterConfig<Row extends object = TableRow> {
  remote?: boolean
  defaultFilters?: TableFilters<Row>
}
export interface TableFilterParams<Row extends object = TableRow> {
  row: Row
  column: TableColumn<Row>
  value: unknown
  values: TableFilterValue[]
}
export interface TableFilterSlotParams<Row extends object = TableRow> {
  column: TableColumn<Row>
  values: TableFilterValue[]
  disabled: boolean
  setValues: (values: TableFilterValue[]) => void
  apply: () => void
  reset: () => void
  close: () => void
}
export interface TableSelectionConfig<Row extends object = TableRow> {
  trigger?: 'row' | 'cell'
  reserve?: boolean
  showSelectAll?: boolean
  selectableMethod?: (params: { row: Row; rowIndex: number }) => boolean
}

export interface TableColumnSlots<Row extends object = TableRow> {
  edit?: string
  default?: string | TableCellRenderer<Row>
  header?: string
  footer?: string
  filter?: string
}

export interface TableFlatRow<Row extends object = TableRow> {
  row: Row
  key: TableRowKey
  index: number
  depth: number
  parentKey?: TableRowKey
  hasChildren: boolean
  expanded: boolean
  loading: boolean
  ancestorHasNext?: readonly boolean[]
  isLastChild?: boolean
}

export interface TableDetailParams<Row extends object = TableRow> {
  row: Row
  rowKey: TableRowKey
  rowIndex: number
}
export interface TableDetailLoadParams<
  Row extends object = TableRow,
> extends TableDetailParams<Row> {
  signal: AbortSignal
}
export interface TableDetailConfig<Row extends object = TableRow> {
  enabled?: boolean
  defaultExpandedKeys?: TableRowKey[]
  expandableMethod?: (params: TableDetailParams<Row>) => boolean
  load?: (params: TableDetailLoadParams<Row>) => Promise<unknown>
}
export interface TableDetailSlotParams<
  Row extends object = TableRow,
> extends TableDetailParams<Row> {
  loading: boolean
  data: unknown
  error: unknown
  reload: () => Promise<void>
  close: () => Promise<void>
}
export interface TableDetailExpandParams<
  Row extends object = TableRow,
> extends TableDetailParams<Row> {
  expanded: boolean
}

export interface TableCellRenderParams<Row extends object = TableRow> {
  row: Row
  column: TableColumn<Row>
  value: unknown
  /** VXE-style alias of rowIndex for configured render functions. */
  index: number
  rowIndex: number
  columnIndex: number
  depth: number
  expanded: boolean
  loading: boolean
  toggleExpand: (expanded?: boolean) => Promise<void>
}

export interface TableHeaderRenderParams<Row extends object = TableRow> {
  column: TableColumn<Row>
  columnIndex: number
}

export type TableCellRenderer<Row extends object = TableRow> = (
  params: TableCellRenderParams<Row>,
) => VNodeChild

export type TableHeaderRenderer<Row extends object = TableRow> = (
  params: TableHeaderRenderParams<Row>,
) => VNodeChild

export interface TableFooterCellRenderParams<Row extends object = TableRow> {
  /** The supplied footer record, independent of body rows. */
  row: TableRow
  column: TableColumn<Row>
  value: unknown
  rowIndex: number
  columnIndex: number
}

export type TableFooterRenderer<Row extends object = TableRow> = (
  params: TableFooterCellRenderParams<Row>,
) => VNodeChild

export type TableFooterFormatter<Row extends object = TableRow> = (
  params: TableFooterCellRenderParams<Row>,
) => string | number | null | undefined

export type TableFilterRenderer<Row extends object = TableRow> = (
  params: TableFilterSlotParams<Row>,
) => VNodeChild

export type TableRendererEvent<Row extends object = TableRow> = (
  params:
    | TableCellRenderParams<Row>
    | TableEditSlotParams<Row>
    | TableFilterSlotParams<Row>,
  ...args: unknown[]
) => unknown

export interface TableRendererOptions<Row extends object = TableRow> {
  name: string
  props?: Record<string, unknown>
  attrs?: Record<string, unknown>
  events?: Record<string, TableRendererEvent<Row>>
  options?: unknown[]
}

export interface TableRenderer<Row extends object = TableRow> {
  edit?: TableEditRenderer<Row>
  cell?: TableCellRenderer<Row>
  header?: TableHeaderRenderer<Row>
  footer?: TableFooterRenderer<Row>
  filter?: TableFilterRenderer<Row>
}

export interface TableColumnOptions<Row extends object = TableRow> {
  rules?: TableValidationRule<Row> | TableValidationRule<Row>[]
  editor?: boolean | TableEditorConfig<Row>
  edit?: TableEditRenderer<Row>
  /** Nested header groups. Only leaf columns render data cells. */
  children?: TableColumn<Row>[]
  type?: TableColumnType
  field?: FieldPath<Row>
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
  filterRender?: TableRendererOptions<Row>
  showOverflow?: TableOverflow
  showHeaderOverflow?: TableOverflow
  showFooterOverflow?: TableOverflow
  slots?: TableColumnSlots<Row>
  renderer?:
    | string
    | TableRendererOptions<Row>
    | TableRenderer<Row>
    | TableCellRenderer<Row>
  cell?: TableCellRenderer<Row>
  header?: TableHeaderRenderer<Row>
  footer?: TableFooterRenderer<Row>
  footerFormatter?: TableFooterFormatter<Row>
}

export interface TableColumn<
  Row extends object = TableRow,
> extends TableColumnOptions<Row> {
  key?: string
}

export interface TableRenderedColumnEntry<Row extends object = TableRow> {
  kind: 'column'
  key: string
  column: TableColumn<Row>
  index: number
  style: CSSProperties
  ariaIndex?: number
  fixed?: 'left' | 'right'
  fixedBoundary?: boolean
  /** Suppress content clipped by a fixed band in the horizontal viewport. */
  edgeFragment?: boolean
}

export interface TableRenderedSpacerEntry {
  kind: 'spacer'
  key: string
  width: number
}

export type TableRenderedEntry<Row extends object = TableRow> =
  TableRenderedColumnEntry<Row> | TableRenderedSpacerEntry

export interface TableColumnRegistration {
  register: (
    id: symbol,
    column: TableColumn,
    anchor?: () => Node | null | undefined,
  ) => void
  update: (id: symbol, column: TableColumn) => void
  unregister: (id: symbol) => void
}

export const tableColumnRegistrationKey: InjectionKey<TableColumnRegistration> =
  Symbol('tableColumnRegistration')

export interface TableTreeLoadParams<Row extends object = TableRow> {
  row: Row
  rowKey: TableRowKey
}

export interface TableTreeConfig<Row extends object = TableRow> {
  children?: FieldPath<Row>
  indent?: number
  line?: boolean
  expandAll?: boolean
  defaultExpandedKeys?: TableRowKey[]
  expandOnClickRow?: boolean
  hasChildren?: FieldPath<Row> | ((row: Row) => boolean)
  load?: (params: TableTreeLoadParams<Row>) => Promise<Row[]>
}

export interface TableParentIndicatorConfig {
  /** Whether to show the parent shortcut while scrolling hierarchical rows. */
  enabled?: boolean
  /** Milliseconds to keep the parent shortcut visible after scrolling stops. */
  hideDelay?: number
}

export interface TableParentIndicatorSlotParams {
  /** Stable key of the parent currently represented by the shortcut. */
  parentKey: TableRowKey
  /** Display label resolved from the parent group or tree row. */
  label: string
  /** Scroll the table back to the represented parent row. */
  jump: () => void
}

export interface TableVirtualConfig {
  enabled?: boolean
  /** Row viewport height. auto consumes the remaining height of a bounded parent. */
  height?: number | string
  estimateSize?: number
  overscan?: number
  dynamic?: boolean
  horizontal?: boolean
  columnOverscan?: number
}

export interface TableVirtualSource<Row extends object = TableRow> {
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

export interface TableHeaderGroup<Row extends object = TableRow> {
  key: string
  title?: string
  align?: TableAlign
  className?: string
  header?: TableHeaderRenderer<Row>
  slots?: TableColumnSlots<Row>
}

export type TableRowKeyGetter<Row extends object = TableRow> =
  FieldPath<Row> | ((row: Row, index: number) => TableRowKey)

export type TableRowClass<Row extends object = TableRow> =
  string | ((params: TableFlatRow<Row>) => string | string[] | undefined)

export const tableCoreProps = buildProps({
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
  clipboardConfig: {
    type: definePropType<boolean | TableClipboardConfig>([Boolean, Object]),
    default: false,
  },
  findConfig: {
    type: definePropType<boolean | TableFindConfig>([Boolean, Object]),
    default: false,
  },
  chartConfig: {
    type: definePropType<boolean | TableChartConfig>([Boolean, Object]),
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
  footerConfig: {
    type: definePropType<boolean | TableFooterConfig>([Boolean, Object]),
    default: false,
  },
  footerRowKey: {
    type: definePropType<TableRowKeyGetter>([String, Function]),
    default: undefined,
  },
  showFooterOverflow: {
    type: definePropType<TableOverflow>([Boolean, String]),
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
  parentIndicator: {
    type: definePropType<boolean | TableParentIndicatorConfig>([
      Boolean,
      Object,
    ]),
    default: true,
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

export const tableProps = buildProps({
  ...tableCoreProps,
  data: { ...tableCoreProps.data, default: undefined },
  proxyConfig: {
    type: definePropType<boolean | TableProxyConfig>([Boolean, Object]),
    default: false,
  },
  queryConfig: {
    type: definePropType<boolean | TableQueryConfig>([Boolean, Object]),
    default: false,
  },
  toolbarConfig: {
    type: definePropType<boolean | TableToolbarConfig>([Boolean, Object]),
    default: false,
  },
} as const)

export type TableCoreProps = ExtractPropTypes<typeof tableCoreProps>
type TableGenericPropKey =
  | 'changeConfig'
  | 'validationRules'
  | 'editConfig'
  | 'rowDragConfig'
  | 'clipboardConfig'
  | 'findConfig'
  | 'contextMenuConfig'
  | 'mergeConfig'
  | 'groupConfig'
  | 'detailConfig'
  | 'footerConfig'
  | 'highlight'
  | 'row'
  | 'data'
  | 'columns'
  | 'rowKey'
  | 'treeConfig'
  | 'virtualSource'
  | 'renderers'
  | 'rowClass'
  | 'sortBy'
  | 'sortConfig'
  | 'filters'
  | 'filterConfig'
  | 'selectionConfig'

export type TableProps<
  Row extends object = TableRow,
  QueryForm extends object = FormModel,
> = Omit<
  TableCoreProps,
  TableGenericPropKey | 'proxyConfig' | 'queryConfig' | 'toolbarConfig'
> & {
  changeConfig: boolean | TableChangeConfig<Row>
  validationRules: TableValidationRules<Row>
  editConfig: boolean | TableEditConfig<Row>
  rowDragConfig: boolean | TableRowDragConfig<Row>
  clipboardConfig: boolean | TableClipboardConfig<Row>
  findConfig: boolean | TableFindConfig<Row>
  contextMenuConfig: boolean | TableContextMenuConfig<Row>
  mergeConfig: boolean | TableMergeConfig<Row>
  groupConfig: boolean | TableGroupConfig<Row>
  detailConfig?: boolean | TableDetailConfig<Row>
  footerConfig: boolean | TableFooterConfig<Row>
  highlight?: Row | Row[] | null
  /** @deprecated Use highlight instead. */
  row?: Row | Row[] | null
  data?: Row[]
  columns: TableColumn<Row>[]
  rowKey: TableRowKeyGetter<Row>
  treeConfig?: TableTreeConfig<Row>
  virtualSource?: TableVirtualSource<Row>
  renderers: Record<string, TableRenderer<Row> | TableCellRenderer<Row>>
  rowClass: TableRowClass<Row>
  sortBy?: TableSort<Row>[]
  sortConfig: TableSortConfig<Row>
  filters?: TableFilters<Row>
  filterConfig: TableFilterConfig<Row>
  selectionConfig: TableSelectionConfig<Row>
  proxyConfig?: boolean | TableProxyConfig<Row, QueryForm>
  queryConfig?: boolean | TableQueryConfig<QueryForm>
  toolbarConfig?: boolean | TableToolbarConfig<Row, QueryForm>
}

export const tableCoreEmits = {
  findChange: (state: TableFindState) => isObject(state),
  chartChange: (state: TableChartState) => isObject(state),
  chartError: (error: unknown) => error !== undefined,
  replace: (result: TableReplaceResult) => isObject(result),
  clipboard: (result: TableClipboardResult) => isObject(result),
  'update:cellRange': (range: TableCellRange | null) =>
    range === null || isObject(range),
  cellRangeChange: (change: TableCellRangeChange) => isObject(change),
  cellRangeError: (error: unknown) => error !== undefined,
  'update:groupExpandedKeys': (keys: string[]) => isArray(keys),
  groupExpand: (params: { group: TableGroupNode; expanded: boolean }) =>
    isObject(params),
  groupError: (error: unknown) => error !== undefined,
  footerError: (error: unknown) => error !== undefined,
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

export const tableEmits = {
  ...tableCoreEmits,
  query: (context: TableQueryContext) => Boolean(context),
  queryError: (() => true) as (error: unknown) => boolean,
  proxyStateChange: (state: TableProxyState) => Boolean(state),
  proxySuccess: (result: TableProxyResult) => Boolean(result),
  proxyError: (result: TableProxyResult) => Boolean(result),
  toolbarClick: (code: string, context: TableQueryContext, event: MouseEvent) =>
    typeof code === 'string' && Boolean(context) && Boolean(event),
}

export type TableCoreEmits = typeof tableCoreEmits
export type TableCoreEmitFn = EmitFn<TableCoreEmits>
export type TableEmits = typeof tableEmits
export type TableBusinessEmitFn = EmitFn<TableEmits>

export interface SaxGridEventMap<
  Row extends object = TableRow,
  QueryForm extends object = FormModel,
> {
  findChange: [state: TableFindState]
  chartChange: [state: TableChartState]
  chartError: [error: unknown]
  replace: [result: TableReplaceResult<Row>]
  clipboard: [result: TableClipboardResult<Row>]
  'update:cellRange': [range: TableCellRange | null]
  cellRangeChange: [change: TableCellRangeChange]
  cellRangeError: [error: unknown]
  'update:groupExpandedKeys': [keys: string[]]
  groupExpand: [params: { group: TableGroupNode; expanded: boolean }]
  groupError: [error: unknown]
  footerError: [error: unknown]
  contextMenuOpen: [context: TableContextMenuContext<Row>]
  contextMenuClose: [context: TableContextMenuContext<Row>]
  contextMenuSelect: [params: TableContextMenuSelectParams<Row>]
  'update:activeCell': [cell: TableActiveCell | null]
  activeCellChange: [cell: TableActiveCell | null]
  rowDragStart: [context: TableRowDragContext<Row>]
  rowDragEnd: [result: TableRowDragResult<Row>]
  historyChange: [state: TableHistoryState]
  'update:data': [data: Row[]]
  changesChange: [version: number]
  dataChange: [operations: TableDataMutation<Row>[]]
  validation: [result: TableValidationResult<Row>]
  editStart: [params: TableEditRecord<Row>]
  editChange: [params: TableEditRecord<Row>]
  editCommit: [params: TableEditEndParams<Row>]
  editCancel: [params: TableEditEndParams<Row>]
  'update:detailExpandedKeys': [keys: TableRowKey[]]
  detailExpand: [params: TableDetailExpandParams<Row>]
  detailLoad: [params: TableDetailParams<Row> & { data: unknown }]
  detailLoadError: [params: TableDetailParams<Row> & { error: unknown }]
  'update:highlight': [value: Row | Row[] | null]
  'update:columnState': [state: TableColumnState[]]
  columnStateChange: [state: TableColumnState[]]
  columnStorageError: [
    event: {
      operation: 'read' | 'write'
      error: unknown
    },
  ]
  'update:row': [value: Row | Row[] | null]
  'update:columnWidths': [widths: TableColumnWidths]
  columnResize: [params: TableColumnResizeParams<Row>]
  'update:modelValue': [
    value: TableModelValueType | TableModelValueType[] | null,
  ]
  'update:expandedKeys': [keys: TableRowKey[]]
  rowClick: [row: Row, event: MouseEvent]
  cellClick: [params: TableCellRenderParams<Row>, event: MouseEvent]
  footerCellClick: [params: TableFooterCellRenderParams<Row>, event: MouseEvent]
  treeExpand: [row: Row, expanded: boolean]
  lazyLoad: [row: Row, children: Row[]]
  scroll: [event: Event]
  'update:sortBy': [sorts: TableSort<Row>[]]
  sortChange: [sorts: TableSort<Row>[]]
  'update:filters': [filters: TableFilters<Row>]
  filterChange: [filters: TableFilters<Row>]
  selectionChange: [rows: Row[]]
  'update:pagerConfig': [config: TablePagerConfig]
  pageChange: [page: TablePageChangeParams]
  query: [context: TableQueryContext<Row, QueryForm>]
  queryError: [error: unknown]
  proxyStateChange: [state: TableProxyState]
  proxySuccess: [result: TableProxyResult]
  proxyError: [result: TableProxyResult]
  toolbarClick: [
    code: string,
    context: TableQueryContext<Row, QueryForm>,
    event: MouseEvent,
  ]
}

type SaxGridEventPropName<Event extends string> = `on${Capitalize<Event>}`

export type SaxGridListenerProps<
  Row extends object = TableRow,
  QueryForm extends object = FormModel,
> = {
  [
    Event in Extract<
      keyof SaxGridEventMap<Row, QueryForm>,
      string
    > as SaxGridEventPropName<Event>
  ]?: (
    ...args: SaxGridEventMap<Row, QueryForm>[Event] extends unknown[]
      ? SaxGridEventMap<Row, QueryForm>[Event]
      : never
  ) => unknown
}

/** Public configuration object accepted by `v-bind` on STable. */
export type SaxGridSetting<
  Row extends object = TableRow,
  QueryForm extends object = FormModel,
> = Partial<TableProps<Row, QueryForm>> & SaxGridListenerProps<Row, QueryForm>

export type SaxGridEmitFn<
  Row extends object = TableRow,
  QueryForm extends object = FormModel,
> = <Event extends keyof SaxGridEventMap<Row, QueryForm>>(
  event: Event,
  ...args: SaxGridEventMap<Row, QueryForm>[Event]
) => void

export type TableEmitFn<
  Row extends object = TableRow,
  QueryForm extends object = FormModel,
> = SaxGridEmitFn<Row, QueryForm>

export interface TableSlots<
  Row extends object = TableRow,
  QueryForm extends object = FormModel,
> {
  default?(): unknown
  header?(): unknown
  footer?(): unknown
  notFound?(): unknown
  'toolbar-title'?(): unknown
  query?(params: TableExposes<Row, QueryForm> & { model: QueryForm }): unknown
  'query-actions'?(
    params: TableExposes<Row, QueryForm> & { busy: boolean },
  ): unknown
  toolbar_left?(
    params: TableExposes<Row, QueryForm> & { busy: boolean },
  ): unknown
  toolbar_right?(
    params: TableExposes<Row, QueryForm> & { busy: boolean },
  ): unknown
  'proxy-error'?(
    params: TableExposes<Row, QueryForm> & { state: TableProxyState },
  ): unknown
  cell?(params: TableCellRenderParams<Row>): unknown
  'header-cell'?(params: TableHeaderRenderParams<Row>): unknown
  'edit-cell'?(params: TableEditSlotParams<Row>): unknown
  'footer-cell'?(params: TableFooterCellRenderParams<Row>): unknown
  'group-header'?(params: { group: TableGroupNode; expanded: boolean }): unknown
  'group-summary'?(
    params: TableFooterCellRenderParams<Row> & {
      group?: TableGroupNode
      kind: string
    },
  ): unknown
  'parent-indicator'?(params: TableParentIndicatorSlotParams): unknown
  detail?(params: TableDetailSlotParams<Row>): unknown
  'detail-loading'?(params: TableDetailSlotParams<Row>): unknown
  'detail-error'?(params: TableDetailSlotParams<Row>): unknown
  [name: string]: ((params: any) => unknown) | undefined
}

export interface TableCoreExposes<Row extends object = TableRow> {
  getChartData: (options: TableChartOptions) => Promise<TableChartResult>
  openChart: (options: TableChartOptions) => Promise<TableChartResult>
  closeChart: () => void
  cancelChart: () => void
  getChartState: () => TableChartState
  openFind: () => Promise<boolean>
  closeFind: () => void
  findCells: (
    query: string | TableFindQuery,
    options?: TableFindOptions,
  ) => Promise<TableFindResult>
  findNext: (options?: TableFindNavigateOptions) => Promise<boolean>
  findPrevious: (options?: TableFindNavigateOptions) => Promise<boolean>
  replaceMatch: (
    replacement: string,
    options?: TableReplaceOptions,
  ) => Promise<TableReplaceResult<Row>>
  replaceAll: (
    replacement: string,
    options?: TableReplaceOptions,
  ) => Promise<TableReplaceResult<Row>>
  getFindState: () => TableFindState
  clearFind: () => void
  cancelFind: () => void
  copyCells: (options?: TableCopyOptions) => Promise<TableClipboardResult<Row>>
  cutCells: (options?: TableCopyOptions) => Promise<TableClipboardResult<Row>>
  pasteCells: (
    data?: string | TableClipboardData,
    options?: TableClipboardOptions,
  ) => Promise<TableClipboardResult<Row>>
  cancelClipboard: () => void
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
    values: Partial<Row>,
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
  /** Resolves after the next Vue update has requested row/footer remeasurement. */
  measure: () => Promise<void>
  setSort: (sorts: TableSort[]) => void
  clearSort: () => void
  setFilters: (filters: TableFilters<Row>) => void
  clearFilters: () => void
  getSelectedRows: () => Row[]
  setSelectedRows: (rows: Row[]) => void
  clearSelection: () => void
  toggleRowSelection: (row: Row, selected?: boolean) => void
  selectAll: (selected?: boolean) => void
}

export const tableCoreExposeKeys = [
  'getChartData',
  'openChart',
  'closeChart',
  'cancelChart',
  'getChartState',
  'openFind',
  'closeFind',
  'findCells',
  'findNext',
  'findPrevious',
  'replaceMatch',
  'replaceAll',
  'getFindState',
  'clearFind',
  'cancelFind',
  'copyCells',
  'cutCells',
  'pasteCells',
  'cancelClipboard',
  'setCellRange',
  'clearCellRange',
  'getCellRange',
  'getCellRangeBounds',
  'setGroupExpandedKeys',
  'toggleGroup',
  'getGroups',
  'getGroupSummary',
  'closeContextMenu',
  'setActiveCell',
  'clearActiveCell',
  'getActiveCell',
  'moveRow',
  'cancelRowDrag',
  'undo',
  'redo',
  'clearHistory',
  'getHistoryState',
  'insertRows',
  'removeRows',
  'updateRow',
  'revertChanges',
  'getChangeRecords',
  'acceptChanges',
  'resetChanges',
  'cancelDataChange',
  'validate',
  'validateRow',
  'validateCell',
  'clearValidation',
  'cancelValidation',
  'getValidationErrors',
  'scrollToValidationError',
  'startEdit',
  'commitEdit',
  'cancelEdit',
  'getEditRecord',
  'toggleRowDetail',
  'reloadRowDetail',
  'setDetailExpandedKeys',
  'toggleRowExpand',
  'setExpandedKeys',
  'scrollToRow',
  'scrollToColumn',
  'measure',
  'setSort',
  'clearSort',
  'setFilters',
  'clearFilters',
  'getSelectedRows',
  'setSelectedRows',
  'clearSelection',
  'toggleRowSelection',
  'selectAll',
] as const satisfies readonly (keyof TableCoreExposes)[]

export interface TableExposes<
  Row extends object = TableRow,
  QueryForm extends object = FormModel,
>
  extends TableCoreExposes<Row>, TableBusinessExposes<Row, QueryForm> {}

export type TableInstance<
  Row extends object = TableRow,
  QueryForm extends object = FormModel,
> = Omit<InstanceType<typeof Table>, '$props' | '$slots' | '$emit'> &
  TableExposes<Row, QueryForm> & {
    $props: SaxGridSetting<Row, QueryForm>
    $slots: TableSlots<Row, QueryForm>
    $emit: SaxGridEmitFn<Row, QueryForm>
  }

export type SaxGridInstance<
  Row extends object = TableRow,
  QueryForm extends object = FormModel,
> = TableInstance<Row, QueryForm>

export interface SaxTableSetupContext<
  Row extends object = TableRow,
  QueryForm extends object = FormModel,
> {
  props: PublicProps & SaxGridSetting<Row, QueryForm>
  expose: (exposed: TableExposes<Row, QueryForm>) => void
  attrs: Record<string, unknown>
  slots: TableSlots<Row, QueryForm>
  emit: SaxGridEmitFn<Row, QueryForm>
}

/** Generic public component signature used by Vue templates and TSX. */
export type SaxTableComponent = <
  Row extends object = TableRow,
  QueryForm extends object = FormModel,
>(
  props: PublicProps & SaxGridSetting<Row, QueryForm>,
  context?: Pick<
    SaxTableSetupContext<Row, QueryForm>,
    'attrs' | 'emit' | 'slots'
  >,
  exposed?: TableExposes<Row, QueryForm>,
  setup?: Promise<SaxTableSetupContext<Row, QueryForm>>,
) => VNode & { __ctx?: SaxTableSetupContext<Row, QueryForm> }
