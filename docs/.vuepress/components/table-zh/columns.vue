<script setup lang="ts">
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
  <s-table :data="rows" row-key="id">
    <s-table-column type="seq" title="序号" :width="72" align="right" />
    <s-table-column field="name" title="项目" :min-width="190" />
    <s-table-column field="owner" title="负责人" :min-width="140" />
    <s-table-column field="status" title="状态" :width="130">
      <template #default="{ value }">
        <s-tag :color="value === '进行中' ? 'success' : 'warn'">
          {{ value }}
        </s-tag>
      </template>
    </s-table-column>
  </s-table>
</template>
