<template>
  <div>
    <s-switch v-model="disabled">禁用</s-switch>
    <s-slider
      v-model="value"
      :disabled="disabled"
      show-value
      aria-label="禁用状态滑块"
    />
    <p>当前值： {{ value }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const disabled = ref(true)
const value = ref(40)
</script>
