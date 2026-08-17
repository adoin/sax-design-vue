<script setup lang="ts">
import { shallowRef } from 'vue'

const quantity = shallowRef('')
</script>

<template>
  <s-input
    v-model="quantity"
    type="number"
    label="Quantity"
    placeholder="1–10"
    :min="1"
    :max="10"
    :step="1"
    input-mode="numeric"
    required
  />
</template>
