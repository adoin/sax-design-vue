<script setup lang="ts">
import { shallowRef } from 'vue'
import type { TableColumn } from 'sax-design-vue'

interface MemberRow {
  id: number
  name: string
  available: boolean
  [key: string]: unknown
}

const selected = shallowRef<MemberRow | null>(null)
const rows: MemberRow[] = [
  { id: 1, name: '林晓', available: true },
  { id: 2, name: '陈屿', available: false },
  { id: 3, name: '周宁', available: true },
]
const columns: TableColumn<MemberRow>[] = [
  { type: 'radio', width: 64 },
  { field: 'name', title: '负责人', minWidth: 180 },
  {
    field: 'available',
    title: '可选状态',
    minWidth: 140,
    cell: ({ value }) => (value ? '可选' : '禁选'),
  },
]
</script>

<template>
  <div class="single-selection-example">
    <span>当前负责人：{{ selected?.name ?? '—' }}</span>
    <s-table
      v-model:highlight="selected"
      :data="rows"
      :columns="columns"
      :selection-config="{ selectableMethod: ({ row }) => row.available }"
      row-key="id"
    />
  </div>
</template>

<style scoped>
.single-selection-example {
  display: grid;
  width: 100%;
  gap: 10px;
  font-size: 0.85rem;
}
</style>
