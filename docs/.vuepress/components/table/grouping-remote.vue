<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import type {
  TableColumn,
  TableGridProxyConfig,
  TableGroupConfig,
  TableGroupRemoteResult,
  TableRemoteGroup,
  TableRow,
} from 'sax-design-vue'

const rows = shallowRef<TableRow[]>([])
const failNext = shallowRef(false)
// Metadata follows the page accepted by the Grid, including controlled updates.
const pages = new WeakMap<TableRow[], TableGroupRemoteResult>()
const groupConfig = computed<TableGroupConfig>(() => ({
  mode: 'remote',
  subtotal: true,
  summary: true,
  remote: pages.get(rows.value),
}))
const columns: TableColumn[] = [
  { field: 'team', title: 'Team', width: 140, fixed: 'left' },
  { field: 'name', title: 'Project', minWidth: 220 },
  { field: 'hours', title: 'Hours', width: 120 },
]
const teams = ['Design', 'Engineering', 'Operations']
const serviceRows = Array.from({ length: 24 }, (_, index) => ({
  id: index + 1,
  team: teams[Math.floor(index / 8)],
  name: `Project ${index + 1}`,
  hours: index + 1,
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
  async query({ pager, signal }) {
    const shouldFail = failNext.value
    failNext.value = false
    await pause(signal)
    if (shouldFail) throw new Error('The simulated service is unavailable.')
    const size = pager ? (pager.pageSize ?? 6) : 6
    const start = pager ? ((pager.currentPage ?? 1) - 1) * size : 0
    const data = serviceRows
      .slice(start, start + size)
      .map((row) => ({ ...row }))
    const groups: TableRemoteGroup[] = []
    data.forEach((row, index) => {
      let group = groups[groups.length - 1]
      if (!group || group.value !== row.team) {
        group = {
          key: row.team,
          field: 'team',
          value: row.team,
          rowStart: index,
          rowCount: 0,
          aggregates: { hours: 0 },
        }
        groups.push(group)
      }
      group.rowCount++
      group.aggregates = { hours: Number(group.aggregates?.hours) + row.hours }
    })
    const result = {
      groups,
      summary: { hours: serviceRows.reduce((sum, row) => sum + row.hours, 0) },
    }
    pages.set(data, result)
    return { data, total: serviceRows.length }
  },
}
</script>

<template>
  <div class="grouping-remote-demo">
    <s-table-grid
      v-model:data="rows"
      :columns="columns"
      row-key="id"
      :group-config="groupConfig"
      :proxy-config="proxyConfig"
      :pager-config="{ pageSize: 6, pageSizes: [6, 12] }"
    >
      <template #toolbar="{ refresh, cancelProxy, busy }">
        <s-button size="small" @click="refresh">Refresh</s-button>
        <s-button size="small" flat :disabled="!busy" @click="cancelProxy"
          >Cancel request</s-button
        >
        <s-checkbox v-model="failNext" :disabled="busy"
          >Fail the next query</s-checkbox
        >
      </template>
      <template #group-summary="{ column, value, group }">
        {{
          column.field === 'team'
            ? group
              ? 'Page subtotal'
              : 'All records'
            : (value ?? '')
        }}
      </template>
    </s-table-grid>
  </div>
</template>
