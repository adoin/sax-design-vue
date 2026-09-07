import { onBeforeUnmount, shallowRef, watch } from 'vue'
import type { ComputedRef } from 'vue'
import type { TableGroupNode } from '../table-group'

export interface TableParentIndicatorTarget {
  key: string
  label: string
  jump: () => void
}

interface TableParentIndicatorOptions {
  enabled: ComputedRef<boolean>
  hideDelay: ComputedRef<number>
  resolve: () => TableParentIndicatorTarget | undefined
}

export const findTableParentGroup = (
  groups: readonly TableGroupNode[],
  rowIndex: number,
  excludedKey?: string,
): TableGroupNode | undefined => {
  let result: TableGroupNode | undefined
  let level = groups
  while (level.length) {
    let low = 0
    let high = level.length - 1
    while (low <= high) {
      const middle = (low + high) >>> 1
      if (level[middle].rowStart <= rowIndex) low = middle + 1
      else high = middle - 1
    }
    const group = level[high]
    if (!group || rowIndex >= group.rowStart + group.rowCount) break
    if (group.key !== excludedKey) result = group
    level = group.children
  }
  return result
}

const requestFrame = (callback: FrameRequestCallback) =>
  typeof requestAnimationFrame === 'function'
    ? requestAnimationFrame(callback)
    : window.setTimeout(() => callback(performance.now()), 0)

const cancelFrame = (frame: number) => {
  if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(frame)
  else clearTimeout(frame)
}

/** Own the short-lived parent shortcut without coupling timing to row rendering. */
export function useTableParentIndicator(options: TableParentIndicatorOptions) {
  const target = shallowRef<TableParentIndicatorTarget>()
  const visible = shallowRef(false)
  let lastScrollTop = 0
  let frame: number | undefined
  let hideTimer: ReturnType<typeof setTimeout> | undefined
  let held = false

  const clearHideTimer = () => {
    if (hideTimer !== undefined) clearTimeout(hideTimer)
    hideTimer = undefined
  }
  const hide = () => {
    clearHideTimer()
    visible.value = false
  }
  const scheduleHide = () => {
    clearHideTimer()
    if (held || !visible.value) return
    hideTimer = setTimeout(hide, options.hideDelay.value)
  }
  const update = () => {
    frame = undefined
    target.value = options.resolve()
    visible.value = Boolean(target.value)
    scheduleHide()
  }
  const onScroll = (event: Event) => {
    const element = event.currentTarget
    if (!(element instanceof HTMLElement)) return
    const nextScrollTop = element.scrollTop
    if (!options.enabled.value || nextScrollTop === lastScrollTop) {
      lastScrollTop = nextScrollTop
      if (!options.enabled.value) hide()
      return
    }
    lastScrollTop = nextScrollTop
    clearHideTimer()
    if (frame !== undefined) cancelFrame(frame)
    frame = requestFrame(update)
  }
  const hold = () => {
    held = true
    clearHideTimer()
  }
  const release = () => {
    held = false
    scheduleHide()
  }
  const jump = () => {
    const current = target.value
    hide()
    current?.jump()
  }
  const reset = () => {
    if (frame !== undefined) cancelFrame(frame)
    frame = undefined
    held = false
    target.value = undefined
    hide()
  }

  watch(options.enabled, (enabled) => {
    if (!enabled) reset()
  })
  onBeforeUnmount(reset)

  return { target, visible, onScroll, hold, release, jump, reset }
}
