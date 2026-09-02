import { computed, shallowRef, watch } from 'vue'
import type { ComputedRef } from 'vue'
import type {
  TableEmitFn,
  TableFlatRow,
  TablePageChangeParams,
  TablePagerConfig,
  TableProps,
} from '../table'

const positive = (value: number | undefined, fallback: number) =>
  Number.isFinite(value) && Number(value) > 0
    ? Math.max(1, Math.floor(Number(value)))
    : fallback
const count = (value: number | undefined) =>
  Number.isFinite(value) ? Math.max(0, Math.floor(Number(value))) : 0

// A root and all its visible descendants stay on one page. Generated sources
// are sliced by index, never enumerated to build the pagination model.
export function useTablePagination(
  props: TableProps,
  emit: TableEmitFn,
  allRows: ComputedRef<TableFlatRow[]>,
) {
  const config = computed<TablePagerConfig>(() =>
    typeof props.pagerConfig === 'object' ? props.pagerConfig : {},
  )
  const enabled = computed(
    () => props.pagerConfig !== false && config.value.enabled !== false,
  )
  const remote = computed(() => enabled.value && Boolean(config.value.remote))
  const innerPage = shallowRef(1)
  const innerSize = shallowRef(10)
  const rootOffsets = computed(() => {
    if (!enabled.value || remote.value || props.virtualSource) return []
    const result: number[] = []
    allRows.value.forEach((row, index) => {
      if (row.depth === 0) result.push(index)
    })
    return result
  })
  const total = computed(() =>
    remote.value
      ? count(config.value.total)
      : props.virtualSource
        ? count(props.virtualSource.rowCount)
        : rootOffsets.value.length,
  )
  const pageSize = computed(() =>
    positive(config.value.pageSize, innerSize.value),
  )
  const requestedPage = computed(() =>
    positive(config.value.currentPage, innerPage.value),
  )
  const pageCount = computed(() =>
    Math.max(1, Math.ceil(total.value / pageSize.value)),
  )
  const currentPage = computed(() =>
    Math.min(requestedPage.value, pageCount.value),
  )
  const offset = computed(() =>
    enabled.value ? (currentPage.value - 1) * pageSize.value : 0,
  )
  const sourceOffset = computed(() => (remote.value ? 0 : offset.value))
  const rows = computed(() => {
    if (!enabled.value || remote.value || props.virtualSource)
      return allRows.value
    const start = rootOffsets.value[offset.value] ?? allRows.value.length
    const end =
      rootOffsets.value[offset.value + pageSize.value] ?? allRows.value.length
    return allRows.value.slice(start, end)
  })
  const sourceCount = computed(() => {
    const length = count(props.virtualSource?.rowCount)
    return !enabled.value || remote.value
      ? length
      : Math.max(0, Math.min(pageSize.value, length - offset.value))
  })
  const commit = (
    page: number,
    size: number,
    type: TablePageChangeParams['type'],
  ) => {
    const nextSize = positive(size, pageSize.value)
    const nextPage = Math.min(
      positive(page, 1),
      Math.max(1, Math.ceil(total.value / nextSize)),
    )
    if (nextPage === requestedPage.value && nextSize === pageSize.value) return
    if (config.value.currentPage === undefined) innerPage.value = nextPage
    if (config.value.pageSize === undefined) innerSize.value = nextSize
    emit('update:pagerConfig', {
      ...config.value,
      currentPage: nextPage,
      pageSize: nextSize,
    })
    emit('pageChange', {
      currentPage: nextPage,
      pageSize: nextSize,
      total: total.value,
      type,
    })
  }
  const changePage = (page: number) => {
    if (enabled.value && !props.loading && !config.value.disabled)
      commit(page, pageSize.value, 'current')
  }
  const changeSize = (size: number) => {
    if (enabled.value && !props.loading && !config.value.disabled)
      commit(1, size, 'size')
  }
  const reset = () => {
    if (enabled.value && !remote.value) commit(1, pageSize.value, 'reset')
  }
  watch(
    [enabled, requestedPage, pageCount],
    () => {
      if (enabled.value && requestedPage.value > pageCount.value)
        commit(pageCount.value, pageSize.value, 'clamp')
    },
    { immediate: true, flush: 'post' },
  )
  return {
    config,
    enabled,
    remote,
    total,
    pageSize,
    currentPage,
    offset,
    sourceOffset,
    rows,
    sourceCount,
    changePage,
    changeSize,
    reset,
  }
}
