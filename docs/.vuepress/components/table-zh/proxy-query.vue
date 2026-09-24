<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type {
  SaxGridSetting,
  TableColumn,
  TableExposes,
  TableProxyConfig,
  TableProxyState,
} from 'sax-design-vue'

interface ProjectRow {
  id: number
  name: string
  team: '设计' | '研发'
}

interface ProjectQueryForm {
  term: string
}

const table = ref<TableExposes<ProjectRow, ProjectQueryForm>>()
const model = reactive<ProjectQueryForm>({ term: '' })
const failNext = ref(false)
const state = ref<TableProxyState>({
  loading: false,
  action: null,
  error: null,
  result: null,
})
const requests = ref(0)
const columns: TableColumn<ProjectRow>[] = [
  { field: 'id', title: 'ID', width: 90, fixed: 'left' },
  { field: 'name', title: '项目', minWidth: 240, sortable: true },
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
const serviceRows: ProjectRow[] = Array.from({ length: 500 }, (_, index) => ({
  id: index + 1,
  name: `项目 ${String(index + 1).padStart(3, '0')}`,
  team: index % 2 ? '设计' : '研发',
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
    }, 600)
    if (signal.aborted) abort()
    else signal.addEventListener('abort', abort, { once: true })
  })
const proxyConfig: TableProxyConfig<ProjectRow, ProjectQueryForm> = {
  async query({ form, pager, sortBy, filters, signal }) {
    requests.value++
    const shouldFail = failNext.value
    failNext.value = false
    await pause(signal)
    if (shouldFail) throw new Error('模拟服务暂不可用。')
    let matched = serviceRows.filter(
      (row) =>
        row.name
          .toLowerCase()
          .includes(String(form.term ?? '').toLowerCase()) &&
        (!filters.team?.length || filters.team.includes(row.team)),
    )
    const sort = sortBy.find((item) => item.field === 'name')
    if (sort)
      matched = [...matched].sort(
        (a, b) =>
          a.name.localeCompare(b.name) * (sort.order === 'desc' ? -1 : 1),
      )
    const size = pager ? (pager.pageSize ?? 20) : matched.length
    const start = pager ? ((pager.currentPage ?? 1) - 1) * size : 0
    return {
      data: matched.slice(start, start + size).map((row) => ({ ...row })),
      total: matched.length,
    }
  },
}
const tableOptions = computed<SaxGridSetting<ProjectRow, ProjectQueryForm>>(
  () => ({
    columns,
    proxyConfig,
    queryConfig: {
      model,
      reserveErrorSpace: false,
      items: [
        {
          field: 'term',
          title: '项目名称',
          itemRender: {
            name: '$input',
            props: { clearable: true },
          },
        },
      ],
    },
    pagerConfig: { pageSize: 20, pageSizes: [20, 50, 100] },
    virtualConfig: { height: 260, dynamic: true, horizontal: true },
    toolbarConfig: { right: [{ itemRender: '$columnConfig' }] },
    resizeConfig: true,
    onProxyStateChange: (next) => (state.value = next),
  }),
)
</script>

<template>
  <div class="table-proxy-query-demo">
    <s-table ref="table" v-bind="tableOptions">
      <template #toolbar_left="{ refresh, cancelProxy, busy }">
        <s-button :disabled="busy" @click="refresh">刷新</s-button>
        <s-button flat :disabled="!busy" @click="cancelProxy"
          >取消请求</s-button
        >
        <s-checkbox v-model="failNext" :disabled="busy"
          >下次查询模拟失败</s-checkbox
        >
      </template>
    </s-table>
    <p role="status">
      {{
        state.loading
          ? '正在从模拟服务加载…'
          : state.result?.status === 'cancelled'
            ? '请求已取消，保留之前的数据。'
            : '就绪。'
      }}
      请求次数： {{ requests }}
    </p>
  </div>
</template>
