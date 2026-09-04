<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumn, TableRowDragResult, TableSort } from 'sax-design-vue'
const rows = ref(
  Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    name: `Project ${index + 1}`,
    team: index % 2 ? 'Design' : 'Engineering',
  })),
)
const sorts = ref<TableSort[]>([])
const message = ref('Drag a handle, or focus it and press Space to start.')
const columns: TableColumn[] = [
  {
    field: 'name',
    title: 'Project',
    width: 240,
    fixed: 'left',
    dragSort: true,
    sortable: true,
  },
  {
    field: 'team',
    title: 'Team',
    minWidth: 180,
    filters: [
      { label: 'Design', value: 'Design' },
      { label: 'Engineering', value: 'Engineering' },
    ],
  },
  { field: 'id', title: 'ID', width: 100 },
]
const report = (result: TableRowDragResult) => {
  message.value = result.applied
    ? `Moved ${result.request!.row.name} to source position ${result.request!.newIndex + 1}.`
    : 'The order was not changed.'
}
</script>

<template>
  <div class="row-drag-demo">
    <s-button size="small" flat :disabled="!sorts.length" @click="sorts = []"
      >Clear sorting to reorder</s-button
    >
    <s-table
      v-model:data="rows"
      v-model:sort-by="sorts"
      :columns="columns"
      :pager-config="{ pageSize: 5 }"
      :row-drag-config="{ checkMethod: ({ row }) => row.id !== 3 }"
      striped
      @row-drag-end="report"
    />
    <p role="status">{{ message }}</p>
    <p>
      Project 3 cannot be picked up. Filtering and paging keep the complete
      source array.
    </p>
  </div>
</template>

<style scoped>
.row-drag-demo {
  width: 100%;
}
.row-drag-demo > .s-button {
  margin-bottom: 12px;
}
.row-drag-demo > p {
  margin: 12px 0 0;
}
</style>
