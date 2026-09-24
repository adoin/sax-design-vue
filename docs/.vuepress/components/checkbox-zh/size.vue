<script setup lang="ts">
import { reactive } from 'vue'

const values = reactive({ small: true, default: true, large: true })
</script>

<template>
  <div class="size-demo">
    <s-checkbox v-model="values.small" size="small">小号</s-checkbox>
    <s-checkbox v-model="values.default">默认</s-checkbox>
    <s-checkbox v-model="values.large" size="large">大号</s-checkbox>
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
