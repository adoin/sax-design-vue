<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { createTableSvgChartAdapter } from 'sax-design-vue'
import type {
  TableChartOptions,
  TableColumn,
  TableExposes,
} from 'sax-design-vue'
const table = ref<TableExposes>()
const eastOnly = shallowRef(false)
const message = shallowRef('框选单元格或使用按钮生成图表。')
const chartConfig = { adapter: createTableSvgChartAdapter() }
const rows = [
  { id: 1, name: '一月', region: '东区', sales: 120, cost: 80 },
  { id: 2, name: '二月', region: '东区', sales: 160, cost: 100 },
  { id: 3, name: '三月', region: '东区', sales: 130, cost: null },
  { id: 4, name: '一月', region: '西区', sales: 95, cost: 75 },
  { id: 5, name: '二月', region: '西区', sales: 150, cost: 110 },
  { id: 6, name: '三月', region: '西区', sales: 180, cost: 115 },
]
const columns: TableColumn[] = [
  { field: 'name', title: '月份', width: 150, fixed: 'left' },
  { field: 'region', title: '区域', minWidth: 140 },
  { field: 'sales', title: '收入', minWidth: 160 },
  { field: 'cost', title: '成本', width: 150, fixed: 'right' },
]
const groupConfig = {
  fields: ['region'],
  aggregates: [
    { key: 'sales', field: 'sales', method: 'sum' as const },
    { key: 'cost', field: 'cost', method: 'sum' as const },
  ],
  summary: true,
  summaryScope: 'filtered' as const,
}
const open = async (scope: TableChartOptions['scope'], summary = false) => {
  if (scope === 'selection' && !table.value?.getCellRange()) {
    await table.value?.setCellRange({
      anchor: { rowKey: 1, columnKey: 'name' },
      focus: { rowKey: 3, columnKey: 'cost' },
    })
  }
  const result = await table.value?.openChart({
    scope,
    ...(scope === 'aggregate'
      ? { aggregate: summary ? 'summary' : 'groups', summaryLabel: '汇总' }
      : { category: 'name' }),
    series: [
      { column: 'sales', name: '收入' },
      { column: 'cost', name: '成本' },
    ],
  })
  message.value = result?.success
    ? '图表已打开。'
    : `未生成图表：${result?.reason}`
}
const filter = () =>
  table.value?.setFilters(eastOnly.value ? { region: ['东区'] } : {})
</script>
<template>
  <div class="chart-demo">
    <div class="chart-demo__controls">
      <s-button size="small" @click="open('selection')">所选区域图表</s-button>
      <s-button size="small" flat @click="open('filtered')"
        >筛选结果图表</s-button
      >
      <s-button size="small" flat @click="open('aggregate')"
        >分组统计图表</s-button
      >
      <s-button size="small" flat @click="open('aggregate', true)"
        >整体汇总图表</s-button
      >
      <s-checkbox v-model="eastOnly" @change="filter">只看东区</s-checkbox>
    </div>
    <s-table
      ref="table"
      :data="rows"
      :columns="columns"
      :chart-config="chartConfig"
      :group-config="groupConfig"
      :pager-config="{ pageSize: 3 }"
      range-config
      keyboard-config
      row-key="id"
    />
    <p role="status">{{ message }}</p>
  </div>
</template>
<style scoped>
.chart-demo {
  width: 100%;
}
.chart-demo__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.chart-demo > p {
  margin: 12px 0 0;
}
</style>
