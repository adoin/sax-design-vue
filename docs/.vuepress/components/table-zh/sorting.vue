<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumn, TableSort } from 'sax-design-vue'
const sorts = ref<TableSort[]>([])
const rows = [
  { id: 1, name: '任务 10', team: '设计', score: 85 },
  { id: 2, name: '任务 2', team: '研发', score: 96 },
  { id: 3, name: '任务 1', team: '设计', score: 96 },
  { id: 4, name: '任务 3', team: '研发', score: null },
]
const columns: TableColumn[] = [
  { field: 'name', title: '任务', sortable: true },
  { field: 'team', title: '团队', sortable: true, sortMethod: 'string' },
  {
    field: 'score',
    title: '评分',
    sortable: true,
    sortMethod: 'number',
    align: 'right',
  },
]
</script>

<template>
  <div class="table-example">
    <div class="table-controls">
      <s-button size="small" type="flat" @click="sorts = []">清除排序</s-button>
      <span
        >上三角升序，下三角降序，再点已选方向取消；至少两列参与排序时才显示优先级数字。</span
      >
    </div>
    <s-table
      v-model:sort-by="sorts"
      :data="rows"
      :columns="columns"
      :sort-config="{ multiple: true }"
      striped
    />
  </div>
</template>

<style scoped>
.table-example {
  width: 100%;
}
.table-controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 0.85rem;
}
</style>
