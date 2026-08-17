<template>
  <div v-if="visible" :class="chipKls" :style="chipStyle" @click="handleClick">
    <span :class="ns.e('text')">
      <SIcon
        v-if="icon" :name="icon"
        :class="ns.e('icon')"
      />
      <slot>{{ text }}</slot>
    </span>

    <button
      v-if="isClosable"
      :class="ns.e('close')"
      type="button"
      :aria-label="t('vs.common.close')"
      @click.stop="handleClose"
    >
      <SIcon :name="closeIcon" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import {
  useColor,
  useLocale,
  useNamespace,
  useVuesaxBaseComponent,
} from '@vuesax-alpha/hooks'
import { SIcon } from '@vuesax-alpha/components/icon'
import { getVsColor, isVsColor, normalizeVsColor } from '@vuesax-alpha/utils'
import { chipEmits, chipProps } from './chip'
import type { Color } from '@vuesax-alpha/constants'
import type { CSSProperties } from 'vue'

defineOptions({
  name: 'SChip',
})

const props = defineProps(chipProps)
const emit = defineEmits(chipEmits)

const ns = useNamespace('chip')
const { t } = useLocale()
const color = useColor(computed(() => (props.color as Color) || undefined))
const vsBaseClasses = useVuesaxBaseComponent(color)

const themeColor = computed(() =>
  normalizeVsColor(props.color || color.value || ''),
)

const isClosable = computed(
  () => props.closable !== false && props.closable !== '',
)

const visible = computed(() => props.item || props.modelValue)

const chipKls = computed(() => [
  ns.b(),
  vsBaseClasses,
  ns.is('closable', isClosable.value),
  ns.is('transparent', props.transparent),
  ns.is(`style-${props.tagStyle}`, props.tagStyle !== 'default'),
  ns.is('round', props.round),
  ns.m(props.size),
  props.color && ns.is('colored', !!props.color),
  props.color && isVsColor(themeColor.value) && ns.m(themeColor.value),
])

const chipStyle = computed((): CSSProperties => {
  const colorValue = props.color || color.value
  if (!colorValue) {
    return {}
  }

  if (isVsColor(themeColor.value)) {
    return {}
  }

  const resolved = getVsColor(colorValue)
  if (!resolved) return {}

  if (props.transparent) {
    const bg = resolved.startsWith('var(')
      ? `color-mix(in srgb, ${resolved} 15%, transparent)`
      : `rgba(${resolved}, 0.15)`
    const fg = resolved.startsWith('var(') ? resolved : `rgb(${resolved})`
    return {
      '--sax-chip-surface': bg,
      '--sax-chip-accent': fg,
      '--sax-chip-text': fg,
    }
  }

  return {
    '--sax-chip-surface': resolved.startsWith('var(')
      ? resolved
      : `rgb(${resolved})`,
    '--sax-chip-accent': resolved.startsWith('var(')
      ? resolved
      : `rgb(${resolved})`,
    '--sax-chip-text': 'rgba(255,255,255,.94)',
  }
})

const handleClose = () => {
  emit('click')
  if (props.item) {
    emit('s-remove', false)
    emit('close')
    return
  }
  emit('update:modelValue', false)
  emit('close')
}

const handleClick = () => {
  emit('click')
}
</script>
