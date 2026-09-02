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
    title: isZh.value ? '节点' : 'Node',
    treeNode: true,
  },
])
const data = computed<TableRow[]>(() => [
  {
    id: 'root',
    name: isZh.value ? '全部节点（10,000）' : 'All nodes (10,000)',
    children: Array.from({ length: 10_000 }, (_, index) => ({
      id: `node-${index + 1}`,
      name:
        index % 12 === 0
          ? isZh.value
            ? `节点 ${index + 1} · 动态测量的较长名称`
            : `Node ${index + 1} · dynamically measured long name`
          : isZh.value
            ? `节点 ${index + 1}`
            : `Node ${index + 1}`,
    })),
  },
])
const treeConfig = {
  children: 'children',
  defaultExpandedKeys: ['root'],
  expandOnClickRow: true,
}
const popupConfig = { width: 380, maxHeight: 360 }
const virtualConfig = {
  height: 280,
  estimateSize: 36,
  overscan: 6,
  dynamic: true,
}
const selectable = (row: TableRow) => !Array.isArray(row.children)
</script>

<template>
  <div class="table-select-demo">
    <s-table-select
      v-model="value"
      :data="data"
      :columns="columns"
      :tree-config="treeConfig"
      :virtual-config="virtualConfig"
      :popup-config="popupConfig"
      :selectable="selectable"
      label-key="name"
      :show-header="false"
      block
      :placeholder="
        isZh ? '从 10,000 个树节点中选择' : 'Select from 10,000 tree nodes'
      "
    />
    <p>{{ isZh ? '已选择' : 'Selected' }}：{{ value || '-' }}</p>
  </div>
</template>

<style scoped>
.table-select-demo {
  width: min(100%, 380px);
}

.table-select-demo p {
  margin: 10px 2px 0;
  color: var(--s-text-color-secondary);
  font-size: 12px;
}
</style>
