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
      placeholder="请选择"
    />
    <p class="table-select-example__result">
      <span>已选键</span><code>{{ value ?? '—' }}</code>
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
