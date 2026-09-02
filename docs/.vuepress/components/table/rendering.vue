<script setup lang="ts">
import { h } from 'vue'
import type { TableColumn, TableRenderer } from 'sax-design-vue'

interface TaskRow {
  id: number
  task: string
  priority: 'High' | 'Normal'
  assignee: string
  [key: string]: unknown
}

const columns: TableColumn<TaskRow>[] = [
  { field: 'task', title: 'Task', minWidth: 220, slots: { default: 'task' } },
  { field: 'assignee', title: 'Assignee', minWidth: 150 },
  { field: 'priority', title: 'Priority', width: 120, renderer: 'priority' },
]

const rows: TaskRow[] = [
  { id: 1, task: 'Review component API', priority: 'High', assignee: 'Leanne' },
  { id: 2, task: 'Update examples', priority: 'Normal', assignee: 'Ervin' },
]

const renderers: Record<string, TableRenderer<TaskRow>> = {
  priority: {
    cell: ({ value }) =>
      h(
        'strong',
        { class: value === 'High' ? 'priority-high' : '' },
        String(value),
      ),
  },
}
</script>

<template>
  <s-table :data="rows" :columns="columns" :renderers="renderers" row-key="id">
    <template #task="{ row, value }">
      <div class="task-cell">
        <strong>{{ value }}</strong>
        <small>Task #{{ row.id }}</small>
      </div>
    </template>
  </s-table>
</template>

<style scoped>
.task-cell {
  display: grid;
  gap: 2px;
}

.task-cell small {
  color: hsl(var(--sax-text-color-secondary));
}

.priority-high {
  color: hsl(var(--sax-danger));
}
</style>
