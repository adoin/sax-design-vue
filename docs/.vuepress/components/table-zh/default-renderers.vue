<script setup lang="ts">
import { shallowRef } from 'vue'
import type { TableCellRenderParams, TableColumn } from 'sax-design-vue'

interface ProjectRow {
  id: number
  project: string
  owner: string
}

const rows: ProjectRow[] = [
  { id: 1, project: '设计系统', owner: '林晓' },
  { id: 2, project: '组件文档', owner: '陈屿' },
]
const message = shallowRef('请选择一项行操作。')
const columns: TableColumn<ProjectRow>[] = [
  {
    field: 'project',
    title: '项目',
    minWidth: 180,
    renderer: { name: '$input' },
  },
  { field: 'owner', title: '负责人', minWidth: 120 },
  {
    key: 'actions',
    title: '操作',
    width: 130,
    renderer: {
      name: '$buttons',
      options: [{ code: 'inspect', text: '查看' }],
      events: {
        inspect: (params) => {
          const { row } = params as TableCellRenderParams<ProjectRow>
          message.value = `正在查看${row.project}`
        },
      },
    },
  },
]
</script>

<template>
  <div class="table-renderer-demo">
    <s-table :data="rows" :columns="columns" row-key="id" />
    <p role="status">{{ message }}</p>
  </div>
</template>

<style scoped>
.table-renderer-demo {
  display: grid;
  gap: 8px;
}

.table-renderer-demo p {
  margin: 0;
}
</style>
