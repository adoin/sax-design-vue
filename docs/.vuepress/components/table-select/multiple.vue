<script setup lang="ts">
import { ref } from 'vue'
import type {
  TableColumn,
  TableRowKey,
  TableSelectCheckedStrategy,
} from 'sax-design-vue'
const value = ref<TableRowKey[]>(['docs'])
const strict = ref(false)
const strategy = ref<TableSelectCheckedStrategy>('leaf')
const strategies = [
  { value: 'leaf', label: 'Leaf nodes' },
  { value: 'all', label: 'All nodes' },
  { value: 'parent', label: 'Parent nodes' },
]
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
    <s-select
      v-model="strategy"
      :options="strategies"
      aria-label="Checked value strategy"
    />
    <s-table-select
      v-model="value"
      multiple
      :check-strictly="strict"
      :checked-strategy="strategy"
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
