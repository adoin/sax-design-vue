<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import type {
  TableColumn,
  TableExposes,
  TableGroupConfig,
} from 'sax-design-vue'

const table = ref<TableExposes>()
const virtual = shallowRef(false)
const filteredSummary = shallowRef(false)
const rows = shallowRef([
  {
    id: 1,
    team: 'Design',
    region: 'East',
    name: 'Workspace',
    hours: 8,
    rate: 50,
  },
  {
    id: 2,
    team: 'Engineering',
    region: 'West',
    name: 'Search',
    hours: 12,
    rate: 60,
  },
  {
    id: 3,
    team: 'Design',
    region: 'East',
    name: 'Components',
    hours: 6,
    rate: 50,
  },
  {
    id: 4,
    team: 'Design',
    region: 'West',
    name: 'Website',
    hours: 10,
    rate: 55,
  },
  {
    id: 5,
    team: 'Engineering',
    region: 'East',
    name: 'Analytics',
    hours: 16,
    rate: 60,
  },
  {
    id: 6,
    team: 'Engineering',
    region: 'West',
    name: 'Dashboard',
    hours: 9,
    rate: 65,
  },
])
const columns: TableColumn[] = [
  { field: 'team', title: 'Team', width: 120, fixed: 'left' },
  { field: 'name', title: 'Project', minWidth: 170 },
  { field: 'region', title: 'Region', width: 110 },
  {
    field: 'hours',
    title: 'Hours',
    width: 100,
    sortable: true,
    editor: { type: 'number' },
  },
  {
    field: 'cost',
    title: 'Cost',
    width: 110,
    fixed: 'right',
    cell: ({ row }) => Number(row.hours) * Number(row.rate),
  },
]
const grouping = computed<TableGroupConfig>(() => ({
  fields: ['team', 'region'],
  subtotal: true,
  summary: true,
  summaryScope: filteredSummary.value ? 'filtered' : 'page',
  aggregates: [
    { key: 'hours', field: 'hours', method: 'sum' },
    {
      key: 'cost',
      method: {
        initial: () => 0,
        step: (state, { row }) =>
          Number(state) + Number(row.hours) * Number(row.rate),
      },
    },
  ],
}))
const expandAll = () => {
  const keys: string[] = []
  const visit = (groups: ReturnType<TableExposes['getGroups']>) => {
    for (const group of groups) {
      keys.push(group.key)
      visit(group.children)
    }
  }
  visit(table.value?.getGroups() ?? [])
  table.value?.setGroupExpandedKeys(keys)
}
</script>

<template>
  <div class="grouping-demo">
    <div class="grouping-demo__controls">
      <s-button size="small" @click="expandAll">Expand all</s-button>
      <s-button size="small" flat @click="table?.setGroupExpandedKeys([])"
        >Collapse all</s-button
      >
      <s-checkbox v-model="virtual">Virtual rows</s-checkbox>
      <s-checkbox v-model="filteredSummary">Summary across pages</s-checkbox>
    </div>
    <s-table
      ref="table"
      v-model:data="rows"
      :columns="columns"
      row-key="id"
      :group-config="grouping"
      :pager-config="{ pageSize: 4 }"
      :virtual-config="
        virtual ? { height: 320, dynamic: true, horizontal: true } : false
      "
      change-config
      edit-config
      keyboard-config
      resize-config
    >
      <template #group-header="{ group }"
        ><strong>{{ group.label }}</strong
        ><s-tag size="small">{{ group.rowCount }} records</s-tag></template
      >
      <template #group-summary="{ column, value, group }"
        ><span>{{
          column.field === 'team'
            ? group
              ? 'Subtotal'
              : 'Total'
            : (value ?? '')
        }}</span></template
      >
    </s-table>
  </div>
</template>

<style scoped>
.grouping-demo {
  width: 100%;
  min-width: 0;
}
.grouping-demo__controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}
</style>
