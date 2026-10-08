<script setup lang="ts">
import SvgFilterAnimation from './svg-filter-animation.vue'

withDefaults(
  defineProps<{
    filterId: string
    dissolved: boolean
    region?: 'text' | 'surface'
    dissolveDuration?: number
    assembleDuration?: number
    initialDissolved?: boolean
    animateOnMount?: boolean
  }>(),
  {
    region: 'text',
    dissolveDuration: 480,
    assembleDuration: 650,
    initialDissolved: undefined,
  },
)
const emit = defineEmits<{ settled: [dissolved: boolean] }>()
</script>

<template>
  <SvgFilterAnimation
    animation="dissolve"
    :filter-id="filterId"
    :progress="dissolved ? 1 : 0"
    :initial-progress="
      initialDissolved === undefined ? undefined : initialDissolved ? 1 : 0
    "
    :animate-on-mount="animateOnMount"
    :region="region"
    :duration="dissolveDuration"
    :reverse-duration="assembleDuration"
    @settled="(value) => emit('settled', value === 1)"
  />
</template>
