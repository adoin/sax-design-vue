<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import type {
  TableContextMenuConfig,
  TableContextMenuSelectParams,
  TableExposes,
  TableVirtualSource,
} from 'sax-design-vue'
const table = ref<TableExposes>()
const message = shallowRef('右键或按 Shift + F10 打开菜单。')
const source: TableVirtualSource = {
  rowCount: 1_000_000,
  columnCount: 100_000,
  fixedLeftCount: 1,
  fixedRightCount: 1,
  rowKey: (index) => index,
  row: (index) => ({ id: index, name: `记录 ${index}` }),
  column: (index) => ({
    field: index === 0 ? 'name' : 'id',
    title: `列 ${index}`,
    width: 140,
  }),
  columnWidth: () => 140,
}
const menu: TableContextMenuConfig = {
  header: [{ label: '查看记录', value: 'header' }],
  body: [{ label: '查看记录', value: 'body' }],
  footer: [{ label: '查看汇总', value: 'footer' }],
}
const selected = ({ context, item }: TableContextMenuSelectParams) => {
  message.value = `${item.label}: ${context.area === 'header' ? '' : `${context.rowIndex} / `}${context.columnIndex}`
}
</script>

<template>
  <div class="table-menu-source-demo">
    <div class="table-menu-source-demo__controls">
      <s-button size="small" @click="table?.setActiveCell(0, 0)">首格</s-button>
      <s-button size="small" @click="table?.setActiveCell(999999, 99998)"
        >末格</s-button
      >
      <s-button size="small" flat @click="table?.closeContextMenu()"
        >关闭菜单</s-button
      >
    </div>
    <s-table
      ref="table"
      :virtual-source="source"
      :context-menu-config="menu"
      :keyboard-config="{ rowIndexOf: (key) => Number(key) }"
      :virtual-config="{ height: 280, dynamic: true, horizontal: true }"
      :footer-data="[{ name: '查看汇总', id: 1_000_000 }]"
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
