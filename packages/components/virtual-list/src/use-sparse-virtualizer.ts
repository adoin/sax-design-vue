import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  watch,
} from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type { VirtualListKey } from './virtual-list'

export interface SparseVirtualItem {
  index: number
  key: VirtualListKey
  start: number
  size: number
  end: number
  lane: 0
}

export interface SparseVirtualMeasurement {
  index: number
  key: VirtualListKey
  size: number
}

interface SparseMeasuredIndex {
  key: VirtualListKey
  size: number
}

interface UseSparseVirtualizerOptions {
  enabled: ComputedRef<boolean>
  count: ComputedRef<number>
  estimateSize: ComputedRef<number>
  overscan: ComputedRef<number>
  retainMaxSize: ComputedRef<boolean>
  scrollElement: Ref<HTMLElement | null>
  scrollbarDragging: Ref<boolean>
  getItemKey: (index: number) => VirtualListKey
  onRangeChange: (range: { start: number; end: number }) => void
}

class FenwickTree {
  private readonly values: Float64Array

  constructor(readonly size: number) {
    this.values = new Float64Array(size + 1)
  }

  add(index: number, delta: number) {
    if (!delta || index < 0 || index >= this.size) return
    for (
      let cursor = index + 1;
      cursor <= this.size;
      cursor += cursor & -cursor
    )
      this.values[cursor] += delta
  }

  prefix(endExclusive: number) {
    let total = 0
    for (
      let cursor = Math.min(Math.max(0, endExclusive), this.size);
      cursor > 0;
      cursor -= cursor & -cursor
    )
      total += this.values[cursor]
    return total
  }
}

const requestFrame = (callback: FrameRequestCallback) =>
  typeof requestAnimationFrame === 'undefined'
    ? setTimeout(() => callback(Date.now()), 0)
    : requestAnimationFrame(callback)

const cancelFrame = (frame: number | ReturnType<typeof setTimeout>) => {
  if (typeof cancelAnimationFrame === 'undefined') clearTimeout(frame)
  else cancelAnimationFrame(frame as number)
}

export const useSparseVirtualizer = (options: UseSparseVirtualizerOptions) => {
  const scrollOffset = shallowRef(0)
  const viewportSize = shallowRef(0)
  const measurementVersion = shallowRef(0)
  const measuredSizeCache = new Map<VirtualListKey, number>()
  const measuredIndexes = new Map<number, SparseMeasuredIndex>()
  let sizeDeltas = new FenwickTree(options.count.value)
  let scrollFrame: number | ReturnType<typeof setTimeout> | undefined
  let pendingScrollOffset = 0
  let viewportObserver: ResizeObserver | undefined
  let observedElement: HTMLElement | null = null
  let pendingAnchorDelta = 0
  let preserveEndOnResize = false
  let scrollAdjustmentScheduled = false
  let keepAtEnd = false

  const rowEstimate = () => Math.max(1, options.estimateSize.value)
  const offsetForIndex = (index: number) =>
    index * rowEstimate() + sizeDeltas.prefix(index)
  const sizeForIndex = (index: number) =>
    measuredIndexes.get(index)?.size ?? rowEstimate()
  const trackMeasurements = () => measurementVersion.value

  const totalSize = computed(() => {
    trackMeasurements()
    return (
      options.count.value * rowEstimate() +
      sizeDeltas.prefix(options.count.value)
    )
  })

  const findIndexAtOffset = (offset: number) => {
    const count = options.count.value
    if (!count) return 0
    const target = Math.max(0, offset)
    let low = 0
    let high = count
    while (low < high) {
      const middle = low + Math.floor((high - low) / 2)
      if (offsetForIndex(middle + 1) <= target) low = middle + 1
      else high = middle
    }
    return Math.min(count - 1, low)
  }

  const range = computed(() => {
    trackMeasurements()
    const count = options.count.value
    if (!options.enabled.value || !count) return { start: 0, end: 0 }

    const overscan = Math.max(0, Math.floor(options.overscan.value))
    const visibleSize = Math.max(viewportSize.value, rowEstimate())
    const first = findIndexAtOffset(scrollOffset.value)
    const last = findIndexAtOffset(scrollOffset.value + visibleSize)
    return {
      start: Math.max(0, first - overscan),
      end: Math.min(count, last + 1 + overscan),
    }
  })

  const virtualItems = computed<SparseVirtualItem[]>(() => {
    trackMeasurements()
    const items: SparseVirtualItem[] = []
    for (let index = range.value.start; index < range.value.end; index++) {
      const start = offsetForIndex(index)
      const size = sizeForIndex(index)
      items.push({
        index,
        key: options.getItemKey(index),
        start,
        size,
        end: start + size,
        lane: 0,
      })
    }
    return items
  })

  const measureViewport = () => {
    const element = options.scrollElement.value
    viewportSize.value = element?.clientHeight ?? 0
    scrollOffset.value = element?.scrollTop ?? 0
  }

  const observeViewport = () => {
    viewportObserver?.disconnect()
    observedElement = options.scrollElement.value
    measureViewport()
    if (!observedElement || typeof ResizeObserver === 'undefined') return
    viewportObserver = new ResizeObserver(measureViewport)
    viewportObserver.observe(observedElement)
  }

  const rebuildSizeIndex = () => {
    const count = options.count.value
    sizeDeltas = new FenwickTree(count)
    for (const [index, measurement] of measuredIndexes) {
      if (index >= count || options.getItemKey(index) !== measurement.key) {
        measuredIndexes.delete(index)
        continue
      }
      sizeDeltas.add(index, measurement.size - rowEstimate())
    }
    measurementVersion.value++
  }

  const resizeItems = (measurements: SparseVirtualMeasurement[]) => {
    if (!options.enabled.value || !measurements.length) return

    const scrollElement = options.scrollElement.value
    const currentOffset = scrollElement?.scrollTop ?? scrollOffset.value
    const wasAtEnd =
      keepAtEnd ||
      (scrollElement != null &&
        scrollElement.scrollHeight -
          scrollElement.clientHeight -
          scrollElement.scrollTop <=
          2) ||
      totalSize.value - currentOffset - viewportSize.value <= 2
    let anchorDelta = 0
    let changed = false
    for (const { index, key, size } of measurements) {
      if (
        index < 0 ||
        index >= options.count.value ||
        !Number.isFinite(size) ||
        size <= 0
      )
        continue

      const roundedSize = Math.ceil(size)
      const previous = measuredIndexes.get(index)
      const cachedSize = measuredSizeCache.get(key)
      const nextSize = options.retainMaxSize.value
        ? Math.max(cachedSize ?? 0, roundedSize)
        : roundedSize
      if (previous?.key === key && previous.size === nextSize) continue

      if (previous && previous.key !== key) {
        sizeDeltas.add(index, rowEstimate() - previous.size)
        measuredIndexes.delete(index)
      }

      const oldSize = previous?.key === key ? previous.size : rowEstimate()
      const delta = nextSize - oldSize
      const startsAboveViewport = offsetForIndex(index) < currentOffset
      measuredSizeCache.set(key, nextSize)
      measuredIndexes.set(index, { key, size: nextSize })
      sizeDeltas.add(index, delta)
      if (startsAboveViewport) anchorDelta += delta
      changed = true
    }

    if (!changed) return
    measurementVersion.value++

    // Keep measurements live, but let the native scrollbar own its position
    // throughout the gesture. Replaying these deltas would break the drag.
    if (options.scrollbarDragging.value) return
    if (!wasAtEnd && !anchorDelta) return
    preserveEndOnResize ||= wasAtEnd
    if (!wasAtEnd) pendingAnchorDelta += anchorDelta
    if (scrollAdjustmentScheduled) return
    scrollAdjustmentScheduled = true
    nextTick(() => {
      const element = options.scrollElement.value
      if (!element) {
        scrollAdjustmentScheduled = false
        return
      }
      const applyAdjustment = () => {
        scrollAdjustmentScheduled = false
        if (
          options.scrollbarDragging.value ||
          (!preserveEndOnResize && !pendingAnchorDelta)
        )
          return
        if (preserveEndOnResize) {
          element.scrollTop = Math.max(
            0,
            element.scrollHeight - element.clientHeight,
          )
        } else element.scrollTop += pendingAnchorDelta
        keepAtEnd = preserveEndOnResize
        preserveEndOnResize = false
        pendingAnchorDelta = 0
        scrollOffset.value = element.scrollTop
      }
      if (preserveEndOnResize) requestFrame(applyAdjustment)
      else applyAdjustment()
    })
  }

  const handleScroll = (element: HTMLElement) => {
    pendingScrollOffset = element.scrollTop
    if (scrollFrame != null) return
    scrollFrame = requestFrame(() => {
      scrollFrame = undefined
      const previousOffset = scrollOffset.value
      scrollOffset.value = pendingScrollOffset
      if (keepAtEnd) {
        if (pendingScrollOffset < previousOffset - 2) keepAtEnd = false
      } else
        keepAtEnd =
          totalSize.value - pendingScrollOffset - viewportSize.value <= 2
    })
  }

  const scrollToOffset = (
    offset: number,
    behavior: ScrollBehavior = 'auto',
  ) => {
    const element = options.scrollElement.value
    if (!element) return
    const nextOffset = Math.max(
      0,
      Math.min(offset, Math.max(0, totalSize.value - viewportSize.value)),
    )
    element.scrollTo({ top: nextOffset, behavior })
    keepAtEnd = totalSize.value - nextOffset - viewportSize.value <= 2
    if (behavior === 'auto') scrollOffset.value = nextOffset
  }

  const scrollToIndex = (
    index: number,
    align: 'auto' | 'start' | 'center' | 'end' = 'auto',
  ) => {
    if (index < 0 || index >= options.count.value) return
    if (index === options.count.value - 1 && align === 'end') {
      const element = options.scrollElement.value
      if (!element) return
      const endOffset = Math.max(0, element.scrollHeight - element.clientHeight)
      keepAtEnd = true
      element.scrollTo({ top: endOffset })
      scrollOffset.value = endOffset
      return
    }
    const start = offsetForIndex(index)
    const size = sizeForIndex(index)
    const end = start + size
    const viewportStart = scrollOffset.value
    const viewportEnd = viewportStart + viewportSize.value
    let nextOffset = viewportStart

    if (align === 'start') nextOffset = start
    else if (align === 'center')
      nextOffset = start - (viewportSize.value - size) / 2
    else if (align === 'end') nextOffset = end - viewportSize.value
    else if (start < viewportStart) nextOffset = start
    else if (end > viewportEnd) nextOffset = end - viewportSize.value

    scrollToOffset(nextOffset)
  }

  watch(
    options.scrollbarDragging,
    (dragging) => {
      if (!dragging) return
      pendingAnchorDelta = 0
      preserveEndOnResize = false
      keepAtEnd = false
    },
    { flush: 'sync' },
  )

  watch(
    range,
    (nextRange) => {
      if (nextRange.end > nextRange.start)
        options.onRangeChange({
          start: nextRange.start,
          end: nextRange.end - 1,
        })
    },
    { immediate: true },
  )

  watch(
    () =>
      [
        options.enabled.value,
        options.count.value,
        options.estimateSize.value,
      ] as const,
    () => {
      rebuildSizeIndex()
      nextTick(measureViewport)
    },
  )

  watch(
    () => options.scrollElement.value,
    (element) => {
      if (element !== observedElement) nextTick(observeViewport)
    },
    { immediate: true, flush: 'post' },
  )

  onMounted(() => nextTick(observeViewport))
  onBeforeUnmount(() => {
    viewportObserver?.disconnect()
    if (scrollFrame != null) cancelFrame(scrollFrame)
  })

  return {
    virtualItems,
    totalSize,
    measuredSizeCache,
    resizeItems,
    handleScroll,
    measureViewport,
    scrollToIndex,
    scrollToOffset,
  }
}
