<script setup lang="ts">
import { shallowRef } from 'vue'

const roundedValue = shallowRef<boolean | string>('pending')
const squareValue = shallowRef<boolean | string>('pending')
const disabledValue = shallowRef<boolean | string>('pending')
</script>

<template>
  <div class="switch-state-examples">
    <s-switch
      v-model="roundedValue"
      indeterminate
      aria-label="Rounded indeterminate switch"
    />
    <s-switch
      v-model="squareValue"
      indeterminate
      shape="square"
      aria-label="Square indeterminate switch"
    />
    <s-switch
      v-model="disabledValue"
      indeterminate
      disabled
      aria-label="Disabled indeterminate switch"
    />
  </div>
</template>

<style scoped>
.switch-state-examples {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 16px;
}
</style>
