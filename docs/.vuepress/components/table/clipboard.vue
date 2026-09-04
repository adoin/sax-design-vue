<script setup lang="ts">
import { ref } from 'vue'
import type {
  TableClipboardResult,
  TableColumn,
  TableExposes,
  TableHistoryState,
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
const strict = ref(false)
const grouped = ref(false)
const virtual = ref(false)
const rows = ref(
  Array.from({ length: 24 }, (_, id) => ({
    id,
    name: `Project ${id + 1}`,
    team: id < 12 ? 'Engineering' : 'Design',
    score: 60 + id,
    note: id % 4 === 0 ? 'Multiline note\nSecond line' : 'Editable note',
  })),
)
const columns: TableColumn[] = [
  { field: 'id', title: 'ID (read-only)', width: 120, fixed: 'left' },
  { field: 'name', title: 'Project', width: 170, editor: true },
  { field: 'score', title: 'Score', width: 140, editor: { type: 'number' } },
  { field: 'team', title: 'Team', width: 150, editor: true },
  { field: 'note', title: 'Note', width: 200, editor: true, fixed: 'right' },
]
const selectSample = () =>
  table.value?.setCellRange({
    anchor: { rowKey: 0, columnKey: 'name' },
    focus: { rowKey: 1, columnKey: 'score' },
  })
const pasteSample = async () => {
  if (await selectSample())
    await table.value?.pasteCells([
      ['New project A', 88],
      ['New project B', 92],
    ])
}
</script>
<template>
  <div class="clipboard-demo">
    <div class="clipboard-demo__controls">
      <s-button size="small" @click="selectSample"
        >Select sample range</s-button
      >
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
      <s-button size="small" flat @click="pasteSample">Paste 2D data</s-button>
      <s-checkbox v-model="strict">Require project name</s-checkbox>
      <s-checkbox v-model="grouped">Group by team</s-checkbox>
      <s-checkbox v-model="virtual">Virtual scrolling</s-checkbox>
    </div>
    <s-table
      ref="table"
      v-model:data="rows"
      :columns="columns"
      row-key="id"
      range-config
      clipboard-config
      edit-config
      change-config
      history-config
      validation-config
      :validation-rules="{
        name: strict ? { required: true } : {},
        score: { type: 'number', min: 0, max: 100 },
      }"
      :group-config="grouped ? { fields: ['team'] } : false"
      :virtual-config="
        virtual ? { height: 280, horizontal: true, dynamic: true } : false
      "
      resize-config
      @clipboard="report"
      @history-change="history = $event"
    />
    <p role="status">{{ message }}</p>
  </div>
</template>
<style scoped>
.clipboard-demo {
  width: 100%;
}
.clipboard-demo__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}
.clipboard-demo > p {
  margin: 12px 0 0;
}
</style>
