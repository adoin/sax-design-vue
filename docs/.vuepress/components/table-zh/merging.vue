<script setup lang="ts">
import { shallowRef } from 'vue'
import type { TableColumn, TableMergeConfig } from 'sax-design-vue'

const merged = shallowRef(true)
const rows = [
  { id: 1, team: '设计', project: '设计系统', owner: '小林', hours: 12 },
  { id: 2, team: '设计', project: '文档站点', owner: '小陈', hours: 8 },
  { id: 3, team: '研发', project: '工作台', owner: '小周', hours: 16 },
  { id: 4, team: '研发', project: '组件库', owner: '小李', hours: 10 },
]
const columns: TableColumn[] = [
  { field: 'team', title: '团队', width: 130, fixed: 'left' },
  { field: 'project', title: '项目', minWidth: 160 },
  { field: 'owner', title: '负责人', minWidth: 120 },
  { field: 'hours', title: '工时', width: 100, align: 'right' },
]
const footer = [{ team: '计划总工时', hours: 46 }]
const merges: TableMergeConfig = {
  body: [
    { row: 0, col: 0, rowspan: 2, colspan: 1 },
    { row: 2, col: 0, rowspan: 2, colspan: 1 },
  ],
  footer: [{ row: 0, col: 0, rowspan: 1, colspan: 3 }],
}
</script>

<template>
  <div class="merging-demo">
    <s-checkbox v-model="merged">合并单元格</s-checkbox>
    <s-table
      :data="rows"
      :columns="columns"
      :footer-data="footer"
      :merge-config="merged ? merges : false"
      row-key="id"
      keyboard-config
    />
  </div>
</template>

<style scoped>
.merging-demo {
  display: grid;
  gap: 16px;
  width: 100%;
  min-width: 0;
}
</style>
