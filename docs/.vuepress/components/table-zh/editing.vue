<script setup lang="ts">
import { ref } from 'vue'
import type {
  TableColumn,
  TableEditEndParams,
  TableExposes,
} from 'sax-design-vue'

const table = ref<TableExposes>()
const rowMode = ref(false)
const pending = ref(false)
const message = ref('双击单元格开始编辑。')
const rows = ref([
  {
    id: 1,
    name: '工作区',
    quantity: 2,
    status: 'open',
    due: '2026-09-20',
    active: true,
  },
  {
    id: 2,
    name: '组件库',
    quantity: 8,
    status: 'open',
    due: '2026-09-25',
    active: false,
  },
  {
    id: 3,
    name: '归档项目',
    quantity: 1,
    status: 'archived',
    due: '2026-09-01',
    active: false,
  },
])
const columns: TableColumn[] = [
  { field: 'name', title: '项目', width: 190, fixed: 'left', editor: true },
  {
    field: 'quantity',
    title: '数量',
    width: 130,
    editor: { type: 'number', props: { min: 0 } },
  },
  {
    field: 'status',
    cell: ({ value }) =>
      (
        ({ open: '进行中', done: '已完成', archived: '归档' }) as Record<
          string,
          string
        >
      )[String(value)] ?? String(value),
    title: '状态',
    width: 150,
    editor: {
      type: 'select',
      options: [
        { label: '进行中', value: 'open' },
        { label: '已完成', value: 'done' },
      ],
    },
  },
  {
    field: 'due',
    title: '截止日期',
    width: 200,
    editor: { type: 'date', props: { valueFormat: 'YYYY-MM-DD' } },
  },
  {
    field: 'active',
    cell: ({ value }) => (value ? '启用' : '停用'),
    title: '启用',
    width: 110,
    editor: { type: 'switch', props: { activeText: '开', inactiveText: '关' } },
  },
]
const save = ({ rowKey, updatedRow, changes }: TableEditEndParams) => {
  rows.value = rows.value.map((row) =>
    row.id === rowKey ? (updatedRow as typeof row) : row,
  )
  pending.value = false
  message.value = `已保存 ${changes.length} 个变更字段。`
}
const cancel = () => {
  pending.value = false
  message.value = '已放弃草稿。'
}
</script>

<template>
  <div class="editing-demo">
    <div class="editing-demo__controls">
      <s-checkbox v-model="rowMode">整行编辑</s-checkbox>
      <s-button size="small" :disabled="!pending" @click="table?.commitEdit()"
        >保存</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="!pending"
        @click="table?.cancelEdit()"
        >取消</s-button
      >
    </div>
    <s-table
      ref="table"
      :data="rows"
      :columns="columns"
      :edit-config="{
        mode: rowMode ? 'row' : 'cell',
        checkMethod: ({ row }) => row.status !== 'archived',
      }"
      row-key="id"
      resize-config
      @edit-start="pending = true"
      @edit-commit="save"
      @edit-cancel="cancel"
    />
    <p role="status">{{ message }}</p>
  </div>
</template>

<style scoped>
.editing-demo {
  width: 100%;
}
.editing-demo__controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}
.editing-demo > p {
  margin: 12px 0 0;
}
</style>
