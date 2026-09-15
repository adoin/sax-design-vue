import { computed, onBeforeUnmount, shallowRef } from 'vue'
import { cloneDeep, isEqual } from 'lodash-unified'
import {
  awaitValidation,
  defaultTableValidationMessages,
  validateTableValue,
  validateTableValueSync,
} from '../validation-utils'
import type { TableValidationMessages } from '../validation-utils'
import type { TableRowKey } from '../table'
import type {
  TableValidationCell,
  TableValidationError,
  TableValidationResult,
} from '../table-validation'

interface ValidationRunOptions {
  signal?: AbortSignal
  maxErrors?: number
  concurrency?: number
  clear?: boolean
  scrollToError?: boolean
}

export function useTableValidation(
  onResult: (result: TableValidationResult) => void,
  messages: TableValidationMessages = defaultTableValidationMessages,
) {
  const errors = shallowRef(new Map<string, TableValidationError>())
  const pending = shallowRef<string | null>(null)
  const pendingFields = shallowRef<ReadonlySet<string>>(new Set())
  const running = shallowRef(false)
  const navigationVisible = shallowRef(false)
  const errorCountTruncated = shallowRef(false)
  const activeErrorId = shallowRef<string>()
  const previewedErrorId = shallowRef<string>()
  const presentationRevision = shallowRef(0)
  const validity = new Map<string, () => boolean>()
  const locations = new Map<
    string,
    NonNullable<TableValidationCell['locate']>
  >()
  let controller: AbortController | undefined
  let revision = 0
  let disposed = false
  const key = (rowKey: TableRowKey, field: string) =>
    JSON.stringify([typeof rowKey, rowKey, field])
  const cancel = () => {
    revision++
    controller?.abort()
    controller = undefined
    running.value = false
    pending.value = null
    pendingFields.value = new Set()
  }
  const clear = (rowKey?: TableRowKey, field?: string) => {
    cancel()
    const next = new Map(errors.value)
    for (const [id, error] of next) {
      if (
        (rowKey === undefined || error.rowKey === rowKey) &&
        (field === undefined || error.field === field)
      ) {
        next.delete(id)
        locations.delete(id)
        validity.delete(id)
      }
    }
    if (next.size !== errors.value.size) errors.value = next
    const available = getErrorEntries()
    if (!available.length) {
      activeErrorId.value = undefined
      previewedErrorId.value = undefined
      errorCountTruncated.value = false
      navigationVisible.value = false
    } else if (!available.some(([id]) => id === activeErrorId.value)) {
      activeErrorId.value = available[0]?.[0]
    }
    if (!available.some(([id]) => id === previewedErrorId.value))
      previewedErrorId.value = undefined
  }
  const getError = (rowKey: TableRowKey, field?: string) => {
    if (!field) return undefined
    const id = key(rowKey, field)
    const error = errors.value.get(id)
    return error && validity.get(id)?.() ? error : undefined
  }
  const isPending = (rowKey: TableRowKey, field?: string) =>
    Boolean(field && pendingFields.value.has(key(rowKey, field)))
  const getErrorEntries = () =>
    [...errors.value.entries()].filter(([id]) => validity.get(id)?.())
  const getErrors = () =>
    getErrorEntries().map(([, error]) => ({
      ...error,
      value: cloneDeep(error.value),
    }))
  const scrollToError = async (error = getErrors()[0]): Promise<boolean> =>
    error && getError(error.rowKey, error.field)
      ? ((await locations.get(key(error.rowKey, error.field))?.()) ?? false)
      : false
  const activeError = computed(() => {
    const entries = getErrorEntries()
    const active = entries.find(([id]) => id === activeErrorId.value)
    return active?.[1] ?? entries[0]?.[1]
  })
  const activeErrorIndex = computed(() => {
    const entries = getErrorEntries()
    const index = entries.findIndex(([id]) => id === activeErrorId.value)
    return index >= 0 ? index : entries.length ? 0 : -1
  })
  const errorCount = computed(() => getErrorEntries().length)
  const activeErrorPreviewed = computed(
    () =>
      Boolean(previewedErrorId.value) &&
      previewedErrorId.value === activeErrorId.value,
  )
  const preview = (rowKey: TableRowKey, field?: string): boolean => {
    const error = getError(rowKey, field)
    if (!error) return false
    const id = key(error.rowKey, error.field)
    activeErrorId.value = id
    previewedErrorId.value = id
    return true
  }
  const dismissPreview = (rowKey: TableRowKey, field?: string) => {
    if (field && previewedErrorId.value === key(rowKey, field))
      previewedErrorId.value = undefined
  }
  const activate = async (
    rowKey: TableRowKey,
    field?: string,
  ): Promise<boolean> => {
    const error = getError(rowKey, field)
    if (!error) return false
    activeErrorId.value = key(error.rowKey, error.field)
    navigationVisible.value = true
    presentationRevision.value++
    return scrollToError(error)
  }
  const navigate = async (step: -1 | 1): Promise<boolean> => {
    const entries = getErrorEntries()
    if (!entries.length) return false
    const current = activeErrorIndex.value
    const index =
      (Math.max(0, current) + step + entries.length) % entries.length
    const [id, error] = entries[index]!
    activeErrorId.value = id
    previewedErrorId.value = undefined
    navigationVisible.value = true
    presentationRevision.value++
    return scrollToError(error)
  }
  const closeNavigation = () => {
    navigationVisible.value = false
  }

  const run = async (
    cells: Iterable<TableValidationCell | undefined>,
    options: ValidationRunOptions = {},
  ): Promise<TableValidationResult> => {
    cancel()
    const request = revision
    const current = new AbortController()
    controller = current
    running.value = true
    const abort = () => current.abort()
    options.signal?.addEventListener('abort', abort, { once: true })
    if (options.signal?.aborted || disposed) current.abort()
    const collected: TableValidationError[] = []
    const failedFields = new Set<string>()
    const nextErrors = options.clear
      ? new Map<string, TableValidationError>()
      : new Map(errors.value)
    const nextLocations = options.clear
      ? new Map<string, NonNullable<TableValidationCell['locate']>>()
      : new Map(locations)
    const nextValidity = options.clear
      ? new Map<string, () => boolean>()
      : new Map(validity)
    const limit = Number.isFinite(options.maxErrors)
      ? Math.max(1, Math.floor(options.maxErrors!))
      : 100
    const concurrency = Number.isFinite(options.concurrency)
      ? Math.min(32, Math.max(1, Math.floor(options.concurrency!)))
      : 8
    let checked = 0
    let visited = 0
    let lastYield = Date.now()
    let truncated = false
    const stale = () =>
      current.signal.aborted || disposed || request !== revision
    const commit = (
      cell: TableValidationCell,
      id: string,
      value: unknown,
      message: string | undefined,
    ) => {
      if (!cell.isCurrent() || !isEqual(value, cell.readValue())) {
        current.abort()
        return false
      }
      checked++
      nextErrors.delete(id)
      nextLocations.delete(id)
      nextValidity.delete(id)
      if (message === undefined) return true
      failedFields.add(id)
      const error: TableValidationError = {
        row: cell.row,
        rowKey: cell.rowKey,
        rowIndex: cell.rowIndex,
        column: cell.column,
        columnIndex: cell.columnIndex,
        field: cell.field,
        value,
        message,
      }
      collected.push(error)
      nextErrors.set(id, error)
      nextValidity.set(
        id,
        () => cell.isCurrent() && isEqual(value, cell.readValue()),
      )
      if (cell.locate) nextLocations.set(id, cell.locate)
      if (collected.length >= limit) truncated = true
      return true
    }
    try {
      const iterator = cells[Symbol.iterator]()
      let deferred: TableValidationCell | undefined
      let hasDeferred = false
      let complete = false
      let invalidated = false
      while (!complete && !truncated && !stale() && !invalidated) {
        let cell: TableValidationCell | undefined
        if (hasDeferred) {
          cell = deferred
          deferred = undefined
          hasDeferred = false
        } else {
          const next = iterator.next()
          if (next.done) break
          cell = next.value
          visited++
        }
        if (stale()) break
        // Include cells without rules in the scheduling budget as well.
        if (visited % 128 === 0 && Date.now() - lastYield >= 8) {
          await new Promise<void>((resolve) => setTimeout(resolve, 0))
          lastYield = Date.now()
          if (stale()) break
        }
        if (!cell?.rules.length) continue
        const id = key(cell.rowKey, cell.field)
        // Several columns can address one field. A later passing column must
        // not erase an earlier failure for that field in the same batch.
        if (failedFields.has(id)) continue
        const value = cloneDeep(cell.value)
        const context = { ...cell, value, signal: current.signal }
        if (!cell.rules.some((rule) => rule.validator)) {
          const message = validateTableValueSync(context, cell.rules, messages)
          if (stale() || !commit(cell, id, value, message)) break
          continue
        }

        const batch = [{ cell, id, value, context }]
        const batchIds = new Set([id])
        const capacity = Math.min(concurrency, limit - collected.length)
        while (batch.length < capacity && !stale()) {
          const next = iterator.next()
          if (next.done) {
            complete = true
            break
          }
          visited++
          const candidate = next.value
          if (!candidate?.rules.length) continue
          const candidateId = key(candidate.rowKey, candidate.field)
          if (failedFields.has(candidateId)) continue
          if (
            batchIds.has(candidateId) ||
            !candidate.rules.some((rule) => rule.validator)
          ) {
            deferred = candidate
            hasDeferred = true
            break
          }
          const candidateValue = cloneDeep(candidate.value)
          batchIds.add(candidateId)
          batch.push({
            cell: candidate,
            id: candidateId,
            value: candidateValue,
            context: {
              ...candidate,
              value: candidateValue,
              signal: current.signal,
            },
          })
        }
        if (stale()) break
        pendingFields.value = new Set(batchIds)
        pending.value = batch[0]!.id
        const outcomes = await Promise.all(
          batch.map(({ cell: target, context: targetContext }) =>
            awaitValidation(
              validateTableValue(targetContext, target.rules, messages),
              current.signal,
            ),
          ),
        )
        pending.value = null
        pendingFields.value = new Set()
        if (stale()) break
        for (const [index, prepared] of batch.entries())
          if (
            !commit(prepared.cell, prepared.id, prepared.value, outcomes[index])
          ) {
            invalidated = true
            break
          }
      }
      if (
        collected.some(
          (error) => !nextValidity.get(key(error.rowKey, error.field))?.(),
        )
      )
        current.abort()
      const cancelled = stale()
      const result: TableValidationResult = {
        valid: !cancelled && !collected.length,
        errors: cancelled
          ? []
          : collected.map((error) => ({
              ...error,
              value: cloneDeep(error.value),
            })),
        cancelled,
        truncated: !cancelled && truncated,
        checked,
      }
      if (!cancelled) {
        validity.clear()
        nextValidity.forEach((check, id) => validity.set(id, check))
        errors.value = nextErrors
        previewedErrorId.value = undefined
        locations.clear()
        nextLocations.forEach((locate, id) => locations.set(id, locate))
        pending.value = null
        pendingFields.value = new Set()
        const available = getErrorEntries()
        errorCountTruncated.value = options.clear
          ? result.truncated
          : errorCountTruncated.value || result.truncated
        if (result.errors.length) {
          activeErrorId.value = key(
            result.errors[0]!.rowKey,
            result.errors[0]!.field,
          )
          navigationVisible.value = true
          presentationRevision.value++
        } else if (!available.length) {
          activeErrorId.value = undefined
          errorCountTruncated.value = false
          navigationVisible.value = false
        } else if (!available.some(([id]) => id === activeErrorId.value)) {
          activeErrorId.value = available[0]?.[0]
        }
        onResult({
          ...result,
          errors: result.errors.map((error) => ({
            ...error,
            value: cloneDeep(error.value),
          })),
        })
        if (!stale() && options.scrollToError && result.errors.length)
          await scrollToError(result.errors[0])
      }
      return result
    } finally {
      options.signal?.removeEventListener('abort', abort)
      if (request === revision) {
        running.value = false
        pending.value = null
        pendingFields.value = new Set()
        controller = undefined
      }
    }
  }
  onBeforeUnmount(() => {
    disposed = true
    clear()
  })
  return {
    hasErrors: computed(() => getErrors().length > 0),
    run,
    clear,
    cancel,
    getError,
    getErrors,
    isPending,
    running,
    pending,
    scrollToError,
    activeError,
    activeErrorIndex,
    errorCount,
    errorCountTruncated,
    activeErrorPreviewed,
    presentationRevision,
    navigationVisible,
    preview,
    dismissPreview,
    activate,
    navigate,
    closeNavigation,
  }
}

export type TableValidation = ReturnType<typeof useTableValidation>
