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
import type { PaginationProps } from '@vuesax-alpha/components/pagination'

export type TableRowKey = string | number
export type TableRow = Record<string, unknown>
export type TableModelValueType = string | number | object
export type TableAlign = 'left' | 'center' | 'right'
export type TableColumnType = 'seq' | 'checkbox' | 'radio'
export type TableColumnFixed = boolean | 'left' | 'right'
export type TableOverflow = boolean | 'ellipsis' | 'title' | 'tooltip'
export type TableSortOrder = 'asc' | 'desc'
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
  default?: string
  header?: string
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

export interface TableRenderer<Row extends TableRow = TableRow> {
  cell?: TableCellRenderer<Row>
  header?: TableHeaderRenderer<Row>
}

export interface TableColumn<Row extends TableRow = TableRow> {
  key?: string
  type?: TableColumnType
  field?: string
  title?: string
  width?: number | string
  minWidth?: number | string
  align?: TableAlign
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
  slots?: TableColumnSlots
  renderer?: string | TableRenderer<Row> | TableCellRenderer<Row>
  cell?: TableCellRenderer<Row>
  header?: TableHeaderRenderer<Row>
}

export interface TableRenderedColumnEntry<Row extends TableRow = TableRow> {
  kind: 'column'
  key: string
  column: TableColumn<Row>
  index: number
  style: CSSProperties
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
}

export type TableRowKeyGetter<Row extends TableRow = TableRow> =
  string | ((row: Row, index: number) => TableRowKey)

export type TableRowClass<Row extends TableRow = TableRow> =
  string | ((params: TableFlatRow<Row>) => string | string[] | undefined)

export const tableProps = buildProps({
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
