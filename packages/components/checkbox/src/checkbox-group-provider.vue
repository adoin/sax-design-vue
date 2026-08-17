<script lang="ts" setup>
import { computed, provide, toRefs } from 'vue'
import { pick } from 'lodash-unified'
import { checkboxGroupContextKey } from '@vuesax-alpha/tokens'
import type { CheckboxGroupValueType } from './checkbox-group'

const props = defineProps<{
  modelValue: CheckboxGroupValueType
  disabled: boolean
  min?: number
  max?: number
}>()

const emit = defineEmits<{
  change: [value: CheckboxGroupValueType]
}>()

const modelValue = computed({
  get: () => props.modelValue,
  set: (value: CheckboxGroupValueType) => emit('change', value),
})

provide(checkboxGroupContextKey, {
  ...pick(toRefs(props), ['min', 'max', 'disabled']),
  modelValue,
  changeEvent: (value: CheckboxGroupValueType) => emit('change', value),
})
</script>

<template>
  <slot />
</template>
