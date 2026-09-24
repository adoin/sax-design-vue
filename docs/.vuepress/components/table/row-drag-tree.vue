<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import type {
  TableColumn,
  TableRowDragConfig,
  TableRowDragResult,
} from 'sax-design-vue'
interface ProjectRow {
  id: number
  name: string
  note: string
  kind: 'folder' | 'item'
  locked?: boolean
  children?: ProjectRow[]
}
const columns: TableColumn<ProjectRow>[] = [
  {
    field: 'name',
    title: 'Project',
    width: 240,
    fixed: 'left',
    treeNode: true,
    dragSort: true,
  },
  { field: 'note', title: 'Details', minWidth: 350 },
  { field: 'id', title: 'ID', width: 100, fixed: 'right' },
]
const rows = ref<ProjectRow[]>([
  {
    id: 1,
    name: 'Workspace',
    note: 'Application packages.',
    kind: 'folder',
    children: [
      { id: 11, name: 'Components', note: 'Reusable controls.', kind: 'item' },
      { id: 12, name: 'Playground', note: 'Live examples.', kind: 'item' },
    ],
  },
  {
    id: 2,
    name: 'Documentation',
    note: 'Developer guides.',
    kind: 'folder',
    children: [
      { id: 21, name: 'Introduction', note: 'Getting started.', kind: 'item' },
      { id: 22, name: 'Examples', note: 'Usage recipes.', kind: 'item' },
    ],
  },
  {
    id: 3,
    name: 'Archive',
    note: 'Locked branch.',
    kind: 'folder',
    locked: true,
  },
])
const expanded = ref([1, 2])
const message = shallowRef(
  'Drop on a folder center to reparent; its edges insert before or after.',
)
const rowDragConfig: TableRowDragConfig<ProjectRow> = {
  tree: {
    allowReparent: true,
    allowDropInside: true,
    maxDepth: 2,
    expandOnDrop: true,
  },
  draggableMethod: ({ row }) => !row.locked,
  dropMethod: ({ targetRow, position, targetChildCount }) =>
    !targetRow.locked && (position !== 'inside' || targetChildCount < 4),
}
const report = (result: TableRowDragResult<ProjectRow>) => {
  if (result.reason === 'cancelled') {
    message.value = 'Reordering cancelled.'
    return
  }
  if (!result.applied || !result.request) {
    message.value = 'That destination is not available.'
    return
  }
  const { row, targetRow, position, reparented } = result.request
  message.value = `${row.name} moved ${position} ${targetRow.name}${reparented ? ' under a different parent' : ''}.`
}
</script>

<template>
  <div class="row-drag-tree-demo">
    <s-table
      v-model:data="rows"
      v-model:expanded-keys="expanded"
      :columns="columns"
      :row-drag-config="rowDragConfig"
      :tree-config="{}"
      :virtual-config="{ height: 260, dynamic: true, horizontal: true }"
      @row-drag-end="report"
    />
    <p role="status">{{ message }}</p>
  </div>
</template>
