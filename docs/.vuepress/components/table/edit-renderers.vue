<script setup lang="ts">
import { shallowRef } from 'vue'
import type { TableColumn, TableEditEndParams } from 'sax-design-vue'

interface TaskRow {
  id: number
  task: string
  state: 'Open' | 'Done'
}

const rows = shallowRef<TaskRow[]>([
  { id: 1, task: 'Review API', state: 'Open' },
  { id: 2, task: 'Update examples', state: 'Done' },
])
const message = shallowRef('Double-click a task or state to edit it.')
const columns: TableColumn<TaskRow>[] = [
  {
    field: 'task',
    title: 'Task',
    minWidth: 200,
    editor: true,
    renderer: { name: '$input' },
  },
  {
    field: 'state',
    title: 'State',
    minWidth: 140,
    editor: true,
    renderer: {
      name: '$select',
      options: [
        { label: 'Open', value: 'Open' },
        { label: 'Done', value: 'Done' },
      ],
    },
  },
]

const save = ({ rowKey, updatedRow }: TableEditEndParams<TaskRow>) => {
  rows.value = rows.value.map((row) =>
    row.id === rowKey ? (updatedRow as TaskRow) : row,
  )
  message.value = 'Draft saved.'
}
</script>

<template>
  <div class="table-renderer-demo">
    <s-table
      :data="rows"
      :columns="columns"
      :edit-config="{ trigger: 'dblclick' }"
      row-key="id"
      @edit-commit="save"
      @edit-cancel="message = 'Draft discarded.'"
    />
    <p role="status">{{ message }}</p>
  </div>
</template>

<style scoped>
.table-renderer-demo {
  display: grid;
  gap: 8px;
}

.table-renderer-demo p {
  margin: 0;
}
</style>
