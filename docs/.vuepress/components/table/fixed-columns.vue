<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumn, TableInstance } from 'sax-design-vue'
const table = ref<TableInstance>()
const rows = Array.from({ length: 5 }, (_, index) => ({
  id: index + 1,
  name: `Member ${index + 1}`,
  team: 'Engineering',
  project: 'Workspace',
  city: 'Shanghai',
  email: `member${index + 1}@example.com`,
  status: 'Active',
}))
const columns: TableColumn[] = [
  { field: 'name', title: 'Member', width: 120, fixed: 'left' },
  { field: 'team', title: 'Team', width: 170 },
  { field: 'project', title: 'Project', width: 190 },
  { field: 'city', title: 'Location', width: 140 },
  { field: 'email', title: 'Email', width: 260 },
  { field: 'status', title: 'Status', width: 100, fixed: 'right' },
]
</script>

<template>
  <div class="fixed-example">
    <div class="table-controls">
      <s-button
        size="small"
        type="flat"
        @click="table?.scrollToColumn('team', 'start')"
        >Go to start</s-button
      >
      <s-button
        size="small"
        type="flat"
        @click="table?.scrollToColumn('email', 'end')"
        >Go to email</s-button
      >
      <s-button
        size="small"
        type="flat"
        @click="table?.scrollToRow(rows[4], 'center')"
        >Go to last row</s-button
      >
    </div>
    <s-table
      ref="table"
      :data="rows"
      :columns="columns"
      striped
      show-overflow
    />
  </div>
</template>

<style scoped>
.fixed-example {
  width: 100%;
}
.table-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}
</style>
