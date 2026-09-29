<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumn, TableRow, TableRowKey } from 'sax-design-vue'
const value = ref<TableRowKey | undefined>('docs')
const columns: TableColumn[] = [
  { field: 'name', title: 'Workspace', treeNode: true },
]
const data = [
  {
    id: 'workspace',
    name: 'Workspace',
    children: [
      { id: 'components', name: 'Components' },
      { id: 'docs', name: 'Documentation' },
      { id: 'archive', name: 'Archive (disabled)', disabled: true },
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
      placeholder="Choose an option"
    />
    <p>Selected keys: {{ value ?? '—' }}</p>
  </div>
</template>
