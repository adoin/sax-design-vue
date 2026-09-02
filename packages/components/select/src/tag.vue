<template>
  <span :class="tagKls" @click="onClick">
    <slot />

    <icon-close
      v-if="!disabled && showClose"
      hover="less"
      scale="0.5"
      @click="onClose"
      @mouseenter="onMouseEnterClose"
      @mouseleave="onMouseLeaveClose"
    />
  </span>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import { useNamespace, useShape } from '@vuesax-alpha/hooks'
import { IconClose } from '@vuesax-alpha/components/icon'
import { tagEmits, tagProps } from './tag'
import { selectContextKey } from './tokens'

defineOptions({
  name: 'STag',
})

const ns = useNamespace('tag')
const shape = useShape()

const select = inject(selectContextKey)!

const props = defineProps(tagProps)
const emit = defineEmits(tagEmits)

const tagKls = computed(() => [
  ns.b(),
  ns.is('disabled', props.disabled),
  ns.is('hit', props.hit),
  ns.is(shape.value),
])

const onClick = (e: Event) => {
  emit('click', e)
}

const onClose = (e: Event) => {
  emit('close', e)
}

const onMouseEnterClose = () => {
  select.handleTarget('tag-close', !props.disabled)
}

const onMouseLeaveClose = () => {
  select.handleTarget(null)
}
</script>
