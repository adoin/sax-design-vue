<template>
  <div :class="ns.b()">
    <div
      ref="scrollRef"
      :class="ns.e('window')"
      :style="{ height: viewportHeight }"
      @scroll="handleScroll"
    >
      <div
        :class="ns.e('content')"
        :style="{
          height: `${dragTotalSize ?? totalSize}px`,
          overflowY: scrollbarDragging ? 'clip' : undefined,
        }"
      >
        <div
          v-for="virtualItem in virtualItems"
          :key="`${typeof virtualItem.key}:${String(virtualItem.key)}`"
          :ref="dynamic ? measurementRefAt(virtualItem.index) : undefined"
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
const measuredElements = new Map<number, HTMLElement>()
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
    ? sparseVirtualizer.totalSize.value
    : virtualizer.value.getTotalSize(),
)
const viewportHeight = computed(() =>
  typeof props.height === 'number' ? `${props.height}px` : props.height,
)

const itemStyle = (start: number, size: number): CSSProperties => {
  const style: CSSProperties = {
    '--s-vl-item-start': `${start}px`,
    transform: 'translateY(var(--s-vl-item-start))',
  }
  if (props.dynamic && props.retainMaxSize) style.minHeight = `${size}px`
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
  size?: number
}

const pendingSparseMeasurements = new Map<number, PendingSparseMeasurement>()
let sparseMeasurementScheduled = false
let destroyed = false

const flushSparseMeasurements = () => {
  sparseMeasurementScheduled = false
  if (destroyed || !sparseMode.value) return
  const measurements = [...pendingSparseMeasurements].map(
    ([index, measurement]) => ({
      index,
      key: resolveItemKey(index),
      size:
        measurement.size ?? measurement.element.getBoundingClientRect().height,
    }),
  )
  pendingSparseMeasurements.clear()
  sparseVirtualizer.resizeItems(measurements)
}

const queueSparseMeasurement = (
  index: number,
  element: HTMLElement,
  size?: number,
) => {
  pendingSparseMeasurements.set(index, { element, size })
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
) {
  const previous = measuredElements.get(index)
  if (!(element instanceof HTMLElement)) {
    if (previous) resizeObserver?.unobserve(previous)
    measuredElements.delete(index)
    measurementRefCallbacks.delete(index)
    return
  }

  if (previous !== element) {
    if (previous) resizeObserver?.unobserve(previous)
    measuredElements.set(index, element)
    resizeObserver?.observe(element)
  }
  if (sparseMode.value) queueSparseMeasurement(index, element)
  else measureElementAt(index, element)
}

const measurementRefAt = (index: number) => {
  let callback = measurementRefCallbacks.get(index)
  if (!callback) {
    callback = (element) => setMeasuredElement(index, element)
    measurementRefCallbacks.set(index, callback)
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

function measure() {
  if (sparseMode.value) sparseVirtualizer.measureViewport()
  else virtualizer.value.measure()
  if (props.dynamic) nextTick(measureVisible)
}

watch(
  () => [props.dynamic, props.estimateSize, props.retainMaxSize] as const,
  () => nextTick(measure),
)

onBeforeUnmount(() => {
  destroyed = true
  pendingSparseMeasurements.clear()
  measurementRefCallbacks.clear()
  resizeObserver?.disconnect()
})

defineExpose({
  scrollToIndex,
  scrollToOffset,
  measure,
  measureVisible,
  getScrollElement: () => scrollRef.value,
  virtualizer,
})
</script>
