<script setup lang="ts">
import { reactive } from 'vue'

const values = reactive({ small: true, default: true, large: true })
</script>

<template>
  <div class="size-demo">
    <s-checkbox v-model="values.small" size="small">Small</s-checkbox>
    <s-checkbox v-model="values.default">Default</s-checkbox>
    <s-checkbox v-model="values.large" size="large">Large</s-checkbox>
  </div>
</template>

<style scoped>
.size-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
</style>
