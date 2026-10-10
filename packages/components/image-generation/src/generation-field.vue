<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue'
const props = defineProps<{ active: boolean; progress: number }>()
const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
let frame: number | undefined
let resize: ResizeObserver | undefined
let preference: MediaQueryList | undefined
let time = 0
const stop = () => {
  if (frame !== undefined) cancelAnimationFrame(frame)
  frame = undefined
}
const draw = (timestamp = time) => {
  const element = canvas.value
  const context = element?.getContext('2d')
  if (!element || !context) return false
  const width = element.clientWidth
  const height = element.clientHeight
  const ratio = Math.min(window.devicePixelRatio || 1, 2)
  if (
    element.width !== Math.round(width * ratio) ||
    element.height !== Math.round(height * ratio)
  ) {
    element.width = Math.round(width * ratio)
    element.height = Math.round(height * ratio)
  }
  context.setTransform(ratio, 0, 0, ratio, 0, 0)
  context.clearRect(0, 0, width, height)
  const style = getComputedStyle(element)
  const colors = ['indigo', 'purple', 'teal'].map((color) =>
    style.getPropertyValue(`--sax-generation-${color}`).trim(),
  )
  const phase = props.active && !preference?.matches ? timestamp / 850 : 0
  const brightness = 0.55 + Math.max(0, Math.min(100, props.progress)) / 300
  // Three traveling fronts sweep the whole height, including both edges.
  const pathY = (x: number, lane: number) =>
    -0.22 +
    1.44 * ((phase * 0.25 + lane / 3) % 1) +
    Math.sin(x * 6.2 - phase * 0.65 + lane * 1.7) * 0.11
  // The matrix remains the main visual: moving color currents light up nearby dots.
  for (let row = 0; row < 28; row++) {
    for (let col = 0; col < 38; col++) {
      const x = (col + 0.5) / 38
      const y = (row + 0.5) / 28
      let strength = 0
      let lane = 0
      for (let n = 0; n < 3; n++) {
        const glow = Math.exp(-(((y - pathY(x, n)) / 0.055) ** 2))
        if (glow > strength) {
          strength = glow
          lane = n
        }
      }
      context.fillStyle = strength > 0.08 ? colors[lane] : style.color
      context.globalAlpha = 0.07 + strength * brightness
      context.beginPath()
      context.arc(x * width, y * height, 0.9 + strength * 0.65, 0, Math.PI * 2)
      context.fill()
    }
  }
  return true
}
const tick = (timestamp: number) => {
  time = timestamp
  draw()
  frame = requestAnimationFrame(tick)
}
const refresh = () => {
  stop()
  if (draw() && props.active && !preference?.matches)
    frame = requestAnimationFrame(tick)
}
onMounted(() => {
  preference = window.matchMedia?.('(prefers-reduced-motion: reduce)')
  preference?.addEventListener('change', refresh)
  if (typeof ResizeObserver !== 'undefined') {
    resize = new ResizeObserver(() => draw())
    if (canvas.value) resize.observe(canvas.value)
  }
  refresh()
})
watch(() => props.active, refresh)
watch(
  () => props.progress,
  () => draw(),
)
onBeforeUnmount(() => {
  stop()
  resize?.disconnect()
  preference?.removeEventListener('change', refresh)
})
</script>
<template>
  <canvas ref="canvas" class="s-agent-generation-field" aria-hidden="true" />
</template>
