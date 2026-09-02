<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumn, TableOverflow } from 'sax-design-vue'
const mode = ref<TableOverflow>('tooltip')
const modes: { label: string; value: TableOverflow }[] = [
  { label: 'Wrap', value: false },
  { label: 'Ellipsis', value: 'ellipsis' },
  { label: 'Native title', value: 'title' },
  { label: 'Tooltip', value: 'tooltip' },
]
const rows = [
  {
    id: 1,
    name: 'Design system accessibility and theme compatibility',
    note: 'This text is longer than its column, demonstrating truncation, keyboard focus and complete content tooltips.',
  },
  {
    id: 2,
    name: 'Short title',
    note: 'Short content does not show an unnecessary tooltip.',
  },
]
const columns: TableColumn[] = [
  { type: 'seq', title: '#', width: 60 },
  {
    field: 'name',
    title: 'Project name (a long heading for testing header overflow)',
    minWidth: 190,
  },
  { field: 'note', title: 'Description', minWidth: 210 },
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
