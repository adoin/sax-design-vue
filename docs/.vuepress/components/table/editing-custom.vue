<script setup lang="ts">
import { ref } from 'vue'
import type { TableEditEndParams, TableExposes } from 'sax-design-vue'

const table = ref<TableExposes>()
const rows = ref([
  { id: 1, name: 'Design review', priority: 'normal' },
  { id: 2, name: 'Release checklist', priority: 'high' },
])
const pending = ref(false)
const options = [
  { label: 'Normal', value: 'normal' },
  { label: 'High', value: 'high' },
]
const save = ({ rowKey, updatedRow }: TableEditEndParams) => {
  rows.value = rows.value.map((row) =>
    row.id === rowKey ? (updatedRow as typeof row) : row,
  )
  pending.value = false
}
</script>

<template>
  <s-table
    ref="table"
    :data="rows"
    :edit-config="{ mode: 'row', trigger: 'manual' }"
    row-key="id"
    @edit-start="pending = true"
    @edit-commit="save"
    @edit-cancel="pending = false"
  >
    <template #header>
      <s-button size="small" :disabled="!pending" @click="table?.commitEdit()"
        >Save row</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="!pending"
        @click="table?.cancelEdit()"
        >Cancel</s-button
      >
    </template>
    <s-table-column field="name" title="Task" :min-width="230" editor>
      <template #default="{ value }"
        ><strong>{{ value }}</strong></template
      >
      <template #edit="{ value, setValue }"
        ><s-input
          :model-value="String(value ?? '')"
          label="Task name"
          block
          @update:model-value="setValue"
      /></template>
    </s-table-column>
    <s-table-column field="priority" title="Priority" :width="180" editor>
      <template #default="{ value }"
        ><s-tag>{{ value === 'high' ? 'High' : 'Normal' }}</s-tag></template
      >
      <template #edit="{ value, setValue }"
        ><s-select
          :model-value="String(value)"
          :options="options"
          label="Task priority"
          block
          @update:model-value="setValue"
      /></template>
    </s-table-column>
    <s-table-column title="Actions" :width="110" fixed="right">
      <template #default="{ row }"
        ><s-button size="small" flat @click.stop="table?.startEdit(row, 'name')"
          >Edit</s-button
        ></template
      >
    </s-table-column>
  </s-table>
</template>
