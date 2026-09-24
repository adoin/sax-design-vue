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
  priority: 'High' | 'Medium' | 'Low'
  status: 'Open' | 'Review' | 'Done'
  updatedAt: string
}

interface WorkItemQuery {
  keyword: string
  status: '' | WorkItemRow['status']
}

const size = shallowRef<TableSize>('default')
const sizeOptions = [
  { label: 'Small', value: 'small' },
  { label: 'Default', value: 'default' },
  { label: 'Large', value: 'large' },
]
const model = reactive<WorkItemQuery>({ keyword: '', status: '' })
const requests = shallowRef(0)
const lastAction = shallowRef('Choose a row action to inspect the renderer.')
const proxyState = shallowRef<TableProxyState>({
  loading: false,
  action: null,
  error: null,
  result: null,
})

const showAction = (action: string, params: unknown) => {
  const { row } = params as TableCellRenderParams<WorkItemRow>
  lastAction.value = `${action}: ${row.ticket}`
}

const columns: TableColumn<WorkItemRow>[] = [
  { field: 'id', title: 'ID', width: 76, fixed: 'left' },
  { field: 'ticket', title: 'Work item', minWidth: 210, sortable: true },
  { field: 'owner', title: 'Owner', width: 132 },
  {
    field: 'priority',
    title: 'Priority',
    width: 120,
    filters: [
      { label: 'High', value: 'High' },
      { label: 'Medium', value: 'Medium' },
      { label: 'Low', value: 'Low' },
    ],
    filterRender: {
      name: '$select',
      props: { multiple: true, placeholder: 'Priority' },
      options: [
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Low', value: 'Low' },
      ],
    },
  },
  { field: 'status', title: 'Status', width: 118 },
  {
    field: 'updatedAt',
    title: 'Updated',
    width: 136,
    sortable: true,
  },
  {
    key: 'actions',
    title: 'Actions',
    width: 176,
    fixed: 'right',
    renderer: {
      name: '$buttons',
      options: [
        { code: 'view', text: 'View' },
        { code: 'assign', text: 'Assign' },
        { code: 'close', text: 'Close', props: { color: 'danger' } },
      ],
      events: {
        view: (params) => showAction('View', params),
        assign: (params) => showAction('Assign', params),
        close: (params) => showAction('Close', params),
      },
    },
  },
]

const owners = ['Avery', 'Morgan', 'Riley', 'Jordan']
const priorities: WorkItemRow['priority'][] = ['High', 'Medium', 'Low']
const statuses: WorkItemRow['status'][] = ['Open', 'Review', 'Done']
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
          title: 'Ticket or owner',
          itemRender: {
            name: '$input',
            props: { clearable: true, placeholder: 'Search work items' },
          },
        },
        {
          field: 'status',
          title: 'Status',
          itemRender: {
            name: '$select',
            props: { clearable: true, placeholder: 'All statuses' },
            options: statuses.map((value) => ({ label: value, value })),
          },
        },
      ],
    },
    toolbarConfig: {
      title: 'Remote work queue',
      left: [{ itemRender: '$refresh', content: 'Refresh' }],
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
      <strong>Inherited table size</strong>
      <s-radio-group
        v-model="size"
        type="button"
        :options="sizeOptions"
        aria-label="Table size"
      />
    </div>

    <s-table v-bind="tableOptions" />

    <p class="table-size-demo__status" role="status">
      <span>
        {{
          proxyState.loading
            ? 'Loading from the simulated service…'
            : `Ready · ${requests} requests`
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
