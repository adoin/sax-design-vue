<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  onActivated,
  onDeactivated,
  onBeforeUnmount,
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
    defer?: boolean
    duration?: number
    reverseDuration?: number
  }>(),
  { hidden: false, multiline: false, defer: false },
)
// Animated graphs belong to each instance, including SSR/hydration.
const instanceId = getCurrentInstance()!.uid
const placeholder = useTemplateRef<HTMLElement>('placeholder')
// No filter ID is emitted during SSR. Vue's runtime UID also separates
// imperative render roots that share a native useId prefix.
const filterId = `sax-placeholder-dissolve-${useId()}-${instanceId}`
const animating = shallowRef(false)
const initialDissolved = shallowRef(props.dissolved)
const pending = shallowRef(false)
let pendingFrame = 0
let pendingView: Window | null = null
const cancelPending = () => {
  if (pendingFrame) pendingView?.cancelAnimationFrame(pendingFrame)
  pendingFrame = 0
  pending.value = false
}
onBeforeUnmount(cancelPending)
let active = true
onDeactivated(() => {
  cancelPending()
  active = false
  animating.value = false
})
onActivated(() => {
  active = true
})
watch(
  () => [props.dissolved, props.hidden] as const,
  ([target, hidden], [previous]) => {
    const wasPending = pending.value
    cancelPending()
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
    if (!animating.value && !wasPending) initialDissolved.value = previous
    if (!animating.value && initialDissolved.value === target) return
    if (props.defer && !animating.value && document?.defaultView) {
      pending.value = true
      pendingView = document.defaultView
      // Give the popup one paint before mounting and starting the SVG graph.
      pendingFrame = pendingView.requestAnimationFrame(() => {
        pendingFrame = pendingView!.requestAnimationFrame(() => {
          pendingFrame = 0
          pending.value = false
          if (!active || props.hidden || document.hidden) return
          animating.value = true
        })
      })
      return
    }
    animating.value = true
  },
  // Decide playback before this component patches, so graph and URL appear
  // together instead of mounting through another post-render update.
  { flush: 'pre' },
)
const filterStyle = computed(() => ({
  // Resting content is ordinary text; hidden content needs no filter raster.
  filter: animating.value ? `url("#${filterId}")` : undefined,
  opacity:
    !animating.value &&
    (pending.value ? initialDissolved.value : props.dissolved)
      ? 0
      : undefined,
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
      :duration="duration"
      :reverse-duration="reverseDuration"
      @settled="animating = false"
    />
    <span :class="ns.e('dissolve')" :style="filterStyle">
      <span :class="ns.e('content')">{{ text }}</span>
    </span>
  </span>
</template>
