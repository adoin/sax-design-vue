<script setup lang="ts">
import { shallowRef } from 'vue'

const roundedValue = shallowRef('2604')
const squareValue = shallowRef('8062')
</script>

<template>
  <div class="shape-demo">
    <div class="shape-demo__item">
      <s-text>Rounded</s-text>
      <s-verification-code v-model="roundedValue" :length="4" />
    </div>
    <div class="shape-demo__item">
      <s-text>Square</s-text>
      <s-verification-code v-model="squareValue" :length="4" shape="square" />
    </div>
  </div>
</template>

<style scoped>
.shape-demo {
  display: grid;
  gap: 22px;
}

.shape-demo__item {
  display: grid;
  gap: 8px;
  justify-items: start;
}
</style>
