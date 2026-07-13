<template>
  <div v-if="visible" :class="chipKls" :style="chipStyle" @click="handleClick">
    <span :class="ns.e('text')">
      <VsIcon
        v-if="icon"
        :icon="icon"
        :icon-pack="iconPack"
        :class="ns.e('icon')"
      />
      <slot>{{ text }}</slot>
    </span>

    <button
      v-if="isClosable"
      :class="ns.e('close')"
      type="button"
      aria-label="Close"
      @click.stop="handleClose"
    >
      <VsIcon :icon="closeIcon" :icon-pack="iconPack" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import {
  useColor,
  useNamespace,
  useVuesaxBaseComponent,
} from '@vuesax-alpha/hooks'
import { VsIcon } from '@vuesax-alpha/components/icon'
import { getVsColor, isVsColor, normalizeVsColor } from '@vuesax-alpha/utils'
import { chipEmits, chipProps } from './chip'
import type { Color } from '@vuesax-alpha/constants'
import type { CSSProperties } from 'vue'

defineOptions({
  name: 'VsChip',
})

const props = defineProps(chipProps)
const emit = defineEmits(chipEmits)

const ns = useNamespace('chip')
const color = useColor(computed(() => (props.color as Color) || undefined))
const vsBaseClasses = useVuesaxBaseComponent(color)

const themeColor = computed(() =>
  normalizeVsColor(props.color || color.value || '')
)

const isClosable = computed(
  () => props.closable !== false && props.closable !== ''
)

const visible = computed(() => props.item || props.modelValue)

const chipKls = computed(() => [
  ns.b(),
  vsBaseClasses,
  ns.is('closable', isClosable.value),
  ns.is('transparent', props.transparent),
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
    return { background: bg, color: fg }
  }

  return {
    background: resolved.startsWith('var(') ? resolved : `rgb(${resolved})`,
    color: 'rgba(255,255,255,.9)',
  }
})

const handleClose = () => {
  emit('click')
  if (props.item) {
    emit('vs-remove', false)
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
