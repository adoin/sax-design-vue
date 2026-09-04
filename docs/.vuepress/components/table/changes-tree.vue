<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import type {
  TableColumn,
  TableDataMutationResult,
  TableExposes,
  TableRow,
} from 'sax-design-vue'

const table = ref<TableExposes>()
const rows = ref<TableRow[]>([
  { id: 1, name: 'Workspace', lazy: true },
  { id: 5, name: 'Independent project' },
])
const loaded = ref(false)
const expanded = ref<number[]>([])
const virtual = ref(true)
const busy = ref(false)
const count = shallowRef(0)
const message = ref(
  'Load the branch, then update, insert or remove its records.',
)
const nextId = ref(10)
const columns: TableColumn[] = [
  { field: 'name', title: 'Name', width: 260, fixed: 'left', treeNode: true },
  { field: 'note', title: 'Notes', minWidth: 440 },
  { field: 'id', title: 'ID', width: 90, fixed: 'right' },
]
const load = async () => [
  {
    id: 2,
    name: 'Component group',
    children: [
      {
        id: 3,
        name: 'Buttons',
        note: 'A loaded descendant can be changed while its parent remains unchanged.',
      },
    ],
  },
]
const expand = async () => {
  if (!table.value || !rows.value[0] || rows.value[0].id !== 1) return
  await table.value.toggleRowExpand(rows.value[0], true)
  expanded.value = [1, 2]
  loaded.value = true
}
const refresh = () => {
  const records = table.value?.getChangeRecords()
  if (records)
    count.value =
      records.inserted.length + records.updated.length + records.removed.length
}
const run = async (
  action: () => Promise<TableDataMutationResult> | undefined,
) => {
  busy.value = true
  try {
    const result = await action()
    message.value = result?.applied
      ? 'Change applied.'
      : 'The target is unavailable. Restore or load the branch first.'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="changes-tree">
    <div class="changes-tree__controls">
      <s-button size="small" :disabled="busy" @click="expand"
        >Load and expand</s-button
      >
      <s-button
        size="small"
        :disabled="busy || !loaded"
        @click="run(() => table?.updateRow(3, { name: 'Updated buttons' }))"
        >Update descendant</s-button
      >
      <s-button
        size="small"
        :disabled="busy || !loaded"
        @click="
          run(() =>
            table?.insertRows([{ id: nextId++, name: 'New component' }], {
              parentKey: 2,
            }),
          )
        "
        >Insert child</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="busy"
        @click="run(() => table?.removeRows([1]))"
        >Remove branch</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="busy"
        @click="run(() => table?.revertChanges([1]))"
        >Revert branch</s-button
      >
      <s-checkbox v-model="virtual">Virtual scrolling</s-checkbox>
      <s-tag>Changed rows: {{ count }}</s-tag>
    </div>
    <s-table
      ref="table"
      v-model:data="rows"
      v-model:expanded-keys="expanded"
      :columns="columns"
      :tree-config="{ hasChildren: 'lazy', load }"
      :virtual-config="
        virtual ? { height: 220, dynamic: true, horizontal: true } : false
      "
      change-config
      @changes-change="refresh"
    />
    <p role="status">{{ message }}</p>
  </div>
</template>

<style scoped>
.changes-tree {
  width: 100%;
}
.changes-tree__controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}
</style>
