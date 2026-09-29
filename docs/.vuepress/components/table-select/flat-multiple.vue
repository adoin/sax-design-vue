<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumn, TableRowKey } from 'sax-design-vue'
const value = ref<TableRowKey[]>(['design'])
const columns: TableColumn[] = [
  { field: 'name', title: 'Name' },
  { field: 'members', title: 'Members' },
]
const data = [
  { id: 'design', name: 'Design', members: 8 },
  { id: 'engineering', name: 'Engineering', members: 12 },
  { id: 'archive', name: 'Archive (disabled)', members: 3, disabled: true },
]
</script>

<template>
  <div>
    <s-table-select
      v-model="value"
      multiple
      :data="data"
      :columns="columns"
      row-key="id"
      label-key="name"
      clearable
      block
      :popup-config="{ width: 360 }"
      placeholder="Choose an option"
    />
    <p>Selected keys: {{ value ?? '—' }}</p>
  </div>
</template>
