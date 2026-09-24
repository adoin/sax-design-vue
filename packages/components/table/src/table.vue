<script setup lang="ts">
import { computed, provide, ref, useAttrs } from 'vue'
import { mapValues, omit, pick } from 'lodash-unified'
import { SAlert } from '@vuesax-alpha/components/alert'
import { SConfigProvider } from '@vuesax-alpha/components/config-provider'
import {
  provideGlobalConfig,
  useGlobalComponentProps,
  useGlobalConfig,
  useLocale,
  useNamespace,
  useSize,
} from '@vuesax-alpha/hooks'
import TableCore from './table-core.vue'
import TableQueryForm from './table-query-form.vue'
import { useTableProxy } from './composables/use-table-proxy'
import { useTableRequestQuery } from './composables/use-table-request-query'
import { tableToolbarRuntimeKey } from './table-toolbar-context'
import {
  tableCoreEmits,
  tableCoreExposeKeys,
  tableCoreProps,
  tableEmits,
  tableProps,
} from './table'
import type {
  FormInstance,
  FormItemConfig,
  FormModel,
} from '@vuesax-alpha/components/form'
import type {
  TableCoreExposes,
  TableExposes,
  TableFilters,
  TablePagerConfig,
  TableRow,
  TableSort,
} from './table'
import type {
  TableBusinessExposes,
  TableQueryActionsState,
  TableSize,
  TableToolbarRendererOptions,
} from './table-business'

defineOptions({ name: 'STable', inheritAttrs: false })

const rawProps = defineProps(tableProps)
const inheritedProps = useGlobalComponentProps('table', rawProps)
const tableConfig = useGlobalConfig('table')
const queryConfig = computed(() => {
  const local = rawProps.queryConfig
  if (!local) return false
  const configured = tableConfig.value?.queryConfig
  const defaults =
    configured && typeof configured === 'object' ? configured : {}
  if (local === true)
    return Object.keys(defaults).length ? { ...defaults } : true
  return { ...defaults, ...local }
})
const props = new Proxy(inheritedProps, {
  get(target, property, receiver) {
    return property === 'queryConfig'
      ? queryConfig.value
      : Reflect.get(target, property, receiver)
  },
})
const size = useSize(computed(() => props.size))
const resolvedSize = computed<TableSize>(() =>
  size.value === 'small' || size.value === 'large' ? size.value : 'default',
)
provideGlobalConfig(computed(() => ({ size: resolvedSize.value })))
const emit = defineEmits(tableEmits)
const table = ref<TableCoreExposes>()
const queryForm = ref<{ getForm: () => FormInstance | undefined }>()
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
  'query-actions'?(
    params: TableExposes & { busy: boolean } & TableQueryActionsState,
  ): unknown
  toolbar_left?(params: TableExposes & { busy: boolean }): unknown
  toolbar_right?(params: TableExposes & { busy: boolean }): unknown
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
const configuredToolbar = computed(() =>
  typeof props.toolbarConfig === 'object' ? props.toolbarConfig : {},
)
const toolbar = computed(() => {
  const config = configuredToolbar.value
  const withDefaults = (
    item: TableToolbarRendererOptions,
  ): TableToolbarRendererOptions =>
    item.itemRender === '$refresh' && item.content == null
      ? { ...item, content: t('vs.table.refresh') }
      : item
  return {
    ...config,
    size: config.size || resolvedSize.value,
    left: (config.left ?? []).map(withDefaults),
    right: (config.right ?? []).map(withDefaults),
  }
})
const toolbarEnablesFind = computed(() => {
  if (toolbar.value.enabled === false) return false
  const includesFind = (items: TableToolbarRendererOptions[] = []) =>
    items.some((item) => item.itemRender === '$find' && item.visible !== false)
  return (
    (!slots.toolbar_left && includesFind(toolbar.value.left)) ||
    (!slots.toolbar_right && includesFind(toolbar.value.right))
  )
})
const toolbarEnabled = computed(
  () =>
    toolbar.value.enabled !== false &&
    Boolean(
      toolbar.value.title ||
      toolbar.value.left?.length ||
      toolbar.value.right?.length ||
      slots.toolbar_left ||
      slots.toolbar_right ||
      slots['toolbar-title'],
    ),
)
const shellEnabled = computed(
  () =>
    Boolean(props.proxyConfig || props.queryConfig || toolbarEnabled.value) ||
    Boolean(slots.query || slots['query-actions'] || slots['proxy-error']),
)
const autoVirtualHeight = computed(
  () =>
    typeof props.virtualConfig === 'object' &&
    props.virtualConfig.height === 'auto' &&
    (props.virtualConfig.enabled !== false || Boolean(props.virtualSource)),
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
  size: resolvedSize.value,
  data: proxy.data.value,
  loading: props.loading || proxy.state.value.loading,
  pagerConfig: proxy.pager.value,
  sortConfig: sortConfig.value,
  filterConfig: filterConfig.value,
  sortBy: query.sorts.value,
  filters: query.filters.value,
  // The toolbar renderer is itself an explicit opt-in to the capability.
  // findConfig remains available for API-only use and behavioral limits.
  findConfig: toolbarEnablesFind.value
    ? props.findConfig || true
    : props.findConfig,
}))
const tableAttrs = computed(() =>
  shellEnabled.value ? omit(attrs, ['class', 'style']) : attrs,
)
const forwardedSlots = () =>
  Object.keys(slots).filter(
    (name) =>
      name !== 'query' && name !== 'query-actions' && name !== 'proxy-error',
  )
const formSlots = () => {
  const names = new Set<string>()
  const collect = (items: readonly FormItemConfig[] = []) =>
    items.forEach((item) => {
      Object.values(item.slots ?? {}).forEach((name) => name && names.add(name))
      collect(item.children)
    })
  collect(query.queryConfig.value.items)
  return [...names].filter((name) => Boolean(slots[name]))
}
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

provide(tableToolbarRuntimeKey, {
  enabled: toolbarEnabled,
  size: computed(() => toolbar.value.size || resolvedSize.value),
  config: toolbar,
  busy,
  table: exposed,
  context: () => query.context('refresh'),
  action: (code, event) =>
    emit('toolbarClick', code, query.context('refresh'), event),
})
</script>

<template>
  <div
    v-if="shellEnabled"
    :class="[ns.b(), ns.is('auto-height', autoVirtualHeight), attrs.class]"
    :style="attrs.style"
    :aria-busy="busy || undefined"
  >
    <SConfigProvider
      v-if="query.enabled.value"
      :size="query.queryConfig.value.size || resolvedSize"
    >
      <TableQueryForm
        ref="queryForm"
        :config="query.queryConfig.value"
        :model="query.model.value"
        :busy="busy"
        :size="query.queryConfig.value.size || resolvedSize"
        @query="businessApi.query"
        @reset="businessApi.resetQuery"
      >
        <template v-if="$slots.query" #default>
          <slot name="query" :model="query.model.value" v-bind="exposed" />
        </template>
        <template v-if="$slots['query-actions']" #actions="actionState">
          <slot
            name="query-actions"
            v-bind="{ ...exposed, ...actionState }"
            :busy="busy"
          />
        </template>
        <template v-for="name in formSlots()" #[name]="params">
          <slot :name="name" v-bind="params || {}" />
        </template>
      </TableQueryForm>
    </SConfigProvider>
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
