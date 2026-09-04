import { onBeforeUnmount, shallowRef } from 'vue'
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
      }
    }
    errors.value = next
  }
  const getError = (rowKey: TableRowKey, field?: string) =>
    field ? errors.value.get(key(rowKey, field)) : undefined
  const isPending = (rowKey: TableRowKey, field?: string) =>
    Boolean(field && pending.value === key(rowKey, field))
  const getErrors = () =>
    [...errors.value.values()].map((error) => ({
      ...error,
      value: cloneDeep(error.value),
    }))
  const scrollToError = async (error = getErrors()[0]): Promise<boolean> =>
    error
      ? ((await locations.get(key(error.rowKey, error.field))?.()) ?? false)
      : false

  const run = async (
    cells: Iterable<TableValidationCell>,
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
    const nextErrors = options.clear
      ? new Map<string, TableValidationError>()
      : new Map(errors.value)
    const nextLocations = options.clear
      ? new Map<string, NonNullable<TableValidationCell['locate']>>()
      : new Map(locations)
    const limit = Number.isFinite(options.maxErrors)
      ? Math.max(1, Math.floor(options.maxErrors!))
      : 100
    let checked = 0
    let visited = 0
    let truncated = false
    const stale = () =>
      current.signal.aborted || disposed || request !== revision
    try {
      for (const cell of cells) {
        if (stale()) break
        // Include cells without rules in the scheduling budget as well.
        if (++visited % 100 === 0) {
          await new Promise<void>((resolve) => setTimeout(resolve, 0))
          if (stale()) break
        }
        if (!cell.rules.length) continue
        const id = key(cell.rowKey, cell.field)
        pending.value = id
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
        if (message !== undefined) {
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
          if (cell.locate) nextLocations.set(id, cell.locate)
          if (collected.length >= limit) {
            truncated = true
            break
          }
        }
      }
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
