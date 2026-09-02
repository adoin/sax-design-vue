<script setup lang="ts">
interface ProjectRow {
  id: number
  name: string
  owner: string
  status: 'Active' | 'Planning'
  [key: string]: unknown
}

const rows: ProjectRow[] = [
  { id: 1, name: 'Design system', owner: 'Leanne', status: 'Active' },
  { id: 2, name: 'Mobile workspace', owner: 'Ervin', status: 'Planning' },
  { id: 3, name: 'Analytics', owner: 'Clementine', status: 'Active' },
]
</script>

<template>
  <s-table :data="rows" row-key="id">
    <s-table-column type="seq" title="#" :width="64" align="right" />
    <s-table-column field="name" title="Project" :min-width="190" />
    <s-table-column field="owner" title="Owner" :min-width="140" />
    <s-table-column field="status" title="Status" :width="130">
      <template #default="{ value }">
        <s-tag :color="value === 'Active' ? 'success' : 'warn'">
          {{ value }}
        </s-tag>
      </template>
    </s-table-column>
  </s-table>
</template>
