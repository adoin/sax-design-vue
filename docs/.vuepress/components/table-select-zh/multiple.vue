<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumn, TableRowKey } from 'sax-design-vue'
const value = ref<TableRowKey[]>(['docs'])
const strict = ref(false)
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
</script>

<template>
  <div>
    <s-switch v-model="strict">父子独立选择</s-switch>
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
      placeholder="选择多个节点"
    />
    <p>已选键： {{ value }}</p>
  </div>
</template>
