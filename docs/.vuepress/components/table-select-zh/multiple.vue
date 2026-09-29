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
  { value: 'leaf', label: '只保留叶子' },
  { value: 'all', label: '全部节点' },
  { value: 'parent', label: '合并为父节点' },
]
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
  <div class="table-select-example">
    <div class="table-select-example__controls">
      <div class="table-select-example__control">
        <s-switch v-model="strict" aria-label="父子独立选择" />
        <span>父子独立选择</span>
      </div>
      <div class="table-select-example__control">
        <span>选中值策略</span>
        <s-select
          v-model="strategy"
          :options="strategies"
          aria-label="选中值策略"
        />
      </div>
    </div>
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
      placeholder="选择多个节点"
    />
    <p class="table-select-example__result">
      <span>已选键</span><code>{{ value }}</code>
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
.table-select-example__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px 24px;
}
.table-select-example__control {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
</style>
