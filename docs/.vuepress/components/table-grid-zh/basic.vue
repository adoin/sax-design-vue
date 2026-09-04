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
  name: `项目 ${index + 1}`,
  team: index % 2 ? '设计' : '研发',
}))
const rows = ref(allRows)
const highlighted = ref<TableRow | null>(null)
const model = reactive({ term: '', team: '' })
const message = ref('修改条件后点击查询。')
const queryConfig: TableGridQueryConfig = {
  model,
  labelPosition: 'top',
  reserveErrorSpace: false,
  items: [
    {
      field: 'term',
      title: '项目名称',
      span: { xs: 24, md: 12 },
      itemRender: {
        name: 'SInput',
        component: SInput,
        props: { block: true, clearable: true },
      },
      rules: {
        validator: (value) =>
          String(value).length <= 20 || '最多输入 20 个字符。',
      },
    },
    {
      field: 'team',
      title: '部门',
      span: { xs: 24, md: 12 },
      itemRender: {
        name: 'SSelect',
        component: SSelect,
        props: { block: true, clearable: true },
        options: [
          { label: '全部部门', value: '' },
          { label: '设计', value: '设计' },
          { label: '研发', value: '研发' },
        ],
      },
    },
  ],
}
const columns: TableColumn[] = [
  { field: 'id', title: 'ID', width: 80, fixed: 'left' },
  { field: 'name', title: '项目', minWidth: 220, sortable: true },
  {
    field: 'team',
    title: '部门',
    width: 160,
    filters: [
      { label: '设计', value: '设计' },
      { label: '研发', value: '研发' },
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
  message.value = `${rows.value.length} 个符合条件的项目。`
}
const action = () => {
  message.value = highlighted.value
    ? `当前选择： ${highlighted.value.name}`
    : '请先选择一行。'
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
        title: '项目列表',
        buttons: [{ code: 'selection', text: '查看选择' }],
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
