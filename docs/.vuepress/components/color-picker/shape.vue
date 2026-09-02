<script setup lang="ts">
import { shallowRef } from 'vue'

const roundedValue = shallowRef('#5667f4')
const squareValue = shallowRef('#f0a657')
</script>

<template>
  <div class="shape-demo">
    <div class="shape-demo__item">
      <s-text>Rounded</s-text>
      <s-color-picker v-model="roundedValue" />
    </div>
    <div class="shape-demo__item">
      <s-text>Square</s-text>
      <s-color-picker v-model="squareValue" shape="square" />
    </div>
  </div>
</template>

<style scoped>
.shape-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
}

.shape-demo__item {
  display: grid;
  gap: 8px;
  justify-items: start;
}
</style>
