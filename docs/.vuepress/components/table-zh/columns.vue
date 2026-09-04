<script setup lang="ts">
import { shallowRef } from 'vue'

const fields = shallowRef([
  { field: 'name', title: '项目', minWidth: 190 },
  { field: 'owner', title: '负责人', minWidth: 140 },
])
const customStatus = shallowRef(true)
interface ProjectRow {
  id: number
  name: string
  owner: string
  status: '进行中' | '规划中'
  [key: string]: unknown
}

const rows: ProjectRow[] = [
  { id: 1, name: '设计系统', owner: '林晓', status: '进行中' },
  { id: 2, name: '移动工作台', owner: '陈屿', status: '规划中' },
  { id: 3, name: '数据分析', owner: '周宁', status: '进行中' },
]
</script>

<template>
  <s-table class="column-order-demo" :data="rows" row-key="id">
    <template #header>
      <div class="column-order-demo__controls">
        <s-button size="small" @click="fields = [...fields].reverse()"
          >反转列顺序</s-button
        >
        <s-checkbox v-model="customStatus">自定义状态单元格</s-checkbox>
      </div>
    </template>
    <s-table-column type="seq" title="序号" :width="72" align="right" />
    <s-table-column
      v-for="column in fields"
      :key="column.field"
      v-bind="column"
    />
    <s-table-column field="status" title="状态" :width="130">
      <template v-if="customStatus" #default="{ value }">
        <s-tag :color="value === '进行中' ? 'success' : 'warn'">
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
