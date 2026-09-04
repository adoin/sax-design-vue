import type {
  TableChartConversions,
  TableChartData,
  TableChartLimits,
  TableChartScan,
} from './chart-data'
import type { TableChartRequest } from './composables/table-chart-scope'

export type {
  TableChartConversionContext,
  TableChartConversions,
  TableChartData,
  TableChartLimit,
  TableChartLimits,
  TableChartScan,
  TableChartPoint,
  TableChartSeriesData,
  TableChartSeriesInfo,
  TableChartScope,
} from './chart-data'
export type {
  TableChartRequest,
  TableChartSeriesMapping,
} from './composables/table-chart-scope'

export type TableChartType = 'bar' | 'line'
export interface TableChartTheme {
  /** Resolved CSS colors, derived from the table's inherited HSL tokens. */
  primary: string
  text: string
  background: string
}
export interface TableChartRenderContext {
  data: Readonly<TableChartData>
  type: TableChartType
  theme: Readonly<TableChartTheme>
  signal: AbortSignal
}
export interface TableChartHandle {
  resize?: (width: number, height: number) => void
  dispose: () => void
}
export interface TableChartAdapter {
  /**
   * Mount only inside this container. Data/type/theme changes remount into a new
   * container; the old signal is aborted and its handle is disposed. A rejected
   * mount must release any resources it created before rejecting.
   */
  mount: (
    container: HTMLElement,
    context: TableChartRenderContext,
  ) => TableChartHandle | Promise<TableChartHandle>
}
export interface TableChartConfig
  extends TableChartLimits, TableChartConversions {
  enabled?: boolean
  /** Optional display adapter. Data extraction does not require an adapter. */
  adapter?: TableChartAdapter
}
export interface TableChartOptions extends TableChartRequest {
  signal?: AbortSignal
  type?: TableChartType
  title?: string
}
export interface TableChartState {
  pending: boolean
  visible: boolean
  type: TableChartType
  title: string
  scan?: Readonly<TableChartScan>
}
export interface TableChartResult {
  success: boolean
  scan?: Readonly<TableChartScan>
  reason?:
    | 'disabled'
    | 'editing'
    | 'cancelled'
    | 'invalid'
    | 'conflict'
    | 'limit'
    | 'adapter'
  error?: unknown
}
