<script setup lang="ts">
import { computed, useTemplateRef, watch } from 'vue'
import { useId, useNamespace } from '@vuesax-alpha/hooks'
const props = defineProps<{
  height: number
  duration: number
  animated: boolean
  playing: boolean
}>()
const ns = useNamespace('progress')
const id = `sax-progress-waves-${useId().value}`
const svg = useTemplateRef<SVGSVGElement>('svg')
const scale = computed(() => Math.max(1, props.height) / 40)
const duration = computed(() => `${props.duration / 1000}s`)
const backDuration = computed(() => `${(props.duration * 1.4) / 1000}s`)
const knots = [
  [
    8, 24, 14, 24, 20, 24, 24, 24, 28, 24, 32, 24, 36, 24, 40, 24, 44, 24, 48,
    24, 54, 25, 60, 26, 66, 27, 74, 26, 80, 24,
  ],
  [
    12, 16, 17, 3, 28, 2, 38, 1, 42, 9, 33, 14, 31, 10, 25, 10, 22, 18, 31, 14,
    39, 22, 46, 31, 54, 38, 66, 34, 80, 24,
  ],
  [
    15, 17, 26, 4, 39, 6, 52, 7, 58, 20, 45, 26, 46, 18, 38, 17, 32, 23, 37, 22,
    45, 29, 51, 34, 60, 39, 68, 33, 80, 24,
  ],
  [
    8, 24, 14, 25, 20, 25, 24, 25, 28, 26, 32, 26, 36, 26, 40, 26, 44, 26, 48,
    26, 54, 25, 60, 25, 66, 25, 74, 24, 80, 24,
  ],
]
const interpolate = (phase: number) => {
  const cycle = ((phase % 1) + 1) % 1
  const value = cycle * knots.length
  const index = Math.floor(value)
  const t = value - index
  const p0 = knots[(index + knots.length - 1) % knots.length]
  const p1 = knots[index]
  const p2 = knots[(index + 1) % knots.length]
  const p3 = knots[(index + 2) % knots.length]
  const points = p1.map(
    (value, i) =>
      0.5 *
      (2 * value +
        (-p0[i] + p2[i]) * t +
        (2 * p0[i] - 5 * value + 4 * p2[i] - p3[i]) * t * t +
        (-p0[i] + 3 * value - 3 * p2[i] + p3[i]) * t * t * t),
  )
  const smooth = (value: number) => {
    const t = Math.min(1, Math.max(0, value))
    return t * t * (3 - 2 * t)
  }
  // As the lip lands, unfold its horizontal controls into a single-valued surface.
  const spread =
    cycle >= 0.45 ? smooth((cycle - 0.45) / 0.2) : 1 - smooth(cycle / 0.12)
  let previous = 0
  for (let i = 0; i < points.length; i += 2) {
    const unfolded = Math.min(80, Math.max(previous, points[i]))
    points[i] += (unfolded - points[i]) * spread
    previous = unfolded
  }
  return points
}
const path = (phase: number) => {
  let result = 'M0 24'
  for (const offset of [0, 80]) {
    const points = interpolate(phase + offset / 160)
    for (let index = 0; index < points.length; index += 6)
      result += `C${(points[index] + offset).toFixed(3)} ${points[index + 1].toFixed(3)} ${(points[index + 2] + offset).toFixed(3)} ${points[index + 3].toFixed(3)} ${(points[index + 4] + offset).toFixed(3)} ${points[index + 5].toFixed(3)}`
  }
  return result
}
const phases = Array.from({ length: 49 }, (_, index) => index / 48)
const front = phases.map(path)
const surfaceValues = front.join(';')
const fillValues = front.map((value) => `${value}L160 64H0Z`).join(';')
const back = (amplitude: number) =>
  `M0 22Q20 ${22 - amplitude} 40 22Q60 ${22 + amplitude} 80 22Q100 ${22 - amplitude} 120 22Q140 ${22 + amplitude} 160 22L160 64H0Z`
const backValues = [4, 20, 10, 4].map(back).join(';')
const splines = '.4 0 .6 1;.4 0 .6 1;.3 0 .5 1;.4 0 .6 1'
watch(
  [svg, () => props.playing, () => props.animated],
  () => {
    if (props.playing && props.animated) svg.value?.unpauseAnimations?.()
    else svg.value?.pauseAnimations?.()
  },
  { flush: 'post' },
)
</script>

<template>
  <svg
    ref="svg"
    :class="ns.e('waves')"
    width="100%"
    height="100%"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient :id="`${id}-water`" x1="0" y1="0" x2="0" y2="1">
        <stop stop-color="white" stop-opacity="0.52" />
        <stop offset="1" stop-color="white" stop-opacity="0.08" />
      </linearGradient>
      <pattern
        :id="id"
        width="160"
        height="40"
        patternUnits="userSpaceOnUse"
        :patternTransform="`scale(${scale})`"
      >
        <path :d="back(20)" fill="black" fill-opacity="0.12">
          <animate
            v-if="animated"
            attributeName="d"
            :values="backValues"
            keyTimes="0;0.35;0.7;1"
            keySplines=".4 0 .6 1;.4 0 .6 1;.4 0 .6 1"
            calcMode="spline"
            :dur="backDuration"
            :begin="`${(-props.duration * 0.25) / 1000}s`"
            repeatCount="indefinite"
          />
        </path>
        <path :d="`${path(0.25)}L160 64H0Z`" :fill="`url(#${id}-water)`">
          <animate
            v-if="animated"
            attributeName="d"
            :values="fillValues"
            calcMode="linear"
            :dur="duration"
            repeatCount="indefinite"
          />
        </path>
        <path
          :d="path(0.25)"
          fill="none"
          stroke="white"
          stroke-opacity="0.8"
          stroke-width="0.8"
        >
          <animate
            v-if="animated"
            attributeName="d"
            :values="surfaceValues"
            calcMode="linear"
            :dur="duration"
            repeatCount="indefinite"
          />
        </path>
        <g
          v-for="offset in [0, 80]"
          :key="offset"
          :transform="`translate(${offset} 0)`"
        >
          <g :class="ns.e('wave-foam')" fill="white" opacity="0.6">
            <circle cx="29" cy="3" r="1.1" />
            <circle cx="33" cy="4.3" r="0.8" />
            <circle cx="26" cy="2" r="0.5" />
            <animateTransform
              v-if="animated"
              attributeName="transform"
              type="translate"
              values="0 0;0 0;12 16;28 32;0 0"
              keyTimes="0;0.25;0.5;0.75;1"
              :keySplines="splines"
              calcMode="spline"
              :dur="duration"
              :begin="`${(-props.duration * offset) / 160000}s`"
              repeatCount="indefinite"
            />
            <animate
              v-if="animated"
              attributeName="opacity"
              values="0;0.5;1;0;0"
              keyTimes="0;0.25;0.5;0.75;1"
              :dur="duration"
              :begin="`${(-props.duration * offset) / 160000}s`"
              repeatCount="indefinite"
            />
          </g>
        </g>
      </pattern>
    </defs>
    <rect width="100%" height="100%" :fill="`url(#${id})`" />
  </svg>
</template>
