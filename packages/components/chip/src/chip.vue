<template>
  <span :class="chipKls" :style="chipStyle" @click="handleClick">
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
      v-if="closable"
      :class="ns.e('close')"
      type="button"
      @click.stop="handleClose"
    >
      <VsIcon :icon="closeIcon" :icon-pack="iconPack" />
    </button>
  </span>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import {
  useColor,
  useNamespace,
  useVuesaxBaseComponent,
} from '@vuesax-alpha/hooks'
import { VsIcon } from '@vuesax-alpha/components/icon'
import { getVsColor } from '@vuesax-alpha/utils'
import { chipEmits, chipProps } from './chip'
import type { Color } from '@vuesax-alpha/constants'

defineOptions({
  name: 'VsChip',
})

const props = defineProps(chipProps)
const emit = defineEmits(chipEmits)

const ns = useNamespace('chip')
const color = useColor(computed(() => (props.color as Color) || undefined))
const vsBaseClasses = useVuesaxBaseComponent(color)

const chipKls = computed(() => [
  ns.b(),
  vsBaseClasses,
  ns.is('closable', !!props.closable),
  ns.is('transparent', props.transparent),
  props.color && ns.m(props.color),
])

const chipStyle = computed(() => {
  const colorValue = color.value
  if (!colorValue) {
    return {}
  }

  return props.transparent
    ? ns.cssVar({ color: getVsColor(colorValue) })
    : ns.cssVar({ color: getVsColor(colorValue) })
})

const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
  emit('click')
}

const handleClick = () => {
  emit('click')
}
</script>
