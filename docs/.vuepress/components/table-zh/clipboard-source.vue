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
const message = ref('选择区域后复制或粘贴。')
const reasons: Record<string, string> = {
  disabled: '功能未开启',
  empty: '请先选择区域',
  editing: '请先保存或取消编辑',
  readonly: '目标为只读',
  cancelled: '已取消',
  limit: '超出区域或文本上限',
  shape: '区域尺寸或合并范围不匹配',
  validation: '校验失败，请检查单元格提示',
  clipboard: '浏览器未允许剪贴板访问',
  conflict: '源数据已变化',
  rejected: '数据所有者拒绝更新',
  busy: '另一项写入尚未完成',
  invalid: '数据格式不正确',
}
const report = (result: TableClipboardResult) => {
  message.value = result.success
    ? `操作完成；变更单元格：${result.changedCells}`
    : (reasons[result.reason ?? 'invalid'] ?? result.reason) +
      (result.clipboardWritten === true ? '；已复制，原数据未清空' : '')
}
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
const all = () =>
  table.value?.setCellRange({
    anchor: { rowKey: 0, columnKey: '0' },
    focus: { rowKey: 999_999, columnKey: '99999' },
  })
const pasteSample = async () => {
  await last()
  await table.value?.pasteCells([
    ['末端更新', ''],
    ['', ''],
  ])
}
</script>
<template>
  <div class="clipboard-source-demo">
    <div class="clipboard-source-demo__controls">
      <s-button size="small" @click="last">选择末端合并区域</s-button>
      <s-button size="small" flat @click="table?.copyCells()">复制</s-button>
      <s-button size="small" flat @click="table?.cutCells()">剪切</s-button>
      <s-button size="small" flat @click="table?.pasteCells()">粘贴</s-button>
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
      <s-button size="small" flat @click="table?.cancelClipboard()"
        >取消操作</s-button
      >
      <s-button size="small" flat @click="pasteSample">更新末端区域</s-button>
      <s-button size="small" flat @click="all">全表选区（复制将超限）</s-button>
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
