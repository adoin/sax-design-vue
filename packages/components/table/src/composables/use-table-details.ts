import {
  computed,
  nextTick,
  onBeforeUnmount,
  shallowReactive,
  shallowRef,
  watch,
} from 'vue'
import type { ComputedRef } from 'vue'
import type {
  TableColumn,
  TableDetailParams,
  TableEmitFn,
  TableFlatRow,
  TableProps,
  TableRowKey,
} from '../table'

interface DetailRecord {
  loading: boolean
  data: unknown
  error: unknown
  settled: boolean
}

export function useTableDetails(
  props: TableProps,
  emit: TableEmitFn,
  columns: ComputedRef<TableColumn[]>,
) {
  const config = computed(() =>
    typeof props.detailConfig === 'object' ? props.detailConfig : {},
  )
  const enabled = computed(
    () =>
      props.detailConfig !== false &&
      config.value.enabled !== false &&
      (props.detailConfig !== undefined ||
        columns.value.some((column) => column.type === 'expand')),
  )
  const localKeys = shallowRef(new Set(config.value.defaultExpandedKeys ?? []))
  const keys = computed(() =>
    props.detailExpandedKeys === undefined
      ? localKeys.value
      : new Set(props.detailExpandedKeys),
  )
  const records = shallowReactive(new Map<TableRowKey, DetailRecord>())
  const requests = new Map<
    TableRowKey,
    { controller: AbortController; promise: Promise<void> }
  >()
  const revision = shallowRef(0)
  let disposed = false
  const paramsFor = (flat: TableFlatRow): TableDetailParams => ({
    row: flat.row,
    rowKey: flat.key,
    rowIndex: flat.index,
  })
  const allowed = (flat: TableFlatRow) =>
    enabled.value && (config.value.checkMethod?.(paramsFor(flat)) ?? true)
  const expanded = (flat: TableFlatRow) =>
    allowed(flat) && keys.value.has(flat.key)
  const stateFor = (key: TableRowKey): DetailRecord =>
    records.get(key) ?? {
      loading: false,
      data: undefined,
      error: undefined,
      settled: false,
    }
  const discard = (key: TableRowKey) => {
    requests.get(key)?.controller.abort()
    requests.delete(key)
    records.delete(key)
  }
  const invalidate = () => {
    for (const key of requests.keys()) discard(key)
    records.clear()
    revision.value++
  }
  const setKeys = (next: TableRowKey[]) => {
    const unique = [...new Set(next)]
    if (props.detailExpandedKeys === undefined)
      localKeys.value = new Set(unique)
    emit('update:detailExpandedKeys', unique)
  }
  const ensure = (flat: TableFlatRow, force = false): Promise<void> => {
    const load = config.value.load
    if (disposed || !expanded(flat) || !load) return Promise.resolve()
    const existing = requests.get(flat.key)
    if (!force && existing) return existing.promise
    if (!force && records.get(flat.key)?.settled) return Promise.resolve()
    if (force) discard(flat.key)
    const controller = new AbortController()
    const params = paramsFor(flat)
    const current = () =>
      !disposed &&
      !controller.signal.aborted &&
      requests.get(flat.key)?.controller === controller &&
      expanded(flat)
    records.set(flat.key, {
      loading: true,
      data: undefined,
      error: undefined,
      settled: false,
    })
    const promise = Promise.resolve()
      .then(() => {
        if (!current()) return undefined
        return load({ ...params, signal: controller.signal })
      })
      .then((data) => {
        if (!current()) return
        records.set(flat.key, {
          loading: false,
          data,
          error: undefined,
          settled: true,
        })
        emit('detailLoad', { ...params, data })
      })
      .catch((error: unknown) => {
        if (!current()) return
        const failure = error ?? new Error('Detail loading failed')
        records.set(flat.key, {
          loading: false,
          data: undefined,
          error: failure,
          settled: true,
        })
        emit('detailLoadError', { ...params, error: failure })
      })
      .finally(() => {
        if (requests.get(flat.key)?.controller === controller)
          requests.delete(flat.key)
      })
    requests.set(flat.key, { controller, promise })
    return promise
  }
  const toggle = async (flat: TableFlatRow, value?: boolean) => {
    const next = value ?? !keys.value.has(flat.key)
    if (next && !allowed(flat)) return
    if (next !== keys.value.has(flat.key)) {
      const updated = new Set(keys.value)
      if (next) updated.add(flat.key)
      else updated.delete(flat.key)
      setKeys([...updated])
      emit('detailExpand', { ...paramsFor(flat), expanded: next })
    }
    await nextTick()
    if (next) await ensure(flat)
  }
  watch(
    keys,
    (next) => {
      for (const key of new Set([...records.keys(), ...requests.keys()]))
        if (!next.has(key)) discard(key)
    },
    { flush: 'sync' },
  )
  watch(
    () => [
      enabled.value,
      config.value.load,
      config.value.checkMethod,
      props.data,
      props.virtualSource?.row,
    ],
    invalidate,
  )
  onBeforeUnmount(() => {
    disposed = true
    invalidate()
  })
  return {
    enabled,
    keys,
    revision,
    allowed,
    expanded,
    stateFor,
    paramsFor,
    setKeys,
    toggle,
    ensure,
    invalidate,
  }
}

export type TableDetails = ReturnType<typeof useTableDetails>

export interface TableRowDetailState {
  enabled: boolean
  expanded: boolean
  disabled: boolean
  panelId: string
  toggle: () => Promise<void>
}
