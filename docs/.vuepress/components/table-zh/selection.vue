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
  { field: 'name', title: '姓名', minWidth: 180 },
  { field: 'team', title: '团队', minWidth: 160 },
]
const rows: UserRow[] = [
  { id: 1, name: '林晓', team: '设计' },
  { id: 2, name: '陈屿', team: '研发' },
  { id: 3, name: '周宁', team: '产品' },
]
const selected = shallowRef<UserRow | null>(null)
</script>

<template>
  <s-table
    v-model:highlight="selected"
    :data="rows"
    :columns="columns"
    row-key="id"
  >
    <template #header>
      当前选择：{{ selected?.name ?? '点击一行进行选择' }}
    </template>
  </s-table>
</template>
