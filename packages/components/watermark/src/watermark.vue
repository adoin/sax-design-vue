<script lang="ts" setup>
import { computed } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { watermarkProps } from './watermark'
import { createWatermarkMask, watermarkNumber } from './watermark-utils'
defineOptions({ name: 'SWatermark' })
const props = defineProps(watermarkProps)
const ns = useNamespace('watermark')
const maskStyle = (content: string) => {
  const mask = createWatermarkMask(
    content,
    props.fontSize,
    props.gap,
    props.rotate,
  )
  return { maskImage: mask.image, maskSize: mask.size, zIndex: props.zIndex }
}
const visibleStyle = computed(() => ({
  ...maskStyle(props.content),
  backgroundColor: props.color,
  opacity: watermarkNumber(props.opacity, 0.12, 0, 1),
}))
const blindStyle = computed(() => {
  const strength = watermarkNumber(props.blindStrength, 2, 1, 16)
  return {
    ...maskStyle(props.blindContent ?? props.content),
    backgroundColor: `rgb(${strength}, 0, ${strength})`,
  }
})
</script>

<template>
  <div :class="[ns.b(), ns.is('blind', mode !== 'visible')]">
    <div :class="ns.e('content')"><slot /></div>
    <div
      v-if="mode !== 'blind'"
      :class="ns.e('marks')"
      :style="visibleStyle"
      aria-hidden="true"
    />
    <div
      v-if="mode !== 'visible'"
      :class="[ns.e('marks'), ns.em('marks', 'blind')]"
      :style="blindStyle"
      aria-hidden="true"
    />
  </div>
</template>
