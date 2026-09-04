import { computed, onBeforeUnmount, shallowRef, watch } from 'vue'
import { cloneDeep, isEqual } from 'lodash-unified'
import {
  TableClipboardShapeError,
  planTableClipboardPaste,
  readTableClipboardRegion,
} from '../clipboard-data'
import {
  TableClipboardLimitError,
  checkTableClipboardArea,
  parseTableClipboardText,
  tableClipboardLimits,
} from '../clipboard-text'
import {
  awaitTableClipboard,
  readTableClipboard,
  writeTableClipboard,
} from '../clipboard-browser'
import { parseTableClipboardValue } from '../clipboard-value'
import { equalTableDataValue } from '../change-snapshot'
import { readTableDataField } from '../change-utils'
import type { WatchSource } from 'vue'
import type { TableClipboardCell, TableClipboardDraft } from '../clipboard-data'
import type {
  TableClipboardAction,
  TableClipboardData,
  TableClipboardOptions,
  TableClipboardResult,
  TableCopyOptions,
} from '../table-clipboard'
import type { TableCellRangeBounds } from '../table-cell-range'
import type { TableEditContext } from '../table-edit'
import type { TableEmitFn, TableProps } from '../table'
import type {
  TableValidationCell,
  TableValidationRule,
} from '../table-validation'
import type { useTableChanges } from './use-table-changes'
import type { TableValidation } from './use-table-validation'

interface Options {
  root: () => HTMLElement | undefined
  bounds: () => TableCellRangeBounds | undefined | null
  count: () => { rows: number; columns: number }
  cells: (
    bounds: TableCellRangeBounds,
  ) => (row: number, column: number) => TableClipboardCell | undefined
  writable: (context: TableEditContext) => boolean
  editing: () => boolean
  changes: ReturnType<typeof useTableChanges>
  validation: TableValidation
  rulesFor: (context: TableEditContext) => TableValidationRule[]
  locate: (context: TableEditContext) => Promise<boolean>
  context: WatchSource[]
  dataContext: WatchSource[]
}
interface Request {
  controller: AbortController
  applying: boolean
  result: TableClipboardResult
}
class ClipboardAccessError extends Error {
  constructor(readonly error: unknown) {
    super('System clipboard access failed')
    this.name = 'ClipboardAccessError'
  }
}

/** Clipboard lifecycle and transactions; rendering/coordinates remain owned by STable. */
export function useTableClipboard(
  props: TableProps,
  emit: TableEmitFn,
  options: Options,
) {
  const config = computed(() =>
    typeof props.clipboardConfig === 'object' ? props.clipboardConfig : {},
  )
  const enabled = computed(
    () =>
      Boolean(props.clipboardConfig) &&
      config.value.enabled !== false &&
      !props.loading,
  )
  const pending = shallowRef<TableClipboardAction | null>(null)
  const last = shallowRef<TableClipboardResult>()
  let request: Request | undefined
  let disposed = false
  const cancel = () => request?.controller.abort()
  const current = (item: Request) =>
    !disposed &&
    request === item &&
    !item.controller.signal.aborted &&
    enabled.value &&
    !options.editing()
  const check = (item: Request) => {
    if (!current(item))
      throw new DOMException(
        'Table clipboard operation cancelled',
        'AbortError',
      )
  }
  const writable = (context: TableEditContext) =>
    options.writable(context) && config.value.checkMethod?.(context) !== false
  const finish = (result: TableClipboardResult) => {
    const snapshot = { ...result }
    if (!disposed) {
      last.value = snapshot
      emit('clipboard', snapshot)
    }
    return snapshot
  }
  const run = async (
    action: TableClipboardAction,
    selected: TableClipboardOptions,
    task: (item: Request) => Promise<void>,
  ): Promise<TableClipboardResult> => {
    const result: TableClipboardResult = {
      action,
      success: false,
      applied: false,
      clipboardWritten: false,
      changedCells: 0,
      skippedCells: 0,
    }
    if (disposed || !enabled.value || config.value[action] === false)
      return finish({ ...result, reason: 'disabled' })
    if (options.editing()) return finish({ ...result, reason: 'editing' })
    if (action !== 'copy' && !options.changes.enabled.value)
      return finish({ ...result, reason: 'disabled' })
    cancel()
    const item: Request = {
      controller: new AbortController(),
      applying: false,
      result,
    }
    request = item
    pending.value = action
    const abort = () => item.controller.abort()
    selected.signal?.addEventListener('abort', abort, { once: true })
    if (selected.signal?.aborted) abort()
    let publish = false
    try {
      check(item)
      await task(item)
    } catch (error) {
      result.error = error instanceof ClipboardAccessError ? error.error : error
      result.reason =
        !current(item) ||
        (error instanceof DOMException && error.name === 'AbortError')
          ? 'cancelled'
          : error instanceof TableClipboardLimitError
            ? 'limit'
            : error instanceof TableClipboardShapeError
              ? 'shape'
              : error instanceof ClipboardAccessError
                ? 'clipboard'
                : 'invalid'
    } finally {
      selected.signal?.removeEventListener('abort', abort)
      publish = request === item
      if (publish) {
        pending.value = null
        request = undefined
      }
    }
    // Older cancelled requests resolve for their caller but cannot replace new feedback.
    return publish ? finish(result) : { ...result }
  }
  const region = (
    selected: TableClipboardOptions,
  ): TableCellRangeBounds | undefined => {
    const bounds = selected.bounds ?? options.bounds()
    if (!bounds) return
    const limits = tableClipboardLimits(config.value)
    const count = options.count()
    if (
      ![bounds.rowStart, bounds.rowEnd, bounds.colStart, bounds.colEnd].every(
        (value) => Number.isSafeInteger(value) && value >= 0,
      ) ||
      bounds.rowEnd > count.rows ||
      bounds.colEnd > count.columns
    )
      throw new TableClipboardShapeError(
        'Clipboard region is outside the current data view',
      )
    checkTableClipboardArea(
      bounds.rowEnd - bounds.rowStart,
      bounds.colEnd - bounds.colStart,
      limits.maxCells,
    )
    return { ...bounds }
  }
  const validate = async (item: Request, drafts: TableClipboardDraft[]) => {
    const validationConfig =
      typeof props.validationConfig === 'object' ? props.validationConfig : {}
    if (!props.validationConfig || validationConfig.onCommit === false)
      return true
    function* cells(): Generator<TableValidationCell> {
      for (const draft of drafts) {
        const unchanged = () =>
          !disposed &&
          !item.controller.signal.aborted &&
          draft.update.expected!.every((expected) => {
            const actual = readTableDataField(draft.row, expected.field)
            return (
              actual.exists === expected.exists &&
              equalTableDataValue(actual.value, expected.value)
            )
          })
        for (const { context, value } of draft.cells)
          yield {
            ...context,
            field: context.column.field!,
            draftRow: draft.draftRow,
            value,
            rules: options.rulesFor(context),
            isCurrent: unchanged,
            readValue: () =>
              readTableDataField(draft.draftRow, context.column.field!).value,
            locate: () => options.locate(context),
          }
      }
    }
    const result = await options.validation.run(cells(), {
      signal: item.controller.signal,
      clear: false,
      maxErrors: validationConfig.maxErrors,
      // Keep focus stable while native copy/cut operations are still in flight.
      scrollToError: false,
    })
    check(item)
    if (!result.valid) {
      item.result.reason = result.cancelled ? 'cancelled' : 'validation'
      item.result.errors = result.errors
      return false
    }
    return true
  }
  const commit = async (
    item: Request,
    plan: Awaited<ReturnType<typeof planTableClipboardPaste>>,
    sourceCurrent?: () => boolean,
  ) => {
    item.result.skippedCells = plan.skipped
    if (!plan.drafts.length) {
      item.result.reason = 'readonly'
      return
    }
    if (!(await validate(item, plan.drafts))) return
    check(item)
    if (sourceCurrent && !sourceCurrent())
      throw new DOMException('Clipboard source changed', 'AbortError')
    if (
      plan.drafts.some((draft) =>
        draft.cells.some(({ context }) => !writable(context)),
      )
    ) {
      item.result.reason = 'readonly'
      return
    }
    item.applying = true
    const result = await options.changes.updateRows(
      plan.drafts.map(({ update }) => update),
      () => current(item),
      item.controller.signal,
    )
    item.applying = false
    item.result.applied = result.applied
    item.result.success = result.applied
    item.result.reason = result.reason
    item.result.error = result.error
    if (result.applied)
      item.result.changedCells = plan.drafts.reduce(
        (count, draft) =>
          count +
          draft.update.patches.filter((patch, index) => {
            const before = draft.update.expected![index]
            return (
              before.exists !== patch.exists ||
              !equalTableDataValue(before.value, patch.value)
            )
          }).length,
        0,
      )
  }
  const copy = (action: 'copy' | 'cut', selected: TableCopyOptions = {}) =>
    run(action, selected, async (item) => {
      const bounds = region(selected)
      if (!bounds) {
        item.result.reason = 'empty'
        return
      }
      item.result.bounds = bounds
      const cellAt = options.cells(bounds)
      const prepared = readTableClipboardRegion({
        ...config.value,
        bounds,
        cellAt,
        signal: item.controller.signal,
        current: () => current(item),
        format: config.value.formatCell,
      })
      // This call must occur before the first await so the initiating gesture is retained.
      let writing: Promise<void> | undefined
      if (selected.writeClipboard !== false) {
        item.result.clipboardWritten = null
        writing = writeTableClipboard(
          options.root(),
          prepared.then(({ text }) => text),
        ).then(
          () => {
            item.result.clipboardWritten = true
          },
          (error) => {
            item.result.clipboardWritten = false
            throw new ClipboardAccessError(error)
          },
        )
        writing.catch(() => {})
      }
      const snapshot = await awaitTableClipboard(
        prepared,
        item.controller.signal,
      )
      item.result.data = snapshot.data
      item.result.text = snapshot.text
      if (writing) await awaitTableClipboard(writing, item.controller.signal)
      check(item)
      if (!snapshot.isCurrent())
        throw new DOMException('Clipboard source changed', 'AbortError')
      if (action === 'copy') {
        item.result.success = true
        return
      }
      const plan = await planTableClipboardPaste({
        ...config.value,
        bounds,
        cellAt,
        data: [[null]],
        writable,
        parse: (_value, context) =>
          config.value.clearCell ? config.value.clearCell(context) : null,
        signal: item.controller.signal,
        current: () => current(item) && snapshot.isCurrent(),
      })
      await commit(item, plan, snapshot.isCurrent)
    })
  const paste = (
    input?: string | TableClipboardData,
    selected: TableClipboardOptions = {},
  ) =>
    run('paste', selected, async (item) => {
      let bounds = region(selected)
      if (!bounds) {
        item.result.reason = 'empty'
        return
      }
      const received =
        input === undefined
          ? await awaitTableClipboard(
              readTableClipboard(options.root()).catch((error) => {
                throw new ClipboardAccessError(error)
              }),
              item.controller.signal,
            )
          : input
      check(item)
      const data =
        typeof received === 'string'
          ? parseTableClipboardText(received, config.value)
          : received
      if (
        bounds.rowEnd - bounds.rowStart === 1 &&
        bounds.colEnd - bounds.colStart === 1
      ) {
        let width = 0
        checkTableClipboardArea(
          data.length,
          1,
          tableClipboardLimits(config.value).maxCells,
        )
        for (const row of data) {
          if (!Array.isArray(row))
            throw new TableClipboardShapeError('Clipboard rows must be arrays')
          width = Math.max(width, row.length)
        }
        bounds = region({
          bounds: {
            ...bounds,
            rowEnd: bounds.rowStart + data.length,
            colEnd: bounds.colStart + width,
          },
        })!
      }
      item.result.bounds = bounds
      const plan = await planTableClipboardPaste({
        ...config.value,
        bounds,
        data,
        cellAt: options.cells(bounds),
        writable,
        parse: config.value.parseCell ?? parseTableClipboardValue,
        signal: item.controller.signal,
        current: () => current(item),
      })
      await commit(item, plan)
    })
  const interactive =
    'input,textarea,select,button,a[href],[contenteditable]:not([contenteditable="false"]),[role="combobox"],[role="switch"]'
  const accepts = (event: Event) => {
    const root = options.root()
    const target = event.target as HTMLElement | null
    return (
      enabled.value &&
      config.value.keyboard !== false &&
      !event.defaultPrevented &&
      target?.closest &&
      root?.contains(target) &&
      !target.closest(interactive) &&
      (target === root ||
        target.closest('[role="table"]') ===
          root.querySelector('[role="table"]'))
    )
  }
  const onClipboard = (event: ClipboardEvent) => {
    if (!accepts(event)) return
    const action = event.type as TableClipboardAction
    if (config.value[action] === false) return
    if (
      action === 'paste' &&
      !event.clipboardData?.types.includes('text/plain')
    )
      return
    event.preventDefault()
    event.stopPropagation()
    if (action === 'paste') paste(event.clipboardData!.getData('text/plain'))
    else copy(action)
  }
  const onKeydown = (event: KeyboardEvent) => {
    if (
      event.key === 'Escape' &&
      pending.value &&
      accepts(event) &&
      !event.isComposing
    ) {
      event.preventDefault()
      event.stopPropagation()
      cancel()
    }
  }
  watch(options.dataContext, () => {
    if (!request?.applying) cancel()
  })
  watch(
    () =>
      cloneDeep([
        ...options.context.map((source) =>
          typeof source === 'function' ? source() : source.value,
        ),
        props.clipboardConfig,
        props.editConfig,
        props.validationConfig,
        props.validationRules,
        props.changeConfig,
        props.loading,
        options.editing(),
      ]),
    (next, previous) => {
      if (!isEqual(next, previous)) cancel()
    },
    { flush: 'sync' },
  )
  onBeforeUnmount(() => {
    disposed = true
    cancel()
  })
  return {
    enabled,
    pending,
    last,
    copyCells: (selected?: TableCopyOptions) => copy('copy', selected),
    cutCells: (selected?: TableCopyOptions) => copy('cut', selected),
    pasteCells: paste,
    cancelClipboard: cancel,
    onClipboard,
    onKeydown,
  }
}
