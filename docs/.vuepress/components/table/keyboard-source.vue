<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import type {
  TableActiveCell,
  TableExposes,
  TableVirtualSource,
} from 'sax-design-vue'
const table = ref<TableExposes>()
const active = shallowRef<TableActiveCell | null>(null)
const source: TableVirtualSource = {
  rowCount: 1_000_000,
  columnCount: 100_000,
  fixedLeftCount: 1,
  fixedRightCount: 1,
  rowKey: (index) => index,
  row: (index) => ({ id: index, name: `Record ${index}` }),
  column: (index) => ({
    field: index === 0 ? 'name' : 'id',
    title: `Column ${index}`,
    width: 140,
  }),
  columnWidth: () => 140,
}
</script>

<template>
  <div class="keyboard-source-demo">
    <div class="keyboard-source-demo__controls">
      <s-button size="small" @click="table?.setActiveCell(0, 0)"
        >First cell</s-button
      >
      <s-button size="small" @click="table?.setActiveCell(999999, 99998)"
        >Last cell</s-button
      >
    </div>
    <s-table
      ref="table"
      v-model:active-cell="active"
      :virtual-source="source"
      :keyboard-config="{ rowIndexOf: (key) => Number(key) }"
      :virtual-config="{ height: 280, dynamic: true, horizontal: true }"
    />
    <p role="status">
      Active cell: {{ active ? `${active.rowKey} / ${active.columnKey}` : '—' }}
    </p>
  </div>
</template>

<style scoped>
.keyboard-source-demo {
  width: 100%;
}
.keyboard-source-demo__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}
.keyboard-source-demo > p {
  margin: 12px 0 0;
}
</style>
