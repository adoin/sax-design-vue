import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  toRaw,
  watch,
} from 'vue'
import { isEqual } from 'lodash-unified'
import type { ComputedRef } from 'vue'
import type {
  TableChangeRecords,
  TableExposes,
  TablePagerConfig,
  TableRow,
} from '@vuesax-alpha/components/table'
import type {
  TableGridEmitFn,
  TableGridProps,
  TableGridQueryContext,
} from './table-grid'
import type {
  TableGridProxyAction,
  TableGridProxyResult,
  TableGridProxyState,
  TableGridProxyStatus,
} from './grid-proxy'

const hasChanges = (records?: TableChangeRecords) =>
  Boolean(
    records &&
    (records.inserted.length ||
      records.updated.length ||
      records.removed.length),
  )
const criteria = (context: TableGridQueryContext) => ({
  form: context.form,
  sortBy: context.sortBy,
  filters: context.filters,
  page: context.pager && context.pager.currentPage,
  size: context.pager && context.pager.pageSize,
})

/** Owns request lifetimes and accepted page data, never the table rendering pipeline. */
export function useGridProxy(
  props: TableGridProps,
  emit: TableGridEmitFn,
  table: () => TableExposes | undefined,
  context: () => TableGridQueryContext,
  queryPager: ComputedRef<TablePagerConfig | false>,
  updatePager: (value: TablePagerConfig) => void,
  queryControls: () => unknown[],
) {
  const config = computed(() =>
    typeof props.proxyConfig === 'object' ? props.proxyConfig : {},
  )
  const enabled = computed(
    () => Boolean(props.proxyConfig) && config.value.enabled !== false,
  )
  const internalData = shallowRef<TableRow[]>([])
  const total = shallowRef<number>()
  const data = computed(() => props.data ?? internalData.value)
  const state = shallowRef<TableGridProxyState>({
    loading: false,
    action: null,
    error: null,
    result: null,
  })
  const pager = computed<TablePagerConfig | false>(() => {
    const value = queryPager.value
    if (!enabled.value || !value) return value
    return {
      ...value,
      remote: true,
      total:
        total.value ??
        value.total ??
        Math.max(
          data.value.length,
          (value.currentPage ?? 1) * (value.pageSize ?? 10),
        ),
    }
  })
  let disposed = false
  let active:
    { controller: AbortController; action: TableGridProxyAction } | undefined
  let proposed: TableRow[] | undefined
  let scheduled = 0
  let lastCriteria: ReturnType<typeof criteria> | undefined
  const publish = (next: TableGridProxyState) => {
    state.value = next
    if (!disposed) emit('proxyStateChange', { ...next })
  }
  const cancel = () => {
    const previous = active
    active = undefined
    previous?.controller.abort()
    if (previous)
      publish({
        loading: false,
        action: null,
        error: null,
        result: { action: previous.action, status: 'cancelled' },
      })
  }
  // A non-cooperative adapter must not keep the public operation pending after cancellation.
  const wait = <T>(
    work: () => T | Promise<T>,
    signal: AbortSignal,
  ): Promise<T> =>
    new Promise((resolve, reject) => {
      const abort = () =>
        reject(signal.reason ?? new Error('Request cancelled'))
      if (signal.aborted) return abort()
      signal.addEventListener('abort', abort, { once: true })
      Promise.resolve()
        .then(() => {
          if (signal.aborted) throw signal.reason
          return work()
        })
        .then(resolve, reject)
        .finally(() => signal.removeEventListener('abort', abort))
    })
  const updateData = (rows: TableRow[]) => {
    if (enabled.value && props.data === undefined) internalData.value = rows
    emit('update:data', rows)
  }
  const acceptData = async (rows: TableRow[]) => {
    proposed = rows
    updateData(rows)
    await nextTick()
    const accepted = toRaw(data.value) === toRaw(rows)
    proposed = undefined
    return accepted
  }
  const run = async (
    action: TableGridProxyAction,
    rows?: TableRow[],
    snapshot = context(),
  ): Promise<TableGridProxyResult> => {
    const result = (
      status: TableGridProxyStatus,
      error?: unknown,
    ): TableGridProxyResult => ({
      action,
      status,
      ...(error === undefined ? {} : { error }),
    })
    const blocked = (status: TableGridProxyStatus) => {
      const value = result(status)
      if (!active && !disposed)
        publish({ loading: false, action: null, error: null, result: value })
      return value
    }
    if (disposed) return result('cancelled')
    if (!enabled.value) return blocked('disabled')
    const write = action === 'save' || action === 'delete'
    const adapter = write ? config.value[action] : config.value.query
    if (!adapter) return blocked('disabled')
    if (
      props.loading ||
      (active &&
        (write || active.action === 'save' || active.action === 'delete'))
    )
      return result('busy')
    const target = table()
    if (!target) return result('disabled')
    if (!write && props.virtualSource) return blocked('unsupported')
    if (target.getEditRecord()) return blocked('editing')
    if (action !== 'save' && hasChanges(target.getChangeRecords()))
      return blocked('dirty')
    cancel()
    const request = { controller: new AbortController(), action }
    active = request
    const signal = request.controller.signal
    const current = () => !disposed && active === request && !signal.aborted
    const finish = (value: TableGridProxyResult) => {
      if (current()) {
        active = undefined
        publish({
          loading: false,
          action: null,
          error: value.status === 'error' ? value.error : null,
          result: value,
        })
        if (value.status === 'success') emit('proxySuccess', value)
        if (value.status === 'error') emit('proxyError', value)
      }
      return value
    }
    publish({ loading: true, action, error: null, result: null })
    const reload = config.value.reloadAfterMutation !== false
    const params = {
      ...snapshot,
      pager: pager.value
        ? { ...snapshot.pager, remote: true, total: pager.value.total }
        : (false as const),
      action,
      signal,
    }
    try {
      if (!write) {
        lastCriteria = criteria(snapshot)
        const response = await wait(() => config.value.query!(params), signal)
        if (!current()) return result('cancelled')
        if (
          !response ||
          !Array.isArray(response.data) ||
          (pager.value &&
            pager.value.enabled !== false &&
            response.total === undefined) ||
          (response.total !== undefined &&
            (!Number.isSafeInteger(response.total) || response.total < 0))
        ) {
          throw new TypeError(
            'Proxy query must return data and a non-negative integer total for pagination.',
          )
        }
        if (!(await acceptData(response.data)))
          return finish(result('rejected'))
        if (!current()) return result('cancelled')
        total.value = response.total ?? response.data.length
        return finish(result('success'))
      }
      let changes: TableChangeRecords | undefined
      if (action === 'save') {
        const baseline = data.value
        changes = target.getChangeRecords()
        if (!hasChanges(changes)) return finish(result('empty'))
        const source = props.virtualSource
        if (
          source &&
          (!config.value.validationColumns ||
            config.value.validationColumns.some(
              (column) =>
                typeof column !== 'number' ||
                !Number.isSafeInteger(column) ||
                column < 0 ||
                column >= source.columnCount,
            ))
        )
          return finish(result('unsupported'))
        const changedRows = [...changes.inserted, ...changes.updated].map(
          (entry) => {
            if (!props.virtualSource) return entry.row as TableRow
            return typeof props.changeConfig === 'object'
              ? props.changeConfig.indexOf?.(entry.rowKey)
              : undefined
          },
        )
        if (
          changedRows.some(
            (row) =>
              row === undefined ||
              (source &&
                (typeof row !== 'number' ||
                  !Number.isSafeInteger(row) ||
                  row < 0 ||
                  row >= source.rowCount)),
          )
        )
          return finish(result('stale'))
        const validation = await wait(
          () =>
            target.validate({
              rows: props.virtualSource ? (changedRows as number[]) : undefined,
              rowKeys: [...changes!.inserted, ...changes!.updated].map(
                (entry) => entry.rowKey,
              ),
              columns: config.value.validationColumns,
              signal,
            }),
          signal,
        )
        if (!validation.valid) return finish(result('invalid'))
        if (target.getChangeRecords().version !== changes.version)
          return finish(result('stale'))
        const accepted = await wait(
          () => config.value.save!({ ...params, changes: changes! }),
          signal,
        )
        if (!current()) return result('cancelled')
        if (accepted === false) return finish(result('rejected'))
        if (data.value !== baseline || !target.acceptChanges(changes.version))
          return finish(result('stale'))
      } else {
        const selected = rows ? [...rows] : target.getSelectedRows()
        if (!selected.length) return finish(result('empty'))
        const version = target.getChangeRecords().version
        const baseline = data.value
        const accepted = await wait(
          () => config.value.delete!({ ...params, rows: selected }),
          signal,
        )
        if (!current()) return result('cancelled')
        if (accepted === false) return finish(result('rejected'))
        if (
          data.value !== baseline ||
          target.getChangeRecords().version !== version ||
          target.getEditRecord()
        )
          return finish(result('stale'))
      }
      const done = finish(result('success'))
      if (reload && config.value.query)
        done.reload = await run('refresh', undefined, context())
      return done
    } catch (error) {
      return current() ? finish(result('error', error)) : result('cancelled')
    }
  }
  const schedule = () => {
    const id = ++scheduled
    nextTick()
      .then(() => nextTick())
      .then(async () => {
        if (
          id !== scheduled ||
          disposed ||
          !enabled.value ||
          config.value.autoQuery === false
        )
          return
        let snapshot = context()
        if (
          lastCriteria &&
          (!isEqual(lastCriteria.sortBy, snapshot.sortBy) ||
            !isEqual(lastCriteria.filters, snapshot.filters)) &&
          snapshot.pager &&
          snapshot.pager.enabled !== false &&
          snapshot.pager.currentPage !== 1
        ) {
          const next = { ...snapshot.pager, currentPage: 1 }
          updatePager(next)
          emit('update:pagerConfig', next)
          await nextTick()
          snapshot = context()
          if (disposed || (snapshot.pager && snapshot.pager.currentPage !== 1))
            return
        }
        if (!isEqual(lastCriteria, criteria(snapshot)))
          run('query', undefined, snapshot)
      })
  }
  // Watch accepted query controls, not draft form fields or response totals.
  watch(queryControls, schedule, { deep: true, flush: 'post' })
  watch(
    [
      enabled,
      () => config.value.dataKey,
      () => config.value.query,
      () => config.value.save,
      () => config.value.delete,
      () => props.virtualSource,
    ],
    () => {
      cancel()
      lastCriteria = undefined
      total.value = undefined
    },
    { flush: 'sync' },
  )
  watch(
    data,
    (value) => {
      if (
        active &&
        active.action !== 'save' &&
        active.action !== 'delete' &&
        (!proposed || toRaw(value) !== toRaw(proposed))
      )
        cancel()
    },
    { flush: 'sync' },
  )
  onMounted(() => {
    if (enabled.value && config.value.autoLoad !== false) run('query')
  })
  onBeforeUnmount(() => {
    disposed = true
    scheduled++
    cancel()
  })
  return { enabled, data, pager, state, updateData, run, cancel }
}
