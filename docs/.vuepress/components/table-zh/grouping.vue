<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import type {
  TableColumn,
  TableExposes,
  TableGroupConfig,
} from 'sax-design-vue'

const table = ref<TableExposes>()
const virtual = shallowRef(false)
const filteredSummary = shallowRef(false)
const rows = shallowRef([
  { id: 1, team: '设计', region: '东区', name: '工作区', hours: 8, rate: 50 },
  { id: 2, team: '研发', region: '西区', name: '搜索', hours: 12, rate: 60 },
  { id: 3, team: '设计', region: '东区', name: '组件', hours: 6, rate: 50 },
  { id: 4, team: '设计', region: '西区', name: '网站', hours: 10, rate: 55 },
  { id: 5, team: '研发', region: '东区', name: '分析', hours: 16, rate: 60 },
  { id: 6, team: '研发', region: '西区', name: '看板', hours: 9, rate: 65 },
])
const columns: TableColumn[] = [
  { field: 'team', title: '团队', width: 120, fixed: 'left' },
  { field: 'name', title: '项目', minWidth: 170 },
  { field: 'region', title: '区域', width: 110 },
  {
    field: 'hours',
    title: '工时',
    width: 100,
    sortable: true,
    editor: { type: 'number' },
  },
  {
    field: 'cost',
    title: '费用',
    width: 110,
    fixed: 'right',
    cell: ({ row }) => Number(row.hours) * Number(row.rate),
  },
]
const grouping = computed<TableGroupConfig>(() => ({
  fields: ['team', 'region'],
  subtotal: true,
  summary: true,
  summaryScope: filteredSummary.value ? 'filtered' : 'page',
  aggregates: [
    { key: 'hours', field: 'hours', method: 'sum' },
    {
      key: 'cost',
      method: {
        initial: () => 0,
        step: (state, { row }) =>
          Number(state) + Number(row.hours) * Number(row.rate),
      },
    },
  ],
}))
const expandAll = () => {
  const keys: string[] = []
  const visit = (groups: ReturnType<TableExposes['getGroups']>) => {
    for (const group of groups) {
      keys.push(group.key)
      visit(group.children)
    }
  }
  visit(table.value?.getGroups() ?? [])
  table.value?.setGroupExpandedKeys(keys)
}
</script>

<template>
  <div class="grouping-demo">
    <div class="grouping-demo__controls">
      <s-button size="small" @click="expandAll">全部展开</s-button>
      <s-button size="small" flat @click="table?.setGroupExpandedKeys([])"
        >全部收起</s-button
      >
      <s-checkbox v-model="virtual">虚拟行</s-checkbox>
      <s-checkbox v-model="filteredSummary">跨页汇总</s-checkbox>
    </div>
    <s-table
      ref="table"
      v-model:data="rows"
      :columns="columns"
      row-key="id"
      :group-config="grouping"
      :pager-config="{ pageSize: 4 }"
      :virtual-config="
        virtual ? { height: 320, dynamic: true, horizontal: true } : false
      "
      change-config
      edit-config
      keyboard-config
      resize-config
    >
      <template #group-header="{ group }"
        ><strong>{{ group.label }}</strong
        ><s-tag size="small">{{ group.rowCount }} 条记录</s-tag></template
      >
      <template #group-summary="{ column, value, group }"
        ><span>{{
          column.field === 'team' ? (group ? '小计' : '总计') : (value ?? '')
        }}</span></template
      >
    </s-table>
  </div>
</template>

<style scoped>
.grouping-demo {
  width: 100%;
  min-width: 0;
}
.grouping-demo__controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}
</style>
