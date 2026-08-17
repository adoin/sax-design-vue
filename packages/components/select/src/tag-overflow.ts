export interface TagOverflowMetrics {
  availableWidth: number
  tagWidths: readonly number[]
  overflowWidth: number
  reservedWidth?: number
  maxVisible?: number
}

/**
 * Returns the number of leading tags that fit beside an overflow counter.
 * Widths include each tag's horizontal margins.
 */
export const calculateVisibleTagCount = ({
  availableWidth,
  tagWidths,
  overflowWidth,
  reservedWidth = 0,
  maxVisible = 0,
}: TagOverflowMetrics) => {
  const contentWidth = Math.max(0, availableWidth - reservedWidth)
  const visibleLimit =
    maxVisible > 0 ? Math.min(maxVisible, tagWidths.length) : tagWidths.length
  const allTagsWidth = tagWidths.reduce((total, width) => total + width, 0)

  if (visibleLimit === tagWidths.length && allTagsWidth <= contentWidth) {
    return tagWidths.length
  }

  const tagBudget = Math.max(0, contentWidth - overflowWidth)
  let usedWidth = 0
  let visibleCount = 0

  for (let index = 0; index < visibleLimit; index++) {
    const nextWidth = Math.max(0, tagWidths[index] ?? 0)
    if (usedWidth + nextWidth > tagBudget) break
    usedWidth += nextWidth
    visibleCount++
  }

  return visibleCount
}
