<script setup lang="ts">
import { ref } from 'vue'
import type { TableExposes, TableVirtualSource } from 'sax-design-vue'
const table = ref<TableExposes>()
const source: TableVirtualSource = {
  rowCount: 1_000_000,
  columnCount: 100_000,
  fixedLeftCount: 1,
  fixedRightCount: 1,
  rowKey: (index) => index,
  row: (index) =>
    new Proxy(
      { id: index },
      {
        get: (row, key) =>
          key === 'id'
            ? row.id
            : typeof key === 'string' && key.startsWith('value_')
              ? `Value ${index}/${key.slice(6)}`
              : undefined,
      },
    ),
  column: (index) => ({
    key: String(index),
    field: index === 0 ? 'id' : `value_${index}`,
    title: index === 0 ? 'Record' : `Column ${index}`,
  }),
  columnWidth: (index) => (index === 0 ? 100 : 150),
}
const last = () => {
  table.value?.scrollToRow(999_999, 'end')
  table.value?.scrollToColumn(99_998, 'end')
}
const first = () => {
  table.value?.scrollToRow(0, 'start')
  table.value?.scrollToColumn(1, 'start')
}
</script>

<template>
  <s-table
    ref="table"
    class="table-source-demo"
    :virtual-source="source"
    :virtual-config="{ height: 280, horizontal: true, dynamic: true }"
    resize-config
  >
    <template #toolbar
      ><s-button @click="last">Last record and column</s-button
      ><s-button flat @click="first">Back to start</s-button></template
    >
  </s-table>
</template>
