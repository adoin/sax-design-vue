export interface AnchorSectionPoint {
  href: string
  top: number
}

const visibleHeight = (
  start: number,
  end: number,
  top: number,
  bottom: number,
) => Math.max(0, Math.min(end, bottom) - Math.max(start, top))

/** Select the section occupying most of the readable viewport. */
export const selectVisibleAnchorSection = (
  points: AnchorSectionPoint[],
  viewportTop: number,
  viewportBottom: number,
  currentHref: string,
): string | undefined => {
  if (viewportBottom <= viewportTop) return
  let selected: string | undefined
  let selectedHeight = 0
  let currentHeight = 0

  points.forEach((point, index) => {
    const end = points[index + 1]?.top ?? viewportBottom
    const height = visibleHeight(point.top, end, viewportTop, viewportBottom)
    if (point.href === currentHref) currentHeight = height
    if (height > selectedHeight) {
      selected = point.href
      selectedHeight = height
    }
  })

  // A small margin prevents the marker oscillating at a section boundary.
  if (
    selected !== currentHref &&
    currentHeight > 0 &&
    selectedHeight < currentHeight + 24
  )
    return currentHref
  return selected
}
