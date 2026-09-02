<script setup lang="ts">
import { shallowRef } from 'vue'

const roundedValue = shallowRef('')
const squareValue = shallowRef('')
</script>

<template>
  <div class="shape-demo">
    <div class="shape-demo__item">
      <s-text>Rounded</s-text>
      <s-time-picker v-model="roundedValue" placeholder="Rounded time picker" />
    </div>
    <div class="shape-demo__item">
      <s-text>Square</s-text>
      <s-time-picker
        v-model="squareValue"
        shape="square"
        placeholder="Square time picker"
      />
    </div>
  </div>
</template>

<style scoped>
.shape-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  width: 100%;
}

.shape-demo__item {
  display: grid;
  gap: 8px;
}
</style>
