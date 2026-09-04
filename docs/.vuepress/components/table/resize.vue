<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import type {
  TableColumn,
  TableColumnResizeParams,
  TableColumnWidths,
  TableInstance,
  TableRow,
  TableVirtualSource,
} from 'sax-design-vue'

const table = ref<TableInstance>()
const widths = ref<TableColumnWidths>({})
const virtual = shallowRef(true)
const pager = shallowRef(false)
const large = shallowRef(false)
const last = shallowRef('')
const description =
  'This description verifies wrapping and row-height remeasurement after a column width changes.'
const rows: TableRow[] = Array.from({ length: 200 }, (_, id) => ({
  id,
  name: `Member ${id}`,
  description: id % 3 ? description : description.repeat(3),
  status: 'Active',
  children:
    id === 0
      ? [{ id: 10001, name: 'Child task', description, status: 'Active' }]
      : undefined,
}))
const columns: TableColumn[] = [
  { field: 'id', title: 'ID', width: 72, minWidth: 56, fixed: 'left' },
  {
    field: 'name',
    title: 'Member',
    width: 160,
    minWidth: 100,
    fixed: 'left',
    treeNode: true,
  },
  { field: 'description', title: 'Description', width: 240, minWidth: 120 },
  ...Array.from({ length: 20 }, (_, index): TableColumn => ({
    field: `metric${index}`,
    title: `Metric ${index}`,
    width: 120,
    minWidth: 80,
    cell: ({ row }) => String(Number(row.id) + index),
  })),
  {
    field: 'status',
    title: 'Status',
    width: 120,
    minWidth: 80,
    fixed: 'right',
  },
]
const source: TableVirtualSource = {
  rowCount: 100_000,
  columnCount: 100_000,
  columnWidth: 120,
  fixedLeftCount: 2,
  fixedRightCount: 1,
  row: (id) => ({
    id,
    name: `Member ${id}`,
    description: id % 3 ? description : description.repeat(3),
    status: 'Active',
  }),
  column: (index) =>
    index < 3
      ? { ...columns[index], width: 120 }
      : index === 99_999
        ? columns[columns.length - 1]
        : {
            field: `metric${index}`,
            title: `Metric ${index}`,
            cell: ({ row }) => String(Number(row.id) + index),
          },
}
const virtualConfig = computed(() =>
  virtual.value || large.value
    ? { height: 320, horizontal: true, dynamic: true, estimateSize: 64 }
    : false,
)
const resized = (event: TableColumnResizeParams) => {
  last.value = `${event.columnKey}: ${event.oldWidth} → ${event.width} px`
}
const jump = () => {
  table.value?.scrollToRow(large.value ? source.rowCount - 1 : 199, 'end')
}
const jumpColumn = () => {
  table.value?.scrollToColumn(
    large.value ? source.columnCount - 2 : columns.length - 2,
    'end',
  )
}
</script>

<template>
  <div class="resize-demo">
    <div class="resize-controls">
      <s-button size="small" @click="widths = {}">Reset widths</s-button>
      <s-checkbox v-model="virtual" :disabled="large"
        >Two-axis virtualization</s-checkbox
      >
      <s-checkbox v-model="pager" :disabled="large">Pagination</s-checkbox>
      <s-checkbox v-model="large" @update:model-value="widths = {}"
        >100,000 generated rows</s-checkbox
      >
      <s-button size="small" flat :disabled="pager && !large" @click="jump"
        >Jump to end</s-button
      >
      <s-button size="small" flat @click="jumpColumn">Last column</s-button>
    </div>
    <s-text>{{
      'Drag a header edge, or focus its handle and use arrow keys. Home uses the minimum width; Escape cancels a drag.'
    }}</s-text>
    <s-table
      ref="table"
      v-model:column-widths="widths"
      :data="large ? [] : rows"
      :columns="large ? [] : columns"
      :virtual-source="large ? source : undefined"
      :virtual-config="virtualConfig"
      :tree-config="large ? undefined : { defaultExpandedKeys: [0] }"
      :pager-config="pager && !large ? { pageSize: 20 } : false"
      :resize-config="{ minWidth: 48 }"
      striped
      @column-resize="resized"
    />
    <s-text v-if="last" role="status" aria-live="polite"
      >Last resize: {{ last }}</s-text
    >
  </div>
</template>

<style scoped>
.resize-demo {
  display: grid;
  width: 100%;
  min-width: 0;
  gap: 16px;
}
.resize-controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
