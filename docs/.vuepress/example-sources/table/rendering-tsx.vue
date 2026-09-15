<script setup lang="tsx">
import { ref } from 'vue'
import type { TableCellRenderParams, TableColumn } from 'sax-design-vue'

interface TaskRow {
  id: number
  task: string
  priority: 'High' | 'Normal'
  assignee: string
  [key: string]: unknown
}

const columns: TableColumn<TaskRow>[] = [
  { field: 'task', title: 'Task', minWidth: 220, slots: { default: 'task' } },
  {
    field: 'assignee',
    title: 'Assignee',
    minWidth: 150,
    slots: {
      default: ({ row, column, index }) => (
        <span title={`${column.title} ${index + 1}`}>
          #{row.id} {row.assignee}
        </span>
      ),
    },
  },
  {
    field: 'priority',
    title: 'Priority',
    width: 120,
    slots: { default: 'priority' },
  },
  {
    key: 'actions',
    title: 'Actions',
    width: 180,
    renderer: {
      name: '$buttons',
      props: { maxVisible: 1, trigger: 'click', moreText: 'More actions' },
      options: [
        { code: 'edit', text: 'Edit', props: { size: 'mini' } },
        { code: 'archive', text: 'Archive' },
        { code: 'remove', text: 'Remove', props: { color: 'danger' } },
      ],
      events: {
        edit: (params) => showAction('Edit', params),
        archive: (params) => showAction('Archive', params),
        remove: (params) => showAction('Remove', params),
      },
    },
  },
]

const rows: TaskRow[] = [
  { id: 1, task: 'Review component API', priority: 'High', assignee: 'Leanne' },
  { id: 2, task: 'Update examples', priority: 'Normal', assignee: 'Ervin' },
]

const lastAction = ref('')
const showAction = (action: string, params: unknown) => {
  const { row } = params as TableCellRenderParams<TaskRow>
  lastAction.value = `${action}: ${row.task}`
}
</script>

<template>
  <div class="renderer-demo">
    <s-table :data="rows" :columns="columns" row-key="id">
      <template #task="{ row, value }">
        <div class="task-cell">
          <strong>{{ value }}</strong>
          <small>Task #{{ row.id }}</small>
        </div>
      </template>
      <template #priority="{ value }">
        <strong :class="{ 'priority-high': value === 'High' }">{{
          value
        }}</strong>
      </template>
    </s-table>
    <small>{{ lastAction || 'Choose an action' }}</small>
  </div>
</template>

<style scoped>
.task-cell {
  display: grid;
  gap: 2px;
}

.renderer-demo {
  display: grid;
  width: 100%;
  gap: 10px;
}

.task-cell small {
  color: hsl(var(--sax-text-color-secondary));
}

.priority-high {
  color: hsl(var(--sax-danger));
}
</style>
