import { popperProps } from '@vuesax-alpha/components/popper'
import { useColorProp, useShapeProp } from '@vuesax-alpha/hooks'
import {
  buildProps,
  definePropType,
  isBoolean,
  isNumber,
  isObject,
  isString,
} from '@vuesax-alpha/utils'
import type {
  TableCellRenderParams,
  TableCellRenderer,
  TableColumn,
  TableRenderer,
  TableRow,
  TableRowClass,
  TableRowKey,
  TableRowKeyGetter,
  TableTreeConfig,
  TableVirtualConfig,
} from '@vuesax-alpha/components/table'
import type {
  OffsetOptions,
  Placement,
} from '@vuesax-alpha/hooks/use-floating/vue'
import type { CSSProperties, ExtractPropTypes } from 'vue'
import type TableSelect from './table-select.vue'

export interface TableSelectAffixConfig {
  icon?: string
  content?: string
}

export interface TableSelectPopupConfig {
  placement?: Placement
  transfer?: boolean
  appendTo?: string | HTMLElement
  offset?: OffsetOptions
  width?: number | string | 'full'
  full?: boolean
  matchTriggerWidth?: boolean
  minWidth?: number | string
  maxWidth?: number | string
  height?: number | string
  maxHeight?: number | string
  zIndex?: number
  className?: string
  style?: CSSProperties
}

export type TableSelectLabelFormatter = (row: TableRow) => string
export type TableSelectSelectable = (row: TableRow) => boolean

export const tableSelectProps = buildProps({
  modelValue: {
    type: definePropType<TableRowKey | undefined>([String, Number]),
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
  labelKey: { type: String, default: 'label' },
  labelFormatter: {
    type: definePropType<TableSelectLabelFormatter>(Function),
  },
  treeConfig: {
    type: definePropType<TableTreeConfig | undefined>(Object),
    default: undefined,
  },
  virtualConfig: {
    type: definePropType<boolean | TableVirtualConfig>([Boolean, Object]),
    default: false,
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
  selectable: {
    type: definePropType<TableSelectSelectable>(Function),
  },
  emptyText: String,
  showHeader: { type: Boolean, default: true },
  striped: Boolean,
  tableLoading: Boolean,
  closeOnSelect: { type: Boolean, default: true },
  placeholder: String,
  clearable: Boolean,
  disabled: popperProps.disabled,
  loading: Boolean,
  block: Boolean,
  shape: useShapeProp,
  color: { ...useColorProp, default: 'primary' },
  state: useColorProp,
  prefixIcon: String,
  suffixIcon: String,
  prefixConfig: {
    type: definePropType<TableSelectAffixConfig>(Object),
  },
  suffixConfig: {
    type: definePropType<TableSelectAffixConfig>(Object),
  },
  open: { type: Boolean, default: undefined },
  defaultOpen: Boolean,
  placement: {
    type: definePropType<Placement>(String),
    default: 'bottom-start',
  },
  teleported: { type: Boolean, default: true },
  flip: { ...popperProps.flip, default: true },
  strategy: { ...popperProps.strategy, default: 'absolute' },
  popupConfig: {
    type: definePropType<TableSelectPopupConfig>(Object),
    default: () => ({}),
  },
} as const)

export const tableSelectEmits = {
  'update:modelValue': (value: TableRowKey | undefined) =>
    value === undefined || isString(value) || isNumber(value),
  'update:open': (value: boolean) => isBoolean(value),
  'update:expandedKeys': (keys: TableRowKey[]) => Array.isArray(keys),
  'visible-change': (value: boolean) => isBoolean(value),
  change: (value: TableRowKey, row: TableRow) =>
    (isString(value) || isNumber(value)) && isObject(row),
  clear: () => true,
  rowClick: (row: TableRow, event: MouseEvent) =>
    isObject(row) && event instanceof MouseEvent,
  cellClick: (params: TableCellRenderParams, event: MouseEvent) =>
    isObject(params) && event instanceof MouseEvent,
  treeExpand: (row: TableRow, expanded: boolean) =>
    isObject(row) && isBoolean(expanded),
  lazyLoad: (row: TableRow, children: TableRow[]) =>
    isObject(row) && Array.isArray(children),
  scroll: (event: Event) => event instanceof Event,
  focus: (event: FocusEvent) => event instanceof FocusEvent,
  blur: (event: FocusEvent) => event instanceof FocusEvent,
  'prefix-click': (event: MouseEvent) => event instanceof MouseEvent,
  'suffix-click': (event: MouseEvent) => event instanceof MouseEvent,
}

export type TableSelectProps = ExtractPropTypes<typeof tableSelectProps>

export interface TableSelectExposes {
  open: () => void
  close: () => void
  toggleRowExpand: (
    row: TableRow,
    expanded?: boolean,
  ) => Promise<void> | undefined
  setExpandedKeys: (keys: TableRowKey[]) => void
  scrollToRow: (
    rowOrIndex: TableRow | TableRowKey,
    align?: 'auto' | 'start' | 'center' | 'end',
  ) => void
  /** Undefined until the popup's internal table has mounted. */
  measure: () => Promise<void> | undefined
}

export type TableSelectInstance = InstanceType<typeof TableSelect> &
  TableSelectExposes
