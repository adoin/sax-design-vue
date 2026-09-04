import { computed, onBeforeUnmount, shallowRef } from 'vue'
import { cloneDeep, isEqual } from 'lodash-unified'
import {
  awaitValidation,
  defaultTableValidationMessages,
  validateTableValue,
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
  clear?: boolean
  scrollToError?: boolean
}

export function useTableValidation(
  onResult: (result: TableValidationResult) => void,
  messages: TableValidationMessages = defaultTableValidationMessages,
) {
  const errors = shallowRef(new Map<string, TableValidationError>())
  const pending = shallowRef<string | null>(null)
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
    pending.value = null
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
  }
  const getError = (rowKey: TableRowKey, field?: string) => {
    if (!field) return undefined
    const id = key(rowKey, field)
    const error = errors.value.get(id)
    return error && validity.get(id)?.() ? error : undefined
  }
  const isPending = (rowKey: TableRowKey, field?: string) =>
    Boolean(field && pending.value === key(rowKey, field))
  const getErrors = () =>
    [...errors.value.entries()]
      .filter(([id]) => validity.get(id)?.())
      .map(([, error]) => ({
        ...error,
        value: cloneDeep(error.value),
      }))
  const scrollToError = async (error = getErrors()[0]): Promise<boolean> =>
    error && getError(error.rowKey, error.field)
      ? ((await locations.get(key(error.rowKey, error.field))?.()) ?? false)
      : false

  const run = async (
    cells: Iterable<TableValidationCell | undefined>,
    options: ValidationRunOptions = {},
  ): Promise<TableValidationResult> => {
    cancel()
    const request = revision
    const current = new AbortController()
    controller = current
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
    let checked = 0
    let visited = 0
    let lastYield = Date.now()
    let truncated = false
    const stale = () =>
      current.signal.aborted || disposed || request !== revision
    try {
      for (const cell of cells) {
        if (stale()) break
        // Include cells without rules in the scheduling budget as well.
        if (++visited % 100 === 0 || Date.now() - lastYield >= 8) {
          await new Promise<void>((resolve) => setTimeout(resolve, 0))
          lastYield = Date.now()
          if (stale()) break
        }
        if (!cell?.rules.length) continue
        const id = key(cell.rowKey, cell.field)
        // Several columns can address one field. A later passing column must
        // not erase an earlier failure for that field in the same batch.
        if (failedFields.has(id)) continue
        // Built-in rules do not wait for external work. Avoid rerendering
        // the visible window for each offscreen field in a synchronous scan.
        pending.value = cell.rules.some((rule) => rule.validator) ? id : null
        const value = cloneDeep(cell.value)
        const message = await awaitValidation(
          validateTableValue(
            {
              ...cell,
              value,
              signal: current.signal,
            },
            cell.rules,
            messages,
          ),
          current.signal,
        )
        if (stale()) break
        if (!cell.isCurrent() || !isEqual(value, cell.readValue())) {
          current.abort()
          break
        }
        checked++
        nextErrors.delete(id)
        nextLocations.delete(id)
        nextValidity.delete(id)
        if (message !== undefined) {
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
          if (collected.length >= limit) {
            truncated = true
            break
          }
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
        locations.clear()
        nextLocations.forEach((locate, id) => locations.set(id, locate))
        pending.value = null
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
        pending.value = null
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
    pending,
    scrollToError,
  }
}

export type TableValidation = ReturnType<typeof useTableValidation>
