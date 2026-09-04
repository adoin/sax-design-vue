import type {
  TableChangeRecords,
  TableRow,
  TableValidateOptions,
} from '@vuesax-alpha/components/table'
import type { TableGridQueryContext } from './table-grid'

export type TableGridProxyAction = 'query' | 'refresh' | 'save' | 'delete'
export interface TableGridProxyRequest extends TableGridQueryContext {
  action: TableGridProxyAction
  signal: AbortSignal
}
export interface TableGridProxyQueryResult {
  data: TableRow[]
  /** Required when pagination is enabled; counts root records for tree data. */
  total?: number
}
export interface TableGridProxySaveRequest extends TableGridProxyRequest {
  changes: TableChangeRecords
}
export interface TableGridProxyDeleteRequest extends TableGridProxyRequest {
  /** Read-only references to explicitly supplied or selected rows. */
  rows: Readonly<TableRow>[]
}
export interface TableGridProxyConfig {
  enabled?: boolean
  /** Change when switching remote datasets, even if callback identities stay stable. */
  dataKey?: string | number
  autoLoad?: boolean
  autoQuery?: boolean
  reloadAfterMutation?: boolean
  /** Optional validation scope for saves; generated sources require numeric column indices. */
  validationColumns?: TableValidateOptions['columns']
  query?: (
    request: TableGridProxyRequest,
  ) => TableGridProxyQueryResult | Promise<TableGridProxyQueryResult>
  save?: (
    request: TableGridProxySaveRequest,
  ) => boolean | void | Promise<boolean | void>
  delete?: (
    request: TableGridProxyDeleteRequest,
  ) => boolean | void | Promise<boolean | void>
}
export type TableGridProxyStatus =
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
export interface TableGridProxyResult {
  action: TableGridProxyAction
  status: TableGridProxyStatus
  error?: unknown
  /** A successful write remains successful if its subsequent reload fails. */
  reload?: TableGridProxyResult
}
export interface TableGridProxyState {
  loading: boolean
  action: TableGridProxyAction | null
  error: unknown
  result: TableGridProxyResult | null
}
