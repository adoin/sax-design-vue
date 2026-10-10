<script setup lang="ts">
import { computed } from 'vue'
import { useId } from '@vuesax-alpha/hooks'

const props = defineProps<{ active: boolean; progress: number }>()
const id = useId()
const gradientId = computed(() => `s-generation-ribbon-${id.value}`)
const intensity = computed(
  () => 0.65 + Math.max(0, Math.min(100, props.progress)) / 300,
)
const logoPath =
  'M43 9H22C14.3 9 9 13.2 9 19s5.3 10 13 10h12c5.4 0 9 3.4 9 7.5S39.4 44 34 44H13'
const strands = [-3, -2, -1, 0, 1, 2, 3]
</script>

<template>
  <svg
    class="s-agent-generation-field"
    :class="{ 'is-active': active }"
    :style="{ '--sax-generation-intensity': intensity }"
    viewBox="0 0 400 300"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient
        :id="gradientId"
        x1="0"
        y1="1"
        x2="1"
        y2="0"
        gradientUnits="objectBoundingBox"
      >
        <stop offset="0" stop-color="var(--sax-generation-teal)" />
        <stop offset=".48" stop-color="var(--sax-generation-indigo)" />
        <stop offset="1" stop-color="var(--sax-generation-purple)" />
      </linearGradient>
    </defs>
    <g class="s-agent-generation-waves" :stroke="`url(#${gradientId})`">
      <path
        v-for="n in 5"
        :key="n"
        :d="`M-40 ${130 + n * 12} C70 ${15 + n * 8} 135 ${265 - n * 10} 220 ${150 + n * 6} S350 ${35 + n * 12} 450 ${155 + n * 10}`"
        :style="{ '--sax-generation-phase': `${n * -0.3}s` }"
        pathLength="100"
      />
    </g>
    <g class="s-agent-generation-logo" transform="translate(97 57) scale(3.6)">
      <g
        v-for="strand in strands"
        :key="strand"
        :transform="`translate(${strand * 0.85} ${strand * 0.75})`"
        :stroke="`url(#${gradientId})`"
        :style="{ '--sax-generation-phase': `${(strand + 3) * -0.08}s` }"
      >
        <path class="s-agent-generation-track" :d="logoPath" />
        <path
          class="s-agent-generation-ribbon"
          :d="logoPath"
          pathLength="100"
        />
      </g>
    </g>
  </svg>
</template>
