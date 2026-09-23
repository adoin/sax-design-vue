<script setup lang="ts">
import { shallowRef } from 'vue'

const labelValue = shallowRef<string[]>([])
const floatingValue = shallowRef<string[]>([])
const placeholderValue = shallowRef<string[]>([])
const options = [
  {
    value: 'guide',
    label: '指南',
    children: [
      { value: 'components', label: '组件' },
      { value: 'theming', label: '主题' },
    ],
  },
  { value: 'api', label: 'API' },
]
</script>

<template>
  <div class="cascader-label-demo">
    <s-cascader
      v-model="labelValue"
      label="标签"
      placeholder="请选择目标"
      :options="options"
      block
    />
    <s-cascader
      v-model="floatingValue"
      label="浮动标签"
      label-float
      :options="options"
      block
    />
    <s-cascader
      v-model="placeholderValue"
      placeholder="占位文本"
      :options="options"
      block
    />
  </div>
</template>

<style scoped>
.cascader-label-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(180px, 100%), 1fr));
  gap: 16px;
  align-items: end;
}
</style>
