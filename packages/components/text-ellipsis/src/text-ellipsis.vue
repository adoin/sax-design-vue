<script lang="ts" setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  useId,
  useTemplateRef,
  watch,
} from 'vue'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import { SIcon } from '@vuesax-alpha/components/icon'
import { textEllipsisEmits, textEllipsisProps } from './text-ellipsis'

defineOptions({ name: 'STextEllipsis' })

const props = defineProps(textEllipsisProps)
const emit = defineEmits(textEllipsisEmits)
const ns = useNamespace('text-ellipsis')
const { t } = useLocale()
const rootRef = useTemplateRef<HTMLElement>('root')
const toggleRef = useTemplateRef<HTMLButtonElement>('toggle')
const contentId = `s-text-ellipsis-${useId()}`
const rootWidth = shallowRef(0)
const toggleWidth = shallowRef(120)
const inlineTail = computed(
  () => !rootWidth.value || rootWidth.value > toggleWidth.value + 56,
)
const rootStyle = computed(() => ({
  '--sax-text-ellipsis-tail-width': `${toggleWidth.value}px`,
}))
const contentStyle = computed(() =>
  props.expanded ? {} : { WebkitLineClamp: Math.max(1, props.lineClamp) },
)
const toggleLabel = computed(() =>
  props.expanded
    ? props.collapseText || t('vs.textEllipsis.collapse')
    : props.expandText || t('vs.textEllipsis.expand'),
)

let resizeObserver: ResizeObserver | undefined
const measureTail = () => {
  rootWidth.value = rootRef.value?.getBoundingClientRect().width ?? 0
  toggleWidth.value = toggleRef.value?.getBoundingClientRect().width ?? 0
}

onMounted(() => {
  measureTail()
  if (typeof ResizeObserver === 'undefined') return
  resizeObserver = new ResizeObserver(measureTail)
  if (rootRef.value) resizeObserver.observe(rootRef.value)
  if (toggleRef.value) resizeObserver.observe(toggleRef.value)
})

watch(toggleRef, async (next, previous) => {
  if (previous) resizeObserver?.unobserve(previous)
  if (next) resizeObserver?.observe(next)
  await nextTick()
  measureTail()
})

onBeforeUnmount(() => resizeObserver?.disconnect())

const toggle = () => {
  const value = !props.expanded
  emit('update:expanded', value)
  emit('change', value)
}
</script>

<template>
  <div
    ref="root"
    :class="[
      ns.b(),
      ns.is('expanded', expanded),
      ns.is('compact', !inlineTail),
      ns.is('expandable', expandable),
    ]"
    :style="rootStyle"
  >
    <span :id="contentId" :class="ns.e('content')" :style="contentStyle">
      <slot>{{ content }}</slot>
    </span>
    <button
      v-if="expandable"
      ref="toggle"
      :class="ns.e('toggle')"
      type="button"
      :aria-controls="contentId"
      :aria-expanded="expanded"
      @click="toggle"
    >
      <span
        v-if="!expanded && inlineTail"
        :class="ns.e('ellipsis')"
        aria-hidden="true"
        >…</span
      >
      <span :class="ns.e('pill')">
        <span>{{ toggleLabel }}</span>
        <SIcon name="cb:chevron-down" size="14" :class="ns.e('chevron')" />
      </span>
    </button>
  </div>
</template>
