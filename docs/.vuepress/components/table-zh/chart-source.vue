<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { createTableSvgChartAdapter } from 'sax-design-vue'
import type { TableExposes, TableVirtualSource } from 'sax-design-vue'
const table = ref<TableExposes>()
const pending = shallowRef(false)
const message = shallowRef('只读取预算范围内的生成行。')
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
    label: `行 ${index}`,
    value: (index % 23) - 5,
  }),
  column: (index) => ({
    key: String(index),
    field: index === 99_998 ? 'label' : 'value',
    title: `列 ${index}`,
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
        value: '全部批次',
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
    series: [{ column: 99_999, name: '数值' }],
    type: 'line',
  })
  message.value = result?.success
    ? '图表已打开。'
    : `未生成图表：${result?.reason}`
}
const aggregate = async () => {
  const result = await table.value?.openChart({
    scope: 'aggregate',
    series: [{ column: 'count', name: '记录数' }],
  })
  message.value = result?.success
    ? '图表已打开。'
    : `未生成图表：${result?.reason}`
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
      ? '已达到 100 个数据点上限，请缩小范围。'
      : `未生成图表：${result?.reason}`
}
</script>
<template>
  <div class="chart-source-demo">
    <div class="chart-source-demo__controls">
      <s-button size="small" @click="last">末端选区图表</s-button>
      <s-button size="small" flat @click="aggregate">远程聚合图表</s-button>
      <s-button size="small" flat :disabled="pending" @click="limited"
        >检查取数上限</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="!pending"
        @click="table?.cancelChart()"
        >取消</s-button
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
