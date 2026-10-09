<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useId, useNamespace } from '@vuesax-alpha/hooks'
import { useResultMotion } from './use-result-motion'
import type { ResultType } from './result'

const props = defineProps<{ status: ResultType; animated: boolean }>()
const ns = useNamespace('result')
const id = `sax-result-${useId().value}`
const scene = useTemplateRef<SVGSVGElement>('scene')
const motion = useResultMotion(scene, () => props.animated)
const finish = (event: AnimationEvent) => {
  if (event.animationName === 'sax-result-seal-in')
    motion.completed.value = true
}
</script>

<template>
  <svg
    ref="scene"
    :class="[
      ns.e('illustration'),
      ns.is(
        'revealing',
        motion.started.value &&
          !motion.completed.value &&
          animated &&
          !motion.reduced.value,
      ),
      ns.is('paused', !motion.playing.value),
      ns.is(
        'pending',
        animated && !motion.started.value && !motion.reduced.value,
      ),
    ]"
    viewBox="0 0 192 152"
    fill="none"
    aria-hidden="true"
    focusable="false"
    @animationend="finish"
  >
    <defs>
      <radialGradient :id="`${id}-halo`">
        <stop stop-color="currentColor" stop-opacity="0.13" />
        <stop offset="1" stop-color="currentColor" stop-opacity="0" />
      </radialGradient>
      <radialGradient :id="`${id}-shadow`">
        <stop stop-color="currentColor" stop-opacity="0.18" />
        <stop offset="1" stop-color="currentColor" stop-opacity="0" />
      </radialGradient>
      <linearGradient :id="`${id}-paper`" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="var(--sax-css-background)" />
        <stop offset="1" stop-color="currentColor" stop-opacity="0.08" />
      </linearGradient>
      <linearGradient :id="`${id}-seal`" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="currentColor" stop-opacity="0.78" />
        <stop offset="1" stop-color="currentColor" />
      </linearGradient>
    </defs>
    <ellipse cx="96" cy="78" rx="92" ry="68" :fill="`url(#${id}-halo)`" />
    <ellipse cx="96" cy="137" rx="68" ry="9" :fill="`url(#${id}-shadow)`" />
    <g :class="ns.e('paper')">
      <rect
        x="47"
        y="34"
        width="96"
        height="92"
        rx="23"
        transform="rotate(-12 95 80)"
        fill="currentColor"
        fill-opacity="0.08"
      />
      <rect
        x="53"
        y="26"
        width="92"
        height="98"
        rx="23"
        transform="rotate(8 99 75)"
        fill="currentColor"
        fill-opacity="0.09"
      />
      <rect
        x="48"
        y="27"
        width="96"
        height="100"
        rx="24"
        fill="var(--sax-css-background)"
      />
      <rect
        x="48"
        y="27"
        width="96"
        height="100"
        rx="24"
        :fill="`url(#${id}-paper)`"
      />
      <path
        d="M72 109H120M80 117H112"
        stroke="currentColor"
        stroke-opacity="0.18"
        stroke-width="3"
        stroke-linecap="round"
      />
      <path
        d="M62 42Q65 35 76 35H94"
        stroke="white"
        stroke-opacity="0.68"
        stroke-width="2"
        stroke-linecap="round"
      />
    </g>
    <g :class="ns.e('seal')">
      <ellipse cx="97" cy="99" rx="30" ry="5" :fill="`url(#${id}-shadow)`" />
      <circle cx="96" cy="70" r="30" :fill="`url(#${id}-seal)`" />
      <path
        d="M76 55A25 25 0 0 1 105 46"
        stroke="white"
        stroke-opacity="0.28"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        v-if="status === 'success'"
        :class="ns.e('mark')"
        d="M81 70L92 81L113 58"
        pathLength="1"
        stroke="white"
        stroke-width="4.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <g
        v-else-if="status === 'warning'"
        stroke="white"
        stroke-width="4"
        stroke-linecap="round"
      >
        <path :class="ns.e('mark')" d="M96 54V73" pathLength="1" />
        <circle cx="96" cy="84" r="2.3" fill="white" stroke="none" />
      </g>
      <path
        v-else-if="status === 'error'"
        :class="ns.e('mark')"
        d="M86 60L106 80M106 60L86 80"
        pathLength="1"
        stroke="white"
        stroke-width="4"
        stroke-linecap="round"
      />
      <g v-else stroke="white" stroke-width="4" stroke-linecap="round">
        <circle cx="96" cy="55" r="2.4" fill="white" stroke="none" />
        <path :class="ns.e('mark')" d="M96 66V84" pathLength="1" />
      </g>
    </g>
    <g :class="ns.e('glints')" fill="currentColor">
      <path
        d="M151 25L153 31L159 33L153 35L151 41L149 35L143 33L149 31Z"
        opacity="0.55"
      />
      <circle cx="32" cy="54" r="2.5" opacity="0.4" />
      <circle cx="156" cy="98" r="3" opacity="0.25" />
      <path
        d="M30 100L32 104L36 106L32 108L30 112L28 108L24 106L28 104Z"
        opacity="0.3"
      />
    </g>
  </svg>
</template>
