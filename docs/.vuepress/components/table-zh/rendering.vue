<script setup lang="ts">
import { h } from 'vue'
import type { TableColumn, TableRenderer } from 'sax-design-vue'

interface TaskRow {
  id: number
  task: string
  priority: '高' | '普通'
  assignee: string
  [key: string]: unknown
}

const columns: TableColumn<TaskRow>[] = [
  { field: 'task', title: '任务', minWidth: 220, slots: { default: 'task' } },
  { field: 'assignee', title: '负责人', minWidth: 150 },
  { field: 'priority', title: '优先级', width: 120, renderer: 'priority' },
]

const rows: TaskRow[] = [
  { id: 1, task: '检查组件 API', priority: '高', assignee: '林晓' },
  { id: 2, task: '更新文档示例', priority: '普通', assignee: '陈屿' },
]

const renderers: Record<string, TableRenderer<TaskRow>> = {
  priority: {
    cell: ({ value }) =>
      h(
        'strong',
        { class: value === '高' ? 'priority-high' : '' },
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
        <small>任务 #{{ row.id }}</small>
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
