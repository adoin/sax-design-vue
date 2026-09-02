<script setup lang="ts">
import { shallowRef } from 'vue'

const roundedValue = shallowRef<string[]>([])
const squareValue = shallowRef<string[]>([])
const options = [
  {
    value: 'guide',
    label: 'Guide',
    children: [
      { value: 'components', label: 'Components' },
      { value: 'theming', label: 'Theming' },
    ],
  },
  { value: 'api', label: 'API' },
]
</script>

<template>
  <div class="shape-demo">
    <div class="shape-demo__item">
      <s-text>Rounded</s-text>
      <s-cascader
        v-model="roundedValue"
        :options="options"
        placeholder="Rounded cascader"
      />
    </div>
    <div class="shape-demo__item">
      <s-text>Square</s-text>
      <s-cascader
        v-model="squareValue"
        :options="options"
        shape="square"
        placeholder="Square cascader"
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
