<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import type {
  TableContextMenuConfig,
  TableContextMenuSelectParams,
  TableExposes,
  TableVirtualSource,
} from 'sax-design-vue'
const table = ref<TableExposes>()
const message = shallowRef('Right-click or press Shift + F10 to open a menu.')
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
const menu: TableContextMenuConfig = {
  header: [{ label: 'Inspect record', value: 'header' }],
  body: [{ label: 'Inspect record', value: 'body' }],
  footer: [{ label: 'Inspect summary', value: 'footer' }],
}
const selected = ({ context, item }: TableContextMenuSelectParams) => {
  message.value = `${item.label}: ${context.area === 'header' ? '' : `${context.rowIndex} / `}${context.columnIndex}`
}
</script>

<template>
  <div class="table-menu-source-demo">
    <div class="table-menu-source-demo__controls">
      <s-button size="small" @click="table?.setActiveCell(0, 0)"
        >First cell</s-button
      >
      <s-button size="small" @click="table?.setActiveCell(999999, 99998)"
        >Last cell</s-button
      >
      <s-button size="small" flat @click="table?.closeContextMenu()"
        >Close menu</s-button
      >
    </div>
    <s-table
      ref="table"
      :virtual-source="source"
      :context-menu-config="menu"
      :keyboard-config="{ rowIndexOf: (key) => Number(key) }"
      :virtual-config="{ height: 280, dynamic: true, horizontal: true }"
      :footer-data="[{ name: 'Inspect summary', id: 1_000_000 }]"
      @context-menu-select="selected"
    />
    <p role="status">{{ message }}</p>
  </div>
</template>

<style scoped>
.table-menu-source-demo {
  width: 100%;
}
.table-menu-source-demo__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}
.table-menu-source-demo > p {
  margin: 12px 0 0;
}
</style>
