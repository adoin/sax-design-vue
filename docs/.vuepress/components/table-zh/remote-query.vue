<script setup lang="ts">
import { ref, watch } from 'vue'
import type {
  TableColumn,
  TableFilters,
  TablePagerConfig,
  TableRow,
  TableSort,
} from 'sax-design-vue'
const sorts = ref<TableSort[]>([])
const filters = ref<TableFilters>({})
const pager = ref<TablePagerConfig>({
  remote: true,
  currentPage: 1,
  pageSize: 2,
  total: 3,
  pageSizes: [2, 3],
})
const loading = ref(false)
const data = ref<TableRow[]>([])
const source = [
  { id: 1, name: '林晓', score: 82, team: 'design' },
  { id: 2, name: '陈屿', score: 96, team: 'dev' },
  { id: 3, name: '周宁', score: 91, team: 'design' },
]
const columns: TableColumn[] = [
  { field: 'name', title: '姓名' },
  { field: 'score', title: '评分', sortable: true },
  {
    field: 'team',
    title: '团队',
    filters: [
      { label: '设计', value: 'design' },
      { label: '研发', value: 'dev' },
    ],
    cell: ({ value }) => (value === 'design' ? '设计' : '研发'),
  },
]
watch(
  [sorts, filters],
  () => {
    pager.value.currentPage = 1
  },
  { deep: true },
)
watch(
  [sorts, filters, () => pager.value.currentPage, () => pager.value.pageSize],
  ([nextSorts, nextFilters, page = 1, size = 2], _, onCleanup) => {
    loading.value = true
    const timer = setTimeout(() => {
      const result = source.filter(
        (row) =>
          !nextFilters.team?.length || nextFilters.team.includes(row.team),
      )
      const order = nextSorts[0]?.order
      if (order)
        result.sort((a, b) => (a.score - b.score) * (order === 'asc' ? 1 : -1))
      pager.value.total = result.length
      data.value = result.slice((page - 1) * size, page * size)
      loading.value = false
    }, 350)
    onCleanup(() => clearTimeout(timer))
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <s-table
    v-model:sort-by="sorts"
    v-model:filters="filters"
    v-model:pager-config="pager"
    :data="data"
    :columns="columns"
    :sort-config="{ remote: true }"
    :filter-config="{ remote: true }"
    :loading="loading"
    striped
  />
</template>
