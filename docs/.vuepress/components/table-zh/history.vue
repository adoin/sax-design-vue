<script setup lang="ts">
import { ref } from 'vue'
import type {
  TableColumn,
  TableExposes,
  TableHistoryState,
  TableRow,
} from 'sax-design-vue'
const table = ref<TableExposes>()
const rows = ref<TableRow[]>([
  { id: 1, name: '工作台', seats: 4 },
  { id: 2, name: '组件库', seats: 8 },
])
const nextId = ref(3)
const editing = ref(false)
const busy = ref(false)
const message = ref('双击单元格编辑整行，然后应用草稿。')
const history = ref<TableHistoryState>({
  undoCount: 0,
  redoCount: 0,
  canUndo: false,
  canRedo: false,
})
const columns: TableColumn[] = [
  { field: 'id', title: 'ID', width: 80, fixed: 'left' },
  {
    field: 'name',
    title: '项目',
    minWidth: 220,
    editor: true,
    rules: { required: true, message: '请输入项目名称。' },
  },
  { field: 'seats', title: '席位', width: 140, editor: { type: 'number' } },
]
const replay = async (direction: 'undo' | 'redo') => {
  busy.value = true
  try {
    const result = await table.value?.[direction]()
    message.value = result?.applied ? '已应用历史操作。' : '未能应用历史操作。'
  } finally {
    busy.value = false
  }
}
const confirm = () => {
  const version = table.value?.getChangeRecords().version
  if (version !== undefined && table.value?.acceptChanges(version))
    message.value = '已确认基线并清空历史。'
}
</script>

<template>
  <div class="history-demo">
    <div class="history-demo__controls">
      <s-button
        size="small"
        :disabled="editing || busy"
        @click="
          table?.insertRows([{ id: nextId++, name: '新项目', seats: 1 }], {
            index: 0,
          })
        "
        >插入行</s-button
      >
      <s-button
        size="small"
        :disabled="editing || busy || !rows.length"
        @click="table?.removeRows([Number(rows[0].id)])"
        >删除首行</s-button
      >
      <s-button
        size="small"
        :disabled="!editing || busy"
        @click="table?.commitEdit()"
        >应用草稿</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="!editing || busy"
        @click="table?.cancelEdit()"
        >放弃草稿</s-button
      >
      <s-button
        size="small"
        :disabled="editing || busy || !history.canUndo"
        @click="replay('undo')"
        >撤销</s-button
      >
      <s-button
        size="small"
        :disabled="editing || busy || !history.canRedo"
        @click="replay('redo')"
        >重做</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="editing || busy"
        @click="table?.clearHistory()"
        >清空历史</s-button
      >
      <s-button size="small" flat :disabled="editing || busy" @click="confirm"
        >确认基线</s-button
      >
      <s-tag
        >可撤销: {{ history.undoCount }} / 可重做:
        {{ history.redoCount }}</s-tag
      >
    </div>
    <s-table
      ref="table"
      v-model:data="rows"
      :columns="columns"
      change-config
      :history-config="{ limit: 30 }"
      :edit-config="{ mode: 'row' }"
      validation-config
      :pager-config="{ pageSize: 3 }"
      @history-change="history = $event"
      @edit-start="editing = true"
      @edit-commit="editing = false"
      @edit-cancel="editing = false"
    />
    <p role="status">{{ message }}</p>
  </div>
</template>

<style scoped>
.history-demo {
  width: 100%;
}
.history-demo__controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}
</style>
