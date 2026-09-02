<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumn, TableFilters, TableRowKey } from 'sax-design-vue'
const filters = ref<TableFilters>({})
const expanded = ref<TableRowKey[]>([])
const rows = [
  {
    id: 'design',
    name: 'Design',
    children: [
      { id: 'd2', name: 'Icons', status: 'Done' },
      { id: 'd1', name: 'Components', status: 'In progress' },
    ],
  },
  {
    id: 'dev',
    name: 'Engineering',
    children: [
      { id: 'e2', name: 'Services', status: 'In progress' },
      { id: 'e1', name: 'API', status: 'Done' },
    ],
  },
]
const columns: TableColumn[] = [
  { field: 'name', title: 'Task', treeNode: true, sortable: true },
  {
    field: 'status',
    title: 'Status',
    filters: [
      { label: 'Done', value: 'Done' },
      { label: 'In progress', value: 'In progress' },
    ],
  },
]
</script>

<template>
  <div class="tree-query">
    <div class="table-controls">
      <s-button size="small" type="flat" @click="expanded = ['design', 'dev']"
        >Expand all</s-button
      >
      <s-button size="small" type="flat" @click="expanded = []"
        >Collapse all</s-button
      >
      <s-button size="small" type="flat" @click="filters = {}"
        >Clear filters</s-button
      >
    </div>
    <s-table
      v-model:expanded-keys="expanded"
      v-model:filters="filters"
      :data="rows"
      :columns="columns"
      :tree-config="{}"
      striped
    />
  </div>
</template>

<style scoped>
.tree-query {
  width: 100%;
}
.table-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}
</style>
