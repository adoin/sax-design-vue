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

/** Vertically overflowing scroller owned by the table; never the page. */
export function tableRangeScrollParent(
  root: HTMLElement,
  start: HTMLElement = root,
) {
  const win = root.ownerDocument.defaultView!
  let node: HTMLElement | null = root.contains(start) ? start : root
  while (node) {
    const style = win.getComputedStyle(node)
    if (
      node.scrollHeight > node.clientHeight &&
      /(auto|scroll)/.test(style.overflowY || style.overflow)
    )
      return node
    if (node === root) break
    node = node.parentElement
  }
}

/** Freeze page and ancestor scroll while a range drag is active. */
export function lockTableRangeOutsideScroll(root: HTMLElement) {
  const doc = root.ownerDocument
  const win = doc.defaultView
  if (!win) return () => undefined
  const snapshots: Array<{ node: Element; top: number; left: number }> = []
  for (
    let node: HTMLElement | null = root.parentElement;
    node;
    node = node.parentElement
  )
    snapshots.push({ node, top: node.scrollTop, left: node.scrollLeft })
  const scrolling = doc.scrollingElement
  if (scrolling && snapshots.every((item) => item.node !== scrolling))
    snapshots.push({
      node: scrolling,
      top: scrolling.scrollTop,
      left: scrolling.scrollLeft,
    })
  const pageX = win.scrollX
  const pageY = win.scrollY
  const restore = (event?: Event) => {
    const target = event?.target
    if (target instanceof Node && (target === root || root.contains(target)))
      return
    for (const item of snapshots) {
      if (item.node.scrollTop !== item.top) item.node.scrollTop = item.top
      if (item.node.scrollLeft !== item.left) item.node.scrollLeft = item.left
    }
    if (win.scrollX !== pageX || win.scrollY !== pageY)
      win.scrollTo(pageX, pageY)
  }
  doc.addEventListener('scroll', restore, true)
  return () => doc.removeEventListener('scroll', restore, true)
}
