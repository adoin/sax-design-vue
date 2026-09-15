<script setup lang="ts">
import { h, ref } from 'vue'
import type { TableCellRenderParams, TableColumn } from 'sax-design-vue'

interface TaskRow {
  id: number
  task: string
  priority: '高' | '普通'
  assignee: string
  [key: string]: unknown
}

const columns: TableColumn<TaskRow>[] = [
  { field: 'task', title: '任务', minWidth: 220, slots: { default: 'task' } },
  {
    field: 'assignee',
    title: '负责人',
    minWidth: 150,
    slots: {
      default: ({ row, column, index }) =>
        h(
          'span',
          { title: `${column.title} ${index + 1}` },
          `#${row.id} ${row.assignee}`,
        ),
    },
  },
  {
    field: 'priority',
    title: '优先级',
    width: 120,
    slots: { default: 'priority' },
  },
  {
    key: 'actions',
    title: '操作',
    width: 180,
    renderer: {
      name: '$buttons',
      props: { maxVisible: 1, trigger: 'click', moreText: '更多操作' },
      options: [
        { code: 'edit', text: '编辑', props: { size: 'mini' } },
        { code: 'archive', text: '归档' },
        { code: 'remove', text: '删除', props: { color: 'danger' } },
      ],
      events: {
        edit: (params) => showAction('编辑', params),
        archive: (params) => showAction('归档', params),
        remove: (params) => showAction('删除', params),
      },
    },
  },
]

const rows: TaskRow[] = [
  { id: 1, task: '检查组件 API', priority: '高', assignee: '林晓' },
  { id: 2, task: '更新文档示例', priority: '普通', assignee: '陈屿' },
]

const lastAction = ref('')
const showAction = (action: string, params: unknown) => {
  const { row } = params as TableCellRenderParams<TaskRow>
  lastAction.value = `${action}：${row.task}`
}
</script>

<template>
  <div class="renderer-demo">
    <s-table :data="rows" :columns="columns" row-key="id">
      <template #task="{ row, value }">
        <div class="task-cell">
          <strong>{{ value }}</strong>
          <small>任务 #{{ row.id }}</small>
        </div>
      </template>
      <template #priority="{ value }">
        <strong :class="{ 'priority-high': value === '高' }">{{
          value
        }}</strong>
      </template>
    </s-table>
    <small>{{ lastAction || '请选择操作' }}</small>
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
