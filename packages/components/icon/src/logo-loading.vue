<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { logoLoadingEmits, logoLoadingProps } from './logo-loading'
import {
  LogoLoadingMotion,
  subscribeLogoLoadingFrame,
} from './logo-loading-motion'
import type { LogoLoadingPhase } from './logo-loading'

defineOptions({ name: 'SLogoLoading' })

const props = defineProps(logoLoadingProps)
const emit = defineEmits(logoLoadingEmits)
const ns = useNamespace('logo-loading')
const phase = shallowRef<LogoLoadingPhase>('idle')
const mounted = shallowRef(false)
let unsubscribe: (() => void) | undefined
let motionPreference: MediaQueryList | undefined

const motion = new LogoLoadingMotion((nextPhase, restored) => {
  phase.value = nextPhase
  emit('phaseChange', nextPhase)
  if (restored) emit('restored')
})
const frame = shallowRef(motion.frame())

const sizeValue = computed(() =>
  typeof props.size === 'number' ? `${props.size}px` : props.size,
)
const styles = computed(() => ({
  '--sax-logo-loading-size': sizeValue.value,
}))
const reduced = () => props.reducedMotion ?? motionPreference?.matches ?? false
const renderFrame = () => {
  frame.value = motion.frame()
}

const stopFrames = () => {
  unsubscribe?.()
  unsubscribe = undefined
}

const startFrames = () => {
  if (unsubscribe || reduced()) return
  unsubscribe = subscribeLogoLoadingFrame((milliseconds) => {
    motion.advance(milliseconds * props.speed)
    renderFrame()
    if (motion.phase === 'idle') stopFrames()
  })
}

const syncActive = () => {
  if (!mounted.value) return
  if (reduced()) {
    stopFrames()
    motion.reduce(props.active)
    renderFrame()
    return
  }
  if (props.active) motion.start()
  else motion.stop()
  renderFrame()
  if (motion.phase !== 'idle') startFrames()
}

const start = () => {
  if (!mounted.value) return
  if (reduced()) {
    motion.reduce(true)
    renderFrame()
    return
  }
  motion.start()
  renderFrame()
  startFrames()
}
const stop = () => {
  if (!mounted.value) return
  if (reduced()) {
    motion.reduce(false)
    renderFrame()
    return
  }
  motion.stop()
  renderFrame()
  startFrames()
}
const reset = () => {
  stopFrames()
  motion.reset()
  renderFrame()
}

watch(() => props.active, syncActive)
watch(
  () => props.reducedMotion,
  () => syncActive(),
)

onMounted(() => {
  if (typeof window.matchMedia === 'function') {
    motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    motionPreference.addEventListener('change', syncActive)
  }
  mounted.value = true
  syncActive()
})

onBeforeUnmount(() => {
  mounted.value = false
  stopFrames()
  motionPreference?.removeEventListener('change', syncActive)
})

defineExpose({ start, stop, reset, phase })
</script>

<template>
  <span
    :class="ns.b()"
    :style="styles"
    :data-phase="phase"
    :role="label ? 'status' : undefined"
    :aria-label="label"
    :aria-busy="label && active ? 'true' : undefined"
    :aria-hidden="label ? undefined : 'true'"
  >
    <svg
      :class="ns.e('graphic')"
      viewBox="0 0 84 84"
      fill="none"
      aria-hidden="true"
    >
      <g transform="translate(14 15.5)">
        <template v-if="frame.phase === 'running'">
          <circle :class="ns.e('ring')" cx="28" cy="26.5" r="27" />
          <path
            :class="[ns.e('stroke'), ns.is('top-accent')]"
            :d="frame.topAccent"
          />
          <path
            :class="[ns.e('stroke'), ns.is('bottom-accent')]"
            :d="frame.bottomAccent"
          />
        </template>
        <template v-else>
          <path :class="ns.e('stroke')" :d="frame.top" />
          <path :class="ns.e('stroke')" :d="frame.bottom" />
          <path
            :class="[ns.e('stroke'), ns.is('top-accent')]"
            :d="frame.topAccent"
          />
          <path
            :class="[ns.e('stroke'), ns.is('bottom-accent')]"
            :d="frame.bottomAccent"
          />
        </template>
      </g>
    </svg>
  </span>
</template>
