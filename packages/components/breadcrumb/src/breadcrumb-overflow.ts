export interface BreadcrumbOverflowPlan {
  collapsed: boolean
  prefixCount: number
  suffixCount: number
}

/** Keep the root and current location, then use remaining space around the hidden run. */
export const planBreadcrumbOverflow = (
  widths: readonly number[],
  availableWidth: number,
  overflowWidth: number,
): BreadcrumbOverflowPlan => {
  const count = widths.length
  if (
    count < 3 ||
    availableWidth <= 0 ||
    widths.some((width) => width <= 0) ||
    widths.reduce((total, width) => total + width, 0) <= availableWidth
  ) {
    return { collapsed: false, prefixCount: count, suffixCount: 0 }
  }

  let prefixCount = 1
  let suffixCount = 1
  let used = widths[0] + widths[count - 1] + overflowWidth

  while (prefixCount + suffixCount < count - 1) {
    let added = false
    const tailIndex = count - suffixCount - 1
    if (used + widths[tailIndex] <= availableWidth) {
      used += widths[tailIndex]
      suffixCount += 1
      added = true
    }

    if (prefixCount + suffixCount < count - 1) {
      const headIndex = prefixCount
      if (used + widths[headIndex] <= availableWidth) {
        used += widths[headIndex]
        prefixCount += 1
        added = true
      }
    }

    if (!added) break
  }

  return { collapsed: true, prefixCount, suffixCount }
}
