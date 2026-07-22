<template>
  <label
    :class="[ns.b(), ns.is('active', checked), ns.is('disabled', disabled)]"
    ><input
      type="checkbox"
      :checked="checked"
      :disabled="disabled"
      @change="toggle"
    /><span
      ><slot>{{ label || value }}</slot></span
    ></label
  >
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { checkboxButtonEmits, checkboxButtonProps } from './checkbox-button'

defineOptions({ name: 'SCheckboxButton' })

const props = defineProps(checkboxButtonProps)
const emit = defineEmits(checkboxButtonEmits)
const ns = useNamespace('checkbox-button')
const checked = computed(() =>
  Array.isArray(props.modelValue)
    ? props.modelValue.includes(props.value)
    : props.modelValue,
)
const toggle = () => {
  const value = Array.isArray(props.modelValue)
    ? props.modelValue.includes(props.value)
      ? props.modelValue.filter((item) => item !== props.value)
      : [...props.modelValue, props.value]
    : !props.modelValue
  emit('update:modelValue', value)
  emit('change', value)
}
</script>
