<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumn, TableRow, TableRowKey } from 'sax-design-vue'
const value = ref<TableRowKey | undefined>('docs')
const columns: TableColumn[] = [
  { field: 'name', title: '工作区', treeNode: true },
]
const data = [
  {
    id: 'workspace',
    name: '工作区',
    children: [
      { id: 'components', name: '组件' },
      { id: 'docs', name: '文档' },
      { id: 'archive', name: '归档（禁用）', disabled: true },
    ],
  },
]
const selectable = (row: TableRow) => !Array.isArray(row.children)
</script>

<template>
  <div>
    <s-table-select
      v-model="value"
      :data="data"
      :columns="columns"
      row-key="id"
      label-key="name"
      clearable
      block
      :popup-config="{ width: 360 }"
      :tree-config="{
        children: 'children',
        defaultExpandedKeys: ['workspace'],
      }"
      :selectable="selectable"
      placeholder="请选择"
    />
    <p>已选键： {{ value ?? '—' }}</p>
  </div>
</template>
