<script setup lang="ts">
import { useId } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { emptyCompletionDuration } from './empty-geometry'

const ns = useNamespace('empty')
const glowId = `s-empty-glow-${useId()}`
const stars = [
  { x: 131, y: 98, size: 1, begin: '1.15s' },
  { x: 188, y: 61, size: 0.6, begin: '1.28s' },
  { x: 82, y: 96, size: 0.45, begin: '1.4s' },
]
</script>

<template>
  <g :class="ns.e('surprise')" opacity="0">
    <defs>
      <radialGradient :id="glowId">
        <stop stop-color="currentColor" stop-opacity=".35" />
        <stop offset=".45" stop-color="currentColor" stop-opacity=".12" />
        <stop offset="1" stop-color="currentColor" stop-opacity="0" />
      </radialGradient>
    </defs>
    <animate
      data-empty-completion
      attributeName="opacity"
      values="0;0;1;1;0"
      keyTimes="0;.48;.56;.75;1"
      :dur="emptyCompletionDuration"
      repeatCount="1"
      fill="freeze"
    />
    <g
      v-for="star in stars"
      :key="star.x"
      :transform="`translate(${star.x} ${star.y}) scale(${star.size})`"
    >
      <g transform="scale(0)">
        <animateTransform
          attributeName="transform"
          type="scale"
          values="0;1.16;1"
          keyTimes="0;.7;1"
          :begin="star.begin"
          dur=".4s"
          repeatCount="1"
          fill="freeze"
        />
        <circle r="22" :fill="`url(#${glowId})`" />
        <path
          d="M0-10C1-3 3-1 10 0C3 1 1 3 0 10C-1 3-3 1-10 0C-3-1-1-3 0-10Z"
          :class="ns.e('spark-core')"
          fill="currentColor"
        />
        <path
          d="M0-10C1-3 3-1 10 0C3 1 1 3 0 10C-1 3-3 1-10 0C-3-1-1-3 0-10Z"
          stroke="currentColor"
          stroke-width=".7"
          stroke-opacity=".6"
        />
      </g>
    </g>
  </g>
</template>
