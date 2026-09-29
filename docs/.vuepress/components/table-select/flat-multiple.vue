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
  <div class="table-select-example">
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
    <p class="table-select-example__result">
      <span>Selected keys</span><code>{{ value ?? '—' }}</code>
    </p>
  </div>
</template>

<style scoped>
.table-select-example {
  display: grid;
  gap: 20px;
  width: 100%;
  min-width: 0;
}
.table-select-example__result {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
  margin: 0;
}
.table-select-example__result code {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
</style>
