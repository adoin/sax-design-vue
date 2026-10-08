<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  onMounted,
  shallowRef,
  useId,
  useTemplateRef,
  watch,
} from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import SvgDissolveFilter from './svg-dissolve-filter.vue'

const props = withDefaults(
  defineProps<{
    text: string
    dissolved: boolean
    hidden?: boolean
    multiline?: boolean
  }>(),
  { hidden: false, multiline: false },
)
// Animated graphs belong to each instance, including SSR/hydration.
const filterId = shallowRef(`sax-placeholder-dissolve-${useId()}`)
const placeholder = useTemplateRef<HTMLElement>('placeholder')
const instanceId = getCurrentInstance()!.uid
onMounted(() => {
  // Imperative overlays can render another root with the same Vue ID prefix.
  // Keep native SSR IDs, then disambiguate only actual mounted collisions.
  const root = placeholder.value?.getRootNode() as
    Document | ShadowRoot | undefined
  const ownFilter = placeholder.value?.querySelector('filter')
  const original = filterId.value
  let suffix = 0
  while (
    root?.getElementById?.(filterId.value) &&
    // eslint-disable-next-line unicorn/prefer-query-selector -- Vue ID prefixes may contain selector punctuation.
    root.getElementById(filterId.value) !== ownFilter
  )
    filterId.value = `${original}-${instanceId}-${++suffix}`
})
const animating = shallowRef(false)
watch(
  () => props.dissolved,
  () => {
    animating.value = true
  },
  { flush: 'sync' },
)
const filterStyle = computed(() => ({
  // Resting content is ordinary text; hidden content needs no filter raster.
  filter: animating.value ? `url("#${filterId.value}")` : undefined,
  opacity: !animating.value && props.dissolved ? 0 : undefined,
}))
const ns = useNamespace('placeholder-text')
</script>

<template>
  <span
    ref="placeholder"
    :class="[ns.b(), ns.is('hidden', hidden), ns.is('multiline', multiline)]"
    aria-hidden="true"
  >
    <SvgDissolveFilter
      :filter-id="filterId"
      :dissolved="dissolved"
      @settled="animating = false"
    />
    <span :class="ns.e('dissolve')" :style="filterStyle">
      <span :class="ns.e('content')">{{ text }}</span>
    </span>
  </span>
</template>
