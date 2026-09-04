<script setup lang="ts">
import { shallowRef } from 'vue'
import type { TableColumn, TableMergeConfig } from 'sax-design-vue'

const merged = shallowRef(true)
const rows = [
  { id: 1, team: 'Design', project: 'Design system', owner: 'Alex', hours: 12 },
  { id: 2, team: 'Design', project: 'Documentation', owner: 'Sam', hours: 8 },
  {
    id: 3,
    team: 'Engineering',
    project: 'Workspace',
    owner: 'Morgan',
    hours: 16,
  },
  {
    id: 4,
    team: 'Engineering',
    project: 'Components',
    owner: 'Taylor',
    hours: 10,
  },
]
const columns: TableColumn[] = [
  { field: 'team', title: 'Team', width: 130, fixed: 'left' },
  { field: 'project', title: 'Project', minWidth: 160 },
  { field: 'owner', title: 'Owner', minWidth: 120 },
  { field: 'hours', title: 'Hours', width: 100, align: 'right' },
]
const footer = [{ team: 'Total planned hours', hours: 46 }]
const merges: TableMergeConfig = {
  body: [
    { row: 0, col: 0, rowspan: 2, colspan: 1 },
    { row: 2, col: 0, rowspan: 2, colspan: 1 },
  ],
  footer: [{ row: 0, col: 0, rowspan: 1, colspan: 3 }],
}
</script>

<template>
  <div class="merging-demo">
    <s-checkbox v-model="merged">Merge cells</s-checkbox>
    <s-table
      :data="rows"
      :columns="columns"
      :footer-data="footer"
      :merge-config="merged ? merges : false"
      row-key="id"
      keyboard-config
    />
  </div>
</template>

<style scoped>
.merging-demo {
  display: grid;
  gap: 16px;
  width: 100%;
  min-width: 0;
}
</style>
