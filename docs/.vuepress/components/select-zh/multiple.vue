<template>
  <div class="con-selects">
    <s-select
      v-model="value"
      label="多选"
      block
      multiple
      danger
      placeholder="筛选"
      :options="options"
    />
    <s-select
      v-model="value2"
      label="筛选多选"
      block
      filter
      multiple
      placeholder="筛选多选"
      :options="options"
    />

    <s-select
      v-model="value3"
      label="自动收缩标签"
      block
      filter
      multiple
      collapse-tags
      placeholder="调整宽度查看标签收缩"
      :options="options"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref(['1', '2', '3'])
const value2 = ref(['4'])
const value3 = ref(['1', '2', '3', '4', '5', '6', '7'])
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  align-items: start;
  gap: 32px 24px;
  width: 100%;
}
</style>
