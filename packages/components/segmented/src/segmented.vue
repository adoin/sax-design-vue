<script lang="ts" setup>
import { computed, useTemplateRef } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { segmentedEmits, segmentedProps } from './segmented'
import type { SegmentedOption } from './segmented'

defineOptions({ name: 'SSegmented' })

const props = defineProps(segmentedProps)
const emit = defineEmits(segmentedEmits)
const ns = useNamespace('segmented')
const rootRef = useTemplateRef<HTMLElement>('root')
const classes = computed(() => [
  ns.b(),
  ns.is(props.variant),
  ns.is('block', props.block),
  ns.is('disabled', props.disabled),
])

const select = (option: SegmentedOption) => {
  if (props.disabled || option.disabled || option.value === props.modelValue)
    return
  emit('update:modelValue', option.value)
  emit('change', option.value)
}

const move = (direction: 1 | -1) => {
  const enabled = props.options.filter((option) => !option.disabled)
  if (!enabled.length || props.disabled) return
  const current = enabled.findIndex(
    (option) => option.value === props.modelValue,
  )
  const nextIndex =
    current < 0 ? 0 : (current + direction + enabled.length) % enabled.length
  const next = enabled[nextIndex]
  select(next)
  requestAnimationFrame(() => {
    const buttons = rootRef.value?.querySelectorAll<HTMLButtonElement>(
      `.${ns.e('item')}:not(:disabled)`,
    )
    buttons?.[nextIndex]?.focus()
  })
}
</script>

<template>
  <div
    ref="root"
    :class="classes"
    role="radiogroup"
    @keydown.left.prevent="move(-1)"
    @keydown.up.prevent="move(-1)"
    @keydown.right.prevent="move(1)"
    @keydown.down.prevent="move(1)"
  >
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      :class="[ns.e('item'), ns.is('active', option.value === modelValue)]"
      :disabled="disabled || option.disabled"
      :tabindex="option.value === modelValue ? 0 : -1"
      role="radio"
      :aria-checked="option.value === modelValue"
      @click="select(option)"
    >
      <span :class="ns.e('label')">{{ option.label }}</span>
      <span v-if="variant === 'text'" :class="ns.e('dot')" />
    </button>
  </div>
</template>
