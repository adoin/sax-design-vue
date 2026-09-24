<script setup lang="ts">
import { shallowRef } from 'vue'
import type { TableColumn, TableToolbarConfig } from 'sax-design-vue'

interface ProjectRow {
  id: number
  project: string
}

const rows = shallowRef<ProjectRow[]>([
  { id: 1, project: '设计系统' },
  { id: 2, project: '组件文档' },
])
const nextId = shallowRef(3)
const message = shallowRef('请选择工具栏操作。')
const columns: TableColumn<ProjectRow>[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'project', title: '项目', minWidth: 220 },
]
const toolbarConfig: TableToolbarConfig<ProjectRow> = {
  title: '项目',
  left: [
    {
      itemRender: 'button',
      props: { code: 'add', content: '新增项目' },
    },
  ],
  right: [{ itemRender: '$columnConfig' }],
}

const onToolbarClick = (code: string) => {
  if (code !== 'add') return
  rows.value = [
    ...rows.value,
    { id: nextId.value, project: `项目 ${nextId.value}` },
  ]
  message.value = `已新增项目 ${nextId.value}。`
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
