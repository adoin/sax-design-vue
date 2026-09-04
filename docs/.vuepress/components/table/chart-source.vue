<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { createTableSvgChartAdapter } from 'sax-design-vue'
import type { TableExposes, TableVirtualSource } from 'sax-design-vue'
const table = ref<TableExposes>()
const pending = shallowRef(false)
const message = shallowRef(
  'Generated rows are read only within the requested budget.',
)
const chartConfig = {
  adapter: createTableSvgChartAdapter(),
  maxPoints: 100,
  maxCells: 1000,
}
const rowIndexOf = (key: string | number) =>
  typeof key === 'number' &&
  Number.isInteger(key) &&
  key >= 0 &&
  key < 1_000_000
    ? key
    : -1
const source: TableVirtualSource = {
  rowCount: 1_000_000,
  columnCount: 100_000,
  columnWidth: 140,
  fixedLeftCount: 1,
  fixedRightCount: 1,
  rowKey: (index) => index,
  row: (index) => ({
    id: index,
    label: `Row ${index}`,
    value: (index % 23) - 5,
  }),
  column: (index) => ({
    key: String(index),
    field: index === 99_998 ? 'label' : 'value',
    title: `Column ${index}`,
    width: 140,
  }),
}
const groupConfig = {
  mode: 'remote' as const,
  remote: {
    groups: [
      {
        key: 'all',
        field: 'batch',
        value: 'All batches',
        rowStart: 0,
        rowCount: 1_000_000,
        aggregates: { count: 1_000_000 },
      },
    ],
    summary: { count: 1_000_000 },
  },
}
const last = async () => {
  table.value?.scrollToRow(999_999, 'end')
  table.value?.scrollToColumn(99_998, 'end')
  await table.value?.setCellRange({
    anchor: { rowKey: 999_995, columnKey: '99998' },
    focus: { rowKey: 999_999, columnKey: '99999' },
  })
  const result = await table.value?.openChart({
    scope: 'selection',
    category: 99_998,
    series: [{ column: 99_999, name: 'Value' }],
    type: 'line',
  })
  message.value = result?.success
    ? 'Chart opened.'
    : `Chart not created: ${result?.reason}`
}
const aggregate = async () => {
  const result = await table.value?.openChart({
    scope: 'aggregate',
    series: [{ column: 'count', name: 'Records' }],
  })
  message.value = result?.success
    ? 'Chart opened.'
    : `Chart not created: ${result?.reason}`
}
const limited = async () => {
  pending.value = true
  const result = await table.value?.getChartData({
    scope: 'filtered',
    category: 99_998,
    series: [{ column: 99_999 }],
  })
  pending.value = false
  message.value =
    result?.reason === 'limit'
      ? 'The 100-point limit was reached. Choose a smaller range.'
      : `Chart not created: ${result?.reason}`
}
</script>
<template>
  <div class="chart-source-demo">
    <div class="chart-source-demo__controls">
      <s-button size="small" @click="last">Chart last range</s-button>
      <s-button size="small" flat @click="aggregate"
        >Chart remote aggregates</s-button
      >
      <s-button size="small" flat :disabled="pending" @click="limited"
        >Check scan limit</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="!pending"
        @click="table?.cancelChart()"
        >Cancel</s-button
      >
    </div>
    <s-table
      ref="table"
      :virtual-source="source"
      :virtual-config="{
        enabled: true,
        horizontal: true,
        rowHeight: 44,
        dynamic: true,
      }"
      :chart-config="chartConfig"
      :group-config="groupConfig"
      height="340px"
      :range-config="{ rowIndexOf }"
      keyboard-config
    />
    <p role="status">{{ message }}</p>
  </div>
</template>
<style scoped>
.chart-source-demo {
  width: 100%;
}
.chart-source-demo__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.chart-source-demo > p {
  margin: 12px 0 0;
}
</style>
