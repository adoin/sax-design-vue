<template>
  <div :class="ns.b()" :style="rootStyle">
    <span :class="[ns.e('border'), ns.is('after')]" :style="afterStyle" />
    <span
      v-if="icon || $slots.default"
      :class="[ns.e('text'), textColorClass, backgroundColorClass]"
      :style="textStyle"
    >
      <template v-if="!icon">
        <slot />
      </template>
      <VsIcon v-else :icon="icon" :icon-pack="iconPack" :class="ns.e('icon')" />
    </span>
    <span :class="[ns.e('border'), ns.is('before')]" :style="beforeStyle" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { VsIcon } from '@vuesax-alpha/components/icon'
import { getVsColor, isVsColor } from '@vuesax-alpha/utils'
import { dividerProps } from './divider'
import type { CSSProperties } from 'vue'

defineOptions({
  name: 'VsDivider',
})

const props = defineProps(dividerProps)

const ns = useNamespace('divider')

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

const borderColor = computed(() => {
  if (!isVsColor(props.color)) {
    return getVsColor(props.color)
  }
  return undefined
})

const afterStyle = computed(
  (): CSSProperties => ({
    width: widthAfter.value,
    borderTopWidth: props.borderHeight,
    borderTopStyle: props.borderStyle as CSSProperties['borderTopStyle'],
    ...(borderColor.value ? { borderTopColor: borderColor.value } : {}),
  })
)

const beforeStyle = computed(
  (): CSSProperties => ({
    width: widthBefore.value,
    borderTopWidth: props.borderHeight,
    borderTopStyle: props.borderStyle as CSSProperties['borderTopStyle'],
    ...(borderColor.value ? { borderTopColor: borderColor.value } : {}),
  })
)

const textStyle = computed(() => {
  const style: Record<string, string> = {}
  if (!isVsColor(props.color)) {
    style.color = getVsColor(
      props.color !== 'rgba(0, 0, 0,.1)' ? props.color : undefined
    )
  }
  if (!isVsColor(props.background)) {
    style.background = getVsColor(props.background)
  }
  return style
})

const textColorClass = computed(() =>
  isVsColor(props.color) ? ns.em('text', props.color) : ns.em('text', 'default')
)

const backgroundColorClass = computed(() =>
  isVsColor(props.background)
    ? ns.em('background', props.background)
    : ns.em('background', 'default')
)

const rootStyle = computed(() =>
  isVsColor(props.color)
    ? ns.cssVar({ color: getVsColor(props.color) })
    : undefined
)
</script>
