<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  onActivated,
  onDeactivated,
  shallowRef,
  useId,
  useTemplateRef,
  watch,
} from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import SvgFilterAnimationGraph from './svg-filter-animation-graph.vue'

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
const instanceId = getCurrentInstance()!.uid
const placeholder = useTemplateRef<HTMLElement>('placeholder')
// No filter ID is emitted during SSR. Vue's runtime UID also separates
// imperative render roots that share a native useId prefix.
const filterId = `sax-placeholder-dissolve-${useId()}-${instanceId}`
const animating = shallowRef(false)
const initialDissolved = shallowRef(props.dissolved)
let active = true
onDeactivated(() => {
  active = false
  animating.value = false
})
onActivated(() => {
  active = true
})
watch(
  () => [props.dissolved, props.hidden] as const,
  ([target, hidden], [previous]) => {
    const document = placeholder.value?.ownerDocument
    if (
      !active ||
      hidden ||
      document?.hidden ||
      document?.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)')
        .matches
    ) {
      animating.value = false
      return
    }
    if (target === previous) return
    if (!animating.value) initialDissolved.value = previous
    animating.value = true
  },
  // Decide playback before this component patches, so graph and URL appear
  // together instead of mounting through another post-render update.
  { flush: 'pre' },
)
const filterStyle = computed(() => ({
  // Resting content is ordinary text; hidden content needs no filter raster.
  filter: animating.value ? `url("#${filterId}")` : undefined,
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
    <SvgFilterAnimationGraph
      v-if="animating"
      animation="dissolve"
      region="padded-text"
      :filter-id="filterId"
      :progress="dissolved ? 1 : 0"
      :initial-progress="initialDissolved ? 1 : 0"
      animate-on-mount
      @settled="animating = false"
    />
    <span :class="ns.e('dissolve')" :style="filterStyle">
      <span :class="ns.e('content')">{{ text }}</span>
    </span>
  </span>
</template>
