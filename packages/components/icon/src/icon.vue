<template>
  <i :class="iconClasses" :style="style">
    <slot v-if="!icon" />
  </i>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { addUnit, getVsColor, isUndefined } from '@vuesax-alpha/utils'
import { useNamespace } from '@vuesax-alpha/hooks'
import { iconProps } from './icon'
import type { CSSProperties } from 'vue'

defineOptions({
  name: 'VsIcon',
})

const props = defineProps(iconProps)
const ns = useNamespace('icon')

const iconClasses = computed(() => [ns.b(), props.iconPack, props.icon])

const style = computed<CSSProperties>(() => {
  const { size, color } = props
  if (!size && !color) return {}

  return {
    ...ns.cssVar({
      color: getVsColor(color),
    }),
    color: `rgb(${ns.cssVarName('color')})`,
    fontSize: isUndefined(size) ? undefined : addUnit(size),
  }
})
</script>
