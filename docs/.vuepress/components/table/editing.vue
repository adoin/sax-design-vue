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
const message = ref('Double-click a cell to edit.')
const rows = ref([
  {
    id: 1,
    name: 'Workspace',
    quantity: 2,
    status: 'open',
    due: '2026-09-20',
    active: true,
  },
  {
    id: 2,
    name: 'Component library',
    quantity: 8,
    status: 'open',
    due: '2026-09-25',
    active: false,
  },
  {
    id: 3,
    name: 'Archived project',
    quantity: 1,
    status: 'archived',
    due: '2026-09-01',
    active: false,
  },
])
const columns: TableColumn[] = [
  { field: 'name', title: 'Project', width: 190, fixed: 'left', editor: true },
  {
    field: 'quantity',
    title: 'Quantity',
    width: 130,
    editor: { type: 'number', props: { min: 0 } },
  },
  {
    field: 'status',
    cell: ({ value }) =>
      (
        ({ open: 'Open', done: 'Done', archived: 'Archived' }) as Record<
          string,
          string
        >
      )[String(value)] ?? String(value),
    title: 'Status',
    width: 150,
    editor: {
      type: 'select',
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Done', value: 'done' },
      ],
    },
  },
  {
    field: 'due',
    title: 'Due date',
    width: 200,
    editor: { type: 'date', props: { valueFormat: 'YYYY-MM-DD' } },
  },
  {
    field: 'active',
    cell: ({ value }) => (value ? 'On' : 'Off'),
    title: 'Active',
    width: 110,
    editor: {
      type: 'switch',
      props: { activeText: 'On', inactiveText: 'Off' },
    },
  },
]
const save = ({ rowKey, updatedRow, changes }: TableEditEndParams) => {
  rows.value = rows.value.map((row) =>
    row.id === rowKey ? (updatedRow as typeof row) : row,
  )
  pending.value = false
  message.value = `Saved ${changes.length} changed field(s).`
}
const cancel = () => {
  pending.value = false
  message.value = 'Draft discarded.'
}
</script>

<template>
  <div class="editing-demo">
    <div class="editing-demo__controls">
      <s-checkbox v-model="rowMode">Edit the whole row</s-checkbox>
      <s-button size="small" :disabled="!pending" @click="table?.commitEdit()"
        >Save</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="!pending"
        @click="table?.cancelEdit()"
        >Cancel</s-button
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
