<template>
  <div class="slider-disabled-example">
    <div class="slider-disabled-example__control">
      <s-switch v-model="disabled" aria-label="禁用" />
      <span>禁用</span>
    </div>
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

<style scoped>
.slider-disabled-example {
  display: grid;
  gap: 24px;
  width: 100%;
  min-width: 0;
}
.slider-disabled-example__control {
  display: flex;
  align-items: center;
  gap: 8px;
}
.slider-disabled-example p {
  margin: 0;
}
</style>
