import { computed, nextTick, onBeforeUnmount, shallowRef, watch } from 'vue'
import { cloneDeep, isEqual } from 'lodash-unified'
import { tableFieldValue } from '../data-utils'
import { applyTableEditChanges, editableField } from '../edit-utils'
import type { TableEmitFn, TableProps } from '../table'
import type {
  TableEditChange,
  TableEditContext,
  TableEditEndParams,
  TableEditReason,
  TableEditRecord,
  TableEditSlotParams,
} from '../table-edit'

interface EditValidationHooks {
  validate?: (record: TableEditRecord) => boolean | Promise<boolean>
  invalidate?: (context: TableEditContext, field?: string) => void
}

export function useTableEdit(
  props: TableProps,
  emit: TableEmitFn,
  resolveContext: (params: TableEditContext) => TableEditContext | undefined = (
    params,
  ) => params,
  validation: EditValidationHooks = {},
) {
  const config = computed(() =>
    typeof props.editConfig === 'object' ? props.editConfig : {},
  )
  const enabled = computed(
    () =>
      Boolean(props.editConfig) &&
      config.value.enabled !== false &&
      !props.loading,
  )
  const active = shallowRef<
    (TableEditContext & { mode: 'cell' | 'row'; id: number }) | null
  >(null)
  const changes = shallowRef(new Map<string, TableEditChange>())
  const baselines = new Map<string, unknown>()
  const attached = new Map<string, number>()
  let sequence = 0
  let focused = false
  let disposed = false
  let draftRevision = 0
  const committing = shallowRef(false)
  const contextRetained = shallowRef(false)
  let pendingCommit:
    { session: number; revision: number; promise: Promise<boolean> } | undefined
  const identity = (params: TableEditContext) =>
    JSON.stringify([typeof params.rowKey, params.rowKey, params.columnKey])
  const isEditable = (params: TableEditContext) =>
    enabled.value &&
    !params.column.type &&
    editableField(params.column.field) &&
    Boolean(params.column.editor) &&
    (typeof params.column.editor !== 'object' ||
      params.column.editor.checkMethod?.(params) !== false) &&
    config.value.checkMethod?.(params) !== false
  const isEditing = (params: TableEditContext) =>
    Boolean(
      active.value &&
      isEditable(params) &&
      active.value.rowKey === params.rowKey &&
      (active.value.mode === 'row' ||
        active.value.columnKey === params.columnKey),
    )
  const draftRow = computed(() =>
    active.value
      ? applyTableEditChanges(active.value.row, [...changes.value.values()])
      : {},
  )
  const record = (): TableEditRecord | null =>
    active.value
      ? {
          ...active.value,
          changes: [...changes.value.values()].map((change) => ({
            ...change,
            oldValue: cloneDeep(change.oldValue),
            value: cloneDeep(change.value),
          })),
          updatedRow: applyTableEditChanges(active.value.row, [
            ...changes.value.values(),
          ]),
        }
      : null
  const clear = () => {
    if (active.value) validation.invalidate?.(active.value)
    active.value = null
    changes.value = new Map()
    baselines.clear()
    focused = false
    draftRevision++
    committing.value = false
    pendingCommit = undefined
    contextRetained.value = false
  }
  const cancel = (reason: TableEditReason = 'api') => {
    const current = record()
    if (current || reason !== 'data') sequence++
    clear()
    if (current) emit('editCancel', { ...current, reason })
  }
  const canCommit = (): boolean => {
    if (!active.value) return false
    if (!isEditable(active.value)) {
      cancel('disabled')
      return false
    }
    for (const change of changes.value.values()) {
      if (
        !isEditable({
          ...active.value,
          column: change.column,
          columnKey: change.columnKey,
        })
      ) {
        cancel('disabled')
        return false
      }
      if (
        !isEqual(
          tableFieldValue(active.value.row, change.field),
          change.oldValue,
        )
      ) {
        cancel('conflict')
        return false
      }
    }
    return true
  }
  const commit = (
    reason: TableEditReason = 'api',
  ): boolean | Promise<boolean> => {
    if (!active.value) return true
    if (!canCommit()) return false
    const session = active.value.id
    const revision = draftRevision
    if (
      pendingCommit?.session === session &&
      pendingCommit.revision === revision
    )
      return pendingCommit.promise
    const finish = (valid: boolean) => {
      if (
        !valid ||
        disposed ||
        active.value?.id !== session ||
        draftRevision !== revision ||
        !canCommit()
      )
        return false
      const current = record()!
      clear()
      emit('editCommit', { ...current, reason } satisfies TableEditEndParams)
      return true
    }
    let result: boolean | Promise<boolean>
    try {
      result = validation.validate?.(record()!) ?? true
    } catch {
      return false
    }
    if (typeof result === 'boolean') return finish(result)
    committing.value = true
    const promise = Promise.resolve(result)
      .then(finish, () => false)
      .finally(() => {
        if (pendingCommit?.promise === promise) {
          pendingCommit = undefined
          committing.value = false
        }
      })
    pendingCommit = { session, revision, promise }
    return promise
  }
  const start = (params: TableEditContext): boolean | Promise<boolean> => {
    if (disposed || !isEditable(params)) return false
    if (isEditing(params)) {
      focused = false
      active.value = { ...active.value!, ...params }
      return true
    }
    if (active.value) {
      if (config.value.onSwitch === 'cancel') cancel('switch')
      else {
        const request = ++sequence
        const result = commit('switch')
        const openNext = () => {
          if (disposed || request !== sequence) return false
          const latest = resolveContext(params)
          return latest ? start(latest) : false
        }
        if (typeof result !== 'boolean')
          return result.then(async (valid) => {
            if (!valid) return false
            await nextTick()
            return openNext()
          })
        if (!result) return false
        nextTick(openNext)
        return true
      }
    }
    active.value = {
      ...params,
      mode: config.value.mode ?? 'cell',
      id: ++sequence,
    }
    baselines.set(
      params.column.field!,
      cloneDeep(tableFieldValue(params.row, params.column.field)),
    )
    focused = false
    emit('editStart', record()!)
    return true
  }
  const setValue = (params: TableEditContext, value: unknown) => {
    if (!isEditing(params)) return
    const field = params.column.field!
    draftRevision++
    validation.invalidate?.(params, field)
    pendingCommit = undefined
    committing.value = false
    if (!baselines.has(field))
      baselines.set(field, cloneDeep(tableFieldValue(active.value!.row, field)))
    const oldValue = baselines.get(field)
    const next = new Map(changes.value)
    if (isEqual(oldValue, value)) next.delete(field)
    else
      next.set(field, {
        field,
        column: params.column,
        columnKey: params.columnKey,
        oldValue,
        value: cloneDeep(value),
      })
    changes.value = next
    emit('editChange', record()!)
  }
  const valueFor = (params: TableEditContext) => {
    const field = params.column.field!
    return changes.value.has(field) && isEditing(params)
      ? changes.value.get(field)!.value
      : tableFieldValue(params.row, field)
  }
  const slotParams = (params: TableEditContext): TableEditSlotParams => ({
    ...params,
    value: valueFor(params),
    mode: active.value?.mode ?? config.value.mode ?? 'cell',
    draftRow: draftRow.value,
    setValue: (value) => setValue(params, value),
    commit: async () => commit(),
    cancel: () => cancel(),
  })
  const contextChanged = (reason: TableEditReason) => {
    if (!active.value) {
      sequence++
      return
    }
    if (config.value.onContextChange === 'commit') {
      contextRetained.value = true
      commit(reason)
    } else cancel(reason)
  }
  const attach = (params: TableEditContext) => {
    const key = identity(params)
    attached.set(key, (attached.get(key) ?? 0) + 1)
    const field = params.column.field!
    if (isEditing(params) && !baselines.has(field))
      baselines.set(field, cloneDeep(tableFieldValue(active.value!.row, field)))
    return () => {
      const count = (attached.get(key) ?? 1) - 1
      if (count) attached.set(key, count)
      else attached.delete(key)
      const session = active.value?.id
      nextTick(() => {
        if (disposed || !active.value || active.value.id !== session) return
        const remains =
          active.value.mode === 'cell'
            ? attached.has(identity(active.value))
            : [...attached.keys()].some((entry) => {
                const [type, rowKey] = JSON.parse(entry)
                return (
                  type === typeof active.value!.rowKey &&
                  rowKey === active.value!.rowKey
                )
              })
        if (
          contextRetained.value ||
          remains ||
          !config.value.onScroll ||
          config.value.onScroll === 'keep'
        )
          return
        if (config.value.onScroll === 'commit') {
          contextRetained.value = true
          commit('scroll')
        } else cancel('scroll')
      })
    }
  }
  const consumeFocus = (params: TableEditContext) => {
    if (
      !isEditing(params) ||
      focused ||
      active.value?.columnKey !== params.columnKey
    )
      return false
    focused = true
    return true
  }
  watch(
    () => [props.data, props.virtualSource?.row],
    () => cancel('data'),
  )
  watch([enabled, () => config.value.mode], () => cancel('disabled'))
  watch(
    () => (active.value ? isEditable(active.value) : true),
    (allowed) => {
      if (!allowed) cancel('disabled')
    },
  )
  const focus = (params: TableEditContext) => {
    if (!isEditing(params)) return
    active.value = { ...active.value!, ...params }
    focused = true
  }
  onBeforeUnmount(() => {
    disposed = true
    cancel('unmount')
    attached.clear()
  })
  return {
    active,
    committing,
    contextRetained,
    enabled,
    config,
    isEditable,
    isEditing,
    valueFor,
    slotParams,
    start,
    commit,
    cancel,
    setValue,
    record,
    contextChanged,
    attach,
    consumeFocus,
    focus,
  }
}

export type TableEditing = ReturnType<typeof useTableEdit>
