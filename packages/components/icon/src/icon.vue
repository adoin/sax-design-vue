<template>
  <span
    v-bind="$attrs"
    :class="[ns.b(), ns.is('rolling', isRolling)]"
    :style="rootStyle"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
    :data-morphing="morphActive || undefined"
  >
    <svg
      v-if="renderedIconData"
      v-bind="renderedIconData.attributes"
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      focusable="false"
      :style="svgStyle"
      v-html="renderedIconData.body"
    />
    <slot v-else />
  </span>
</template>

<script lang="ts" setup>
import { computed, useId } from 'vue'
import { addUnit, getVsColor } from '@vuesax-alpha/utils'
import { useGlobalComponentProps, useNamespace } from '@vuesax-alpha/hooks'
import { getIconData } from 'sax-design-vue-iconify'
import { iconEmits, iconProps } from './icon'
import { useIconMorph } from './use-icon-morph'
import { builtinCarbonIcons } from './builtin-carbon-icons'
import { closeIconData } from './close-artwork'
import { scopeIconData } from './scope-svg'
import type { CSSProperties } from 'vue'

defineOptions({
  name: 'SIcon',
  inheritAttrs: false,
})

const rawProps = defineProps(iconProps)
const props = useGlobalComponentProps('icon', rawProps)
const emit = defineEmits(iconEmits)
const ns = useNamespace('icon')
const paintId = `sax-icon-${useId().replace(/[^\w-]/g, '-')}`
const isRolling = computed(
  () =>
    props.rolling === true ||
    (typeof props.rolling === 'number' && props.rolling > 0),
)
const resolvedIconData = computed(() => {
  if (props.iconData || !props.name) return props.iconData
  if (props.name === 'sax:close') return closeIconData
  const registered = getIconData(props.name)
  if (registered) return registered
  const [prefix, name] = props.name.split(':')
  return prefix === 'cb' && name ? builtinCarbonIcons[name] : undefined
})
const { rendered: renderedIconData, active: morphActive } = useIconMorph(
  computed(() => scopeIconData(resolvedIconData.value, paintId)),
  () => props.morph,
  (event, detail) => {
    if (event === 'morphStart') emit('morphStart', detail)
    else emit('morphEnd', detail)
  },
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
