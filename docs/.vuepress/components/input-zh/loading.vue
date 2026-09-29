<template>
  <div class="loading-demo">
    <s-switch v-model="loading">加载状态</s-switch>
    <div class="loading-demo__fields">
      <s-input
        v-model="value"
        :loading="loading"
        label="输入框"
        label-float
        clearable
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const loading = ref(true)
const value = ref('Sax Design')
</script>

<style scoped>
.loading-demo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
}
.loading-demo__fields {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 24px;
}
</style>
