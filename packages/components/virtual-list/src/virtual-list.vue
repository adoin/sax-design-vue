<template>
  <div :class="ns.b()">
    <div
      ref="scrollRef"
      :class="ns.e('window')"
      :style="{ height: viewportHeight }"
      @scroll="handleScroll"
    >
      <div :class="ns.e('content')" :style="{ height: `${totalSize}px` }">
        <div
          v-for="virtualItem in virtualItems"
          :key="virtualItem.key"
          :ref="dynamic ? measureElement : undefined"
          :class="ns.e('item')"
          :data-index="virtualItem.index"
          :style="{
            transform: `translateY(${virtualItem.start}px)`,
          }"
        >
          <slot
            :item="items[virtualItem.index]"
            :index="virtualItem.index"
            :key-value="virtualItem.key"
          >
            {{ items[virtualItem.index] }}
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { useNamespace } from '@vuesax-alpha/hooks'
import { virtualListEmits, virtualListProps } from './virtual-list'

defineOptions({
  name: 'SVirtualList',
})

const props = defineProps(virtualListProps)
const emit = defineEmits(virtualListEmits)
const ns = useNamespace('vl')
const scrollRef = ref<HTMLElement>()

const virtualizerOptions = computed(() => ({
  count: props.items.length,
  getScrollElement: () => scrollRef.value ?? null,
  estimateSize: () => Math.max(1, props.estimateSize),
  overscan: Math.max(0, props.overscan),
  getItemKey: (index: number) =>
    props.itemKey?.(props.items[index], index) ?? index,
  onChange: () => {
    const rows = virtualizer.value.getVirtualItems()
    if (!rows.length) return
    emit('range-change', {
      start: rows[0].index,
      end: rows[rows.length - 1].index,
    })
  },
}))

const virtualizer = useVirtualizer<HTMLElement, HTMLElement>(virtualizerOptions)
const virtualItems = computed(() => virtualizer.value.getVirtualItems())
const totalSize = computed(() => virtualizer.value.getTotalSize())
const viewportHeight = computed(() =>
  typeof props.height === 'number' ? `${props.height}px` : props.height,
)

function measureElement(element: Element | null) {
  if (element instanceof HTMLElement) virtualizer.value.measureElement(element)
}

function handleScroll(event: Event) {
  emit('scroll', event)
}

function scrollToIndex(
  index: number,
  align: 'auto' | 'start' | 'center' | 'end' = 'auto',
) {
  virtualizer.value.scrollToIndex(index, { align })
}

function scrollToOffset(offset: number, behavior: ScrollBehavior = 'auto') {
  virtualizer.value.scrollToOffset(offset, { behavior })
}

function measure() {
  virtualizer.value.measure()
}

watch(
  () => [props.items, props.dynamic] as const,
  () => virtualizer.value.measure(),
  { deep: true },
)

defineExpose({
  scrollToIndex,
  scrollToOffset,
  measure,
  virtualizer,
})
</script>
