export interface TableRangeViewport {
  left: number
  top: number
  right: number
  bottom: number
}

const bodyCell = '[role="cell"][data-column-index]'
const merge = '[data-merge-region]:not(.is-footer-merge)'

/** Return one of this table's data cells or merged continuation surfaces. */
export function ownedTableRangeCell(root: HTMLElement, target: Element | null) {
  if (!target || !root.contains(target)) return
  const table = root.querySelector('[role="table"]')
  const cell = target.closest<HTMLElement>(`${bodyCell},${merge}`)
  if (
    !cell ||
    cell.closest('[role="table"]') !== table ||
    cell.closest('[data-footer-row-index],[data-table-group-band]')
  )
    return
  if (!cell.closest('[data-table-row-index]') && !cell.matches(merge)) return
  return cell
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

/** Hit only mounted cells; gaps between group/detail bands choose the nearest visible data cell. */
export function hitTableRangeCell(
  root: HTMLElement,
  x: number,
  y: number,
  viewport: TableRangeViewport,
) {
  if (
    ![x, y, viewport.left, viewport.top, viewport.right, viewport.bottom].every(
      Number.isFinite,
    ) ||
    viewport.right <= viewport.left ||
    viewport.bottom <= viewport.top
  )
    return
  const doc = root.ownerDocument
  const pointX = clamp(x, viewport.left + 0.5, viewport.right - 0.5)
  const pointY = clamp(y, viewport.top + 0.5, viewport.bottom - 0.5)
  const hit = ownedTableRangeCell(
    root,
    doc.elementFromPoint?.(pointX, pointY) ?? null,
  )
  if (hit) return hit
  let nearest: HTMLElement | undefined
  let distance = Infinity
  for (const element of root.querySelectorAll<HTMLElement>(
    `${bodyCell},${merge}`,
  )) {
    if (ownedTableRangeCell(root, element) !== element) continue
    const rect = element.getBoundingClientRect()
    const left = Math.max(rect.left, viewport.left)
    const right = Math.min(rect.right, viewport.right)
    const top = Math.max(rect.top, viewport.top)
    const bottom = Math.min(rect.bottom, viewport.bottom)
    if (right <= left || bottom <= top) continue
    const nearX = clamp(pointX, left + 0.5, right - 0.5)
    const nearY = clamp(pointY, top + 0.5, bottom - 0.5)
    const score = (pointX - nearX) ** 2 + (pointY - nearY) ** 2
    if (score >= distance) continue
    // A fixed pane can cover a scrolling cell that has identical geometry.
    const painted = ownedTableRangeCell(
      root,
      doc.elementFromPoint?.(nearX, nearY) ?? null,
    )
    if (painted && painted !== element && !element.contains(painted)) continue
    distance = score
    nearest = element
  }
  return nearest
}

/** Pixel delta for one animation frame, capped even when the pointer is outside the viewport. */
export function tableRangeEdgeDelta(
  point: number,
  start: number,
  end: number,
  threshold = 40,
  speed = 16,
) {
  if (![point, start, end].every(Number.isFinite) || end <= start) return 0
  const zone = Math.min(
    (end - start) / 2,
    Math.max(1, Number.isFinite(threshold) ? threshold : 40),
  )
  const step = Math.max(0, Number.isFinite(speed) ? speed : 16)
  if (!step) return 0
  if (point < start + zone)
    return -step * Math.min(1, (start + zone - point) / zone)
  if (point > end - zone) return step * Math.min(1, (point - end + zone) / zone)
  return 0
}
