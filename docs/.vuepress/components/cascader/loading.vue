<template>
  <div class="loading-demo">
    <s-switch v-model="loading">Loading</s-switch>
    <div class="loading-demo__fields">
      <s-cascader
        v-model="value"
        :options="options"
        :loading="loading"
        clearable
        placeholder="Choose location"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const loading = ref(true)
const value = ref(['north', 'city'])
const options = [
  {
    value: 'north',
    label: 'North',
    children: [{ value: 'city', label: 'City' }],
  },
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
