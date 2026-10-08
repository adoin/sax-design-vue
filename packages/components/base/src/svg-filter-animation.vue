<script setup lang="ts">
import {
  getCurrentInstance,
  onActivated,
  onDeactivated,
  onMounted,
  shallowRef,
  watch,
} from 'vue'
import Graph from './svg-filter-animation-graph.vue'

defineOptions({ name: 'SSvgFilterAnimation' })
const props = withDefaults(
  defineProps<{
    animation: string
    filterId: string
    progress: number
    initialProgress?: number
    animateOnMount?: boolean
    region?: string
    duration?: number
    reverseDuration?: number
  }>(),
  { region: 'text' },
)
const emit = defineEmits<{ settled: [progress: number] }>()
const owner = getCurrentInstance()!
const playing = shallowRef(false)
const initial = shallowRef(props.initialProgress ?? props.progress)
let active = false
const complete = (value: number) => {
  if (value !== props.progress) return
  playing.value = false
  emit('settled', value)
}
const start = (previous: number) => {
  const document = (owner.vnode.el as Node | null)?.ownerDocument
  if (
    !active ||
    document?.hidden ||
    document?.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)')
      .matches
  )
    return complete(props.progress)
  if (!playing.value) initial.value = previous
  playing.value = true
}
watch(
  () => props.progress,
  (_value, previous) => start(previous),
  { flush: 'post' },
)
onMounted(() => {
  active = true
  if (props.animateOnMount && initial.value !== props.progress)
    start(initial.value)
  else complete(props.progress)
})
onDeactivated(() => {
  active = false
  complete(props.progress)
})
onActivated(() => {
  active = true
})
</script>

<template>
  <Graph
    v-if="playing"
    :animation="animation"
    :filter-id="filterId"
    :progress="progress"
    :initial-progress="initial"
    animate-on-mount
    :region="region"
    :duration="duration"
    :reverse-duration="reverseDuration"
    @settled="complete"
  />
</template>
