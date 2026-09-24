<script setup lang="ts">
import { reactive, ref } from 'vue'
import type {
  TableColumn,
  TableQueryConfig,
  TableQueryContext,
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
const queryConfig: TableQueryConfig = {
  model,
  reserveErrorSpace: false,
  fixedButtons: ['submit', 'reset', 'more'],
  items: [
    {
      field: 'term',
      title: '项目名称',
      span: { xs: 24, md: 12 },
      itemRender: {
        name: '$input',
        props: { clearable: true },
      },
      rules: {
        validator: (value) =>
          String(value).length <= 20 || '最多输入 20 个字符。',
      },
    },
    {
      field: 'team',
      title: '部门',
      visible: false,
      span: { xs: 24, md: 12 },
      itemRender: {
        name: '$select',
        props: { clearable: true },
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
  {
    field: 'name',
    title: '项目',
    minWidth: 220,
    sortable: true,
    slots: { default: 'projectNameCell' },
  },
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
const search = (context: TableQueryContext) => {
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
  <div class="table-basic-demo">
    <s-table
      v-model:highlight="highlighted"
      :data="rows"
      :columns="columns"
      :query-config="queryConfig"
      :toolbar-config="{
        title: '项目列表',
        left: [
          {
            itemRender: 'button',
            props: { content: '查看选择', code: 'selection' },
          },
          {
            itemRender: 'button',
            props: {
              content: '更多',
              children: [
                { content: '归档', code: 'archive', icon: 'cb:archive' },
                { content: '删除', code: 'delete', icon: 'cb:close' },
              ],
            },
          },
        ],
        right: [{ itemRender: '$refresh' }, { itemRender: '$columnConfig' }],
      }"
      :pager-config="{ pageSize: 3 }"
      resize-config
      @query="search"
      @toolbar-click="action"
    >
      <template #projectNameCell="{ value }"
        ><strong>{{ value }}</strong></template
      >
    </s-table>
    <p role="status">{{ message }}</p>
  </div>
</template>

<style scoped>
.table-basic-demo {
  width: 100%;
}
</style>
