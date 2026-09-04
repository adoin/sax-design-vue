<script setup lang="ts">
import { reactive, ref } from 'vue'
import { SInput } from 'sax-design-vue'
import type {
  TableColumn,
  TableGridExposes,
  TableGridProxyConfig,
  TableGridProxyState,
} from 'sax-design-vue'

const grid = ref<TableGridExposes>()
const model = reactive({ term: '' })
const failNext = ref(false)
const state = ref<TableGridProxyState>({
  loading: false,
  action: null,
  error: null,
  result: null,
})
const requests = ref(0)
const columns: TableColumn[] = [
  { field: 'id', title: 'ID', width: 90, fixed: 'left' },
  { field: 'name', title: 'Project', minWidth: 240, sortable: true },
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
const serviceRows = Array.from({ length: 500 }, (_, index) => ({
  id: index + 1,
  name: `Project ${String(index + 1).padStart(3, '0')}`,
  team: index % 2 ? 'Design' : 'Engineering',
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
const proxyConfig: TableGridProxyConfig = {
  async query({ form, pager, sortBy, filters, signal }) {
    requests.value++
    const shouldFail = failNext.value
    failNext.value = false
    await pause(signal)
    if (shouldFail) throw new Error('The simulated service is unavailable.')
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
</script>

<template>
  <div class="grid-proxy-query-demo">
    <s-table-grid
      ref="grid"
      :columns="columns"
      :proxy-config="proxyConfig"
      :query-config="{
        model,
        labelPosition: 'top',
        reserveErrorSpace: false,
        items: [
          {
            field: 'term',
            title: 'Project name',
            itemRender: {
              name: 'SInput',
              component: SInput,
              props: { block: true, clearable: true },
            },
          },
        ],
      }"
      :pager-config="{ pageSize: 20, pageSizes: [20, 50, 100] }"
      :virtual-config="{ height: 260, dynamic: true, horizontal: true }"
      column-manager-config
      resize-config
      @proxy-state-change="state = $event"
    >
      <template #toolbar="{ refresh, cancelProxy, busy }">
        <s-button :disabled="busy" @click="refresh">Refresh</s-button>
        <s-button flat :disabled="!busy" @click="cancelProxy"
          >Cancel request</s-button
        >
        <s-checkbox v-model="failNext" :disabled="busy"
          >Fail the next query</s-checkbox
        >
      </template>
    </s-table-grid>
    <p role="status">
      {{
        state.loading
          ? 'Loading from the simulated service…'
          : state.result?.status === 'cancelled'
            ? 'Request cancelled; previous rows are preserved.'
            : 'Ready.'
      }}
      Requests: {{ requests }}
    </p>
  </div>
</template>
