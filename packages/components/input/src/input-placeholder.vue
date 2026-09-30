<script setup lang="ts">
import { useId, useTemplateRef } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { usePlaceholderDissolve } from './composables/use-placeholder-dissolve'

const props = defineProps<{ text: string; dissolved: boolean }>()
const ns = useNamespace('input')
// Vue's native ID is stable during SSR/hydration and unique within the app.
const filterId = `sax-placeholder-dissolve-${useId()}`
const filterStyle = { filter: `url("#${filterId}")` }
const filter = useTemplateRef<SVGFilterElement>('filter')
const initial = usePlaceholderDissolve(() => props.dissolved, filter)
</script>

<template>
  <span :class="ns.e('placeholder-text')">
    <svg
      :class="ns.e('placeholder-filter')"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter
          :id="filterId"
          ref="filter"
          x="-100%"
          y="-250%"
          width="300%"
          height="600%"
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
    <span :class="ns.e('placeholder-dissolve')" :style="filterStyle">
      <span :class="ns.e('placeholder-content')">{{ text }}</span>
    </span>
  </span>
</template>
