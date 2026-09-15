<script setup lang="ts">
import { computed } from 'vue'
import type { SaxGridSetting } from 'sax-design-vue'

interface UserRow {
  id: number
  name: string
  role: string
  email: string
}

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

const tableOptions = computed<SaxGridSetting<UserRow>>(() => ({
  data: rows,
  columns: [
    { type: 'seq', title: '#', width: 64, align: 'right' },
    {
      field: 'name',
      title: 'Name',
      minWidth: 180,
      cell: ({ row }) => row.name,
    },
    { field: 'role', title: 'Role' },
    { field: 'email', title: 'Email', minWidth: 220 },
  ],
  rowKey: 'id',
  striped: true,
}))
</script>

<template>
  <s-table v-bind="tableOptions" />
</template>
