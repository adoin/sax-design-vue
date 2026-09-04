<script setup lang="ts">
import { ref } from 'vue'
import type { TableInstance, TableVirtualSource } from 'sax-design-vue'

const table = ref<TableInstance>()
const source: TableVirtualSource = {
  rowCount: 1_000_000,
  columnCount: 100_000,
  row: (index) => ({ id: index }),
  rowKey: (index) => index,
  column: (index) => ({
    key: String(index),
    title: `指标 ${index + 1}`,
    cell: ({ row }) => `${row.id}:${index}`,
  }),
  columnWidth: 120,
  fixedLeftCount: 1,
  fixedRightCount: 1,
  headerDepth: 3,
  headerPath: (index) => [
    {
      key: `period-${Math.floor(index / 100)}`,
      title: `周期 ${Math.floor(index / 100) + 1}`,
    },
    {
      key: `batch-${Math.floor(index / 10)}`,
      title: `批次 ${Math.floor(index / 10) + 1}`,
    },
  ],
}
function jumpToEnd() {
  table.value?.scrollToColumn(99_998, 'end')
  table.value?.scrollToRow(999_999, 'end')
}
</script>

<template>
  <div class="grouped-source-demo">
    <s-button size="small" flat @click="jumpToEnd">定位末行末列</s-button>
    <s-table
      ref="table"
      :virtual-source="source"
      :virtual-config="{
        height: 260,
        horizontal: true,
        dynamic: true,
        columnOverscan: 1,
      }"
      column-manager-config
      resize-config
    />
  </div>
</template>

<style scoped>
.grouped-source-demo {
  width: 100%;
}
.grouped-source-demo > .s-table-wrapper {
  margin-top: 16px;
}
</style>
