<script lang="ts" setup>
import { computed, provide, toRefs } from 'vue'
import { radioGroupContextKey } from '@vuesax-alpha/tokens'
import type { RadioValue } from './radio-group'

const props = defineProps<{
  modelValue: RadioValue
  disabled: boolean
  name: string
}>()

const emit = defineEmits<{
  change: [value: RadioValue]
}>()

const { disabled, name } = toRefs(props)
const modelValue = computed({
  get: () => props.modelValue,
  set: (value: RadioValue) => emit('change', value),
})

provide(radioGroupContextKey, {
  modelValue,
  disabled,
  name,
  changeEvent: (value: RadioValue) => emit('change', value),
})
</script>

<template>
  <slot />
</template>
