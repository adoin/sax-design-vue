<script setup lang="ts">
import { useId, useNamespace } from '@vuesax-alpha/hooks'

const props = defineProps<{ duration: number; height: number }>()
const ns = useNamespace('progress')
const id = `sax-progress-sparkle-${useId().value}`
const stars = [
  { x: 18, y: 12, size: 1, phase: 0 },
  { x: 58, y: 5, size: 0.42, phase: 0.34 },
  { x: 108, y: 18, size: 0.78, phase: 0.7 },
  { x: 146, y: 8, size: 0.55, phase: 0.16 },
  { x: 78, y: 33, size: 0.35, phase: 0.53 },
]
</script>

<template>
  <svg
    :class="ns.e('sparkle')"
    width="100%"
    height="100%"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <radialGradient :id="`${id}-glow`">
        <stop stop-color="white" stop-opacity="0.7" />
        <stop offset="0.35" stop-color="white" stop-opacity="0.2" />
        <stop offset="1" stop-color="white" stop-opacity="0" />
      </radialGradient>
      <pattern
        :id="id"
        width="160"
        height="40"
        patternUnits="userSpaceOnUse"
        :patternTransform="`scale(${Math.max(1, height) / 40})`"
      >
        <g
          v-for="(star, index) in stars"
          :key="index"
          :transform="`translate(${star.x} ${star.y}) scale(${star.size})`"
        >
          <g
            :class="ns.e('sparkle-star')"
            :style="{
              '--sax-progress-star-delay': `${-star.phase * props.duration}ms`,
            }"
          >
            <circle r="10" :fill="`url(#${id}-glow)`" />
            <path
              :class="ns.e('sparkle-ray')"
              d="M0-7C.7-1.6 1.6-.7 7 0C1.6.7.7 1.6 0 7C-.7 1.6-1.6.7-7 0C-1.6-.7-.7-1.6 0-7Z"
              fill="white"
            />
            <circle r="1.15" fill="white" />
          </g>
        </g>
      </pattern>
    </defs>
    <rect width="100%" height="100%" :fill="`url(#${id})`" />
  </svg>
</template>
