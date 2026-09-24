import type {
  FormInstance,
  FormModel,
  FormProps,
} from '@vuesax-alpha/components/form'
import type { VNodeChild } from 'vue'
import type { ComponentSize } from '@vuesax-alpha/constants'
import type {
  TableChangeRecords,
  TableExposes,
  TableFilters,
  TablePagerConfig,
  TableRow,
  TableSort,
  TableValidateOptions,
} from './table'

export type TableSize = Exclude<ComponentSize, ''>

export type TableQueryFixedButton = 'submit' | 'reset' | 'more'

export interface TableQueryConfig<
  QueryForm extends object = FormModel,
> extends Partial<FormProps<QueryForm>> {
  enabled?: boolean
  size?: ComponentSize
  /** Ordered built-in actions; an empty array leaves the fixed area to its slot. */
  fixedButtons?: TableQueryFixedButton[]
  /** @deprecated Use fixedButtons instead. */
  showActions?: boolean
  submitText?: string
  resetText?: string
}

export interface TableQueryActionsState {
  expanded: boolean
  hasMore: boolean
  toggleMore: () => void
}

export interface TableToolbarRendererParams<
  Row extends object = TableRow,
  QueryForm extends object = FormModel,
> {
  table: TableExposes<Row, QueryForm>
  context: TableQueryContext<Row, QueryForm>
  placement: 'left' | 'right'
  size: TableSize
  busy: boolean
}

export type TableToolbarRendererEvent<
  Row extends object = TableRow,
  QueryForm extends object = FormModel,
> = (
  params: TableToolbarRendererParams<Row, QueryForm>,
  ...args: unknown[]
) => unknown

export interface TableToolbarRendererOptions<
  Row extends object = TableRow,
  QueryForm extends object = FormModel,
> {
  /** Renderer name from the shared global renderer registry. */
  itemRender: string
  key?: string
  props?: Record<string, unknown>
  attrs?: Record<string, unknown>
  events?: Record<string, TableToolbarRendererEvent<Row, QueryForm>>
  content?:
    | string
    | ((params: TableToolbarRendererParams<Row, QueryForm>) => VNodeChild)
  options?: unknown[]
  visible?: boolean
  disabled?: boolean
}

export interface TableToolbarConfig<
  Row extends object = TableRow,
  QueryForm extends object = FormModel,
> {
  enabled?: boolean
  size?: ComponentSize
  title?: string
  left?: TableToolbarRendererOptions<Row, QueryForm>[]
  right?: TableToolbarRendererOptions<Row, QueryForm>[]
}

export interface TableQueryContext<
  Row extends object = TableRow,
  QueryForm extends object = FormModel,
> {
  reason: 'submit' | 'reset' | 'refresh'
  form: QueryForm
  pager: TablePagerConfig | false
  sortBy: TableSort<Row>[]
  filters: TableFilters<Row>
}

export type TableProxyAction = 'query' | 'refresh' | 'save' | 'delete'

export interface TableProxyRequest<
  Row extends object = TableRow,
  QueryForm extends object = FormModel,
> extends TableQueryContext<Row, QueryForm> {
  action: TableProxyAction
  signal: AbortSignal
}

export interface TableProxyQueryResult<Row extends object = TableRow> {
  data: Row[]
  /** Required when pagination is enabled; counts root records for tree data. */
  total?: number
}

export interface TableProxySaveRequest<
  Row extends object = TableRow,
  QueryForm extends object = FormModel,
> extends TableProxyRequest<Row, QueryForm> {
  changes: TableChangeRecords<Row>
}

export interface TableProxyDeleteRequest<
  Row extends object = TableRow,
  QueryForm extends object = FormModel,
> extends TableProxyRequest<Row, QueryForm> {
  /** Read-only references to explicitly supplied or selected rows. */
  rows: Readonly<Row>[]
}

export interface TableProxyConfig<
  Row extends object = TableRow,
  QueryForm extends object = FormModel,
> {
  enabled?: boolean
  /** Change when switching remote datasets, even if callback identities stay stable. */
  dataKey?: string | number
  autoLoad?: boolean
  autoQuery?: boolean
  reloadAfterMutation?: boolean
  /** Optional validation scope for saves; generated sources require numeric column indices. */
  validationColumns?: TableValidateOptions<Row>['columns']
  query?: (
    request: TableProxyRequest<Row, QueryForm>,
  ) => TableProxyQueryResult<Row> | Promise<TableProxyQueryResult<Row>>
  save?: (
    request: TableProxySaveRequest<Row, QueryForm>,
  ) => boolean | void | Promise<boolean | void>
  delete?: (
    request: TableProxyDeleteRequest<Row, QueryForm>,
  ) => boolean | void | Promise<boolean | void>
}

export type TableProxyStatus =
  | 'success'
  | 'disabled'
  | 'busy'
  | 'cancelled'
  | 'rejected'
  | 'error'
  | 'dirty'
  | 'editing'
  | 'empty'
  | 'invalid'
  | 'stale'
  | 'unsupported'

export interface TableProxyResult {
  action: TableProxyAction
  status: TableProxyStatus
  error?: unknown
  /** A successful write remains successful if its subsequent reload fails. */
  reload?: TableProxyResult
}

export interface TableProxyState {
  loading: boolean
  action: TableProxyAction | null
  error: unknown
  result: TableProxyResult | null
}

export interface TableBusinessExposes<
  Row extends object = TableRow,
  QueryForm extends object = FormModel,
> {
  query: () => Promise<boolean>
  resetQuery: () => Promise<boolean>
  refresh: () => Promise<boolean>
  getQueryContext: () => TableQueryContext<Row, QueryForm>
  getForm: () => FormInstance | undefined
  commitProxy: (
    action: TableProxyAction,
    rows?: Row[],
  ) => Promise<TableProxyResult>
  cancelProxy: () => void
  getProxyState: () => TableProxyState
}
