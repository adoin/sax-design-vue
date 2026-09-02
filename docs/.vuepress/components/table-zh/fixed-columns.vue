<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumn, TableInstance } from 'sax-design-vue'
const table = ref<TableInstance>()
const rows = Array.from({ length: 5 }, (_, index) => ({
  id: index + 1,
  name: `成员 ${index + 1}`,
  team: '研发团队',
  project: '工作台项目',
  city: '上海',
  email: `member${index + 1}@example.com`,
  status: '活跃',
}))
const columns: TableColumn[] = [
  { field: 'name', title: '成员', width: 120, fixed: 'left' },
  { field: 'team', title: '团队', width: 170 },
  { field: 'project', title: '项目', width: 190 },
  { field: 'city', title: '地点', width: 140 },
  { field: 'email', title: '邮箱', width: 260 },
  { field: 'status', title: '状态', width: 100, fixed: 'right' },
]
</script>

<template>
  <div class="fixed-example">
    <div class="table-controls">
      <s-button
        size="small"
        type="flat"
        @click="table?.scrollToColumn('team', 'start')"
        >回到起点</s-button
      >
      <s-button
        size="small"
        type="flat"
        @click="table?.scrollToColumn('email', 'end')"
        >定位邮箱列</s-button
      >
      <s-button
        size="small"
        type="flat"
        @click="table?.scrollToRow(rows[4], 'center')"
        >定位最后一行</s-button
      >
    </div>
    <s-table
      ref="table"
      :data="rows"
      :columns="columns"
      striped
      show-overflow
    />
  </div>
</template>

<style scoped>
.fixed-example {
  width: 100%;
}
.table-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}
</style>
