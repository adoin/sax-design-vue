<script setup lang="ts">
import { shallowRef } from 'vue'

const roundedValue = shallowRef('')
const squareValue = shallowRef('')
const options = [
  { label: 'Design', value: 'design' },
  { label: 'Develop', value: 'develop' },
  { label: 'Release', value: 'release' },
]
</script>

<template>
  <div class="shape-demo">
    <div class="shape-demo__item">
      <s-text>Rounded</s-text>
      <s-select
        v-model="roundedValue"
        :options="options"
        placeholder="Rounded select"
      />
    </div>
    <div class="shape-demo__item">
      <s-text>Square</s-text>
      <s-select
        v-model="squareValue"
        :options="options"
        shape="square"
        placeholder="Square select"
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
