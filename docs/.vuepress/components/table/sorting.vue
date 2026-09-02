<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumn, TableSort } from 'sax-design-vue'
const sorts = ref<TableSort[]>([])
const rows = [
  { id: 1, name: 'Task 10', team: 'Design', score: 85 },
  { id: 2, name: 'Task 2', team: 'Engineering', score: 96 },
  { id: 3, name: 'Task 1', team: 'Design', score: 96 },
  { id: 4, name: 'Task 3', team: 'Engineering', score: null },
]
const columns: TableColumn[] = [
  { field: 'name', title: 'Task', sortable: true },
  { field: 'team', title: 'Team', sortable: true, sortMethod: 'string' },
  {
    field: 'score',
    title: 'Score',
    sortable: true,
    sortMethod: 'number',
    align: 'right',
  },
]
</script>

<template>
  <div class="table-example">
    <div class="table-controls">
      <s-button size="small" type="flat" @click="sorts = []"
        >Clear sorting</s-button
      >
      <span
        >Up sorts ascending, down sorts descending; click the active arrow to
        clear. Priority numbers appear only when two or more columns are
        sorted.</span
      >
    </div>
    <s-table
      v-model:sort-by="sorts"
      :data="rows"
      :columns="columns"
      :sort-config="{ multiple: true }"
      striped
    />
  </div>
</template>

<style scoped>
.table-example {
  width: 100%;
}
.table-controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 0.85rem;
}
</style>
