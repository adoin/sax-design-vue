<script setup lang="ts">
import { shallowRef } from 'vue'

const fields = shallowRef([
  { field: 'name', title: 'Project', minWidth: 190 },
  { field: 'owner', title: 'Owner', minWidth: 140 },
])
const customStatus = shallowRef(true)
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
  <s-table class="column-order-demo" :data="rows" row-key="id">
    <template #header>
      <div class="column-order-demo__controls">
        <s-button size="small" @click="fields = [...fields].reverse()"
          >Reverse columns</s-button
        >
        <s-checkbox v-model="customStatus">Custom status cells</s-checkbox>
      </div>
    </template>
    <s-table-column type="seq" title="#" :width="64" align="right" />
    <s-table-column
      v-for="column in fields"
      :key="column.field"
      v-bind="column"
    />
    <s-table-column field="status" title="Status" :width="130">
      <template v-if="customStatus" #default="{ value }">
        <s-tag :color="value === 'Active' ? 'success' : 'warn'">
          {{ value }}
        </s-tag>
      </template>
    </s-table-column>
  </s-table>
</template>

<style scoped>
.column-order-demo__controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
