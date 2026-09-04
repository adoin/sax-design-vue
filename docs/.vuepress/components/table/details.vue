<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumn, TableRowKey } from 'sax-design-vue'

const expanded = ref<TableRowKey[]>([1])
const treeKeys = ref<TableRowKey[]>([])
const virtual = ref(false)
const notes = ref<Record<string, string>>({})
const showItems = ref(true)
const rows = [
  {
    id: 1,
    name: 'Design workspace',
    owner: 'Alex',
    children: [{ id: 3, name: 'Mobile layouts', owner: 'Morgan' }],
  },
  { id: 2, name: 'Component library', owner: 'Sam' },
]
const columns: TableColumn[] = [
  { key: 'details', type: 'expand', width: 56, fixed: 'left' },
  { field: 'name', title: 'Project', treeNode: true, minWidth: 260 },
  { field: 'owner', title: 'Owner', minWidth: 140 },
  { field: 'id', title: 'ID', width: 80, fixed: 'right' },
]
const itemColumns: TableColumn[] = [
  { field: 'task', title: 'Task', minWidth: 160 },
  { field: 'status', title: 'Status', minWidth: 120 },
]
const items = [
  { task: 'Review specifications', status: 'In progress' },
  { task: 'Prepare preview', status: 'Planned' },
]
</script>

<template>
  <div class="details-demo">
    <div class="details-demo__controls">
      <s-checkbox v-model="virtual">Virtual rows</s-checkbox>
      <s-checkbox v-model="showItems">Show related tasks</s-checkbox>
      <s-button size="small" flat @click="expanded = []"
        >Close all details</s-button
      >
    </div>
    <s-table
      v-model:detail-expanded-keys="expanded"
      v-model:expanded-keys="treeKeys"
      :data="rows"
      :columns="columns"
      :tree-config="{}"
      :virtual-config="virtual ? { height: 260, horizontal: true } : false"
      row-key="id"
    >
      <template #detail="{ row, close }">
        <div class="details-demo__panel">
          <strong>{{ row.name }}</strong>
          <s-input
            v-model="notes[row.id]"
            label="Project notes"
            placeholder="Add a note"
            block
          />
          <s-table v-if="showItems" :data="items" :columns="itemColumns" />
          <s-button size="small" flat @click="close">Close details</s-button>
        </div>
      </template>
    </s-table>
  </div>
</template>

<style scoped>
.details-demo {
  width: 100%;
}
.details-demo__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
  align-items: center;
}
.details-demo__panel {
  display: grid;
  gap: 16px;
}
.details-demo__panel > .s-button {
  justify-self: start;
}
</style>
