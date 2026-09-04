<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import type {
  TableChangeConfig,
  TableClipboardResult,
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
const message = ref('Select a range to copy or paste.')
const reasons: Record<string, string> = {
  disabled: 'Feature disabled',
  empty: 'Select a range first',
  editing: 'Finish the active editor first',
  readonly: 'Read-only target',
  cancelled: 'Cancelled',
  limit: 'Cell or text limit exceeded',
  shape: 'Range dimensions or merged cells do not match',
  validation: 'Validation failed; check cell messages',
  clipboard: 'Browser clipboard access was not allowed',
  conflict: 'Source data changed',
  rejected: 'Data owner rejected the update',
  busy: 'Another write is pending',
  invalid: 'Invalid data format',
}
const report = (result: TableClipboardResult) => {
  message.value = result.success
    ? `Completed; changed cells: ${result.changedCells}`
    : (reasons[result.reason ?? 'invalid'] ?? result.reason) +
      (result.clipboardWritten === true
        ? '; copied, source data was not cleared'
        : '')
}
const values = shallowRef(new Map<number, Record<string, unknown>>())
const column = (index: number) => ({
  key: String(index),
  field: `c${index}`,
  title: `Column ${index}`,
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
const all = () =>
  table.value?.setCellRange({
    anchor: { rowKey: 0, columnKey: '0' },
    focus: { rowKey: 999_999, columnKey: '99999' },
  })
const pasteSample = async () => {
  await last()
  await table.value?.pasteCells([
    ['Updated at the end', ''],
    ['', ''],
  ])
}
</script>
<template>
  <div class="clipboard-source-demo">
    <div class="clipboard-source-demo__controls">
      <s-button size="small" @click="last">Select last merged range</s-button>
      <s-button size="small" flat @click="table?.copyCells()">Copy</s-button>
      <s-button size="small" flat @click="table?.cutCells()">Cut</s-button>
      <s-button size="small" flat @click="table?.pasteCells()">Paste</s-button>
      <s-button
        size="small"
        flat
        :disabled="!history.canUndo"
        @click="table?.undo()"
        >Undo</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="!history.canRedo"
        @click="table?.redo()"
        >Redo</s-button
      >
      <s-button size="small" flat @click="table?.cancelClipboard()"
        >Cancel operation</s-button
      >
      <s-button size="small" flat @click="pasteSample"
        >Update last range</s-button
      >
      <s-button size="small" flat @click="all"
        >Select all (exceeds copy limit)</s-button
      >
    </div>
    <s-table
      ref="table"
      :virtual-source="source"
      :change-config="changeConfig"
      edit-config
      history-config
      :clipboard-config="{ maxCells: 10000 }"
      :range-config="{ rowIndexOf: Number }"
      :virtual-config="{
        height: 280,
        horizontal: true,
        rowHeight: 44,
        dynamic: true,
      }"
      :merge-config="{
        body: [{ row: 999998, col: 99998, rowspan: 2, colspan: 2 }],
      }"
      resize-config
      @clipboard="report"
      @history-change="history = $event"
    />
    <p role="status">{{ message }}</p>
  </div>
</template>
<style scoped>
.clipboard-source-demo {
  width: 100%;
}
.clipboard-source-demo__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}
.clipboard-source-demo > p {
  margin: 12px 0 0;
}
</style>
