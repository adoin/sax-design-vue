<template>
  <div :class="[ns.b(), ns.is('disabled', disabled)]" role="radiogroup">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      :class="[ns.e('item'), ns.is('active', option.value === modelValue)]"
      :disabled="disabled || option.disabled"
      role="radio"
      :aria-checked="option.value === modelValue"
      @click="select(option)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
<script lang="ts" setup>
import { useNamespace } from '@vuesax-alpha/hooks'
import { segmentedEmits, segmentedProps } from './segmented'
import type { SegmentedOption } from './segmented'
defineOptions({ name: 'SSegmented' })
const props = defineProps(segmentedProps)
const emit = defineEmits(segmentedEmits)
const ns = useNamespace('segmented')
const select = (option: SegmentedOption) => {
  if (props.disabled || option.disabled || option.value === props.modelValue)
    return
  emit('update:modelValue', option.value)
  emit('change', option.value)
}
</script>
