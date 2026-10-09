<script setup lang="ts">
import { useNamespace } from '@vuesax-alpha/hooks'
import { emptyMotionDuration } from './empty-geometry'
import type { EmptyFlapAnimation } from './empty-geometry'

defineProps<{ flap: EmptyFlapAnimation; paint: string; animated: boolean }>()
const ns = useNamespace('empty')
</script>

<template>
  <g
    :class="[ns.e('flap'), ns.e(`flap-${flap.side}`)]"
    :data-motion="`flap-${flap.side}`"
  >
    <path
      :d="flap.rest.outline"
      :fill="paint"
      stroke="currentColor"
      stroke-opacity=".3"
      stroke-width="1.5"
      stroke-linejoin="round"
    >
      <animate
        v-if="animated"
        attributeName="d"
        :values="flap.outlines"
        :dur="emptyMotionDuration"
        repeatCount="1"
        fill="freeze"
        calcMode="linear"
      />
    </path>
    <path
      :d="flap.rest.outline"
      fill="currentColor"
      :fill-opacity="flap.rest.shade"
    >
      <animate
        v-if="animated"
        attributeName="d"
        :values="flap.outlines"
        :dur="emptyMotionDuration"
        repeatCount="1"
        fill="freeze"
        calcMode="linear"
      />
      <animate
        v-if="animated"
        attributeName="fill-opacity"
        :values="flap.shades"
        :dur="emptyMotionDuration"
        repeatCount="1"
        fill="freeze"
      />
    </path>
    <path :d="flap.rest.edge" fill="currentColor" fill-opacity=".2">
      <animate
        v-if="animated"
        attributeName="d"
        :values="flap.edges"
        :dur="emptyMotionDuration"
        repeatCount="1"
        fill="freeze"
        calcMode="linear"
      />
    </path>
    <path :d="flap.rest.crease" fill="currentColor" fill-opacity=".06">
      <animate
        v-if="animated"
        attributeName="d"
        :values="flap.creases"
        :dur="emptyMotionDuration"
        repeatCount="1"
        fill="freeze"
        calcMode="linear"
      />
    </path>
    <path
      :d="flap.rest.fold"
      stroke="currentColor"
      stroke-opacity=".18"
      stroke-linecap="round"
    >
      <animate
        v-if="animated"
        attributeName="d"
        :values="flap.folds"
        :dur="emptyMotionDuration"
        repeatCount="1"
        fill="freeze"
        calcMode="linear"
      />
    </path>
    <path
      :d="flap.rest.highlight"
      :class="ns.e('tone-surface')"
      stroke="currentColor"
      stroke-width="2"
      stroke-opacity=".75"
      stroke-linecap="round"
    >
      <animate
        v-if="animated"
        attributeName="d"
        :values="flap.highlights"
        :dur="emptyMotionDuration"
        repeatCount="1"
        fill="freeze"
        calcMode="linear"
      />
    </path>
  </g>
</template>
