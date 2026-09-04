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
  { id: 1, name: 'Workbench', seats: 4 },
  { id: 2, name: 'Components', seats: 8 },
])
const nextId = ref(3)
const editing = ref(false)
const busy = ref(false)
const message = ref(
  'Double-click a cell to edit the row, then apply the draft.',
)
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
    title: 'Project',
    minWidth: 220,
    editor: true,
    rules: { required: true, message: 'Enter a project name.' },
  },
  { field: 'seats', title: 'Seats', width: 140, editor: { type: 'number' } },
]
const replay = async (direction: 'undo' | 'redo') => {
  busy.value = true
  try {
    const result = await table.value?.[direction]()
    message.value = result?.applied
      ? 'History applied.'
      : 'History could not be applied.'
  } finally {
    busy.value = false
  }
}
const confirm = () => {
  const version = table.value?.getChangeRecords().version
  if (version !== undefined && table.value?.acceptChanges(version))
    message.value = 'Baseline confirmed; history cleared.'
}
</script>

<template>
  <div class="history-demo">
    <div class="history-demo__controls">
      <s-button
        size="small"
        :disabled="editing || busy"
        @click="
          table?.insertRows([{ id: nextId++, name: 'New project', seats: 1 }], {
            index: 0,
          })
        "
        >Insert row</s-button
      >
      <s-button
        size="small"
        :disabled="editing || busy || !rows.length"
        @click="table?.removeRows([Number(rows[0].id)])"
        >Remove first row</s-button
      >
      <s-button
        size="small"
        :disabled="!editing || busy"
        @click="table?.commitEdit()"
        >Apply draft</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="!editing || busy"
        @click="table?.cancelEdit()"
        >Discard draft</s-button
      >
      <s-button
        size="small"
        :disabled="editing || busy || !history.canUndo"
        @click="replay('undo')"
        >Undo</s-button
      >
      <s-button
        size="small"
        :disabled="editing || busy || !history.canRedo"
        @click="replay('redo')"
        >Redo</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="editing || busy"
        @click="table?.clearHistory()"
        >Clear history</s-button
      >
      <s-button size="small" flat :disabled="editing || busy" @click="confirm"
        >Confirm baseline</s-button
      >
      <s-tag
        >Undo: {{ history.undoCount }} / Redo: {{ history.redoCount }}</s-tag
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
