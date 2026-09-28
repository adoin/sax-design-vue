<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import STag from '@vuesax-alpha/components/tag'
import { useNamespace } from '@vuesax-alpha/hooks'
import { calculateVisibleTagCount } from '../../select/src/tag-overflow'
const props = defineProps<{
  labels: string[]
  disabled: boolean
  shape: 'rounded' | 'square'
}>()
const emit = defineEmits<{ remove: [index: number] }>()
const ns = useNamespace('date-picker')
const root = ref<HTMLElement>()
const measure = ref<HTMLElement>()
const count = ref(0)
const visibleLabels = computed(() => props.labels.slice(0, count.value))
let observer: ResizeObserver | undefined
const update = () => {
  if (!root.value || !measure.value) return
  const widths = Array.from(
    measure.value.querySelectorAll<HTMLElement>('[data-date-tag]'),
    (el) => el.getBoundingClientRect().width + 4,
  )
  const overflow = measure.value.querySelector<HTMLElement>(
    '[data-date-overflow]',
  )
  count.value = calculateVisibleTagCount({
    availableWidth: root.value.clientWidth,
    tagWidths: widths,
    overflowWidth: (overflow?.getBoundingClientRect().width ?? 0) + 4,
  })
}
watch(
  () => [props.labels, props.shape, props.disabled],
  () => nextTick(update),
  { deep: true, flush: 'post' },
)
onMounted(() => {
  if (typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(update)
    observer.observe(root.value!)
    observer.observe(measure.value!)
  }
  window.addEventListener('resize', update)
  nextTick(update)
})
onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('resize', update)
})
</script>

<template>
  <span ref="root" :class="ns.e('tags')" :title="labels.join(', ')">
    <s-tag
      v-for="(label, index) in visibleLabels"
      :key="label"
      size="small"
      :shape="shape"
      :closable="!disabled"
      @close="emit('remove', index)"
      >{{ label }}</s-tag
    >
    <s-tag v-if="labels.length > count" size="small" :shape="shape"
      >+{{ labels.length - count }}</s-tag
    >
    <span ref="measure" :class="ns.e('tag-measure')" aria-hidden="true" inert>
      <s-tag
        v-for="label in labels"
        :key="label"
        data-date-tag
        size="small"
        :shape="shape"
        :closable="!disabled"
        >{{ label }}</s-tag
      >
      <s-tag data-date-overflow size="small" :shape="shape"
        >+{{ labels.length }}</s-tag
      >
    </span>
  </span>
</template>
