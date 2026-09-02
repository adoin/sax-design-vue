<script setup lang="ts">
import { shallowRef } from 'vue'

const roundedValue = shallowRef('')
const squareValue = shallowRef('')
</script>

<template>
  <div class="shape-demo">
    <div class="shape-demo__item">
      <s-text>Rounded</s-text>
      <s-time-select
        v-model="roundedValue"
        start="08:30"
        step="00:30"
        end="18:30"
        placeholder="Rounded time select"
      />
    </div>
    <div class="shape-demo__item">
      <s-text>Square</s-text>
      <s-time-select
        v-model="squareValue"
        shape="square"
        start="08:30"
        step="00:30"
        end="18:30"
        placeholder="Square time select"
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
