<script setup lang="ts">
import { shallowRef } from 'vue'
import type { TableColumn } from 'sax-design-vue'

interface UserRow {
  id: number
  name: string
  team: string
  [key: string]: unknown
}

const columns: TableColumn<UserRow>[] = [
  { field: 'name', title: 'Name', minWidth: 180 },
  { field: 'team', title: 'Team', minWidth: 160 },
]
const rows: UserRow[] = [
  { id: 1, name: 'Leanne Graham', team: 'Design' },
  { id: 2, name: 'Ervin Howell', team: 'Engineering' },
  { id: 3, name: 'Clementine Bauch', team: 'Product' },
]
const selected = shallowRef<UserRow | null>(null)
</script>

<template>
  <s-table v-model="selected" :data="rows" :columns="columns" row-key="id">
    <template #header>
      Selected: {{ selected?.name ?? 'Click a row' }}
    </template>
  </s-table>
</template>
