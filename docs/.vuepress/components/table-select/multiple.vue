<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumn, TableRowKey } from 'sax-design-vue'
const value = ref<TableRowKey[]>(['docs'])
const strict = ref(false)
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
</script>

<template>
  <div>
    <s-switch v-model="strict">Independent parent and child selection</s-switch>
    <s-table-select
      v-model="value"
      multiple
      :check-strictly="strict"
      :data="data"
      :columns="columns"
      :tree-config="{
        children: 'children',
        defaultExpandedKeys: ['workspace'],
      }"
      :popup-config="{ width: 360, maxHeight: 320 }"
      label-key="name"
      clearable
      block
      placeholder="Select multiple nodes"
    />
    <p>Selected keys: {{ value }}</p>
  </div>
</template>
