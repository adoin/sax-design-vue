<template>
  <div :class="ns.b()">
    <div
      ref="scrollRef"
      :class="ns.e('window')"
      :style="{ height: viewportHeight }"
      @scroll="handleScroll"
      @wheel="handleWheel"
    >
      <div
        :class="ns.e('content')"
        :style="{
          height: `${dragTotalSize ?? totalSize}px`,
          overflowY: scrollbarDragging || compressed ? 'clip' : undefined,
        }"
      >
        <div
          v-for="virtualItem in virtualItems"
          :key="`${typeof virtualItem.key}:${String(virtualItem.key)}`"
          :ref="
            dynamic
              ? measurementRefAt(
                  virtualItem.index,
                  virtualItem.key as VirtualListKey,
                )
              : undefined
          "
          :class="ns.e('item')"
          :data-index="virtualItem.index"
          :style="itemStyle(virtualItem.start, virtualItem.size)"
        >
          <slot
            :item="getItem(virtualItem.index)"
            :index="virtualItem.index"
            :key-value="virtualItem.key"
          >
            {{ getItem(virtualItem.index) }}
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  shallowRef,
  useTemplateRef,
  watch,
} from 'vue'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { useNamespace } from '@vuesax-alpha/hooks'
import { virtualListEmits, virtualListProps } from './virtual-list'
import { useSparseVirtualizer } from './use-sparse-virtualizer'
import { useScrollbarDrag } from './use-scrollbar-drag'
import type { CSSProperties, ComponentPublicInstance } from 'vue'
import type { VirtualListKey } from './virtual-list'

defineOptions({
  name: 'SVirtualList',
})

const props = defineProps(virtualListProps)
const emit = defineEmits(virtualListEmits)
const ns = useNamespace('vl')
const scrollRef = useTemplateRef<HTMLElement>('scrollRef')
let scrollbarEndedAtEnd = false
const scrollbarDragging = useScrollbarDrag(scrollRef, (atEnd) => {
  scrollbarEndedAtEnd = atEnd
})
const itemCount = computed(() =>
  props.count == null
    ? props.items.length
    : Math.max(0, Math.floor(props.count)),
)
const getItem = (index: number) => props.itemAt?.(index) ?? props.items[index]
const measuredSizeCache = new Map<VirtualListKey, number>()
const resettingMeasurements = shallowRef(false)
const measuredElements = new Map<number, HTMLElement>()
const measuredElementKeys = new WeakMap<HTMLElement, VirtualListKey>()
const measurementRefKeys = new Map<number, VirtualListKey>()
const measurementRefCallbacks = new Map<
  number,
  (element: Element | ComponentPublicInstance | null) => void
>()
const sparseMode = computed(
  () => props.count != null && itemCount.value >= 10_000,
)
const estimateSize = computed(() => Math.max(1, props.estimateSize))
const overscan = computed(() => Math.max(0, props.overscan))

const resolveItemKey = (index: number): VirtualListKey =>
  props.itemKeyAt?.(index) ?? props.itemKey?.(getItem(index), index) ?? index

const estimateItemSize = (index: number) =>
  measuredSizeCache.get(resolveItemKey(index)) ?? estimateSize.value

const sparseVirtualizer = useSparseVirtualizer({
  enabled: sparseMode,
  count: itemCount,
  estimateSize,
  overscan,
  retainMaxSize: computed(() => props.retainMaxSize),
  scrollElement: scrollRef,
  scrollbarDragging,
  getItemKey: resolveItemKey,
  onRangeChange: (range) => emit('range-change', range),
})

const virtualizerOptions = computed(() => {
  return {
    count: sparseMode.value ? 0 : itemCount.value,
    enabled: !sparseMode.value,
    getScrollElement: () => scrollRef.value ?? null,
    estimateSize: estimateItemSize,
    overscan: Math.max(0, props.overscan),
    getItemKey: resolveItemKey,
    useAnimationFrameWithResizeObserver: true,
    onChange: (instance: {
      getVirtualItems: () => Array<{ index: number }>
    }) => {
      const rows = instance.getVirtualItems()
      if (!rows.length) return
      emit('range-change', {
        start: rows[0].index,
        end: rows[rows.length - 1].index,
      })
    },
  }
})

const virtualizer = useVirtualizer<HTMLElement, HTMLElement>(virtualizerOptions)
const dragTotalSize = shallowRef<number>()
watch(
  scrollbarDragging,
  (dragging) => {
    // A programmatic correction cancels Chromium's native thumb drag.
    // Restore TanStack's default anchoring predicate after release.
    virtualizer.value.shouldAdjustScrollPositionOnItemSizeChange = dragging
      ? () => false
      : undefined

    const element = scrollRef.value
    if (dragging) {
      // Keep the native track geometry stable as newly visited rows are sized.
      dragTotalSize.value = element?.scrollHeight ?? totalSize.value
    } else {
      dragTotalSize.value = undefined
    }
  },
  { flush: 'sync' },
)
watch(
  scrollbarDragging,
  (dragging) => {
    // End alignment must use the updated DOM height, after releasing the lock.
    if (!dragging && scrollbarEndedAtEnd)
      nextTick(() => {
        if (!destroyed && !scrollbarDragging.value)
          scrollToIndex(itemCount.value - 1, 'end')
      })
  },
  { flush: 'post' },
)
const virtualItems = computed(() =>
  sparseMode.value
    ? sparseVirtualizer.virtualItems.value
    : virtualizer.value.getVirtualItems(),
)
const totalSize = computed(() =>
  sparseMode.value
    ? sparseVirtualizer.physicalSize.value
    : virtualizer.value.getTotalSize(),
)
const compressed = computed(
  () => sparseMode.value && sparseVirtualizer.compressed.value,
)
const viewportHeight = computed(() =>
  typeof props.height === 'number' ? `${props.height}px` : props.height,
)

const itemStyle = (start: number, size: number): CSSProperties => {
  const physicalStart = compressed.value
    ? start -
      sparseVirtualizer.scrollOffset.value +
      sparseVirtualizer.physicalOffset.value
    : start
  const style: CSSProperties = {
    '--s-vl-item-start': `${physicalStart}px`,
    transform: 'translateY(var(--s-vl-item-start))',
  }
  if (props.dynamic && props.retainMaxSize && !resettingMeasurements.value)
    style.minHeight = `${size}px`
  return style
}

const measureElementAt = (index: number, element: HTMLElement) => {
  const size = Math.ceil(element.getBoundingClientRect().height)
  if (!Number.isFinite(size) || size <= 0) return

  const key = resolveItemKey(index)
  const cachedSize = measuredSizeCache.get(key)
  const nextSize = props.retainMaxSize ? Math.max(cachedSize ?? 0, size) : size
  if (cachedSize === nextSize) return

  measuredSizeCache.set(key, nextSize)
  virtualizer.value.resizeItem(index, nextSize)
}

interface PendingSparseMeasurement {
  element: HTMLElement
  key: VirtualListKey
  size?: number
}

const pendingSparseMeasurements = new Map<number, PendingSparseMeasurement>()
let sparseMeasurementScheduled = false
let destroyed = false

const flushSparseMeasurements = () => {
  sparseMeasurementScheduled = false
  const pending = [...pendingSparseMeasurements]
  pendingSparseMeasurements.clear()
  if (destroyed || !sparseMode.value) return
  const measurements: { index: number; key: VirtualListKey; size: number }[] =
    []
  for (const [index, measurement] of pending) {
    if (
      index >= itemCount.value ||
      measuredElements.get(index) !== measurement.element
    )
      continue
    const key = resolveItemKey(index)
    if (key !== measurement.key) continue
    measurements.push({
      index,
      key,
      size:
        measurement.size ?? measurement.element.getBoundingClientRect().height,
    })
  }
  sparseVirtualizer.resizeItems(measurements)
}

const queueSparseMeasurement = (
  index: number,
  element: HTMLElement,
  size?: number,
) => {
  if (
    index < 0 ||
    index >= itemCount.value ||
    measuredElements.get(index) !== element
  )
    return
  const key = measuredElementKeys.get(element)
  if (key == null) return
  pendingSparseMeasurements.set(index, {
    element,
    size,
    key,
  })
  if (sparseMeasurementScheduled) return
  sparseMeasurementScheduled = true
  queueMicrotask(flushSparseMeasurements)
}

const resizeObserver =
  typeof ResizeObserver === 'undefined'
    ? undefined
    : new ResizeObserver((entries) => {
        for (const entry of entries) {
          const element = entry.target
          if (!(element instanceof HTMLElement)) continue
          const index = Number(element.dataset.index)
          if (!Number.isInteger(index)) continue
          if (sparseMode.value) {
            const borderBox = Array.isArray(entry.borderBoxSize)
              ? entry.borderBoxSize[0]
              : entry.borderBoxSize
            queueSparseMeasurement(index, element, borderBox?.blockSize)
          } else measureElementAt(index, element)
        }
      })

function setMeasuredElement(
  index: number,
  element: Element | ComponentPublicInstance | null,
  key: VirtualListKey,
) {
  const previous = measuredElements.get(index)
  if (!(element instanceof HTMLElement)) {
    if (previous && measuredElementKeys.get(previous) !== key) return
    if (previous) resizeObserver?.unobserve(previous)
    measuredElements.delete(index)
    if (measurementRefKeys.get(index) === key) {
      measurementRefCallbacks.delete(index)
      measurementRefKeys.delete(index)
    }
    return
  }

  if (previous !== element) {
    if (previous) resizeObserver?.unobserve(previous)
    measuredElements.set(index, element)
    resizeObserver?.observe(element)
  }
  measuredElementKeys.set(element, key)
  if (sparseMode.value) queueSparseMeasurement(index, element)
  else measureElementAt(index, element)
}

const measurementRefAt = (index: number, key: VirtualListKey) => {
  let callback = measurementRefCallbacks.get(index)
  if (!callback || measurementRefKeys.get(index) !== key) {
    callback = (element) => setMeasuredElement(index, element, key)
    measurementRefCallbacks.set(index, callback)
    measurementRefKeys.set(index, key)
  }
  return callback
}

function measureVisible() {
  for (const [index, element] of measuredElements) {
    if (sparseMode.value) queueSparseMeasurement(index, element)
    else measureElementAt(index, element)
  }
}

function handleScroll(event: Event) {
  if (sparseMode.value && event.currentTarget instanceof HTMLElement)
    sparseVirtualizer.handleScroll(event.currentTarget)
  emit('scroll', event)
}

function handleWheel(event: WheelEvent) {
  if (
    !compressed.value ||
    event.defaultPrevented ||
    event.ctrlKey ||
    event.shiftKey ||
    !event.deltaY ||
    Math.abs(event.deltaX) > Math.abs(event.deltaY)
  )
    return
  const element = scrollRef.value
  if (!element) return
  // Let nested scrollable controls consume their own vertical gesture.
  let target = event.target instanceof Element ? event.target : null
  while (target && target !== element) {
    if (
      target instanceof HTMLElement &&
      target.scrollHeight > target.clientHeight &&
      /auto|scroll/.test(getComputedStyle(target).overflowY) &&
      (event.deltaY < 0
        ? target.scrollTop > 0
        : target.scrollTop + target.clientHeight < target.scrollHeight)
    )
      return
    target = target.parentElement
  }
  const scale =
    event.deltaMode === 1
      ? 16
      : event.deltaMode === 2
        ? element.clientHeight
        : 1
  event.preventDefault()
  sparseVirtualizer.scrollToOffset(
    sparseVirtualizer.scrollOffset.value + event.deltaY * scale,
  )
}

function scrollToIndex(
  index: number,
  align: 'auto' | 'start' | 'center' | 'end' = 'auto',
) {
  if (!Number.isInteger(index) || index < 0 || index >= itemCount.value) return
  if (sparseMode.value) sparseVirtualizer.scrollToIndex(index, align)
  else virtualizer.value.scrollToIndex(index, { align })
}

function scrollToOffset(offset: number, behavior: ScrollBehavior = 'auto') {
  if (sparseMode.value) sparseVirtualizer.scrollToOffset(offset, behavior)
  else virtualizer.value.scrollToOffset(offset, { behavior })
}

function scrollBy(delta: number) {
  if (!Number.isFinite(delta) || !delta || !scrollRef.value) return
  const current = sparseMode.value
    ? sparseVirtualizer.scrollOffset.value
    : scrollRef.value.scrollTop
  scrollToOffset(Math.max(0, current + delta))
}

function measure() {
  if (sparseMode.value) sparseVirtualizer.measureViewport()
  else virtualizer.value.measure()
  if (props.dynamic) nextTick(measureVisible)
}

async function resetMeasurements() {
  if (resettingMeasurements.value || destroyed) return
  const element = scrollRef.value
  const top = sparseMode.value
    ? sparseVirtualizer.scrollOffset.value
    : (element?.scrollTop ?? 0)
  const anchor = virtualItems.value.find((item) => item.start + item.size > top)
  const delta = anchor ? Math.max(0, top - anchor.start) : 0
  resettingMeasurements.value = true
  pendingSparseMeasurements.clear()
  measuredSizeCache.clear()
  if (sparseMode.value) sparseVirtualizer.resetMeasurements()
  else virtualizer.value.measure()
  await nextTick()
  if (destroyed) return
  if (anchor) scrollToIndex(anchor.index, 'start')
  await nextTick()
  if (destroyed) return
  if (props.dynamic) measureVisible()
  await nextTick()
  if (destroyed) return
  resettingMeasurements.value = false
  if (anchor) {
    scrollToIndex(anchor.index, 'start')
    if (delta && element)
      scrollToOffset(
        (sparseMode.value
          ? sparseVirtualizer.scrollOffset.value
          : element.scrollTop) + delta,
      )
  }
}

watch(
  () => [props.dynamic, props.estimateSize, props.retainMaxSize] as const,
  () => nextTick(measure),
)

onBeforeUnmount(() => {
  destroyed = true
  pendingSparseMeasurements.clear()
  measurementRefCallbacks.clear()
  measurementRefKeys.clear()
  resizeObserver?.disconnect()
})

defineExpose({
  scrollToIndex,
  scrollToOffset,
  scrollBy,
  measure,
  measureVisible,
  resetMeasurements,
  getScrollElement: () => scrollRef.value,
  virtualizer,
})
</script>
