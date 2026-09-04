<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumn, TablePagerConfig, TableRow } from 'sax-design-vue'
const pager = ref<TablePagerConfig>({
  currentPage: 1,
  pageSize: 2,
  pageSizes: [2, 4],
  layout: ['total', 'prev', 'pager', 'next', 'sizes'],
})
const selected = ref<TableRow[]>([])
const radio = ref<TableRow | null>(null)
const rows = [
  { id: 1, name: '林晓', available: true },
  { id: 2, name: '陈屿', available: false },
  { id: 3, name: '周宁', available: true },
  { id: 4, name: '苏禾', available: true },
]
const columns: TableColumn[] = [
  { type: 'checkbox', width: 64 },
  { field: 'name', title: '成员' },
  {
    field: 'available',
    title: '可选状态',
    cell: ({ value }) => (value ? '可选' : '禁选'),
  },
]
const radioColumns: TableColumn[] = [
  { type: 'radio', width: 64 },
  { field: 'name', title: '负责人' },
]
</script>

<template>
  <div class="selection-example">
    <div class="table-controls">
      <s-button size="small" type="flat" @click="selected = []"
        >清空选择</s-button
      >
      <span>已选: {{ selected.map((row) => row.name).join(', ') || '—' }}</span>
    </div>
    <s-table
      v-model:row="selected"
      v-model:pager-config="pager"
      :data="rows"
      :columns="columns"
      :selection-config="{
        reserve: true,
        checkMethod: ({ row }) => Boolean(row.available),
      }"
      row-key="id"
    />
    <span>单选负责人: {{ radio?.name ?? '—' }}</span>
    <s-table
      v-model:row="radio"
      :data="rows"
      :columns="radioColumns"
      :selection-config="{ checkMethod: ({ row }) => Boolean(row.available) }"
      row-key="id"
    />
  </div>
</template>

<style scoped>
.selection-example {
  display: grid;
  width: 100%;
  gap: 16px;
}
.table-controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 0.85rem;
}
</style>
