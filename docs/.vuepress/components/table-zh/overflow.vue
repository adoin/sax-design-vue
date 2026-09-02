<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumn, TableOverflow } from 'sax-design-vue'
const mode = ref<TableOverflow>('tooltip')
const modes: { label: string; value: TableOverflow }[] = [
  { label: '换行', value: false },
  { label: '省略', value: 'ellipsis' },
  { label: '原生提示', value: 'title' },
  { label: 'Tooltip', value: 'tooltip' },
]
const rows = [
  {
    id: 1,
    name: '设计系统无障碍与主题适配专项',
    note: '这里是一段比列宽更长的内容，用来验证省略、键盘聚焦和完整文字提示。',
  },
  { id: 2, name: '短标题', note: '短文本不会弹出多余提示。' },
]
const columns: TableColumn[] = [
  { type: 'seq', title: '#', width: 60 },
  {
    field: 'name',
    title: '项目名称（这是一个用于测试表头溢出的长标题）',
    minWidth: 190,
  },
  { field: 'note', title: '说明', minWidth: 210 },
]
</script>

<template>
  <div class="overflow-example">
    <div class="table-controls">
      <s-button
        v-for="item in modes"
        :key="String(item.value)"
        size="small"
        type="flat"
        :active="mode === item.value"
        @click="mode = item.value"
        >{{ item.label }}</s-button
      >
    </div>
    <s-table
      :data="rows"
      :columns="columns"
      :show-overflow="mode"
      show-header-overflow
      striped
    />
  </div>
</template>

<style scoped>
.overflow-example {
  width: 100%;
}
.table-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}
</style>
