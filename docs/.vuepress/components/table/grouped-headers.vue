<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TableColumn, TableColumnState } from 'sax-design-vue'

const virtual = ref(false)
const columnState = ref<TableColumnState[]>([])
const rows = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  name: `Member ${index + 1}`,
  team: index % 2 ? 'Engineering' : 'Design',
  city: index % 2 ? 'London' : 'Paris',
  notes:
    index % 3
      ? 'Available for review'
      : 'Working across teams on the next release. Available for design and implementation reviews.',
  status: 'Active',
}))
const columns: TableColumn[] = [
  { field: 'id', title: 'ID', width: 72, fixed: 'left' },
  {
    title: 'Member profile',
    children: [
      { field: 'name', title: 'Name', minWidth: 160, sortable: true },
      {
        title: 'Organization',
        children: [
          {
            field: 'team',
            title: 'Team',
            minWidth: 150,
            filters: [
              { label: 'Design', value: 'Design' },
              { label: 'Engineering', value: 'Engineering' },
            ],
          },
          { field: 'city', title: 'City', minWidth: 140 },
        ],
      },
    ],
  },
  { field: 'notes', title: 'Notes', minWidth: 260 },
  { field: 'status', title: 'Status', width: 110, fixed: 'right' },
]
const visibleRows = computed(() => (virtual.value ? rows : rows.slice(0, 5)))
</script>

<template>
  <div class="grouped-demo">
    <s-checkbox v-model="virtual"
      >Virtual scrolling with dynamic row heights</s-checkbox
    >
    <s-button size="small" flat @click="columnState = []"
      >Reset columns</s-button
    >
    <s-table
      v-model:column-state="columnState"
      :data="visibleRows"
      :columns="columns"
      :virtual-config="
        virtual
          ? { height: 280, horizontal: true, dynamic: true, columnOverscan: 1 }
          : false
      "
      column-manager-config
      resize-config
      row-key="id"
    />
  </div>
</template>

<style scoped>
.grouped-demo {
  width: 100%;
}
.grouped-demo > .s-table-wrapper {
  margin-top: 16px;
}
</style>
