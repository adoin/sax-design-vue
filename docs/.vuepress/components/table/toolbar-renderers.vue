<script setup lang="ts">
import { shallowRef } from 'vue'
import type { TableColumn, TableToolbarConfig } from 'sax-design-vue'

interface ProjectRow {
  id: number
  project: string
}

const rows = shallowRef<ProjectRow[]>([
  { id: 1, project: 'Design system' },
  { id: 2, project: 'Component docs' },
])
const nextId = shallowRef(3)
const message = shallowRef('Use a toolbar action.')
const columns: TableColumn<ProjectRow>[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'project', title: 'Project', minWidth: 220 },
]
const toolbarConfig: TableToolbarConfig<ProjectRow> = {
  title: 'Projects',
  left: [
    {
      itemRender: 'button',
      props: { code: 'add', content: 'Add project' },
    },
  ],
  right: [{ itemRender: '$columnConfig' }],
}

const onToolbarClick = (code: string) => {
  if (code !== 'add') return
  rows.value = [
    ...rows.value,
    { id: nextId.value, project: `Project ${nextId.value}` },
  ]
  message.value = `Added project ${nextId.value}.`
  nextId.value += 1
}
</script>

<template>
  <div class="table-renderer-demo">
    <s-table
      :data="rows"
      :columns="columns"
      :toolbar-config="toolbarConfig"
      row-key="id"
      @toolbar-click="onToolbarClick"
    />
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
