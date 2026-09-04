<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import type {
  TableChangeConfig,
  TableExposes,
  TableHistoryState,
  TableVirtualSource,
} from 'sax-design-vue'
const table = ref<TableExposes>()
const history = ref<TableHistoryState>({
  undoCount: 0,
  redoCount: 0,
  canUndo: false,
  canRedo: false,
})
const values = shallowRef(new Map<number, Record<string, unknown>>())
const column = (index: number) => ({
  key: String(index),
  field: `c${index}`,
  title: `列 ${index}`,
  width: 140,
  editor: index !== 0,
})
const rowKey = (index: number) => index
const source = computed<TableVirtualSource>(() => {
  const snapshot = values.value
  return {
    rowCount: 1_000_000,
    columnCount: 100_000,
    columnWidth: 140,
    fixedLeftCount: 1,
    fixedRightCount: 1,
    column,
    rowKey,
    row: (index) =>
      new Proxy(
        { id: index, ...snapshot.get(index) },
        {
          get: (target, key, receiver) =>
            typeof key === 'string' && /^c\d+$/.test(key) && !(key in target)
              ? `${index}/${key.slice(1)}`
              : Reflect.get(target, key, receiver),
          has: (target, key) =>
            (typeof key === 'string' && /^c\d+$/.test(key)) || key in target,
        },
      ),
  }
})
const changeConfig: TableChangeConfig = {
  indexOf: (key) =>
    typeof key === 'number' &&
    Number.isInteger(key) &&
    key >= 0 &&
    key < 1_000_000
      ? key
      : -1,
  apply: ({ operations, signal }) => {
    if (
      signal.aborted ||
      operations.some((operation) => operation.type !== 'update')
    )
      return false
    const next = new Map(values.value)
    for (const operation of operations) {
      const fields = { ...next.get(Number(operation.rowKey)) }
      for (const patch of operation.patches) {
        if (patch.exists) fields[patch.field] = patch.value
        else Reflect.deleteProperty(fields, patch.field)
      }
      next.set(Number(operation.rowKey), fields)
    }
    values.value = next
    return true
  },
}
const last = async () => {
  table.value?.scrollToRow(999_999, 'end')
  table.value?.scrollToColumn(99_998, 'end')
  await table.value?.setCellRange({
    anchor: { rowKey: 999_998, columnKey: '99998' },
    focus: { rowKey: 999_999, columnKey: '99999' },
  })
}
const findLast = async () => {
  await last()
  await table.value?.findCells('999998', { scope: 'selection' })
  await table.value?.findNext({ focus: false })
  await table.value?.openFind()
}
const limited = async () => {
  await table.value?.findCells('unmatched', { scope: 'data' })
  await table.value?.openFind()
}
</script>
<template>
  <div class="find-source-demo">
    <div class="find-source-demo__controls">
      <s-button size="small" @click="findLast">查找末端合并区域</s-button>
      <s-button size="small" flat @click="limited">查看扫描上限</s-button>
      <s-button
        size="small"
        flat
        :disabled="!history.canUndo"
        @click="table?.undo()"
        >撤销</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="!history.canRedo"
        @click="table?.redo()"
        >重做</s-button
      >
    </div>
    <s-table
      ref="table"
      :virtual-source="source"
      :virtual-config="{
        height: 280,
        rowHeight: 44,
        horizontal: true,
        dynamic: true,
      }"
      :find-config="{ maxCells: 4096 }"
      :range-config="{ rowIndexOf: Number }"
      edit-config
      :change-config="changeConfig"
      history-config
      :merge-config="{
        body: [{ row: 999998, col: 99998, rowspan: 2, colspan: 2 }],
      }"
      @history-change="history = $event"
    />
  </div>
</template>
<style scoped>
.find-source-demo {
  width: 100%;
}
.find-source-demo__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}
</style>
