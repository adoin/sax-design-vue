import { nextTick, onBeforeUnmount, shallowRef, watch } from 'vue'
import type { WatchSource } from 'vue'
import type { TableEmitFn, TableFlatRow, TableRowKey } from '../table'
import type {
  TableRowDragResult,
  TableRowDropPosition,
} from '../table-row-drag'
import type { TableRowReorder } from './use-table-row-reorder'

interface DragSession {
  from: number
  key: TableRowKey
  target?: number
  targetKey?: TableRowKey
  position: TableRowDropPosition
  keyboard: boolean
}
interface RowDragOptions {
  root: () => HTMLElement | undefined
  scroll: () => HTMLElement | undefined
  rowAt: (index: number) => TableFlatRow | undefined
  count: () => number
  changes: WatchSource[]
  focus: (key: TableRowKey, generatedIndex?: number) => void | Promise<void>
  scrollTo: (index: number) => void
}

/** Handles pointer capture and edge scrolling using only mounted row rectangles. */
export function useTableRowDrag(
  reorder: TableRowReorder,
  emit: TableEmitFn,
  options: RowDragOptions,
) {
  const session = shallowRef<DragSession>()
  const announcement = shallowRef<
    'grabbed' | 'moved' | 'cancelled' | 'rejected' | ''
  >('')
  let cleanup: (() => void) | undefined
  const clear = () => {
    cleanup?.()
    cleanup = undefined
    session.value = undefined
  }
  const cancel = () => {
    const current = session.value
    clear()
    reorder.cancel()
    if (current) {
      announcement.value = 'cancelled'
      options.focus(current.key, options.rowAt(current.from)?.index)
      emit('rowDragEnd', { applied: false, reason: 'cancelled' })
    }
  }
  const choose = (index: number, position: TableRowDropPosition) => {
    const current = session.value
    if (!current) return
    let valid = false
    try {
      valid = Boolean(reorder.dropContext(current.from, index, position))
    } catch {
      /* Invalid consumer predicates cannot leave a stale drop target. */
    }
    session.value = {
      ...current,
      target: valid ? index : undefined,
      targetKey: valid ? options.rowAt(index)?.key : undefined,
      position,
    }
  }
  const drop = async () => {
    const current = session.value
    if (!current) return
    clear()
    const result: TableRowDragResult =
      current.target === undefined
        ? { applied: false, reason: 'empty' as const }
        : await reorder.move(current.from, current.target, current.position)
    if (current.target === undefined) emit('rowDragEnd', result)
    announcement.value = result.applied
      ? 'moved'
      : result.reason === 'cancelled'
        ? 'cancelled'
        : 'rejected'
    await nextTick()
    options.focus(
      current.key,
      result.request?.newIndex ?? options.rowAt(current.from)?.index,
    )
  }
  const begin = (index: number, keyboard: boolean) => {
    const row = options.rowAt(index)
    if (!row || !reorder.canStart(row, index)) return false
    clear()
    session.value = { from: index, key: row.key, keyboard, position: 'before' }
    announcement.value = 'grabbed'
    emit('rowDragStart', reorder.context(row, index))
    return true
  }
  const start = (event: PointerEvent, index: number) => {
    if (event.button !== 0 || event.isPrimary === false || !begin(index, false))
      return
    event.preventDefault()
    event.stopPropagation()
    const root = options.root()!
    const doc = root.ownerDocument
    const win = doc.defaultView!
    const pointerId = event.pointerId
    let x = event.clientX,
      y = event.clientY
    let moved = false
    let frame = 0
    const startX = x,
      startY = y
    const hit = () => {
      const current = session.value
      if (!current || !moved) return
      const rect = root.getBoundingClientRect()
      if (
        x < rect.left ||
        x > rect.right ||
        y < Math.max(0, rect.top) ||
        y > Math.min(win.innerHeight, rect.bottom)
      ) {
        session.value = { ...current, target: undefined, targetKey: undefined }
        return
      }
      const element = doc
        .elementFromPoint(x, y)
        ?.closest<HTMLElement>('[data-table-row-index]')
      if (
        !element ||
        !root.contains(element) ||
        element.closest('[role="table"]') !==
          root.querySelector('[role="table"]')
      ) {
        session.value = { ...current, target: undefined, targetKey: undefined }
        return
      }
      const box = element.getBoundingClientRect()
      choose(
        Number(element.dataset.tableRowIndex),
        y < box.top + box.height / 2 ? 'before' : 'after',
      )
    }
    const tick = () => {
      if (!session.value) return
      if (moved && reorder.config.value.autoScroll !== false) {
        const scroller = options.scroll()
        if (scroller) {
          const box = scroller.getBoundingClientRect()
          const documentScroll = scroller === doc.scrollingElement
          const tableBox = root.getBoundingClientRect()
          const top = Math.max(0, tableBox.top, documentScroll ? 0 : box.top)
          const bottom = Math.min(
            win.innerHeight,
            tableBox.bottom,
            documentScroll ? win.innerHeight : box.bottom,
          )
          const threshold = Math.max(
            8,
            Number.isFinite(reorder.config.value.scrollThreshold)
              ? reorder.config.value.scrollThreshold!
              : 40,
          )
          const speed = Math.max(
            1,
            Number.isFinite(reorder.config.value.scrollSpeed)
              ? reorder.config.value.scrollSpeed!
              : 16,
          )
          if (
            x >= tableBox.left &&
            x <= tableBox.right &&
            y >= top &&
            y <= bottom
          ) {
            const delta =
              y < top + threshold
                ? -speed * Math.min(1, (top + threshold - y) / threshold)
                : y > bottom - threshold
                  ? speed * Math.min(1, (y - bottom + threshold) / threshold)
                  : 0
            if (delta) scroller.scrollTop += delta
          }
        }
      }
      hit()
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
      hit()
      drop()
    }
    const abort = (e: PointerEvent) => {
      if (e.pointerId === pointerId) cancel()
    }
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        cancel()
      }
    }
    const blur = () => cancel()
    doc.addEventListener('pointermove', move)
    doc.addEventListener('pointerup', up)
    doc.addEventListener('pointercancel', abort)
    doc.addEventListener('keydown', key)
    win.addEventListener('blur', blur)
    const oldCursor = root.style.cursor
    root.style.cursor = 'grabbing'
    root.setPointerCapture?.(pointerId)
    frame = win.requestAnimationFrame(tick)
    cleanup = () => {
      win.cancelAnimationFrame(frame)
      doc.removeEventListener('pointermove', move)
      doc.removeEventListener('pointerup', up)
      doc.removeEventListener('pointercancel', abort)
      doc.removeEventListener('keydown', key)
      win.removeEventListener('blur', blur)
      if (root.hasPointerCapture?.(pointerId))
        root.releasePointerCapture(pointerId)
      root.style.cursor = oldCursor
    }
  }
  const keydown = (event: KeyboardEvent, index: number) => {
    if (event.isComposing || event.defaultPrevented) return
    if (event.key === 'Escape' && session.value) {
      event.preventDefault()
      event.stopPropagation()
      cancel()
      return
    }
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      event.stopPropagation()
      if (session.value?.keyboard) drop()
      else if (begin(index, true))
        options.root()?.focus({ preventScroll: true })
      return
    }
    const current = session.value
    if (!current?.keyboard || !['ArrowUp', 'ArrowDown'].includes(event.key))
      return
    event.preventDefault()
    event.stopPropagation()
    const direction = event.key === 'ArrowUp' ? -1 : 1
    const row = options.rowAt(current.from)!
    for (
      let target = (current.target ?? current.from) + direction;
      target >= 0 && target < options.count();
      target += direction
    ) {
      if (target === current.from) {
        session.value = { ...current, target: undefined, targetKey: undefined }
        options.scrollTo(target)
        break
      }
      if (options.rowAt(target)?.parentKey !== row.parentKey) continue
      choose(target, direction < 0 ? 'before' : 'after')
      options.scrollTo(target)
      break
    }
  }
  watch(options.changes, () => {
    if (session.value) cancel()
  })
  watch(reorder.enabled, (value) => {
    if (!value && session.value) cancel()
  })
  onBeforeUnmount(clear)
  return {
    session,
    announcement,
    start,
    keydown,
    cancel,
    canStart: reorder.canStart,
    pending: reorder.pending,
  }
}

export type TableRowDrag = ReturnType<typeof useTableRowDrag>
