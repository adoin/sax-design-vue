<script setup lang="ts">
import type { TableColumn } from 'sax-design-vue'

interface UserRow {
  id: number
  name: string
  role: string
  email: string
  [key: string]: unknown
}

const columns: TableColumn<UserRow>[] = [
  { type: 'seq', title: '#', width: 64, align: 'right' },
  { field: 'name', title: 'Name', minWidth: 180 },
  { field: 'role', title: 'Role' },
  { field: 'email', title: 'Email', minWidth: 220 },
]

const rows: UserRow[] = [
  {
    id: 1,
    name: 'Leanne Graham',
    role: 'Designer',
    email: 'leanne@example.com',
  },
  {
    id: 2,
    name: 'Ervin Howell',
    role: 'Developer',
    email: 'ervin@example.com',
  },
  {
    id: 3,
    name: 'Clementine Bauch',
    role: 'Product',
    email: 'clementine@example.com',
  },
  {
    id: 4,
    name: 'Patricia Lebsack',
    role: 'Operations',
    email: 'patricia@example.com',
  },
]

const gridOptions = {
  data: rows,
  columns,
  rowKey: 'id',
  striped: true,
}
</script>

<template>
  <s-table v-bind="gridOptions" />
</template>
