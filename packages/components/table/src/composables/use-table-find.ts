import { computed, onBeforeUnmount, shallowRef, watch } from 'vue'
import { cloneDeep, isEqual } from 'lodash-unified'
import {
  TableFindLimitError,
  planTableFindReplace,
  scanTableFind,
} from '../find-data'
import { TableDataBatchConflictError } from '../change-batch'
import { TableCellWriteConflictError } from '../cell-write-plan'
import { equalTableDataValue } from '../change-snapshot'
import { awaitTableClipboard } from '../clipboard-browser'
import { validateTableCellWrites } from './validate-cell-write'
import type { WatchSource } from 'vue'
import type { TableFindCell, TableFindScan } from '../find-data'
import type { TableEmitFn, TableProps } from '../table'
import type { TableEditContext } from '../table-edit'
import type { TableValidationRule } from '../table-validation'
import type {
  TableFindNavigateOptions,
  TableFindOptions,
  TableFindQuery,
  TableFindResult,
  TableFindState,
  TableReplaceOptions,
  TableReplaceResult,
} from '../table-find'
import type { useTableChanges } from './use-table-changes'
import type { TableValidation } from './use-table-validation'

interface Options {
  cells: (
    selected: TableFindOptions,
    current: () => boolean,
  ) => Iterable<() => TableFindCell | undefined>
  editing: () => boolean
  writable: (context: TableEditContext) => boolean
  changes: ReturnType<typeof useTableChanges>
  validation: TableValidation
  rulesFor: (context: TableEditContext) => TableValidationRule[]
  locateError: (context: TableEditContext) => Promise<boolean>
  dataContext: WatchSource[]
  viewContext: WatchSource[]
  selection: WatchSource
  context: WatchSource[]
}
interface Request {
  controller: AbortController
  applying: boolean
}

/** Search, navigation and replacement transactions share one explicit lifecycle. */
export function useTableFind(
  props: TableProps,
  emit: TableEmitFn,
  options: Options,
) {
  const config = computed(() =>
    typeof props.findConfig === 'object' ? props.findConfig : {},
  )
  const enabled = computed(
    () =>
      Boolean(props.findConfig) &&
      config.value.enabled !== false &&
      !props.loading,
  )
  const scan = shallowRef<TableFindScan>()
  const active = shallowRef(-1)
  const pending = shallowRef<TableFindState['pending']>(null)
  const query = shallowRef<TableFindQuery>({ text: '' })
  const selected = shallowRef<TableFindOptions>({
    scope: config.value.scope ?? 'view',
  })
  const lastReplace = shallowRef<TableReplaceResult>()
  let request: Request | undefined
  let navigation: AbortController | undefined
  let revision = 0
  let disposed = false
  const getState = (): TableFindState => ({
    query: { ...query.value },
    scope: selected.value.scope ?? 'view',
    matches: (scan.value?.matches ?? []).map(
      ({ context, text, occurrences }) => ({
        rowKey: context.rowKey,
        columnKey: context.columnKey,
        rowIndex: context.rowIndex,
        columnIndex: context.columnIndex,
        field: context.column.field!,
        text,
        occurrences,
      }),
    ),
    activeIndex: active.value,
    complete: scan.value?.complete ?? false,
    visited: scan.value?.visited ?? 0,
    limit: scan.value?.limit,
    pending: pending.value,
  })
  const notify = () => {
    if (!disposed) emit('findChange', getState())
  }
  const cancel = () => {
    request?.controller.abort()
    navigation?.abort()
  }
  const clear = () => {
    const hadState = Boolean(scan.value || pending.value || active.value >= 0)
    cancel()
    revision++
    scan.value = undefined
    active.value = -1
    if (hadState) notify()
  }
  const current = (version: number) =>
    !disposed && enabled.value && revision === version && !options.editing()
  const check = (version: number, signal: AbortSignal) => {
    if (signal.aborted || !current(version))
      throw new DOMException('Find cancelled', 'AbortError')
  }
  const begin = (signal?: AbortSignal) => {
    cancel()
    const item: Request = { controller: new AbortController(), applying: false }
    request = item
    const abort = () => item.controller.abort()
    signal?.addEventListener('abort', abort, { once: true })
    if (signal?.aborted) abort()
    return { item, detach: () => signal?.removeEventListener('abort', abort) }
  }
  const search = async (
    input: string | TableFindQuery,
    settings: TableFindOptions = {},
  ): Promise<TableFindResult> => {
    if (!enabled.value || disposed)
      return { success: false, reason: 'disabled', state: getState() }
    if (options.editing())
      return { success: false, reason: 'editing', state: getState() }
    const { item, detach } = begin(settings.signal)
    const version = ++revision
    query.value = typeof input === 'string' ? { text: input } : { ...input }
    selected.value = {
      ...settings,
      scope: settings.scope ?? config.value.scope ?? 'view',
      bounds: settings.bounds && { ...settings.bounds },
      columns: settings.columns && [...settings.columns],
      signal: undefined,
    }
    scan.value = undefined
    active.value = -1
    pending.value = 'search'
    notify()
    let reason: TableFindResult['reason']
    let error: unknown
    try {
      check(version, item.controller.signal)
      const valid = () => current(version) && !item.controller.signal.aborted
      const result = await scanTableFind({
        ...config.value,
        query: query.value,
        signal: item.controller.signal,
        current: valid,
        cells: options.cells(selected.value, valid),
        format: config.value.formatCell,
      })
      check(version, item.controller.signal)
      scan.value = result
    } catch (caught) {
      error = caught
      reason =
        !current(version) ||
        item.controller.signal.aborted ||
        (caught instanceof DOMException && caught.name === 'AbortError')
          ? 'cancelled'
          : caught instanceof TableDataBatchConflictError
            ? 'conflict'
            : 'invalid'
    } finally {
      detach()
      if (request === item) {
        request = undefined
        pending.value = null
        notify()
      }
    }
    return { success: !reason, reason, error, state: getState() }
  }
  const navigate = async (
    direction: 1 | -1,
    settings: TableFindNavigateOptions = {},
  ) => {
    const result = scan.value
    if (
      !enabled.value ||
      disposed ||
      pending.value ||
      options.editing() ||
      !result?.matches.length
    )
      return false
    navigation?.abort()
    const controller = new AbortController()
    navigation = controller
    const abort = () => controller.abort()
    settings.signal?.addEventListener('abort', abort, { once: true })
    if (settings.signal?.aborted) abort()
    const version = revision
    const valid = () =>
      current(version) &&
      !controller.signal.aborted &&
      navigation === controller
    const index =
      active.value < 0
        ? direction > 0
          ? 0
          : result.matches.length - 1
        : (active.value + direction + result.matches.length) %
          result.matches.length
    const match = result.matches[index]
    try {
      if (!valid() || !match.isCurrent()) {
        if (valid()) clear()
        return false
      }
      active.value = index
      notify()
      const located = await awaitTableClipboard(
        match.locate?.(valid, settings.focus !== false) ??
          Promise.resolve(false),
        controller.signal,
      )
      return valid() && located
    } catch {
      return false
    } finally {
      settings.signal?.removeEventListener('abort', abort)
      if (navigation === controller) navigation = undefined
    }
  }
  const writable = (context: TableEditContext) =>
    options.writable(context) && config.value.checkMethod?.(context) !== false
  const replace = async (
    all: boolean,
    replacement: string,
    settings: TableReplaceOptions = {},
  ): Promise<TableReplaceResult> => {
    const result: TableReplaceResult = {
      applied: false,
      changedCells: 0,
      skippedCells: 0,
    }
    let publish = true
    const finish = () => {
      if (!disposed && publish) {
        lastReplace.value = { ...result }
        emit('replace', { ...result })
      }
      return { ...result }
    }
    if (!enabled.value || disposed || !options.changes.enabled.value) {
      result.reason = 'disabled'
      return finish()
    }
    if (options.editing()) {
      result.reason = 'editing'
      return finish()
    }
    const found = scan.value
    const index = settings.index ?? active.value
    if (all && found && !found.complete) {
      result.reason = 'limit'
      return finish()
    }
    if (
      !found?.matches.length ||
      (!all &&
        (!Number.isInteger(index) ||
          index < 0 ||
          index >= found.matches.length))
    ) {
      result.reason = 'empty'
      return finish()
    }
    const { item, detach } = begin(settings.signal)
    const version = revision
    const valid = () => current(version) && !item.controller.signal.aborted
    pending.value = 'replace'
    notify()
    let accepted = false
    try {
      check(version, item.controller.signal)
      const plan = await planTableFindReplace({
        ...config.value,
        result: found,
        matches: all ? undefined : [found.matches[index]],
        replacement,
        writable,
        parse: config.value.parseCell,
        signal: item.controller.signal,
        current: valid,
      })
      result.skippedCells = plan.skipped
      if (!plan.drafts.length) {
        result.reason = 'readonly'
        return finish()
      }
      const validationConfig =
        typeof props.validationConfig === 'object' ? props.validationConfig : {}
      if (props.validationConfig && validationConfig.onCommit !== false) {
        const validation = await validateTableCellWrites(
          options.validation,
          plan.drafts,
          {
            signal: item.controller.signal,
            current: () => !disposed && revision === version,
            rulesFor: options.rulesFor,
            locate: options.locateError,
            maxErrors: validationConfig.maxErrors,
          },
        )
        check(version, item.controller.signal)
        if (!validation.valid) {
          result.reason = validation.cancelled ? 'cancelled' : 'validation'
          result.errors = validation.errors
          return finish()
        }
      }
      check(version, item.controller.signal)
      if (
        plan.drafts.some((draft) =>
          draft.cells.some(({ context }) => !writable(context)),
        )
      ) {
        result.reason = 'readonly'
        return finish()
      }
      item.applying = true
      const applied = await options.changes.updateRows(
        plan.drafts.map((draft) => draft.update),
        valid,
        item.controller.signal,
      )
      item.applying = false
      Object.assign(result, applied)
      if (applied.applied) {
        accepted = true
        result.changedCells = plan.drafts.reduce(
          (count, draft) =>
            count +
            draft.update.patches.filter((patch, i) => {
              const before = draft.update.expected![i]
              return (
                before.exists !== patch.exists ||
                !equalTableDataValue(before.value, patch.value)
              )
            }).length,
          0,
        )
      }
    } catch (error) {
      result.error = error
      result.reason =
        !valid() ||
        (error instanceof DOMException && error.name === 'AbortError')
          ? 'cancelled'
          : error instanceof TableFindLimitError
            ? 'limit'
            : error instanceof TableDataBatchConflictError ||
                error instanceof TableCellWriteConflictError
              ? 'conflict'
              : 'invalid'
    } finally {
      detach()
      publish = request === item
      if (request === item) {
        request = undefined
        pending.value = null
        notify()
      }
    }
    const outcome = finish()
    // Accepted writes invalidate old field snapshots. Refresh the same search without moving focus.
    if (accepted && valid()) {
      const refreshed = await search(query.value, selected.value)
      if (refreshed.success && scan.value?.matches.length) {
        active.value =
          Math.min(Math.max(index, 0), scan.value.matches.length - 1) - 1
        await navigate(1, { focus: false })
      }
    }
    return outcome
  }
  watch(options.dataContext, () => {
    if (!request?.applying) clear()
  })
  watch(options.viewContext, () => {
    if (selected.value.scope !== 'data' && !request?.applying) clear()
  })
  watch(options.selection, (next, previous) => {
    if (
      selected.value.scope === 'selection' &&
      !selected.value.bounds &&
      !request?.applying &&
      !isEqual(next, previous)
    )
      clear()
  })
  watch(
    () =>
      cloneDeep([
        ...options.context.map((source) =>
          typeof source === 'function' ? source() : source.value,
        ),
        props.findConfig,
        props.editConfig,
        props.validationConfig,
        props.validationRules,
        props.changeConfig,
        props.loading,
        options.editing(),
      ]),
    (next, previous) => {
      if (!isEqual(next, previous)) clear()
    },
    { flush: 'sync' },
  )
  onBeforeUnmount(() => {
    disposed = true
    cancel()
    revision++
  })
  return {
    enabled,
    config,
    pending,
    active,
    scan,
    query,
    selected,
    lastReplace,
    findCells: search,
    findNext: (settings?: TableFindNavigateOptions) => navigate(1, settings),
    findPrevious: (settings?: TableFindNavigateOptions) =>
      navigate(-1, settings),
    replaceMatch: (text: string, settings?: TableReplaceOptions) =>
      replace(false, text, settings),
    replaceAll: (text: string, settings?: TableReplaceOptions) =>
      replace(true, text, settings),
    clearFind: clear,
    cancelFind: cancel,
    getFindState: getState,
  }
}
export type TableFindController = ReturnType<typeof useTableFind>
