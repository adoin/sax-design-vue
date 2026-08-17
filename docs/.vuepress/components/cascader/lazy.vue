<template>
  <div class="demo-row">
    <s-cascader
      v-model="value"
      :options="options"
      :load-data="loadData"
      placeholder="Lazy load teams"
    />
    <s-cascader
      v-model="hoverValue"
      :options="staticOptions"
      expand-trigger="hover"
      placeholder="Hover to expand"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { CascaderOption } from '@vuesax-alpha/components/cascader'

const value = ref<Array<string | number>>([])
const hoverValue = ref<Array<string | number>>([])
const options = ref<CascaderOption[]>([
  { value: 'engineering', label: 'Engineering', isLeaf: false },
  { value: 'product', label: 'Product', isLeaf: false },
])
const staticOptions = [
  {
    value: 'asia',
    label: 'Asia',
    children: [
      { value: 'shanghai', label: 'Shanghai' },
      { value: 'singapore', label: 'Singapore' },
    ],
  },
  {
    value: 'europe',
    label: 'Europe',
    children: [{ value: 'london', label: 'London' }],
  },
]

const loadData = async (selectedOptions: CascaderOption[]) => {
  const target = selectedOptions[selectedOptions.length - 1]
  if (!target || target.children) return
  await new Promise((resolve) => setTimeout(resolve, 500))
  target.children = [
    { value: `${target.value}-platform`, label: 'Platform team' },
    { value: `${target.value}-experience`, label: 'Experience team' },
  ]
}
</script>

<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
