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
  <div class="table-select-example">
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
    <p class="table-select-example__result">
      <span>Selected keys</span><code>{{ value ?? '—' }}</code>
    </p>
  </div>
</template>

<style scoped>
.table-select-example {
  display: grid;
  gap: 20px;
  width: 100%;
  min-width: 0;
}
.table-select-example__result {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
  margin: 0;
}
.table-select-example__result code {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
</style>
