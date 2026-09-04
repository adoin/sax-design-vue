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
const message = shallowRef(
  'Select a cell range or use the buttons to create a chart.',
)
const chartConfig = { adapter: createTableSvgChartAdapter() }
const rows = [
  { id: 1, name: 'Jan', region: 'East', sales: 120, cost: 80 },
  { id: 2, name: 'Feb', region: 'East', sales: 160, cost: 100 },
  { id: 3, name: 'Mar', region: 'East', sales: 130, cost: null },
  { id: 4, name: 'Jan', region: 'West', sales: 95, cost: 75 },
  { id: 5, name: 'Feb', region: 'West', sales: 150, cost: 110 },
  { id: 6, name: 'Mar', region: 'West', sales: 180, cost: 115 },
]
const columns: TableColumn[] = [
  { field: 'name', title: 'Month', width: 150, fixed: 'left' },
  { field: 'region', title: 'Region', minWidth: 140 },
  { field: 'sales', title: 'Revenue', minWidth: 160 },
  { field: 'cost', title: 'Cost', width: 150, fixed: 'right' },
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
      ? { aggregate: summary ? 'summary' : 'groups', summaryLabel: 'Total' }
      : { category: 'name' }),
    series: [
      { column: 'sales', name: 'Revenue' },
      { column: 'cost', name: 'Cost' },
    ],
  })
  message.value = result?.success
    ? 'Chart opened.'
    : `Chart not created: ${result?.reason}`
}
const filter = () =>
  table.value?.setFilters(eastOnly.value ? { region: ['East'] } : {})
</script>
<template>
  <div class="chart-demo">
    <div class="chart-demo__controls">
      <s-button size="small" @click="open('selection')"
        >Chart selection</s-button
      >
      <s-button size="small" flat @click="open('filtered')"
        >Chart filtered rows</s-button
      >
      <s-button size="small" flat @click="open('aggregate')"
        >Chart group totals</s-button
      >
      <s-button size="small" flat @click="open('aggregate', true)"
        >Chart summary</s-button
      >
      <s-checkbox v-model="eastOnly" @change="filter">East only</s-checkbox>
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
