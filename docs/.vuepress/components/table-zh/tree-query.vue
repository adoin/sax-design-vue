<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumn, TableFilters, TableRowKey } from 'sax-design-vue'
const filters = ref<TableFilters>({})
const expanded = ref<TableRowKey[]>([])
const rows = [
  {
    id: 'design',
    name: '设计组',
    children: [
      { id: 'd2', name: '图标', status: '完成' },
      { id: 'd1', name: '组件', status: '进行中' },
    ],
  },
  {
    id: 'dev',
    name: '研发组',
    children: [
      { id: 'e2', name: '服务', status: '进行中' },
      { id: 'e1', name: '接口', status: '完成' },
    ],
  },
]
const columns: TableColumn[] = [
  { field: 'name', title: '任务', treeNode: true, sortable: true },
  {
    field: 'status',
    title: '状态',
    filters: [
      { label: '完成', value: '完成' },
      { label: '进行中', value: '进行中' },
    ],
  },
]
</script>

<template>
  <div class="tree-query">
    <div class="table-controls">
      <s-button size="small" type="flat" @click="expanded = ['design', 'dev']"
        >全部展开</s-button
      >
      <s-button size="small" type="flat" @click="expanded = []"
        >全部收起</s-button
      >
      <s-button size="small" type="flat" @click="filters = {}"
        >清除筛选</s-button
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
