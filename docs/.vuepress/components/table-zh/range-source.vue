<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import type {
  TableCellRange,
  TableCellRangeBounds,
  TableExposes,
  TableVirtualSource,
} from 'sax-design-vue'
const table = ref<TableExposes>()
const selected = shallowRef<TableCellRange | null>(null)
const bounds = shallowRef<TableCellRangeBounds | null>(null)
const source: TableVirtualSource = {
  rowCount: 1_000_000,
  columnCount: 100_000,
  columnWidth: 120,
  fixedLeftCount: 1,
  fixedRightCount: 1,
  row: (index) => ({ id: index }),
  rowKey: (index) => index,
  column: (index) => ({
    key: String(index),
    title: `编号 ${index}`,
    cell: ({ rowIndex }) => `${rowIndex} / ${index}`,
  }),
}
const last = () => {
  table.value?.scrollToRow(999_999, 'end')
  table.value?.scrollToColumn(99_998, 'end')
}
const all = () =>
  table.value?.setCellRange({
    anchor: { rowKey: 0, columnKey: '0' },
    focus: { rowKey: 999_999, columnKey: '99999' },
  })
const reset = () => {
  table.value?.scrollToRow(0, 'start')
  table.value?.scrollToColumn(1, 'start')
}
</script>

<template>
  <div class="range-source-demo">
    <div class="range-source-demo__controls">
      <s-button size="small" @click="last">末端区域</s-button>
      <s-button size="small" flat @click="all">全表选区</s-button>
      <s-button size="small" flat @click="table?.clearCellRange()"
        >清空选区</s-button
      >
      <s-button size="small" flat @click="reset">返回开头</s-button>
    </div>
    <s-table
      ref="table"
      v-model:cell-range="selected"
      :virtual-source="source"
      :range-config="{ rowIndexOf: (key) => Number(key) }"
      :virtual-config="{
        enabled: true,
        horizontal: true,
        height: 280,
        rowHeight: 44,
        dynamic: true,
      }"
      :merge-config="{
        body: [{ row: 999_996, col: 99_994, rowspan: 4, colspan: 6 }],
      }"
      resize-config
      @cell-range-change="bounds = $event.bounds"
    />
    <p role="status">
      选区:
      {{
        bounds
          ? bounds.rowEnd -
            bounds.rowStart +
            ' × ' +
            (bounds.colEnd - bounds.colStart)
          : '未选择'
      }}
    </p>
  </div>
</template>

<style scoped>
.range-source-demo {
  width: 100%;
}
.range-source-demo__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}
.range-source-demo p {
  margin: 12px 0 0;
}
</style>
