import { onBeforeUnmount, shallowRef, watch } from 'vue'
import {
  hitTableRangeCell,
  ownedTableRangeCell,
  tableRangeEdgeDelta,
} from './table-range-hit'
import type { WatchSource } from 'vue'
import type { TableRangeViewport } from './table-range-hit'
import type {
  TableCellRangeState,
  TableRangeHints,
} from './use-table-cell-range'
import type { TableCellCoordinate } from './use-table-keyboard'
import type { TableCellRange } from '../table-cell-range'

interface Options {
  root: () => HTMLElement | undefined
  viewport: () => TableRangeViewport | undefined
  fromElement: (element: HTMLElement) => TableCellCoordinate | undefined
  current: () => TableCellCoordinate | undefined
  at: (row: number, col: number) => TableCellCoordinate | undefined
  count: () => { rows: number; columns: number }
  move: (
    point: TableCellCoordinate,
    key: string,
    backwards: boolean,
  ) => TableCellCoordinate | undefined
  focus: (point: TableCellCoordinate) => boolean | Promise<boolean>
  /** Scroll logical pixels through the existing table/virtual-list scrolling pipeline. */
  scrollBy: (x: number, y: number) => void
  blocked: () => boolean
  context: WatchSource[]
}
const interactive =
  'input,textarea,select,button,a[href],[contenteditable]:not([contenteditable="false"]),[role="combobox"],[role="slider"],[role="switch"],[role="separator"]'
const samePoint = (a?: TableCellCoordinate, b?: TableCellCoordinate) =>
  a?.address.rowKey === b?.address.rowKey &&
  a?.address.columnKey === b?.address.columnKey

/** Pointer capture, frame-limited hit testing and keyboard extension; focus stays in the shared keyboard layer. */
export function useTableRangeInteraction(
  state: TableCellRangeState,
  options: Options,
) {
  const dragging = shallowRef(false)
  let disposePointer: (() => void) | undefined
  let previous: TableCellRange | null = null
  let previousHints: TableRangeHints = {}
  let operation = 0
  let suppressClick = false
  let desiredFocus: TableCellCoordinate | undefined
  let desiredAnchor: TableCellRange['anchor'] | undefined
  let desiredAnchorHint: TableCellCoordinate | undefined
  let disposed = false
  const allowed = () => !disposed && state.enabled.value && !options.blocked()
  const stop = () => {
    const dispose = disposePointer
    disposePointer = undefined
    dragging.value = false
    dispose?.()
  }
  const cancel = (restore = false) => {
    const wasDragging = dragging.value
    stop()
    operation++
    desiredFocus = undefined
    desiredAnchor = undefined
    desiredAnchorHint = undefined
    suppressClick = false
    state.cancelPending()
    if (restore && wasDragging && allowed())
      state.select(previous, 'pointer', previousHints)
  }
  const onPointerdown = (event: PointerEvent) => {
    suppressClick = false
    if (
      !allowed() ||
      state.config.value.mouse === false ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.isPrimary === false ||
      event.pointerType === 'touch' ||
      !(event.target instanceof Element) ||
      event.target.closest(interactive)
    )
      return
    const root = options.root()
    const cell = root && ownedTableRangeCell(root, event.target)
    const first = cell && options.fromElement(cell)
    if (!root || !first) return
    cancel()
    const request = ++operation
    previous = state.getRange()
    previousHints = state.getHints()
    const anchor = event.shiftKey
      ? (previous?.anchor ?? options.current()?.address ?? first.address)
      : first.address
    const anchorHint = event.shiftKey ? options.current() : first
    const doc = root.ownerDocument
    const win = doc.defaultView!
    const pointerId = event.pointerId
    let x = event.clientX,
      y = event.clientY
    const startX = x,
      startY = y
    let moved = false
    let frame = 0
    let lastTime = 0
    let target = first
    let latest = state.select({ anchor, focus: first.address }, 'pointer', {
      anchor: anchorHint,
      focus: first,
    })
    const update = () => {
      const viewport = options.viewport()
      const cell = viewport && hitTableRangeCell(root, x, y, viewport)
      const next = cell && options.fromElement(cell)
      if (!next) return
      const changed = !samePoint(next, target)
      target = next
      // A merged continuation can move to another virtual window while keeping
      // the same owner address. Focus the latest visible fragment after release.
      if (!changed) return
      latest = state.select({ anchor, focus: next.address }, 'pointer', {
        anchor: anchorHint,
        focus: next,
      })
    }
    const tick = (time: number) => {
      if (!dragging.value || request !== operation) return
      if (moved) {
        const viewport = options.viewport()
        if (viewport && state.config.value.autoScroll !== false) {
          const { scrollThreshold, scrollSpeed } = state.config.value
          const scale = lastTime
            ? Math.min(2, Math.max(0, (time - lastTime) / (1000 / 60)))
            : 1
          const dx =
            tableRangeEdgeDelta(
              x,
              viewport.left,
              viewport.right,
              scrollThreshold,
              scrollSpeed,
            ) * scale
          const dy =
            tableRangeEdgeDelta(
              y,
              viewport.top,
              viewport.bottom,
              scrollThreshold,
              scrollSpeed,
            ) * scale
          if (dx || dy) options.scrollBy(dx, dy)
        }
        update()
      }
      lastTime = time
      frame = win.requestAnimationFrame(tick)
    }
    const move = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return
      x = e.clientX
      y = e.clientY
      moved ||= Math.hypot(x - startX, y - startY) >= 3
    }
    const up = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return
      move(e)
      if (moved) update()
      stop()
      suppressClick = moved
      latest.then((accepted) => {
        if (accepted && allowed() && request === operation)
          options.focus(target)
      })
    }
    const abort = (e: PointerEvent) => {
      if (e.pointerId === pointerId) cancel(true)
    }
    const escape = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.isComposing) return
      e.preventDefault()
      e.stopPropagation()
      cancel(true)
    }
    const blur = () => cancel(true)
    const oldUserSelect = root.style.userSelect
    const oldCursor = root.style.cursor
    event.preventDefault()
    dragging.value = true
    desiredFocus = undefined
    root.style.userSelect = 'none'
    root.style.cursor = 'cell'
    doc.addEventListener('pointermove', move)
    doc.addEventListener('pointerup', up)
    doc.addEventListener('pointercancel', abort)
    doc.addEventListener('keydown', escape, true)
    root.addEventListener('lostpointercapture', abort)
    win.addEventListener('blur', blur)
    disposePointer = () => {
      win.cancelAnimationFrame(frame)
      doc.removeEventListener('pointermove', move)
      doc.removeEventListener('pointerup', up)
      doc.removeEventListener('pointercancel', abort)
      doc.removeEventListener('keydown', escape, true)
      root.removeEventListener('lostpointercapture', abort)
      win.removeEventListener('blur', blur)
      if (root.hasPointerCapture?.(pointerId))
        root.releasePointerCapture(pointerId)
      root.style.userSelect = oldUserSelect
      root.style.cursor = oldCursor
    }
    try {
      root.setPointerCapture?.(pointerId)
    } catch {
      /* Document listeners still handle a synthetic pointer or a disconnected trigger. */
    }
    frame = win.requestAnimationFrame(tick)
  }
  const onClickCapture = (event: MouseEvent) => {
    if (!suppressClick || event.detail === 0) return
    suppressClick = false
    event.preventDefault()
    event.stopPropagation()
  }
  const onKeydown = (event: KeyboardEvent) => {
    if (
      !allowed() ||
      state.config.value.keyboard === false ||
      event.defaultPrevented ||
      event.isComposing ||
      event.keyCode === 229 ||
      event.altKey ||
      dragging.value ||
      !(event.target instanceof Element) ||
      event.target.closest(interactive)
    )
      return
    const root = options.root()
    if (
      !root ||
      (event.target !== root && !ownedTableRangeCell(root, event.target))
    )
      return
    const current = desiredFocus ?? options.current() ?? options.at(0, 0)
    if (!current) return
    const all =
      (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'a'
    const edge = event.key === 'Home' || event.key === 'End'
    if (!all && !edge && (event.ctrlKey || event.metaKey)) return
    let target: TableCellCoordinate | undefined
    let anchor = event.shiftKey
      ? (desiredAnchor ?? state.getRange()?.anchor ?? current.address)
      : undefined
    let anchorHint = event.shiftKey ? (desiredAnchorHint ?? current) : undefined
    if (all) {
      const count = options.count()
      anchorHint = options.at(0, 0)
      anchor = anchorHint?.address
      target = options.at(count.rows - 1, count.columns - 1)
    } else if (edge) {
      const end = event.key === 'End'
      const count = options.count()
      target = options.at(
        event.ctrlKey || event.metaKey
          ? end
            ? count.rows - 1
            : 0
          : (current.viewRow ?? current.row),
        end ? count.columns - 1 : 0,
      )
    } else if (
      ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)
    )
      target = options.move(current, event.key, false)
    else if (event.key === 'Escape') {
      if (state.getRange() || desiredFocus || state.pending.value) {
        event.preventDefault()
        event.stopPropagation()
        cancel()
        state.clear()
      }
      return
    } else {
      if (event.key === 'Tab') cancel()
      return
    }
    event.preventDefault()
    event.stopPropagation()
    if (!target) return
    const request = ++operation
    desiredFocus = target
    desiredAnchor = anchor ?? target.address
    desiredAnchorHint = anchorHint ?? target
    state
      .select(
        { anchor: anchor ?? target.address, focus: target.address },
        'keyboard',
        { anchor: desiredAnchorHint, focus: target },
      )
      .then((accepted) => {
        if (disposed || request !== operation) return
        if (accepted && allowed()) options.focus(target!)
        else {
          desiredFocus = undefined
          desiredAnchor = undefined
          desiredAnchorHint = undefined
        }
      })
  }
  // Cancel the old gesture before the state's queued context reconciliation runs.
  // Otherwise this watcher can abort the replacement geometry calculation itself.
  watch([state.enabled, options.blocked, ...options.context], () => cancel(), {
    flush: 'sync',
  })
  let detachFocus: (() => void) | undefined
  watch(
    [state.enabled, options.root],
    ([enabled, root]) => {
      detachFocus?.()
      detachFocus = undefined
      if (!enabled || !root) return
      const doc = root.ownerDocument
      const leave = (event: Event) => {
        const target = event.target
        if (
          target instanceof Element &&
          (!root.contains(target) || target.closest(interactive))
        )
          cancel()
      }
      doc.addEventListener('pointerdown', leave, true)
      doc.addEventListener('focusin', leave)
      detachFocus = () => {
        doc.removeEventListener('pointerdown', leave, true)
        doc.removeEventListener('focusin', leave)
      }
    },
    { immediate: true, flush: 'post' },
  )
  onBeforeUnmount(() => {
    disposed = true
    detachFocus?.()
    cancel()
  })
  return { dragging, onPointerdown, onClickCapture, onKeydown, cancel }
}
