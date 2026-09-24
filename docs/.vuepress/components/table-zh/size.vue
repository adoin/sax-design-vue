<script setup lang="ts">
import { computed, reactive, shallowRef } from 'vue'
import type {
  SaxGridSetting,
  TableCellRenderParams,
  TableColumn,
  TableProxyConfig,
  TableProxyState,
  TableSize,
} from 'sax-design-vue'

interface WorkItemRow {
  id: number
  ticket: string
  owner: string
  priority: '高' | '中' | '低'
  status: '待处理' | '审核中' | '已完成'
  updatedAt: string
}

interface WorkItemQuery {
  keyword: string
  status: '' | WorkItemRow['status']
}

const size = shallowRef<TableSize>('default')
const sizeOptions = [
  { label: '小号', value: 'small' },
  { label: '默认', value: 'default' },
  { label: '大号', value: 'large' },
]
const model = reactive<WorkItemQuery>({ keyword: '', status: '' })
const requests = shallowRef(0)
const lastAction = shallowRef('请选择一项行操作，查看渲染器的尺寸变化。')
const proxyState = shallowRef<TableProxyState>({
  loading: false,
  action: null,
  error: null,
  result: null,
})

const showAction = (action: string, params: unknown) => {
  const { row } = params as TableCellRenderParams<WorkItemRow>
  lastAction.value = `${action}：${row.ticket}`
}

const columns: TableColumn<WorkItemRow>[] = [
  { field: 'id', title: 'ID', width: 76, fixed: 'left' },
  { field: 'ticket', title: '工作项', minWidth: 210, sortable: true },
  { field: 'owner', title: '负责人', width: 132 },
  {
    field: 'priority',
    title: '优先级',
    width: 120,
    filters: [
      { label: '高', value: '高' },
      { label: '中', value: '中' },
      { label: '低', value: '低' },
    ],
    filterRender: {
      name: '$select',
      props: { multiple: true, placeholder: '优先级' },
      options: [
        { label: '高', value: '高' },
        { label: '中', value: '中' },
        { label: '低', value: '低' },
      ],
    },
  },
  { field: 'status', title: '状态', width: 118 },
  {
    field: 'updatedAt',
    title: '更新时间',
    width: 136,
    sortable: true,
  },
  {
    key: 'actions',
    title: '操作',
    width: 176,
    fixed: 'right',
    renderer: {
      name: '$buttons',
      options: [
        { code: 'view', text: '查看' },
        { code: 'assign', text: '分派' },
        { code: 'close', text: '关闭', props: { color: 'danger' } },
      ],
      events: {
        view: (params) => showAction('查看', params),
        assign: (params) => showAction('分派', params),
        close: (params) => showAction('关闭', params),
      },
    },
  },
]

const owners = ['林晓', '陈屿', '周宁', '许澄']
const priorities: WorkItemRow['priority'][] = ['高', '中', '低']
const statuses: WorkItemRow['status'][] = ['待处理', '审核中', '已完成']
const serviceRows: WorkItemRow[] = Array.from({ length: 48 }, (_, index) => ({
  id: index + 1,
  ticket: `SAX-${String(index + 1).padStart(3, '0')}`,
  owner: owners[index % owners.length],
  priority: priorities[index % priorities.length],
  status: statuses[index % statuses.length],
  updatedAt: `2026-09-${String((index % 22) + 1).padStart(2, '0')}`,
}))

const pause = (signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer)
      reject(signal.reason)
    }
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', abort)
      resolve()
    }, 350)
    if (signal.aborted) abort()
    else signal.addEventListener('abort', abort, { once: true })
  })

const proxyConfig: TableProxyConfig<WorkItemRow, WorkItemQuery> = {
  async query({ form, pager, sortBy, filters, signal }) {
    requests.value++
    await pause(signal)
    const keyword = form.keyword.trim().toLowerCase()
    let matched = serviceRows.filter(
      (row) =>
        (!keyword ||
          row.ticket.toLowerCase().includes(keyword) ||
          row.owner.toLowerCase().includes(keyword)) &&
        (!form.status || row.status === form.status) &&
        (!filters.priority?.length || filters.priority.includes(row.priority)),
    )
    const sort = sortBy[0]
    if (sort) {
      matched = [...matched].sort((left, right) => {
        const field = sort.field as keyof WorkItemRow
        return (
          String(left[field]).localeCompare(String(right[field])) *
          (sort.order === 'desc' ? -1 : 1)
        )
      })
    }
    const pageSize = pager ? (pager.pageSize ?? 6) : matched.length
    const start = pager ? ((pager.currentPage ?? 1) - 1) * pageSize : 0
    return {
      data: matched.slice(start, start + pageSize).map((row) => ({ ...row })),
      total: matched.length,
    }
  },
}

const tableOptions = computed<SaxGridSetting<WorkItemRow, WorkItemQuery>>(
  () => ({
    size: size.value,
    rowKey: 'id',
    columns,
    proxyConfig,
    queryConfig: {
      model,
      reserveErrorSpace: false,
      items: [
        {
          field: 'keyword',
          title: '编号或负责人',
          itemRender: {
            name: '$input',
            props: { clearable: true, placeholder: '搜索工作项' },
          },
        },
        {
          field: 'status',
          title: '状态',
          itemRender: {
            name: '$select',
            props: { clearable: true, placeholder: '全部状态' },
            options: statuses.map((value) => ({ label: value, value })),
          },
        },
      ],
    },
    toolbarConfig: {
      title: '远程工作队列',
      left: [{ itemRender: '$refresh', content: '刷新' }],
      right: [{ itemRender: '$find' }, { itemRender: '$columnConfig' }],
    },
    pagerConfig: { pageSize: 6, pageSizes: [6, 12, 24] },
    findConfig: true,
    resizeConfig: true,
    onProxyStateChange: (next) => (proxyState.value = next),
  }),
)
</script>

<template>
  <div class="table-size-demo">
    <div class="table-size-demo__controls">
      <strong>表格继承尺寸</strong>
      <s-radio-group
        v-model="size"
        type="button"
        :options="sizeOptions"
        aria-label="表格尺寸"
      />
    </div>

    <s-table v-bind="tableOptions" />

    <p class="table-size-demo__status" role="status">
      <span>
        {{
          proxyState.loading
            ? '正在从模拟服务加载…'
            : `就绪 · 已请求 ${requests} 次`
        }}
      </span>
      <span>{{ lastAction }}</span>
    </p>
  </div>
</template>

<style scoped>
.table-size-demo {
  display: grid;
  gap: 14px;
  width: 100%;
}

.table-size-demo__controls,
.table-size-demo__status {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 16px;
}

.table-size-demo__status {
  margin: 0;
  color: var(--sax-css-text-color-secondary);
}
</style>
