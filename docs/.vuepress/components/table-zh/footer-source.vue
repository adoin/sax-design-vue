<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TableInstance, TableVirtualSource } from 'sax-design-vue'

const table = ref<TableInstance>()
const empty = ref(false)
const count = computed(() => (empty.value ? 0 : 1_000_000))
const totals = computed(() => [
  { kind: 'sum', label: '合计', factor: count.value },
  { kind: 'mean', label: '平均值', factor: count.value ? 1 : 0 },
])
const source = computed<TableVirtualSource>(() => ({
  rowCount: count.value,
  columnCount: 100_000,
  row: (index) => ({ id: index }),
  rowKey: (index) => index,
  column: (index) => ({
    key: String(index),
    title: index ? `指标 ${index}` : '行号',
    cell: ({ row }) => Number(row.id) + index,
    footer: ({ row }) =>
      index
        ? (
            (Math.max(0, count.value - 1) / 2 + index) *
            Number(row.factor)
          ).toLocaleString('zh-CN', { maximumFractionDigits: 1 })
        : (row.label as string),
    footerAlign: index ? 'right' : 'left',
  }),
  columnWidth: 160,
  fixedLeftCount: 1,
  fixedRightCount: 1,
  headerDepth: 2,
  headerPath: (index) => [
    {
      key: `batch-${Math.floor(index / 100)}`,
      title: `批次 ${Math.floor(index / 100) + 1}`,
    },
  ],
}))
function jumpToEnd() {
  table.value?.scrollToColumn(99_998, 'end')
  if (count.value) table.value?.scrollToRow(count.value - 1, 'end')
}
</script>

<template>
  <div class="footer-source-demo">
    <s-checkbox v-model="empty">正文为空时显示表尾</s-checkbox>
    <s-button size="small" flat @click="jumpToEnd">定位末行末列</s-button>
    <s-table
      ref="table"
      :virtual-source="source"
      :footer-data="totals"
      footer-row-key="kind"
      :virtual-config="{
        height: 240,
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
.footer-source-demo {
  width: 100%;
}
.footer-source-demo > .s-table-wrapper {
  margin-top: 16px;
}
</style>
