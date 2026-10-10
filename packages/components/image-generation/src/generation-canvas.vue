<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue'
const props = defineProps<{ active: boolean; progress: number }>()
const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
let frame: number | undefined
let resize: ResizeObserver | undefined
let preference: MediaQueryList | undefined
let last = 0
const stop = () => {
  if (frame !== undefined) cancelAnimationFrame(frame)
  frame = undefined
}
const draw = (time = 0) => {
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
  context.fillStyle = getComputedStyle(element).color
  const phase = props.active && !preference?.matches ? time / 1800 : 0
  for (let row = 0; row < 28; row++)
    for (let col = 0; col < 38; col++) {
      const x = (col + 0.5) / 38
      const y = (row + 0.5) / 28
      const wave = Math.sin(x * 9 + phase) * Math.cos(y * 8 - phase * 0.7)
      context.globalAlpha =
        0.07 + Math.max(0, wave) ** 4 * (0.15 + props.progress / 150)
      context.beginPath()
      context.arc(x * width, y * height, 1.15, 0, Math.PI * 2)
      context.fill()
    }
  return true
}
const tick = (time: number) => {
  if (time - last >= 40) {
    draw(time)
    last = time
  }
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
watch(() => [props.active, props.progress], refresh)
onBeforeUnmount(() => {
  stop()
  resize?.disconnect()
  preference?.removeEventListener('change', refresh)
})
</script>
<template>
  <canvas ref="canvas" class="s-agent-generation-field" aria-hidden="true" />
</template>
