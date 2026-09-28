<script setup lang="ts">
import { shallowRef } from 'vue'

const direction = shallowRef<'horizontal' | 'vertical'>('horizontal')
const animated = shallowRef(true)
const regular = shallowRef(1)
const button = shallowRef(1)
const directions = [
  { label: '横向', value: 'horizontal' },
  { label: '纵向', value: 'vertical' },
]
const options = [1, 2, 3, 4].map((value) => ({
  label: `选项 ${value}`,
  value,
}))
</script>

<template>
  <div class="radio-motion-demo">
    <div class="radio-motion-demo__controls">
      <s-select v-model="direction" :options="directions" label="排列方向" />
      <s-checkbox v-model="animated">圆点动效</s-checkbox>
    </div>
    <section>
      <h4>RadioGroup</h4>
      <s-radio-group
        v-model="regular"
        :options="options"
        :direction="direction"
        :animated="animated"
      />
    </section>
    <section>
      <h4>RadioButton</h4>
      <s-radio-group
        v-model="button"
        type="button"
        :options="options"
        :direction="direction"
        :animated="animated"
      />
    </section>
  </div>
</template>

<style scoped>
.radio-motion-demo {
  display: grid;
  gap: 20px;
}
.radio-motion-demo__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}
.radio-motion-demo h4 {
  margin: 0 0 10px;
}
</style>
