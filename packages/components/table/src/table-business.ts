import type { ButtonProps } from '@vuesax-alpha/components/button'
import type {
  FormInstance,
  FormModel,
  FormProps,
} from '@vuesax-alpha/components/form'
import type {
  TableChangeRecords,
  TableFilters,
  TablePagerConfig,
  TableRow,
  TableSort,
  TableValidateOptions,
} from './table'

export interface TableQueryConfig extends Partial<FormProps> {
  enabled?: boolean
  showActions?: boolean
  submitText?: string
  resetText?: string
}

export interface TableToolbarButton {
  code: string
  text: string
  visible?: boolean
  disabled?: boolean
  loading?: boolean
  props?: Partial<ButtonProps>
}

export interface TableToolbarConfig {
  enabled?: boolean
  title?: string
  refresh?: boolean
  refreshText?: string
  buttons?: TableToolbarButton[]
}

export interface TableQueryContext {
  reason: 'submit' | 'reset' | 'refresh'
  form: FormModel
  pager: TablePagerConfig | false
  sortBy: TableSort[]
  filters: TableFilters
}

export type TableProxyAction = 'query' | 'refresh' | 'save' | 'delete'

export interface TableProxyRequest extends TableQueryContext {
  action: TableProxyAction
  signal: AbortSignal
}

export interface TableProxyQueryResult {
  data: TableRow[]
  /** Required when pagination is enabled; counts root records for tree data. */
  total?: number
}

export interface TableProxySaveRequest extends TableProxyRequest {
  changes: TableChangeRecords
}

export interface TableProxyDeleteRequest extends TableProxyRequest {
  /** Read-only references to explicitly supplied or selected rows. */
  rows: Readonly<TableRow>[]
}

export interface TableProxyConfig {
  enabled?: boolean
  /** Change when switching remote datasets, even if callback identities stay stable. */
  dataKey?: string | number
  autoLoad?: boolean
  autoQuery?: boolean
  reloadAfterMutation?: boolean
  /** Optional validation scope for saves; generated sources require numeric column indices. */
  validationColumns?: TableValidateOptions['columns']
  query?: (
    request: TableProxyRequest,
  ) => TableProxyQueryResult | Promise<TableProxyQueryResult>
  save?: (
    request: TableProxySaveRequest,
  ) => boolean | void | Promise<boolean | void>
  delete?: (
    request: TableProxyDeleteRequest,
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

export interface TableBusinessExposes {
  query: () => Promise<boolean>
  resetQuery: () => Promise<boolean>
  refresh: () => Promise<boolean>
  getQueryContext: () => TableQueryContext
  getForm: () => FormInstance | undefined
  commitProxy: (
    action: TableProxyAction,
    rows?: TableRow[],
  ) => Promise<TableProxyResult>
  cancelProxy: () => void
  getProxyState: () => TableProxyState
}
