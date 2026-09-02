<script setup lang="ts">
import { shallowRef } from 'vue'

const loading = shallowRef(true)
const roundedValue = shallowRef(false)
const squareValue = shallowRef(true)
</script>

<template>
  <div class="switch-state-examples">
    <s-switch v-model="loading">Loading state</s-switch>
    <s-switch
      v-model="roundedValue"
      :loading="loading"
      aria-label="Rounded loading switch"
    />
    <s-switch
      v-model="squareValue"
      :loading="loading"
      shape="square"
      aria-label="Square loading switch"
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
