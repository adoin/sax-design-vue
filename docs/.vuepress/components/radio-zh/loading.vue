<script setup lang="ts">
import { ref } from 'vue'

const picked = ref('1')
const loading = ref(false)
</script>

<template>
  <div class="radio-loading-example">
    <div class="loading-control">
      <s-switch v-model="loading" aria-label="加载状态" />
      <span>加载状态</span>
    </div>
    <div class="radio-options">
      <s-radio v-model="picked" :loading="loading" value="1">选项 1</s-radio>
      <s-radio v-model="picked" :loading="loading" value="2">选项 2</s-radio>
    </div>
  </div>
</template>

<style scoped>
.loading-control {
  display: flex;
  align-items: center;
  gap: 8px;
}
.radio-loading-example,
.radio-options {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.radio-loading-example {
  gap: 16px;
}
.radio-options {
  gap: 10px;
}
</style>
