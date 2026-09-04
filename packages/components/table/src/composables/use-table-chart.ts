import { computed, onBeforeUnmount, shallowRef, watch } from 'vue'
import { TableChartLimitError, buildTableChartData } from '../chart-data'
import { TableDataBatchConflictError } from '../change-batch'
import type { WatchSource } from 'vue'
import type { TableEmitFn, TableProps } from '../table'
import type {
  TableChartOptions,
  TableChartResult,
  TableChartState,
} from '../table-chart'
import type { createTableChartScope } from './table-chart-scope'

interface Options {
  scope: ReturnType<typeof createTableChartScope>
  editing: () => boolean
  context: WatchSource[]
  selection: WatchSource
}

export function useTableChart(
  props: TableProps,
  emit: TableEmitFn,
  options: Options,
) {
  const config = computed(() =>
    typeof props.chartConfig === 'object' ? props.chartConfig : {},
  )
  const enabled = computed(
    () =>
      Boolean(props.chartConfig) &&
      config.value.enabled !== false &&
      !props.loading,
  )
  const state = shallowRef<TableChartState>({
    pending: false,
    visible: false,
    type: 'bar',
    title: '',
  })
  let request: AbortController | undefined
  let selected: TableChartOptions | undefined
  let disposed = false
  const getState = (): TableChartState => ({ ...state.value })
  const setState = (value: Partial<TableChartState>) => {
    state.value = { ...state.value, ...value }
    if (!disposed) emit('chartChange', getState())
  }
  const cancel = () => {
    request?.abort()
    request = undefined
    if (state.value.pending) setState({ pending: false })
  }
  const close = () => {
    cancel()
    if (state.value.visible || state.value.scan)
      setState({ visible: false, scan: undefined })
  }
  const extract = async (
    input: TableChartOptions,
    show = false,
  ): Promise<TableChartResult> => {
    if (disposed || !enabled.value)
      return { success: false, reason: 'disabled' }
    if (options.editing()) return { success: false, reason: 'editing' }
    if (show && !config.value.adapter)
      return { success: false, reason: 'adapter' }
    cancel()
    const controller = new AbortController()
    request = controller
    const abort = () => controller.abort()
    const signal = input.signal
    signal?.addEventListener('abort', abort, { once: true })
    if (signal?.aborted) abort()
    const current = () =>
      !disposed &&
      request === controller &&
      enabled.value &&
      !controller.signal.aborted &&
      !options.editing()
    try {
      const type = input.type ?? 'bar'
      if (type !== 'bar' && type !== 'line')
        throw new TypeError('Invalid chart type')
      selected = {
        ...input,
        bounds: input.bounds && { ...input.bounds },
        series: input.series.map((series) => ({ ...series })),
        groupKeys: input.groupKeys && [...input.groupKeys],
        signal: undefined,
      }
      setState({
        pending: true,
        visible: show && state.value.visible,
        scan: show && state.value.visible ? state.value.scan : undefined,
        type,
        title: input.title ?? '',
      })
      const scan = Object.freeze(
        await buildTableChartData({
          ...config.value,
          ...options.scope(selected, config.value, current),
          signal: controller.signal,
          current,
        }),
      )
      if (!current()) return { success: false, reason: 'cancelled' }
      setState({ pending: false, scan, visible: show && scan.complete })
      return {
        success: scan.complete,
        scan,
        reason: scan.complete ? undefined : 'limit',
      }
    } catch (error) {
      const reason =
        !current() ||
        (error instanceof DOMException && error.name === 'AbortError')
          ? 'cancelled'
          : error instanceof TableChartLimitError
            ? 'limit'
            : error instanceof TableDataBatchConflictError
              ? 'conflict'
              : 'invalid'
      return { success: false, reason, error }
    } finally {
      signal?.removeEventListener('abort', abort)
      if (request === controller) {
        request = undefined
        if (state.value.pending) setState({ pending: false })
      }
    }
  }
  watch([enabled, ...options.context], close, { flush: 'sync' })
  watch(
    options.selection,
    () => {
      if (selected?.scope === 'selection' && !selected.bounds) close()
    },
    { flush: 'sync' },
  )
  watch(
    [
      () => config.value.categoryMethod,
      () => config.value.valueMethod,
      () => config.value.maxPoints,
      () => config.value.maxSeries,
      () => config.value.maxCells,
      () => config.value.maxCharacters,
    ],
    cancel,
    { flush: 'sync' },
  )
  onBeforeUnmount(() => {
    disposed = true
    close()
  })
  return {
    config,
    enabled,
    state,
    getChartData: (input: TableChartOptions) => extract(input),
    openChart: (input: TableChartOptions) => extract(input, true),
    closeChart: close,
    cancelChart: cancel,
    getChartState: getState,
    setType: (type: TableChartState['type']) => setState({ type }),
  }
}
