<template>
  <div
    :class="[ns.b(), ns.m(type), ns.is('disabled', disabled)]"
    role="radiogroup"
  >
    <template v-if="options.length">
      <template v-if="type === 'button'">
        <s-radio-button
          v-for="item in options"
          :key="String(item.value)"
          :model-value="modelValue"
          :value="item.value"
          :name="name"
          :disabled="disabled || item.disabled"
          @update:model-value="update"
        />
      </template>
      <template v-else>
        <s-radio
          v-for="item in options"
          :key="String(item.value)"
          :model-value="modelValue"
          :value="item.value"
          :label="item.label"
          :name="name"
          :disabled="disabled || item.disabled"
          @update:model-value="update"
        />
      </template>
    </template>
    <slot v-else />
  </div>
</template>

<script lang="ts" setup>
import { SRadioButton } from '@vuesax-alpha/components/radio-button'
import { useNamespace } from '@vuesax-alpha/hooks'
import SRadio from './radio.vue'
import { radioGroupEmits, radioGroupProps } from './radio-group'
import type { RadioValue } from './radio-group'

defineOptions({ name: 'SRadioGroup' })

defineProps(radioGroupProps)
const emit = defineEmits(radioGroupEmits)
const ns = useNamespace('radio-group')
const update = (value: RadioValue) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>
