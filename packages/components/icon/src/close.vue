<template>
  <svg
    :class="[ns.b(), hover && ns.bm('hover', hover)]"
    :style="{
      transform: `scale(${scale})`,
      width: addUnit(size),
      height: addUnit(size),
    }"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path :d="closePath" />
  </svg>
</template>

<script lang="ts" setup>
import { useNamespace } from '@vuesax-alpha/hooks'
import { addUnit } from '@vuesax-alpha/utils'
import { closeProps } from './close'
import { closePath } from './close-artwork'

defineOptions({
  name: 'IconClose',
})

defineProps(closeProps)

const ns = useNamespace('icon-close')
</script>
