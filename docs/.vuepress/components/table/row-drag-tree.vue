<script setup lang="ts">
import { ref } from 'vue'
import type { TableRow, TableRowDragResult } from 'sax-design-vue'
const rows = ref<TableRow[]>([
  { id: 1, name: 'Workspace', lazy: true },
  {
    id: 2,
    name: 'Documentation',
    children: [
      { id: 21, name: 'Introduction' },
      { id: 22, name: 'Examples' },
    ],
  },
])
const expanded = ref([2])
const message = ref(
  'Expand Workspace to load its children, then reorder siblings.',
)
const load = async () => [
  { id: 11, name: 'Components', note: 'Reusable controls and shared styles.' },
  {
    id: 12,
    name: 'Playground',
    note: 'Edit component examples directly in the browser.',
  },
  { id: 13, name: 'Release', note: 'Prepare the next release.' },
]
const report = (result: TableRowDragResult) => {
  message.value = result.applied
    ? 'Sibling order updated.'
    : 'Only siblings can be reordered.'
}
</script>

<template>
  <div class="row-drag-tree-demo">
    <s-table
      v-model:data="rows"
      v-model:expanded-keys="expanded"
      row-drag-config
      :tree-config="{ hasChildren: 'lazy', load }"
      :virtual-config="{ height: 260, dynamic: true, horizontal: true }"
      @row-drag-end="report"
    >
      <s-table-column
        field="name"
        title="Project"
        :width="240"
        fixed="left"
        tree-node
        drag-sort
      />
      <s-table-column field="note" title="Details" :min-width="350" />
      <s-table-column field="id" title="ID" :width="100" fixed="right" />
    </s-table>
    <p role="status">{{ message }}</p>
  </div>
</template>
