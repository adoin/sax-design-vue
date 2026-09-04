import type { TableRangeViewport } from './table-range-hit'

const clientRect = (element: HTMLElement): TableRangeViewport => {
  const rect = element.getBoundingClientRect()
  const left = rect.left + element.clientLeft
  const top = rect.top + element.clientTop
  return {
    left,
    top,
    right: left + element.clientWidth,
    bottom: top + element.clientHeight,
  }
}

/** Visible data area, clipped by scroll ancestors and the browser viewport. */
export function tableRangeViewport(root: HTMLElement, body: HTMLElement) {
  const win = root.ownerDocument.defaultView!
  const rect = body.getBoundingClientRect()
  const rootRect = clientRect(root)
  const view = {
    left: Math.max(0, rootRect.left, rect.left),
    top: Math.max(0, rootRect.top, rect.top),
    right: Math.min(win.innerWidth, rootRect.right, rect.right),
    bottom: Math.min(win.innerHeight, rect.bottom),
  }
  for (let node: HTMLElement | null = body; node; node = node.parentElement) {
    const style = win.getComputedStyle(node)
    const bounds = clientRect(node)
    if (/(auto|scroll|hidden|clip)/.test(style.overflowX)) {
      view.left = Math.max(view.left, bounds.left)
      view.right = Math.min(view.right, bounds.right)
    }
    if (/(auto|scroll|hidden|clip)/.test(style.overflowY)) {
      view.top = Math.max(view.top, bounds.top)
      view.bottom = Math.min(view.bottom, bounds.bottom)
    }
  }
  return view.right > view.left && view.bottom > view.top ? view : undefined
}

export function tableRangeScrollParent(root: HTMLElement) {
  const win = root.ownerDocument.defaultView!
  for (let node: HTMLElement | null = root; node; node = node.parentElement) {
    if (
      node.scrollHeight > node.clientHeight &&
      /(auto|scroll)/.test(win.getComputedStyle(node).overflowY)
    )
      return node
  }
  return root.ownerDocument.scrollingElement
}
