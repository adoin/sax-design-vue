<template>
  <i :class="iconClasses" :style="style">
    <template v-if="isMaterialIcons">{{ icon }}</template>
    <slot v-else-if="!icon" />
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

const isMaterialIcons = computed(
  () => props.iconPack === 'material-icons' && !!props.icon
)

const iconClasses = computed(() => {
  const classes: string[] = [ns.b(), props.iconPack]
  if (!isMaterialIcons.value && props.icon) {
    classes.push(props.icon)
  }
  return classes
})

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
