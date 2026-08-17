<template>
  <span
    v-bind="$attrs"
    :class="[ns.b(), ns.is('rolling', isRolling)]"
    :style="rootStyle"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
  >
    <svg
      v-if="resolvedIconData"
      v-bind="resolvedIconData.attributes"
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      focusable="false"
      :style="svgStyle"
      v-html="resolvedIconData.body"
    />
    <slot v-else />
  </span>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { addUnit, getVsColor } from '@vuesax-alpha/utils'
import { useNamespace } from '@vuesax-alpha/hooks'
import { getIconData } from 'sax-design-vue-iconify'
import { iconProps } from './icon'
import type { CSSProperties } from 'vue'

defineOptions({
  name: 'SIcon',
  inheritAttrs: false,
})

const props = defineProps(iconProps)
const ns = useNamespace('icon')
const isRolling = computed(
  () =>
    props.rolling === true ||
    (typeof props.rolling === 'number' && props.rolling > 0),
)
const resolvedIconData = computed(
  () => props.iconData || (props.name ? getIconData(props.name) : undefined),
)

const rootStyle = computed<CSSProperties>(() => {
  const size = props.size === undefined ? '1em' : addUnit(props.size)
  const rgb = getVsColor(props.color)
  const style: CSSProperties = {
    width: size,
    height: size,
    fontSize: size,
    color: rgb ? `rgb(${rgb})` : props.color || 'currentColor',
  }
  if (typeof props.rolling === 'number' && props.rolling > 0) {
    style['--sax-icon-rolling-duration'] = `${props.rolling}s`
  }
  return style
})

const svgStyle = computed<CSSProperties>(() => {
  const angle =
    typeof props.rotate === 'number' ? `${props.rotate}deg` : props.rotate
  const scaleX = props.flip === 'horizontal' || props.flip === 'both' ? -1 : 1
  const scaleY = props.flip === 'vertical' || props.flip === 'both' ? -1 : 1
  return {
    transform: `rotate(${angle || '0deg'}) scale(${scaleX}, ${scaleY})`,
  }
})
</script>
