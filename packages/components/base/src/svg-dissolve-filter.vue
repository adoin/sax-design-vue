<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useSvgDissolve } from '@vuesax-alpha/hooks/use-svg-dissolve'

const props = withDefaults(
  defineProps<{
    filterId: string
    dissolved: boolean
    region?: 'text' | 'surface'
    dissolveDuration?: number
    assembleDuration?: number
  }>(),
  { region: 'text', dissolveDuration: 480, assembleDuration: 650 },
)
const emit = defineEmits<{ settled: [dissolved: boolean] }>()
const filter = useTemplateRef<SVGFilterElement>('filter')
const initial = useSvgDissolve(() => props.dissolved, filter, {
  dissolveDuration: () => props.dissolveDuration,
  assembleDuration: props.assembleDuration,
  onSettled: (value) => emit('settled', value),
})
</script>

<template>
  <svg
    aria-hidden="true"
    focusable="false"
    width="0"
    height="0"
    style="position: absolute; pointer-events: none"
  >
    <defs>
      <filter
        :id="filterId"
        ref="filter"
        :x="region === 'text' ? '-100%' : '-10%'"
        :y="region === 'text' ? '-250%' : '-10%'"
        :width="region === 'text' ? '300%' : '120%'"
        :height="region === 'text' ? '600%' : '120%'"
        color-interpolation-filters="sRGB"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency=".62 .78"
          numOctaves="2"
          seed="13"
          result="noise"
        />
        <feColorMatrix
          in="noise"
          type="matrix"
          values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  .333 .333 .333 0 0"
          result="noiseAlpha"
        />
        <feComponentTransfer in="noiseAlpha" result="particleMask">
          <feFuncA
            data-dissolve-threshold
            type="linear"
            :slope="initial.slope"
            :intercept="initial.intercept"
          />
        </feComponentTransfer>
        <feComposite
          in="SourceGraphic"
          in2="particleMask"
          operator="in"
          result="cut"
        />
        <feDisplacementMap
          in="cut"
          in2="noise"
          :scale="initial.scale"
          xChannelSelector="R"
          yChannelSelector="G"
          result="moved"
        />
        <feOffset
          in="moved"
          :dx="initial.dx"
          :dy="initial.dy"
          result="shifted"
        />
        <feComponentTransfer in="shifted">
          <feFuncA
            data-dissolve-alpha
            type="linear"
            :slope="initial.alpha"
            intercept="0"
          />
        </feComponentTransfer>
      </filter>
    </defs>
  </svg>
</template>
