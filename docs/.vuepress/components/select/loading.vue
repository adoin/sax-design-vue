<template>
  <div class="loading-demo">
    <s-switch v-model="loading">Loading</s-switch>
    <div class="loading-demo__fields">
      <s-select
        v-model="value"
        :options="options"
        :loading="loading"
        label="Single selection"
        label-float
        clearable
      />
      <s-select
        v-model="multipleValue"
        :options="options"
        :loading="loading"
        label="Multiple selection"
        label-float
        multiple
        clearable
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const loading = ref(true)
const value = ref('vue')
const multipleValue = ref(['vue', 'ts'])
const options = [
  { value: 'vue', label: 'Vue' },
  { value: 'ts', label: 'TypeScript' },
]
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
