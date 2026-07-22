<template>
  <s-date-picker
    v-bind="$attrs"
    :model-value="modelValue"
    type="daterange"
    @update:model-value="emit('update:modelValue', $event)"
    @change="emit('change', $event)"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
    @clear="emit('clear')"
  />
</template>

<script lang="ts" setup>
import SDatePicker from '@vuesax-alpha/components/date-picker'
import { dateRangePickerEmits, dateRangePickerProps } from './date-range-picker'

defineOptions({ name: 'SDateRangePicker', inheritAttrs: false })

defineProps(dateRangePickerProps)
const emit = defineEmits(dateRangePickerEmits)
</script>
