<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { mapValues, omit, pick } from 'lodash-unified'
import { SAlert } from '@vuesax-alpha/components/alert'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import TableCore from './table-core.vue'
import TableQueryForm from './table-query-form.vue'
import TableToolbar from './table-toolbar.vue'
import { useTableProxy } from './composables/use-table-proxy'
import { useTableRequestQuery } from './composables/use-table-request-query'
import {
  tableCoreEmits,
  tableCoreExposeKeys,
  tableCoreProps,
  tableEmits,
  tableProps,
} from './table'
import type { FormModel } from '@vuesax-alpha/components/form'
import type {
  TableCoreExposes,
  TableExposes,
  TableFilters,
  TablePagerConfig,
  TableRow,
  TableSort,
} from './table'
import type { TableBusinessExposes } from './table-business'

defineOptions({ name: 'STable', inheritAttrs: false })

const props = defineProps(tableProps)
const emit = defineEmits(tableEmits)
const table = ref<TableCoreExposes>()
const queryForm = ref<InstanceType<typeof TableQueryForm>>()
const coreApi = tableCoreExposeKeys.reduce((api, key) => {
  let lastMethod: ((...values: unknown[]) => unknown) | undefined
  api[key] = ((...args: unknown[]) => {
    const method = table.value?.[key] as
      ((...values: unknown[]) => unknown) | undefined
    if (method) lastMethod = method
    return lastMethod?.(...args)
  }) as never
  return api
}, {} as TableCoreExposes)
const businessApi: TableBusinessExposes = {
  query: () => query.run('submit'),
  resetQuery: () => query.run('reset'),
  refresh: () => query.run('refresh'),
  getQueryContext: () => query.context(),
  getForm: () => queryForm.value?.getForm(),
  commitProxy: (action, rows) => proxy.run(action, rows),
  cancelProxy: () => proxy.cancel(),
  getProxyState: () => ({ ...proxy.state.value }),
}
const exposed = Object.assign(coreApi, businessApi) as TableExposes
defineExpose(exposed)
const attrs = useAttrs()
const slots = defineSlots<{
  [name: string]: ((params: any) => unknown) | undefined
  query?(params: TableExposes & { model: FormModel }): unknown
  'query-actions'?(params: TableExposes & { busy: boolean }): unknown
  toolbar?(params: TableExposes & { busy: boolean }): unknown
  'toolbar-title'?(): unknown
}>()
const ns = useNamespace('table-shell')
const { t } = useLocale()

const query = useTableRequestQuery(
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
const proxy = useTableProxy(
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
  return key ? t(`vs.table.${key}`) : ''
})
const toolbar = computed(() =>
  typeof props.toolbarConfig === 'object' ? props.toolbarConfig : {},
)
const toolbarEnabled = computed(
  () => Boolean(props.toolbarConfig) && toolbar.value.enabled !== false,
)
const shellEnabled = computed(
  () =>
    Boolean(props.proxyConfig || props.queryConfig || props.toolbarConfig) ||
    Boolean(
      slots.query ||
      slots['query-actions'] ||
      slots.toolbar ||
      slots['toolbar-title'] ||
      slots['proxy-error'],
    ),
)
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
  ...pick(props, Object.keys(tableCoreProps)),
  data: proxy.data.value,
  loading: props.loading || proxy.state.value.loading,
  pagerConfig: proxy.pager.value,
  sortConfig: sortConfig.value,
  filterConfig: filterConfig.value,
  sortBy: query.sorts.value,
  filters: query.filters.value,
}))
const tableAttrs = computed(() =>
  shellEnabled.value ? omit(attrs, ['class', 'style']) : attrs,
)
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
  event: keyof typeof tableCoreEmits,
  ...args: unknown[]
) => void
const listeners = mapValues(
  tableCoreEmits,
  (_, event) =>
    (...args: unknown[]) => {
      if (event === 'update:data') {
        proxy.updateData(args[0] as TableRow[])
        return
      }
      if (event === 'update:pagerConfig')
        query.updatePager(args[0] as TablePagerConfig)
      if (event === 'update:sortBy') query.updateSorts(args[0] as TableSort[])
      if (event === 'update:filters')
        query.updateFilters(args[0] as TableFilters)
      forward(event as keyof typeof tableCoreEmits, ...args)
    },
)
</script>

<template>
  <div
    v-if="shellEnabled"
    :class="[ns.b(), attrs.class]"
    :style="attrs.style"
    :aria-busy="busy || undefined"
  >
    <TableQueryForm
      v-if="query.enabled.value"
      ref="queryForm"
      :config="query.queryConfig.value"
      :model="query.model.value"
      :busy="busy"
      @query="businessApi.query"
      @reset="businessApi.resetQuery"
    >
      <template v-if="$slots.query" #default>
        <slot name="query" :model="query.model.value" v-bind="exposed" />
      </template>
      <template v-if="$slots['query-actions']" #actions>
        <slot name="query-actions" v-bind="exposed" :busy="busy" />
      </template>
      <template v-for="name in formSlots()" #[name.slice(6)]="params">
        <slot :name="name" v-bind="params || {}" />
      </template>
    </TableQueryForm>
    <TableToolbar
      v-if="toolbarEnabled || $slots.toolbar || $slots['toolbar-title']"
      :config="toolbar"
      :busy="busy"
      @refresh="businessApi.refresh"
      @action="
        (code, event) =>
          emit('toolbarClick', code, query.context('refresh'), event)
      "
    >
      <template v-if="$slots['toolbar-title']" #title>
        <slot name="toolbar-title" />
      </template>
      <template v-if="$slots.toolbar" #default>
        <slot name="toolbar" v-bind="exposed" :busy="busy" />
      </template>
    </TableToolbar>
    <div v-if="proxyFeedback" :class="ns.e('error')">
      <slot name="proxy-error" :state="proxy.state.value" v-bind="exposed">
        <SAlert color="danger" type="flat">{{ proxyFeedback }}</SAlert>
      </slot>
    </div>
    <TableCore
      ref="table"
      v-bind="{ ...tableAttrs, ...tableOptions }"
      v-on="listeners"
    >
      <template v-for="name in forwardedSlots()" #[name]="params">
        <slot :name="name" v-bind="params || {}" />
      </template>
    </TableCore>
  </div>
  <TableCore
    v-else
    ref="table"
    v-bind="{ ...tableAttrs, ...tableOptions }"
    v-on="listeners"
  >
    <template v-for="name in forwardedSlots()" #[name]="params">
      <slot :name="name" v-bind="params || {}" />
    </template>
  </TableCore>
</template>
