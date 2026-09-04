<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import type {
  TableChangeRecords,
  TableColumn,
  TableDataMutationResult,
  TableExposes,
  TableRow,
} from 'sax-design-vue'

const table = ref<TableExposes>()
const rows = ref<TableRow[]>([
  { id: 1, name: 'Workbench', seats: 4 },
  { id: 2, name: 'Components', seats: 8 },
  { id: 3, name: 'Documentation', seats: 2 },
])
const highlighted = ref<TableRow | null>(null)
const editing = ref(false)
const busy = ref(false)
const message = ref('Select a row or double-click a cell to edit.')
const records = shallowRef<TableChangeRecords>({
  version: 0,
  inserted: [],
  updated: [],
  removed: [],
})
let nextId = 4
const columns: TableColumn[] = [
  { field: 'id', title: 'ID', width: 90, fixed: 'left' },
  {
    field: 'name',
    title: 'Project',
    minWidth: 220,
    editor: true,
    rules: { required: true, message: 'Enter a project name.' },
  },
  {
    field: 'seats',
    title: 'Seats',
    width: 140,
    editor: { type: 'number' },
    rules: {
      type: 'integer',
      min: 1,
      message: 'Seats must be a positive integer.',
    },
  },
]
const refresh = () => {
  if (table.value) records.value = table.value.getChangeRecords()
}
const run = async (
  action: () => Promise<TableDataMutationResult> | undefined,
) => {
  busy.value = true
  try {
    const result = await action()
    message.value = result?.applied
      ? 'Applied locally; awaiting business confirmation.'
      : 'The change was not accepted.'
    if (result?.applied) highlighted.value = null
  } finally {
    busy.value = false
  }
}
const insert = () =>
  run(() =>
    table.value?.insertRows([{ id: nextId++, name: 'New project', seats: 1 }], {
      index: 0,
    }),
  )
const remove = () => {
  const key = highlighted.value?.id
  if (typeof key === 'number') return run(() => table.value?.removeRows([key]))
}
const revert = () => {
  const key = highlighted.value?.id
  if (typeof key === 'number')
    return run(() => table.value?.revertChanges([key]))
}
const commit = async () => {
  busy.value = true
  try {
    message.value = (await table.value?.commitEdit())
      ? 'Applied locally; awaiting business confirmation.'
      : 'Correct invalid fields before continuing.'
  } finally {
    busy.value = false
  }
}
const confirm = async () => {
  if (!table.value) return
  busy.value = true
  try {
    if (!(await table.value.commitEdit())) return
    const result = await table.value.validate()
    if (!result.valid) {
      message.value = 'Correct invalid fields before continuing.'
      return
    }
    const snapshot = table.value.getChangeRecords()
    // In an application, await the save request before acknowledging this version.
    message.value = table.value.acceptChanges(snapshot.version)
      ? 'Current changes are now the confirmed baseline.'
      : 'The data changed. Review the latest changes before confirming.'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="changes-demo">
    <div class="changes-demo__controls">
      <s-button size="small" :disabled="busy || editing" @click="insert"
        >Insert row</s-button
      >
      <s-button
        size="small"
        :disabled="busy || editing || !highlighted"
        @click="table?.startEdit(highlighted!, 'name')"
        >Edit selected</s-button
      >
      <s-button size="small" :disabled="busy || !editing" @click="commit"
        >Apply draft</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="busy || !editing"
        @click="table?.cancelEdit()"
        >Discard draft</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="busy || editing || !highlighted"
        @click="remove"
        >Remove selected</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="busy || editing || !highlighted"
        @click="revert"
        >Revert selected</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="busy || editing"
        @click="run(() => table?.revertChanges())"
        >Revert all</s-button
      >
      <s-button size="small" :loading="busy" @click="confirm"
        >Confirm baseline</s-button
      >
    </div>
    <s-table
      ref="table"
      v-model:data="rows"
      v-model:highlight="highlighted"
      :columns="columns"
      :edit-config="{ mode: 'row' }"
      change-config
      validation-config
      :pager-config="{ pageSize: 3 }"
      @changes-change="refresh"
      @edit-start="editing = true"
      @edit-commit="editing = false"
      @edit-cancel="editing = false"
    />
    <p role="status">{{ message }}</p>
    <div class="changes-demo__controls">
      <s-tag>Inserted: {{ records.inserted.length }}</s-tag>
      <s-tag>Updated: {{ records.updated.length }}</s-tag>
      <s-tag>Removed: {{ records.removed.length }}</s-tag>
    </div>
  </div>
</template>

<style scoped>
.changes-demo {
  width: 100%;
}
.changes-demo__controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin: 12px 0;
}
</style>
