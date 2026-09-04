import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  watch,
} from 'vue'
import { createSparseColumnMetrics } from './sparse-column-metrics'
import type { ComputedRef, Ref } from 'vue'
import type { TableColumn } from '../table'

const DEFAULT_COLUMN_WIDTH = 120
export const MAX_PHYSICAL_COLUMN_SCROLL_WIDTH = 100_000

export const mapPhysicalToLogicalScroll = (
  physicalLeft: number,
  physicalScrollableWidth: number,
  logicalScrollableWidth: number,
) => {
  if (physicalScrollableWidth <= 0 || logicalScrollableWidth <= 0) return 0
  const clamped = Math.min(Math.max(physicalLeft, 0), physicalScrollableWidth)
  return (clamped / physicalScrollableWidth) * logicalScrollableWidth
}

export const mapLogicalToPhysicalScroll = (
  logicalLeft: number,
  logicalScrollableWidth: number,
  physicalScrollableWidth: number,
) => {
  if (logicalScrollableWidth <= 0 || physicalScrollableWidth <= 0) return 0
  const clamped = Math.min(Math.max(logicalLeft, 0), logicalScrollableWidth)
  return (clamped / logicalScrollableWidth) * physicalScrollableWidth
}

const wheelDeltaInPixels = (
  event: WheelEvent,
  delta: number,
  pageSize: number,
) => {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return delta * 16
  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE)
    return delta * Math.max(1, pageSize)
  return delta
}

export interface TableColumnVirtualRange {
  start: number
  end: number
  before: number
  after: number
}

export interface UseTableColumnVirtualizationOptions {
  columns: ComputedRef<TableColumn[]>
  columnCount?: ComputedRef<number>
  columnWidth?: (index: number) => number | string | undefined
  uniformColumnWidth?: ComputedRef<number | string | undefined>
  columnWidthOverrides?: ComputedRef<ReadonlyMap<number, number>>
  horizontal: ComputedRef<boolean>
  overscan: ComputedRef<number>
  scrollElement: Ref<HTMLElement | undefined>
  reservedWidth?: ComputedRef<number>
}

export const resolveColumnPixelWidth = (
  value: number | string | undefined,
): number | null => {
  if (value == null) return DEFAULT_COLUMN_WIDTH
  if (typeof value === 'number')
    return Number.isFinite(value) ? Math.max(0, value) : null

  const normalized = value.trim()
  const match = normalized.match(/^(\d+(?:\.\d+)?)(?:px)?$/)
  return match ? Number(match[1]) : null
}

export const getVirtualColumnRange = (
  widths: number[],
  scrollLeft: number,
  viewportWidth: number,
  overscan: number,
): TableColumnVirtualRange => {
  if (!widths.length) return { start: 0, end: 0, before: 0, after: 0 }

  const offsets = getColumnOffsets(widths)
  return getVirtualColumnRangeFromOffsets(
    offsets,
    scrollLeft,
    viewportWidth,
    overscan,
  )
}

export const getUniformVirtualColumnRange = (
  columnCount: number,
  columnWidth: number,
  scrollLeft: number,
  viewportWidth: number,
  overscan: number,
): TableColumnVirtualRange => {
  const count = Math.max(0, Math.floor(columnCount))
  if (!count || columnWidth <= 0)
    return { start: 0, end: 0, before: 0, after: 0 }

  const total = count * columnWidth
  const visibleStart = Math.max(0, scrollLeft)
  const visibleEnd = visibleStart + Math.max(0, viewportWidth)
  const first = Math.min(count - 1, Math.floor(visibleStart / columnWidth))
  const last = Math.min(
    count,
    Math.max(first + 1, Math.ceil(visibleEnd / columnWidth)),
  )
  const safeOverscan = Math.max(0, Math.floor(overscan))
  const start = Math.max(0, first - safeOverscan)
  const end = Math.min(count, last + safeOverscan)
  return {
    start,
    end,
    before: start * columnWidth,
    after: Math.max(0, total - end * columnWidth),
  }
}

export const getColumnOffsets = (widths: number[]): number[] => {
  const offsets = Array.from({ length: widths.length + 1 }, () => 0)
  offsets[0] = 0
  for (let index = 0; index < widths.length; index++)
    offsets[index + 1] = offsets[index] + widths[index]
  return offsets
}

const lowerBound = (values: number[], target: number, start = 0) => {
  let low = Math.max(0, start)
  let high = values.length
  while (low < high) {
    const middle = low + Math.floor((high - low) / 2)
    if (values[middle] < target) low = middle + 1
    else high = middle
  }
  return low
}

const upperBound = (values: number[], target: number) => {
  let low = 0
  let high = values.length
  while (low < high) {
    const middle = low + Math.floor((high - low) / 2)
    if (values[middle] <= target) low = middle + 1
    else high = middle
  }
  return low
}

export const getVirtualColumnRangeFromOffsets = (
  offsets: number[],
  scrollLeft: number,
  viewportWidth: number,
  overscan: number,
): TableColumnVirtualRange => {
  const columnCount = Math.max(0, offsets.length - 1)
  if (!columnCount) return { start: 0, end: 0, before: 0, after: 0 }

  const total = offsets[offsets.length - 1]
  const visibleStart = Math.max(0, scrollLeft)
  const visibleEnd = visibleStart + Math.max(0, viewportWidth)
  const first = Math.min(
    columnCount - 1,
    Math.max(0, upperBound(offsets, visibleStart) - 1),
  )
  const last = Math.min(
    columnCount,
    Math.max(first + 1, lowerBound(offsets, visibleEnd, first + 1)),
  )

  const safeOverscan = Math.max(0, Math.floor(overscan))
  const start = Math.max(0, first - safeOverscan)
  const end = Math.min(columnCount, last + safeOverscan)

  return {
    start,
    end,
    before: offsets[start],
    after: Math.max(0, total - offsets[end]),
  }
}

export const useTableColumnVirtualization = (
  options: UseTableColumnVirtualizationOptions,
) => {
  const viewportWidth = shallowRef(0)
  const scrollLeft = shallowRef(0)
  let resizeObserver: ResizeObserver | undefined
  let observedElement: HTMLElement | undefined
  let scrollFrame: number | undefined
  let pendingScrollLeft = 0
  let layoutRevision = 0
  let disposed = false

  const sparseMetrics = computed(() => {
    const width = options.uniformColumnWidth?.value
    const pixels = width == null ? null : resolveColumnPixelWidth(width)
    const overrides = options.columnWidthOverrides?.value
    if (!pixels || !overrides?.size) return undefined
    return createSparseColumnMetrics(
      options.columnCount?.value ?? options.columns.value.length,
      pixels,
      overrides,
    )
  })

  const metrics = computed(() => {
    const count = Math.max(
      0,
      Math.floor(options.columnCount?.value ?? options.columns.value.length),
    )
    if (
      options.uniformColumnWidth &&
      options.uniformColumnWidth.value != null
    ) {
      const uniformWidth = resolveColumnPixelWidth(
        options.uniformColumnWidth.value,
      )
      return {
        supported: uniformWidth != null && uniformWidth > 0,
        widths: [] as number[],
        offsets: [0],
        uniformWidth,
        count,
        totalWidth:
          uniformWidth == null
            ? 0
            : (sparseMetrics.value?.totalWidth ?? uniformWidth * count),
      }
    }
    const widths = Array.from({ length: count }, () => 0)
    const offsets = Array.from({ length: count + 1 }, () => 0)
    offsets[0] = 0
    for (let index = 0; index < count; index++) {
      const column = options.columns.value[index]
      const width = resolveColumnPixelWidth(
        options.columnWidth?.(index) ?? column?.width ?? column?.minWidth,
      )
      if (width == null)
        return {
          supported: false,
          widths: [] as number[],
          offsets: [0],
          uniformWidth: null,
          count,
          totalWidth: 0,
        }
      widths[index] = width
      offsets[index + 1] = offsets[index] + width
    }
    return {
      supported: true,
      widths,
      offsets,
      uniformWidth: null,
      count,
      totalWidth: offsets[offsets.length - 1] ?? 0,
    }
  })
  const supported = computed(() => metrics.value.supported)
  const pixelWidths = computed(() => metrics.value.widths)
  const columnOffsets = computed(() => metrics.value.offsets)
  const totalWidth = computed(() => metrics.value.totalWidth)
  const pixelWidthAt = (index: number) =>
    sparseMetrics.value?.widthAt(index) ??
    metrics.value.uniformWidth ??
    pixelWidths.value[index] ??
    0
  const availableWidth = computed(() =>
    Math.max(0, viewportWidth.value - (options.reservedWidth?.value ?? 0)),
  )
  const physicalTotalWidth = computed(() =>
    Math.min(
      totalWidth.value,
      Math.max(availableWidth.value, MAX_PHYSICAL_COLUMN_SCROLL_WIDTH),
    ),
  )
  const logicalScrollableWidth = computed(() =>
    Math.max(0, totalWidth.value - availableWidth.value),
  )
  const physicalScrollableWidth = computed(() =>
    Math.max(0, physicalTotalWidth.value - availableWidth.value),
  )
  const logicalScrollLeft = computed(() => {
    return mapPhysicalToLogicalScroll(
      scrollLeft.value,
      physicalScrollableWidth.value,
      logicalScrollableWidth.value,
    )
  })
  const toPhysicalScrollLeft = (logicalLeft: number) =>
    mapLogicalToPhysicalScroll(
      logicalLeft,
      logicalScrollableWidth.value,
      physicalScrollableWidth.value,
    )
  const active = computed(
    () =>
      options.horizontal.value &&
      supported.value &&
      totalWidth.value > availableWidth.value,
  )
  const range = computed<TableColumnVirtualRange>(() =>
    active.value
      ? metrics.value.uniformWidth != null
        ? sparseMetrics.value
          ? sparseMetrics.value.range(
              logicalScrollLeft.value,
              availableWidth.value,
              options.overscan.value,
            )
          : getUniformVirtualColumnRange(
              metrics.value.count,
              metrics.value.uniformWidth,
              logicalScrollLeft.value,
              availableWidth.value,
              options.overscan.value,
            )
        : getVirtualColumnRangeFromOffsets(
            columnOffsets.value,
            logicalScrollLeft.value,
            availableWidth.value,
            options.overscan.value,
          )
      : {
          start: 0,
          end: Math.max(
            0,
            Math.floor(
              options.columnCount?.value ?? options.columns.value.length,
            ),
          ),
          before: 0,
          after: 0,
        },
  )
  const renderedCenterWidth = computed(() => {
    let width = 0
    for (let index = range.value.start; index < range.value.end; index++)
      width += pixelWidthAt(index)
    return width
  })
  const renderBefore = computed(() =>
    Math.max(
      0,
      Math.min(
        scrollLeft.value - (logicalScrollLeft.value - range.value.before),
        physicalTotalWidth.value - renderedCenterWidth.value,
      ),
    ),
  )
  const renderAfter = computed(() =>
    Math.max(
      0,
      physicalTotalWidth.value - renderBefore.value - renderedCenterWidth.value,
    ),
  )

  const measureViewport = () => {
    const element = options.scrollElement.value
    viewportWidth.value = element?.clientWidth ?? 0
    scrollLeft.value = element?.scrollLeft ?? 0
  }

  const observeScrollElement = () => {
    resizeObserver?.disconnect()
    observedElement = options.scrollElement.value
    measureViewport()
    if (!observedElement || typeof ResizeObserver === 'undefined') return
    resizeObserver = new ResizeObserver(measureViewport)
    resizeObserver.observe(observedElement)
  }

  const scheduleScrollLeft = (nextScrollLeft: number) => {
    pendingScrollLeft = nextScrollLeft
    if (scrollFrame != null) return
    if (typeof requestAnimationFrame === 'undefined') {
      scrollLeft.value = pendingScrollLeft
      return
    }
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = undefined
      scrollLeft.value = pendingScrollLeft
    })
  }

  const handleScroll = (event: Event) => {
    const element = event.currentTarget as HTMLElement | null
    if (!element) return
    scheduleScrollLeft(element.scrollLeft)
  }

  const handleWheel = (event: WheelEvent) => {
    const element = options.scrollElement.value
    const compressed =
      logicalScrollableWidth.value > physicalScrollableWidth.value
    if (!element || !active.value || !compressed) return

    const horizontalDelta = event.shiftKey
      ? event.deltaX || event.deltaY
      : Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : 0
    if (!horizontalDelta) return

    const logicalDelta = wheelDeltaInPixels(
      event,
      horizontalDelta,
      availableWidth.value,
    )
    const currentLogicalLeft = mapPhysicalToLogicalScroll(
      element.scrollLeft,
      physicalScrollableWidth.value,
      logicalScrollableWidth.value,
    )
    const nextLogicalLeft = Math.max(
      0,
      Math.min(currentLogicalLeft + logicalDelta, logicalScrollableWidth.value),
    )
    if (nextLogicalLeft === currentLogicalLeft) return

    event.preventDefault()
    const nextPhysicalLeft = toPhysicalScrollLeft(nextLogicalLeft)
    element.scrollLeft = nextPhysicalLeft
    scheduleScrollLeft(nextPhysicalLeft)
  }

  const scrollToColumn = (
    index: number,
    align: 'auto' | 'start' | 'center' | 'end' = 'auto',
  ) => {
    const element = options.scrollElement.value
    const count = metrics.value.count
    if (!element || index < 0 || index >= count) return

    const viewport = availableWidth.value
    const width = pixelWidthAt(index)
    const start =
      metrics.value.uniformWidth != null
        ? (sparseMetrics.value?.offsetAt(index) ??
          index * metrics.value.uniformWidth)
        : columnOffsets.value[index]
    const end = start + width
    const currentStart = logicalScrollLeft.value
    const currentEnd = currentStart + viewport
    let left = currentStart

    if (align === 'start') left = start
    else if (align === 'center') left = start - (viewport - width) / 2
    else if (align === 'end') left = end - viewport
    else if (start < currentStart) left = start
    else if (end > currentEnd) left = end - viewport

    const nextLogicalLeft = Math.max(
      0,
      Math.min(left, logicalScrollableWidth.value),
    )
    const nextLeft = toPhysicalScrollLeft(nextLogicalLeft)
    if (typeof element.scrollTo === 'function')
      element.scrollTo({ left: nextLeft })
    else element.scrollLeft = nextLeft
  }

  onMounted(observeScrollElement)

  // Physical scrollbar ratios change when the viewport or reserved fixed bands
  // change. Preserve the logical column and in-column offset, including the end.
  const scrollLayout = computed(() => {
    const current = metrics.value
    const sparse = sparseMetrics.value
    return {
      count: current.count,
      logical: logicalScrollableWidth.value,
      physical: physicalScrollableWidth.value,
      offsetAt: (index: number) =>
        sparse?.offsetAt(index) ??
        (current.uniformWidth != null
          ? index * current.uniformWidth
          : (current.offsets[index] ?? current.totalWidth)),
    }
  })
  watch(scrollLayout, (current, previous) => {
    const element = options.scrollElement.value
    if (
      !element ||
      !options.horizontal.value ||
      !previous.count ||
      !current.count ||
      !previous.logical
    )
      return
    const physical = scrollFrame == null ? scrollLeft.value : pendingScrollLeft
    const logical = mapPhysicalToLogicalScroll(
      physical,
      previous.physical,
      previous.logical,
    )
    let low = 0
    let high = previous.count - 1
    while (low < high) {
      const middle = Math.floor((low + high) / 2)
      if (previous.offsetAt(middle + 1) <= logical) low = middle + 1
      else high = middle
    }
    const column = Math.min(low, current.count - 1)
    const offset = Math.min(
      Math.max(0, logical - previous.offsetAt(low)),
      Math.max(0, current.offsetAt(column + 1) - current.offsetAt(column)),
    )
    const nextLogical =
      previous.physical > 0 && physical >= previous.physical - 1
        ? current.logical
        : current.offsetAt(column) + offset
    const nextPhysical = mapLogicalToPhysicalScroll(
      nextLogical,
      current.logical,
      current.physical,
    )
    if (scrollFrame != null && typeof cancelAnimationFrame !== 'undefined')
      cancelAnimationFrame(scrollFrame)
    scrollFrame = undefined
    pendingScrollLeft = nextPhysical
    scrollLeft.value = nextPhysical
    const revision = ++layoutRevision
    nextTick(() => {
      if (
        disposed ||
        revision !== layoutRevision ||
        options.scrollElement.value !== element
      )
        return
      element.scrollLeft = nextPhysical
      scheduleScrollLeft(element.scrollLeft)
    })
  })

  watch(
    () => options.scrollElement.value,
    (element) => {
      if (element !== observedElement) nextTick(observeScrollElement)
    },
    { flush: 'post' },
  )

  watch(
    () =>
      [
        options.columns.value,
        options.columnCount?.value,
        options.horizontal.value,
      ] as const,
    () => nextTick(measureViewport),
    { flush: 'post' },
  )

  onBeforeUnmount(() => {
    disposed = true
    resizeObserver?.disconnect()
    if (scrollFrame != null && typeof cancelAnimationFrame !== 'undefined')
      cancelAnimationFrame(scrollFrame)
  })

  return {
    active,
    supported,
    pixelWidths,
    pixelWidthAt,
    totalWidth,
    physicalTotalWidth,
    viewportWidth,
    availableWidth,
    scrollLeft,
    logicalScrollLeft,
    range,
    renderBefore,
    renderAfter,
    handleScroll,
    handleWheel,
    measureViewport,
    scrollToColumn,
  }
}
