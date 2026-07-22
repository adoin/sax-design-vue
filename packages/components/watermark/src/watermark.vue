<template>
  <div :class="ns.b()">
    <div :class="ns.e('marks')" :style="style">
      <span v-for="item in 36" :key="item">{{ content }}</span>
    </div>
    <div :class="ns.e('content')"><slot /></div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { watermarkProps } from './watermark'
defineOptions({ name: 'SWatermark' })
const props = defineProps(watermarkProps)
const ns = useNamespace('watermark')
const style = computed(() => ({
  gap: `${props.gap}px`,
  opacity: props.opacity,
  transform: `rotate(${props.rotate}deg)`,
}))
</script>
