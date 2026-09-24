<script setup lang="ts">
import { shallowRef } from 'vue'
import type { TableColumn, TableEditEndParams } from 'sax-design-vue'

interface TaskRow {
  id: number
  task: string
  state: '待处理' | '已完成'
}

const rows = shallowRef<TaskRow[]>([
  { id: 1, task: '检查 API', state: '待处理' },
  { id: 2, task: '更新示例', state: '已完成' },
])
const message = shallowRef('双击任务或状态单元格开始编辑。')
const columns: TableColumn<TaskRow>[] = [
  {
    field: 'task',
    title: '任务',
    minWidth: 200,
    editor: true,
    renderer: { name: '$input' },
  },
  {
    field: 'state',
    title: '状态',
    minWidth: 140,
    editor: true,
    renderer: {
      name: '$select',
      options: [
        { label: '待处理', value: '待处理' },
        { label: '已完成', value: '已完成' },
      ],
    },
  },
]

const save = ({ rowKey, updatedRow }: TableEditEndParams<TaskRow>) => {
  rows.value = rows.value.map((row) =>
    row.id === rowKey ? (updatedRow as TaskRow) : row,
  )
  message.value = '草稿已保存。'
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
      @edit-cancel="message = '已放弃草稿。'"
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
