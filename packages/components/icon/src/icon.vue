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
  name: 'SIcon',
  inheritAttrs: false,
})

const props = defineProps(iconProps)
const ns = useNamespace('icon')

const MATERIAL_ICON_PACKS = new Set([
  'material-icons',
  'material-icons-outlined',
  'material-symbols-outlined',
])

const isMaterialIcons = computed(
  () => !!props.icon && MATERIAL_ICON_PACKS.has(props.iconPack)
)

const iconClasses = computed(() => {
  const classes: string[] = [ns.b(), 'notranslate', props.iconPack]
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
