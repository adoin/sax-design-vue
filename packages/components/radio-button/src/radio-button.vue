<template>
  <label
    :class="[ns.b(), ns.is('active', active), ns.is('disabled', disabled)]"
  >
    <input
      :checked="active"
      type="radio"
      :name="name"
      :disabled="disabled"
      @change="select"
    />
    <span
      ><slot>{{ label || value }}</slot></span
    >
  </label>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { radioButtonEmits, radioButtonProps } from './radio-button'

defineOptions({ name: 'SRadioButton' })

const props = defineProps(radioButtonProps)
const emit = defineEmits(radioButtonEmits)
const ns = useNamespace('radio-button')
const active = computed(() => props.modelValue === props.value)
const select = () => {
  emit('update:modelValue', props.value)
  emit('change', props.value)
}
</script>
