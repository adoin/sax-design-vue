<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { mapValues, omit, pick } from 'lodash-unified'
import { STable, tableEmits, tableProps } from '@vuesax-alpha/components/table'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import { SAlert } from '@vuesax-alpha/components/alert'
import GridQueryForm from './grid-query-form.vue'
import GridToolbar from './grid-toolbar.vue'
import { tableGridEmits, tableGridProps } from './table-grid'
import { useGridQuery } from './use-grid-query'
import { useGridProxy } from './use-grid-proxy'
import type {
  TableExposes,
  TableFilters,
  TablePagerConfig,
  TableRow,
  TableSort,
} from '@vuesax-alpha/components/table'
import type { TableGridExposes } from './table-grid'
import type { FormModel } from '@vuesax-alpha/components/form'

defineOptions({ name: 'STableGrid', inheritAttrs: false })
const props = defineProps(tableGridProps)
const emit = defineEmits(tableGridEmits)
const attrs = useAttrs()
const slots = defineSlots<{
  // Consumer-defined table and form slot names carry their own scoped values.
  [name: string]: ((params: any) => unknown) | undefined
  query?(params: TableGridExposes & { model: FormModel }): unknown
  'query-actions'?(params: TableGridExposes & { busy: boolean }): unknown
  toolbar?(params: TableGridExposes & { busy: boolean }): unknown
  'toolbar-title'?(): unknown
}>()
const ns = useNamespace('table-grid')
const { t } = useLocale()
const table = ref<TableExposes>()
const queryForm = ref<InstanceType<typeof GridQueryForm>>()
const query = useGridQuery(
  props,
  emit,
  () => queryForm.value?.getForm(),
  async (snapshot) => {
    if (!proxy.enabled.value) return true
    return (
      (
        await proxy.run(
          snapshot.reason === 'refresh' ? 'refresh' : 'query',
          undefined,
          snapshot,
        )
      ).status === 'success'
    )
  },
)
const proxy = useGridProxy(
  props,
  emit,
  () => table.value,
  () => query.context(),
  query.pager,
  query.updatePager,
  () => [
    query.pager.value && query.pager.value.currentPage,
    query.pager.value && query.pager.value.pageSize,
    query.sorts.value,
    query.filters.value,
  ],
)
const busy = computed(
  () => props.loading || query.busy.value || proxy.state.value.loading,
)
const proxyFeedback = computed(() => {
  const messages: Record<string, string> = {
    error: 'requestFailed',
    dirty: 'pendingChanges',
    editing: 'pendingDraft',
    invalid: 'invalidChanges',
    rejected: 'requestRejected',
    stale: 'staleResult',
    unsupported: 'unsupportedSource',
  }
  const key = messages[proxy.state.value.result?.status ?? '']
  return key ? t(`vs.tableGrid.${key}`) : ''
})
const toolbar = computed(() =>
  typeof props.toolbarConfig === 'object' ? props.toolbarConfig : {},
)
const toolbarEnabled = computed(
  () => Boolean(props.toolbarConfig) && toolbar.value.enabled !== false,
)
// Data acceptance must not look like a query change to the edit lifecycle.
const sortConfig = computed(() =>
  proxy.enabled.value
    ? { ...props.sortConfig, remote: true }
    : props.sortConfig,
)
const filterConfig = computed(() =>
  proxy.enabled.value
    ? { ...props.filterConfig, remote: true }
    : props.filterConfig,
)
const tableOptions = computed(() => ({
  ...pick(props, Object.keys(tableProps)),
  data: proxy.data.value,
  loading: props.loading || proxy.state.value.loading,
  pagerConfig: proxy.pager.value,
  sortConfig: sortConfig.value,
  filterConfig: filterConfig.value,
  sortBy: query.sorts.value,
  filters: query.filters.value,
}))
const tableAttrs = () => omit(attrs, ['class', 'style'])
const forwardedSlots = () =>
  Object.keys(slots).filter(
    (name) =>
      !name.startsWith('query-') &&
      name !== 'query' &&
      name !== 'toolbar' &&
      name !== 'toolbar-title' &&
      name !== 'proxy-error',
  )
const formSlots = () =>
  Object.keys(slots).filter(
    (name) => name.startsWith('query-') && name !== 'query-actions',
  )
const forward = emit as (
  event: keyof typeof tableEmits,
  ...args: unknown[]
) => void
const listeners = mapValues(tableEmits, (_, event) => (...args: unknown[]) => {
  if (event === 'update:data') {
    proxy.updateData(args[0] as TableRow[])
    return
  }
  if (event === 'update:pagerConfig')
    query.updatePager(args[0] as TablePagerConfig)
  if (event === 'update:sortBy') query.updateSorts(args[0] as TableSort[])
  if (event === 'update:filters') query.updateFilters(args[0] as TableFilters)
  forward(event as keyof typeof tableEmits, ...args)
})
const api: TableGridExposes = {
  query: () => query.run('submit'),
  resetQuery: () => query.run('reset'),
  refresh: () => query.run('refresh'),
  getQueryContext: () => query.context(),
  getTable: () => table.value,
  getForm: () => queryForm.value?.getForm(),
  commitProxy: (action, rows) => proxy.run(action, rows),
  cancelProxy: proxy.cancel,
  getProxyState: () => ({ ...proxy.state.value }),
}
defineExpose(api)
</script>

<template>
  <div
    :class="[ns.b(), attrs.class]"
    :style="attrs.style"
    :aria-busy="busy || undefined"
  >
    <GridQueryForm
      v-if="query.enabled.value"
      ref="queryForm"
      :config="query.queryConfig.value"
      :model="query.model.value"
      :busy="busy"
      @query="api.query"
      @reset="api.resetQuery"
    >
      <template v-if="$slots.query" #default
        ><slot name="query" :model="query.model.value" v-bind="api"
      /></template>
      <template v-if="$slots['query-actions']" #actions
        ><slot name="query-actions" v-bind="api" :busy="busy"
      /></template>
      <template v-for="name in formSlots()" #[name.slice(6)]="params"
        ><slot :name="name" v-bind="params || {}"
      /></template>
    </GridQueryForm>
    <GridToolbar
      v-if="toolbarEnabled || $slots.toolbar || $slots['toolbar-title']"
      :config="toolbar"
      :busy="busy"
      @refresh="api.refresh"
      @action="
        (code, event) =>
          emit('toolbarClick', code, query.context('refresh'), event)
      "
    >
      <template v-if="$slots['toolbar-title']" #title
        ><slot name="toolbar-title"
      /></template>
      <template v-if="$slots.toolbar" #default
        ><slot name="toolbar" v-bind="api" :busy="busy"
      /></template>
    </GridToolbar>
    <div v-if="proxyFeedback" :class="ns.e('error')">
      <slot name="proxy-error" :state="proxy.state.value" v-bind="api">
        <SAlert color="danger" type="flat">{{ proxyFeedback }}</SAlert>
      </slot>
    </div>
    <STable
      ref="table"
      v-bind="{ ...tableAttrs(), ...tableOptions }"
      v-on="listeners"
    >
      <template v-for="name in forwardedSlots()" #[name]="params"
        ><slot :name="name" v-bind="params || {}"
      /></template>
    </STable>
  </div>
</template>
