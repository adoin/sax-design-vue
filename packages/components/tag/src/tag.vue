<template>
  <span :class="classes" :style="style" @click="handleClick">
    <slot>{{ content }}</slot>
    <button
      v-if="closable"
      type="button"
      :class="ns.e('close')"
      :disabled="disabled"
      aria-label="Close"
      @click.stop="handleClose"
    >
      <icon-close />
    </button>
  </span>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { IconClose } from '@vuesax-alpha/components/icon'
import { getVsColor } from '@vuesax-alpha/utils'
import { useNamespace } from '@vuesax-alpha/hooks'
import { tagEmits, tagProps } from './tag'
import type { CSSProperties } from 'vue'

defineOptions({ name: 'STag' })

const props = defineProps(tagProps)
const emit = defineEmits(tagEmits)
const ns = useNamespace('tag')

const classes = computed(() => [
  ns.b(),
  ns.m(props.status || props.type),
  props.size && ns.m(props.size),
  ns.is('round', props.round),
  ns.is('borderless', !props.border),
  ns.is('disabled', props.disabled),
])

const style = computed<CSSProperties>(() =>
  props.color
    ? ({ '--sax-tag-color': getVsColor(props.color) } as CSSProperties)
    : {},
)

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) emit('click', event)
}

const handleClose = (event: MouseEvent) => {
  if (!props.disabled) emit('close', event)
}
</script>
