<script setup lang="ts">
import { shallowRef } from 'vue'
import type { TableCellRenderParams, TableColumn } from 'sax-design-vue'

interface ProjectRow {
  id: number
  project: string
  owner: string
}

const rows: ProjectRow[] = [
  { id: 1, project: 'Design system', owner: 'Leanne' },
  { id: 2, project: 'Component docs', owner: 'Ervin' },
]
const message = shallowRef('Choose a row action.')
const columns: TableColumn<ProjectRow>[] = [
  {
    field: 'project',
    title: 'Project',
    minWidth: 180,
    renderer: { name: '$input' },
  },
  { field: 'owner', title: 'Owner', minWidth: 120 },
  {
    key: 'actions',
    title: 'Actions',
    width: 130,
    renderer: {
      name: '$buttons',
      options: [{ code: 'inspect', text: 'Inspect' }],
      events: {
        inspect: (params) => {
          const { row } = params as TableCellRenderParams<ProjectRow>
          message.value = `Inspecting ${row.project}`
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
