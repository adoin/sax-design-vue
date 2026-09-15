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
  { id: 1, name: '林晓', role: '设计师', email: 'linxiao@example.com' },
  { id: 2, name: '陈屿', role: '开发工程师', email: 'chenyu@example.com' },
  { id: 3, name: '周宁', role: '产品经理', email: 'zhouning@example.com' },
  { id: 4, name: '苏禾', role: '运营', email: 'suhe@example.com' },
]

const tableOptions = computed<SaxGridSetting<UserRow>>(() => ({
  data: rows,
  columns: [
    { type: 'seq', title: '序号', width: 72, align: 'right' },
    {
      field: 'name',
      title: '姓名',
      minWidth: 160,
      cell: ({ row }) => row.name,
    },
    { field: 'role', title: '岗位' },
    { field: 'email', title: '邮箱', minWidth: 220 },
  ],
  rowKey: 'id',
  striped: true,
}))
</script>

<template>
  <s-table v-bind="tableOptions" />
</template>
