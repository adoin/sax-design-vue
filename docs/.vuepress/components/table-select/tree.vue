<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { useRoute } from 'vue-router'
import type { TableColumn, TableRow } from 'sax-design-vue'

const route = useRoute()
const isZh = computed(() => route.path.startsWith('/zh/'))
const value = shallowRef<string>()

const columns = computed<TableColumn[]>(() => [
  {
    field: 'name',
    title: isZh.value ? '工作区' : 'Workspace',
    treeNode: true,
  },
])
const data = computed<TableRow[]>(() => [
  {
    id: 'workspace',
    name: isZh.value ? '工作区' : 'Workspace',
    children: [
      { id: 'components', name: isZh.value ? '组件' : 'Components' },
      { id: 'docs', name: isZh.value ? '文档' : 'Documentation' },
    ],
  },
])
const treeConfig = {
  children: 'children',
  defaultExpandedKeys: ['workspace'],
  expandOnClickRow: true,
}
const popupConfig = { width: 340, maxHeight: 320 }
const selectable = (row: TableRow) => !Array.isArray(row.children)
</script>

<template>
  <div class="table-select-demo">
    <s-table-select
      v-model="value"
      :data="data"
      :columns="columns"
      :tree-config="treeConfig"
      :popup-config="popupConfig"
      :selectable="selectable"
      label-key="name"
      :show-header="false"
      clearable
      block
      :placeholder="isZh ? '选择工作区节点' : 'Select a workspace node'"
    >
      <template #prefix><s-icon name="cb:folder" /></template>
    </s-table-select>
    <p>{{ isZh ? '已选择' : 'Selected' }}：{{ value || '-' }}</p>
  </div>
</template>

<style scoped>
.table-select-demo {
  width: min(100%, 360px);
}

.table-select-demo p {
  margin: 10px 2px 0;
  color: var(--s-text-color-secondary);
  font-size: 12px;
}
</style>
