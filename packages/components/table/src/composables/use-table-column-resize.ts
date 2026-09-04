import { computed, onBeforeUnmount, shallowRef, watch } from 'vue'
import { resolveColumnPixelWidth } from './use-table-column-virtualization'
import type { ComputedRef } from 'vue'
import type {
  TableColumn,
  TableColumnResizeParams,
  TableColumnWidths,
  TableEmitFn,
  TableProps,
} from '../table'

interface ResizeSession {
  column: TableColumn
  index: number
  key: string
  startX: number
  oldWidth: number
  width: number
  minimum: number
  pointerId: number
  direction: number
}

export function useTableColumnResize(
  props: TableProps,
  emit: TableEmitFn,
  columns: ComputedRef<TableColumn[]>,
) {
  const localWidths = shallowRef<TableColumnWidths>({})
  const session = shallowRef<ResizeSession>()
  const revision = shallowRef(0)
  let cleanup: (() => void) | undefined
  let frame: number | undefined
  let frameWindow: Window | undefined
  let pendingX = 0
  const config = computed(() =>
    typeof props.resizeConfig === 'object' ? props.resizeConfig : {},
  )
  const enabled = computed(
    () =>
      props.resizeConfig !== false &&
      config.value.enabled !== false &&
      !props.loading,
  )
  const keyFor = (column: TableColumn, index: number) =>
    props.virtualSource
      ? String(index)
      : (column.key ?? column.field ?? `@${index}`)
  const widths = computed(() => props.columnWidths ?? localWidths.value)
  const widthFor = (column: TableColumn, index: number) => {
    const key = keyFor(column, index)
    const value =
      session.value?.key === key ? session.value.width : widths.value[key]
    return typeof value === 'number' && Number.isFinite(value) && value > 0
      ? value
      : undefined
  }
  const canResize = (column: TableColumn) =>
    enabled.value && column.resizable !== false
  const focus = (event: FocusEvent) => {
    const target = event.currentTarget as HTMLElement
    const cell = target.closest<HTMLElement>('[role="columnheader"]')
    if (cell)
      target.setAttribute(
        'aria-valuenow',
        String(Math.round(cell.getBoundingClientRect().width)),
      )
  }
  const minimumFor = (column: TableColumn) =>
    Math.max(
      24,
      Number.isFinite(config.value.minWidth) ? config.value.minWidth! : 40,
      column.minWidth == null
        ? 0
        : (resolveColumnPixelWidth(column.minWidth) ?? 0),
    )
  const cancelFrame = () => {
    if (frame != null) frameWindow?.cancelAnimationFrame(frame)
    frame = undefined
  }
  const cancel = () => {
    if (session.value && session.value.width !== session.value.oldWidth)
      revision.value++
    cancelFrame()
    cleanup?.()
    cleanup = undefined
    session.value = undefined
  }
  const commit = (
    entry: ResizeSession,
    source: TableColumnResizeParams['source'],
  ) => {
    if (entry.width === entry.oldWidth) return
    const next = { ...widths.value, [entry.key]: entry.width }
    if (props.columnWidths === undefined) localWidths.value = next
    emit('update:columnWidths', next)
    emit('columnResize', {
      column: entry.column,
      columnIndex: entry.index,
      columnKey: entry.key,
      oldWidth: entry.oldWidth,
      width: entry.width,
      source,
    })
    revision.value++
  }
  const applyPointer = (clientX: number) => {
    const entry = session.value
    if (!entry) return
    session.value = {
      ...entry,
      width: Math.max(
        entry.minimum,
        Math.round(entry.oldWidth + (clientX - entry.startX) * entry.direction),
      ),
    }
  }
  const start = (
    event: PointerEvent,
    column: TableColumn,
    index: number,
    fixed?: 'left' | 'right',
  ) => {
    if (!canResize(column) || event.button !== 0 || event.isPrimary === false)
      return
    const target = event.currentTarget as HTMLElement
    const view = target.ownerDocument.defaultView
    const cell = target.closest<HTMLElement>('[role="columnheader"]')
    if (!view || !cell) return
    event.preventDefault()
    event.stopPropagation()
    cancel()
    target.focus({ preventScroll: true })
    const oldWidth = Math.round(cell.getBoundingClientRect().width)
    session.value = {
      column,
      index,
      key: keyFor(column, index),
      startX: event.clientX,
      oldWidth,
      width: oldWidth,
      minimum: minimumFor(column),
      pointerId: event.pointerId,
      direction: fixed === 'right' ? -1 : 1,
    }
    const root = target.ownerDocument.documentElement
    const cursor = root.style.cursor
    const selection = root.style.userSelect
    root.style.cursor = 'col-resize'
    root.style.userSelect = 'none'
    frameWindow = view
    const move = (event: PointerEvent) => {
      if (event.pointerId !== session.value?.pointerId) return
      pendingX = event.clientX
      if (frame != null) return
      frame = view.requestAnimationFrame(() => {
        frame = undefined
        applyPointer(pendingX)
      })
    }
    const end = (event: PointerEvent) => {
      if (event.pointerId !== session.value?.pointerId) return
      cancelFrame()
      applyPointer(event.clientX)
      const entry = session.value!
      cancel()
      commit(entry, 'pointer')
    }
    const abort = (event: PointerEvent) => {
      if (event.pointerId === session.value?.pointerId) cancel()
    }
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        cancel()
      }
    }
    view.addEventListener('pointermove', move)
    view.addEventListener('pointerup', end)
    view.addEventListener('pointercancel', abort)
    view.addEventListener('keydown', keydown)
    view.addEventListener('blur', cancel)
    cleanup = () => {
      view.removeEventListener('pointermove', move)
      view.removeEventListener('pointerup', end)
      view.removeEventListener('pointercancel', abort)
      view.removeEventListener('keydown', keydown)
      view.removeEventListener('blur', cancel)
      root.style.cursor = cursor
      root.style.userSelect = selection
    }
  }
  const keydown = (
    event: KeyboardEvent,
    column: TableColumn,
    index: number,
  ) => {
    if (
      !canResize(column) ||
      event.isComposing ||
      !['ArrowLeft', 'ArrowRight', 'Home'].includes(event.key)
    )
      return
    event.preventDefault()
    event.stopPropagation()
    const cell = (event.currentTarget as HTMLElement).closest<HTMLElement>(
      '[role="columnheader"]',
    )
    if (!cell) return
    const oldWidth = Math.round(cell.getBoundingClientRect().width)
    const minimum = minimumFor(column)
    const step =
      Math.max(
        1,
        Number.isFinite(config.value.keyboardStep)
          ? config.value.keyboardStep!
          : 10,
      ) * (event.shiftKey ? 5 : 1)
    const width =
      event.key === 'Home'
        ? minimum
        : Math.max(
            minimum,
            oldWidth + (event.key === 'ArrowRight' ? step : -step),
          )
    commit(
      {
        column,
        index,
        key: keyFor(column, index),
        oldWidth,
        width,
        minimum,
        pointerId: -1,
        direction: 1,
        startX: 0,
      },
      'keyboard',
    )
  }
  // External widths are authoritative. Cancel stale drags when the layout changes.
  watch(() => [props.columnWidths, props.virtualSource, enabled.value], cancel)
  watch(
    () => props.virtualSource,
    () => {
      if (props.columnWidths === undefined) localWidths.value = {}
    },
  )
  watch(
    () =>
      columns.value.map((column, index) => [
        keyFor(column, index),
        column.width,
        column.minWidth,
        column.resizable,
      ]),
    (next, previous) => {
      cancel()
      if (props.columnWidths !== undefined) return
      const prior = new Map(previous.map(([key, width]) => [key, width]))
      const retained: TableColumnWidths = {}
      for (const [key, width] of next) {
        if (prior.get(key) === width && localWidths.value[String(key)] != null)
          retained[String(key)] = localWidths.value[String(key)]
      }
      localWidths.value = retained
    },
  )
  onBeforeUnmount(cancel)
  return {
    cancel,
    canResize,
    minimumFor,
    keyFor,
    widthFor,
    widths,
    session,
    revision,
    start,
    focus,
    keydown,
  }
}
