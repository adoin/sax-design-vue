<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumn, TableFlatRow } from 'sax-design-vue'
const loading = ref(false)
const empty = ref(false)
const showHeader = ref(true)
const rows = [
  { id: 1, member: { name: 'Avery' }, status: 'Ready', attention: false },
  { id: 2, member: { name: 'Casey' }, status: 'Needs review', attention: true },
]
const columns: TableColumn[] = [
  { field: 'id', title: '#', width: 70 },
  { field: 'member.name', title: 'Member (nested field)' },
  { field: 'status', title: 'Status' },
]
const rowClass = ({ row }: TableFlatRow) =>
  row.attention ? 'attention-row' : ''
</script>

<template>
  <div class="states-example">
    <div class="table-controls">
      <span class="state-control"
        >Loading<s-switch v-model="loading" aria-label="Loading"
      /></span>
      <span class="state-control"
        >Empty data<s-switch v-model="empty" aria-label="Empty data"
      /></span>
      <span class="state-control"
        >Show header<s-switch v-model="showHeader" aria-label="Show header"
      /></span>
    </div>
    <s-table
      :data="empty ? [] : rows"
      :columns="columns"
      :loading="loading"
      :show-header="showHeader"
      :row-class="rowClass"
    >
      <template #header><strong>Member review list</strong></template>
      <template #footer>Records: {{ empty ? 0 : rows.length }}</template>
      <template #notFound>
        <div class="empty-content">
          <span>No records to display</span
          ><s-button size="small" type="flat" @click="empty = false"
            >Restore sample data</s-button
          >
        </div>
      </template>
    </s-table>
  </div>
</template>

<style scoped>
.states-example {
  width: 100%;
}
.table-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
  margin-bottom: 16px;
}
.state-control {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.empty-content {
  display: flex;
  align-items: center;
  gap: 12px;
}
:deep(.attention-row) {
  --s-table-row-surface: color-mix(
    in srgb,
    hsl(var(--sax-warn)) 12%,
    hsl(var(--sax-background))
  );
}
</style>
