<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumn, TableRowDragResult, TableSort } from 'sax-design-vue'
const rows = ref(
  Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    name: `项目 ${index + 1}`,
    team: index % 2 ? '设计' : '研发',
  })),
)
const sorts = ref<TableSort[]>([])
const message = ref('拖动手柄，或聚焦手柄后按空格开始。')
const columns: TableColumn[] = [
  {
    field: 'name',
    title: '项目',
    width: 240,
    fixed: 'left',
    dragSort: true,
    sortable: true,
  },
  {
    field: 'team',
    title: '部门',
    minWidth: 180,
    filters: [
      { label: '设计', value: '设计' },
      { label: '研发', value: '研发' },
    ],
  },
  { field: 'id', title: 'ID', width: 100 },
]
const report = (result: TableRowDragResult) => {
  message.value = result.applied
    ? `已将 ${result.request!.row.name} 移至源数据第 ${result.request!.newIndex + 1} 位。`
    : '行顺序未改变。'
}
</script>

<template>
  <div class="row-drag-demo">
    <s-button size="small" flat :disabled="!sorts.length" @click="sorts = []"
      >清除排序后调整顺序</s-button
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
    <p>项目 3 不可拖动。筛选和分页始终保留完整源数组。</p>
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
