<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumn, TableFilters } from 'sax-design-vue'
const filters = ref<TableFilters>({})
const rows = [
  { id: 1, name: '林晓', team: 'design', status: 'active' },
  { id: 2, name: '陈屿', team: 'dev', status: 'active' },
  { id: 3, name: '周宁', team: 'dev', status: 'paused' },
  { id: 4, name: '苏禾', team: 'design', status: 'paused' },
]
const columns: TableColumn[] = [
  {
    field: 'name',
    title: '姓名',
    slots: { filter: 'nameFilter' },
    filterMethod: ({ value, values }) =>
      String(value)
        .toLowerCase()
        .includes(String(values[0] ?? '').toLowerCase()),
  },
  {
    field: 'team',
    title: '团队',
    filters: [
      { label: '设计', value: 'design' },
      { label: '研发', value: 'dev' },
    ],
    cell: ({ value }) => (value === 'design' ? '设计' : '研发'),
  },
  {
    field: 'status',
    title: '状态',
    filterMultiple: false,
    filters: [
      { label: '活跃', value: 'active' },
      { label: '暂停', value: 'paused' },
    ],
    cell: ({ value }) => (value === 'active' ? '活跃' : '暂停'),
  },
]
</script>

<template>
  <div class="table-example">
    <s-button size="small" type="flat" @click="filters = {}"
      >清除全部筛选</s-button
    >
    <s-table v-model:filters="filters" :data="rows" :columns="columns" striped>
      <template #nameFilter="{ values, setValues }">
        <s-input
          :model-value="String(values[0] ?? '')"
          placeholder="输入姓名关键字"
          aria-label="姓名关键字"
          @update:model-value="setValues($event ? [String($event)] : [])"
        />
      </template>
    </s-table>
  </div>
</template>

<style scoped>
.table-example {
  display: grid;
  width: 100%;
  gap: 16px;
  justify-items: start;
}
</style>
