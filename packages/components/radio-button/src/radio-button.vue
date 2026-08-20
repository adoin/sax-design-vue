<script lang="ts" setup>
import { computed, inject } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { radioGroupContextKey } from '@vuesax-alpha/tokens'
import { radioButtonEmits, radioButtonProps } from './radio-button'

defineOptions({ name: 'SRadioButton' })

defineSlots<{
  default?(): unknown
}>()

const props = defineProps(radioButtonProps)
const emit = defineEmits(radioButtonEmits)
const ns = useNamespace('radio-button')
const radioGroup = inject(radioGroupContextKey, undefined)

const selectedValue = computed(
  () => radioGroup?.modelValue.value ?? props.modelValue,
)
const active = computed(() => selectedValue.value === props.value)
const isDisabled = computed(() => props.disabled || radioGroup?.disabled.value)
const radioName = computed(() => props.name || radioGroup?.name.value)
const displayLabel = computed(() =>
  props.label === '' ? props.value : props.label,
)

const select = (event: Event) => {
  if (isDisabled.value || !(event.target as HTMLInputElement).checked) return

  if (radioGroup) {
    radioGroup.changeEvent(props.value)
  } else {
    emit('update:modelValue', props.value)
  }
  emit('change', props.value)
}
</script>

<template>
  <label
    :class="[ns.b(), ns.is('active', active), ns.is('disabled', isDisabled)]"
  >
    <input
      :checked="active"
      type="radio"
      :value="value"
      :name="radioName"
      :disabled="isDisabled"
      @change="select"
    />

    <span :class="ns.e('content')">
      <span :class="ns.e('indicator')" aria-hidden="true">
        <span :class="ns.e('dot')" />
      </span>

      <span :class="ns.e('copy')">
        <span :class="ns.e('label')">
          <slot>{{ displayLabel }}</slot>
        </span>
        <small v-if="description" :class="ns.e('description')">
          {{ description }}
        </small>
      </span>
    </span>
  </label>
</template>
