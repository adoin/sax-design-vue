<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import type {
  TableActiveCell,
  TableExposes,
  TableGroupConfig,
  TableVirtualSource,
} from 'sax-design-vue'

const table = ref<TableExposes>()
const active = shallowRef<TableActiveCell | null>(null)
const source: TableVirtualSource = {
  rowCount: 1_000_000,
  columnCount: 100_000,
  fixedLeftCount: 1,
  fixedRightCount: 1,
  columnWidth: () => 140,
  rowKey: (index) => index,
  row: (index) => ({ id: index }),
  column: (index) => ({
    field: String(index),
    title: `Column ${index}`,
    width: 140,
  }),
}
const grouping: TableGroupConfig = {
  mode: 'remote',
  subtotal: true,
  summary: true,
  remote: {
    groups: Array.from({ length: 8 }, (_, index) => ({
      key: `batch-${index}`,
      field: 'batch',
      value: index + 1,
      label: `Batch ${index + 1}`,
      rowStart: index * 125_000,
      rowCount: 125_000,
      aggregates: {
        '0': 'Subtotal',
        '1': ((index * 250_000 + 124_999) * 125_000) / 2,
      },
    })),
    summary: { '0': 'Total', '1': (999_999 * 1_000_000) / 2 },
  },
}
const last = async () => {
  if (await table.value?.setGroupExpandedKeys(['batch-7']))
    await table.value?.setActiveCell(999_999, 99_998)
}
</script>

<template>
  <div class="grouping-source-demo">
    <div class="grouping-source-demo__controls">
      <s-button size="small" @click="last">Open last batch</s-button>
      <s-button size="small" flat @click="table?.setGroupExpandedKeys([])"
        >Collapse all</s-button
      >
    </div>
    <s-table
      ref="table"
      v-model:active-cell="active"
      :virtual-source="source"
      :group-config="grouping"
      :keyboard-config="{ rowIndexOf: Number }"
      :virtual-config="{ height: 300, dynamic: true, horizontal: true }"
      resize-config
    >
      <template #cell="{ rowIndex, columnIndex }"
        >{{ rowIndex }} / {{ columnIndex }}</template
      >
    </s-table>
    <p role="status">
      Active source cell:
      {{ active ? `${active.rowKey} / ${active.columnKey}` : '—' }}
    </p>
  </div>
</template>

<style scoped>
.grouping-source-demo {
  width: 100%;
  min-width: 0;
}
.grouping-source-demo__controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}
.grouping-source-demo p {
  margin: 12px 0 0;
}
</style>
