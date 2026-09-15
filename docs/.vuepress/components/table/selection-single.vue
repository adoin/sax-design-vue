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
  { id: 1, name: 'Avery', available: true },
  { id: 2, name: 'Casey', available: false },
  { id: 3, name: 'Jordan', available: true },
]
const columns: TableColumn<MemberRow>[] = [
  { type: 'radio', width: 64 },
  { field: 'name', title: 'Owner', minWidth: 180 },
  {
    field: 'available',
    title: 'Availability',
    minWidth: 140,
    cell: ({ value }) => (value ? 'Available' : 'Disabled'),
  },
]
</script>

<template>
  <div class="single-selection-example">
    <span>Selected owner: {{ selected?.name ?? '—' }}</span>
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
