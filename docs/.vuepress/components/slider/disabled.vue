<template>
  <div>
    <s-switch v-model="disabled">Disabled</s-switch>
    <s-slider
      v-model="value"
      :disabled="disabled"
      show-value
      aria-label="Slider disabled state"
    />
    <p>Value: {{ value }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const disabled = ref(true)
const value = ref(40)
</script>
