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
    filterRender: {
      name: '$input',
      props: { placeholder: '输入姓名', 'aria-label': '姓名关键字' },
    },
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
    filterRender: {
      name: '$radio',
      options: [
        { label: '活跃', value: 'active' },
        { label: '暂停', value: 'paused' },
      ],
    },
    filterMethod: ({ value, values }) => value === values[0],
    cell: ({ value }) => (value === 'active' ? '活跃' : '暂停'),
  },
]
</script>

<template>
  <div class="table-example">
    <s-button size="small" type="flat" @click="filters = {}"
      >清除全部筛选</s-button
    >
    <s-table
      v-model:filters="filters"
      :data="rows"
      :columns="columns"
      striped
    />
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
