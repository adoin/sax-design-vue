<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumn, TableFilters } from 'sax-design-vue'
const filters = ref<TableFilters>({})
const rows = [
  { id: 1, name: 'Avery', team: 'design', status: 'active' },
  { id: 2, name: 'Casey', team: 'dev', status: 'active' },
  { id: 3, name: 'Jordan', team: 'dev', status: 'paused' },
  { id: 4, name: 'Morgan', team: 'design', status: 'paused' },
]
const columns: TableColumn[] = [
  {
    field: 'name',
    title: 'Name',
    slots: { filter: 'nameFilter' },
    filterMethod: ({ value, values }) =>
      String(value)
        .toLowerCase()
        .includes(String(values[0] ?? '').toLowerCase()),
  },
  {
    field: 'team',
    title: 'Team',
    filters: [
      { label: 'Design', value: 'design' },
      { label: 'Engineering', value: 'dev' },
    ],
    cell: ({ value }) => (value === 'design' ? 'Design' : 'Engineering'),
  },
  {
    field: 'status',
    title: 'Status',
    filterMultiple: false,
    filters: [
      { label: 'Active', value: 'active' },
      { label: 'Paused', value: 'paused' },
    ],
    cell: ({ value }) => (value === 'active' ? 'Active' : 'Paused'),
  },
]
</script>

<template>
  <div class="table-example">
    <s-button size="small" type="flat" @click="filters = {}"
      >Clear all filters</s-button
    >
    <s-table v-model:filters="filters" :data="rows" :columns="columns" striped>
      <template #nameFilter="{ values, setValues }">
        <s-input
          :model-value="String(values[0] ?? '')"
          placeholder="Enter a name"
          aria-label="Name keyword"
          @update:model-value="setValues($event ? [String($event)] : [])"
        />
      </template>
    </s-table>
  </div>
</template>

<style scoped>
.table-example {
  display: grid;
  width: 100%;
  gap: 16px;
  justify-items: start;
}
</style>
