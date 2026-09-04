<script setup lang="ts">
import { reactive, ref } from 'vue'
import { SInput, SSelect } from 'sax-design-vue'
import type {
  TableColumn,
  TableGridQueryConfig,
  TableGridQueryContext,
  TableRow,
} from 'sax-design-vue'
const allRows: TableRow[] = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  name: `Project ${index + 1}`,
  team: index % 2 ? 'Design' : 'Engineering',
}))
const rows = ref(allRows)
const highlighted = ref<TableRow | null>(null)
const model = reactive({ term: '', team: '' })
const message = ref('Change the conditions, then select Search.')
const queryConfig: TableGridQueryConfig = {
  model,
  labelPosition: 'top',
  reserveErrorSpace: false,
  items: [
    {
      field: 'term',
      title: 'Project name',
      span: { xs: 24, md: 12 },
      itemRender: {
        name: 'SInput',
        component: SInput,
        props: { block: true, clearable: true },
      },
      rules: {
        validator: (value) =>
          String(value).length <= 20 || 'Use at most 20 characters.',
      },
    },
    {
      field: 'team',
      title: 'Team',
      span: { xs: 24, md: 12 },
      itemRender: {
        name: 'SSelect',
        component: SSelect,
        props: { block: true, clearable: true },
        options: [
          { label: 'All teams', value: '' },
          { label: 'Design', value: 'Design' },
          { label: 'Engineering', value: 'Engineering' },
        ],
      },
    },
  ],
}
const columns: TableColumn[] = [
  { field: 'id', title: 'ID', width: 80, fixed: 'left' },
  { field: 'name', title: 'Project', minWidth: 220, sortable: true },
  {
    field: 'team',
    title: 'Team',
    width: 160,
    filters: [
      { label: 'Design', value: 'Design' },
      { label: 'Engineering', value: 'Engineering' },
    ],
  },
]
const search = (context: TableGridQueryContext) => {
  const term = String(context.form.term ?? '').toLowerCase()
  const team = context.form.team
  rows.value = allRows.filter(
    (row) =>
      String(row.name).toLowerCase().includes(term) &&
      (!team || row.team === team),
  )
  message.value = `${rows.value.length} matching projects.`
}
const action = () => {
  message.value = highlighted.value
    ? `Selected: ${highlighted.value.name}`
    : 'Select a row first.'
}
</script>

<template>
  <div class="grid-basic-demo">
    <s-table-grid
      v-model:highlight="highlighted"
      :data="rows"
      :columns="columns"
      :query-config="queryConfig"
      :toolbar-config="{
        title: 'Projects',
        buttons: [{ code: 'selection', text: 'Show selection' }],
      }"
      :pager-config="{ pageSize: 3 }"
      column-manager-config
      resize-config
      @query="search"
      @toolbar-click="action"
    >
      <template #cell-name="{ value }"
        ><strong>{{ value }}</strong></template
      >
    </s-table-grid>
    <p role="status">{{ message }}</p>
  </div>
</template>

<style scoped>
.grid-basic-demo {
  width: 100%;
}
</style>
