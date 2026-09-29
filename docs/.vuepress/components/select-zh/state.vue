<template>
  <div class="center con-selects">
    <s-select
      v-for="(color, index) in colors"
      :key="index"
      v-model="color.value"
      :state="color.color"
      :label="color.color"
      placeholder="请选择"
      :options="options"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { Color } from 'sax-design-vue'

const colors = ref<{ color: Color; value: string }[]>([
  {
    color: 'primary',
    value: '1',
  },
  {
    color: 'danger',
    value: '1',
  },
  {
    color: 'success',
    value: '2',
  },
  {
    color: 'warn',
    value: '3',
  },
  {
    color: 'dark',
    value: '4',
  },
])
const options = [
  { label: 'Sax Design', value: '1' },
  { label: 'Vue', value: '2' },
  { label: 'Javascript', value: '3' },
  { label: 'Sass', value: '4' },
  { label: 'Typescript', value: '5' },
  { label: 'Webpack', value: '6' },
  { label: 'Nodejs', value: '7' },
]
</script>

<style scoped lang="scss">
.con-selects {
  .s-select {
    margin: 10px;
  }
}
</style>
