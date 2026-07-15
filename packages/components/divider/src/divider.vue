<template>
  <div :class="ns.b()" :style="rootStyle">
    <span
      :class="[ns.e('border'), ns.is('after'), borderColorClass]"
      :style="afterStyle"
    />
    <span
      v-if="icon || $slots.default"
      :class="[ns.e('text'), textColorClass, backgroundColorClass]"
      :style="textStyle"
    >
      <template v-if="!icon">
        <slot />
      </template>
      <SIcon v-else :icon="icon" :icon-pack="iconPack" :class="ns.e('icon')" />
    </span>
    <span
      :class="[ns.e('border'), ns.is('before'), borderColorClass]"
      :style="beforeStyle"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { SIcon } from '@vuesax-alpha/components/icon'
import { getVsColor, isRgbColor, isVsColor } from '@vuesax-alpha/utils'
import { dividerProps } from './divider'
import type { CSSProperties } from 'vue'

defineOptions({
  name: 'SDivider',
})

const props = defineProps(dividerProps)

const ns = useNamespace('divider')

const DEFAULT_COLOR = 'rgba(0, 0, 0,.1)'

const normalizeThemeColor = (color: string) =>
  color === 'warning' ? 'warn' : color

const normalizedColor = computed(() => normalizeThemeColor(props.color))
const normalizedBackground = computed(() =>
  normalizeThemeColor(props.background)
)

const widthAfter = computed(() => {
  switch (props.position) {
    case 'left':
      return '0%'
    case 'left-center':
      return '25%'
    case 'right-center':
      return '75%'
    case 'right':
      return '100%'
    default:
      return '100%'
  }
})

const widthBefore = computed(() => {
  switch (props.position) {
    case 'left':
      return '100%'
    case 'left-center':
      return '75%'
    case 'right-center':
      return '25%'
    case 'right':
      return '0%'
    default:
      return '100%'
  }
})

const resolveInlineColor = (color: string) => {
  if (!color || color === DEFAULT_COLOR || color === 'transparent')
    return undefined
  if (isVsColor(normalizeThemeColor(color))) return undefined
  if (isRgbColor(color)) return color
  const resolved = getVsColor(color)
  if (resolved) {
    return resolved.startsWith('var(') ? resolved : `rgb(${resolved})`
  }
  return color
}

const borderColorClass = computed(() =>
  isVsColor(normalizedColor.value)
    ? ns.em('border', normalizedColor.value)
    : ns.em('border', 'default')
)

const borderFlexStyle = (width: string): CSSProperties => {
  if (width === '0%') {
    return { flex: '0 0 0', width: 0, minWidth: 0 }
  }
  if (width === '100%') {
    return { flex: '1 1 0', minWidth: 0, width: 'auto' }
  }
  return { flex: `0 1 ${width}`, width, minWidth: 0 }
}

const afterStyle = computed(
  (): CSSProperties => ({
    ...borderFlexStyle(widthAfter.value),
    borderTopWidth: props.borderHeight,
    borderTopStyle: props.borderStyle as CSSProperties['borderTopStyle'],
    borderTopColor: resolveInlineColor(props.color),
  })
)

const beforeStyle = computed(
  (): CSSProperties => ({
    ...borderFlexStyle(widthBefore.value),
    borderTopWidth: props.borderHeight,
    borderTopStyle: props.borderStyle as CSSProperties['borderTopStyle'],
    borderTopColor: resolveInlineColor(props.color),
  })
)

const textStyle = computed(() => {
  const style: Record<string, string> = {}
  const textColor = resolveInlineColor(
    props.color !== DEFAULT_COLOR ? props.color : ''
  )
  if (textColor) style.color = textColor
  const background = resolveInlineColor(props.background)
  if (background && props.background !== 'transparent') {
    style.background = background
  }
  return style
})

const textColorClass = computed(() =>
  isVsColor(normalizedColor.value)
    ? ns.em('text', normalizedColor.value)
    : ns.em('text', 'default')
)

const backgroundColorClass = computed(() =>
  isVsColor(normalizedBackground.value)
    ? ns.em('background', normalizedBackground.value)
    : ns.em('background', 'default')
)

const rootStyle = computed(() =>
  isVsColor(normalizedColor.value)
    ? ns.cssVar({ color: getVsColor(normalizedColor.value) })
    : undefined
)
</script>
