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
  <div class="table-select-example">
    <div class="table-select-example__controls">
      <div class="table-select-example__control">
        <s-switch
          v-model="strict"
          aria-label="Independent parent and child selection"
        />
        <span>Independent selection</span>
      </div>
      <div class="table-select-example__control">
        <span>Checked values</span>
        <s-select
          v-model="strategy"
          :options="strategies"
          aria-label="Checked value strategy"
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
      placeholder="Select multiple nodes"
    />
    <p class="table-select-example__result">
      <span>Selected keys</span><code>{{ value }}</code>
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
