<template>
  <s-select
    v-model="value"
    filterable
    highlight-search
    :options="options"
    :render-item="renderItem"
    placeholder="搜索城市"
  />
</template>

<script setup lang="ts">
import { h, ref } from 'vue'
import type { SelectRenderItem } from 'sax-design-vue'

const value = ref('')
const options = [
  { value: 'shanghai', label: '上海', code: 'SHA' },
  { value: 'shenzhen', label: '深圳', code: 'SZX' },
]
const renderItem: SelectRenderItem = (
  option,
  { label, keyword, matched, highlight },
) =>
  h('span', { title: matched ? `${keyword}: ${label}` : label }, [
    highlight(label),
    h('small', ` / ${option.code}`),
  ])
</script>
