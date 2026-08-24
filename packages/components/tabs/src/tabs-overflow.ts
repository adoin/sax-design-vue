export interface TabsOverflowLayout {
  uids: number[]
  itemSizes: number[]
  containerSize: number
  reservedSize: number
  moreSize: number
  gap: number
  activeUid?: number
}

export interface TabsOverflowResult {
  visibleUids: number[]
  leadingHiddenUids: number[]
  trailingHiddenUids: number[]
}

const totalSize = (sizes: number[], gap: number) =>
  sizes.reduce((total, size) => total + size, 0) +
  Math.max(0, sizes.length - 1) * gap

const rangeSize = (
  itemSizes: number[],
  start: number,
  end: number,
  moreSize: number,
  gap: number,
) => {
  const sizes = itemSizes.slice(start, end + 1)
  if (start > 0) sizes.unshift(moreSize)
  if (end + 1 < itemSizes.length) sizes.push(moreSize)
  return totalSize(sizes, gap)
}

/**
 * Keep a contiguous window around the active tab. Hidden tabs remain in their
 * source order and are exposed by leading/trailing overflow controls.
 */
export const calculateTabsOverflowLayout = ({
  uids,
  itemSizes,
  containerSize,
  reservedSize,
  moreSize,
  gap,
  activeUid,
}: TabsOverflowLayout): TabsOverflowResult => {
  if (!uids.length) {
    return {
      visibleUids: [],
      leadingHiddenUids: [],
      trailingHiddenUids: [],
    }
  }

  const availableWithoutMore = Math.max(0, containerSize - reservedSize)
  const normalizedSizes = uids.map((_, index) => itemSizes[index] ?? 0)
  if (totalSize(normalizedSizes, gap) <= availableWithoutMore) {
    return {
      visibleUids: [...uids],
      leadingHiddenUids: [],
      trailingHiddenUids: [],
    }
  }

  const activeIndex = Math.max(0, uids.indexOf(activeUid ?? uids[0]))
  let start = activeIndex
  let end = activeIndex

  const fits = (nextStart: number, nextEnd: number) =>
    rangeSize(normalizedSizes, nextStart, nextEnd, moreSize, gap) <=
    availableWithoutMore

  while (start > 0 || end + 1 < uids.length) {
    const leftFits = start > 0 && fits(start - 1, end)
    const rightFits = end + 1 < uids.length && fits(start, end + 1)

    if (!leftFits && !rightFits) break
    if (leftFits && rightFits) {
      const leftCount = activeIndex - start
      const rightCount = end - activeIndex
      if (leftCount <= rightCount) start -= 1
      else end += 1
    } else if (leftFits) start -= 1
    else end += 1
  }

  return {
    visibleUids: uids.slice(start, end + 1),
    leadingHiddenUids: uids.slice(0, start),
    trailingHiddenUids: uids.slice(end + 1),
  }
}

export const calculateVisibleTabUids = (layout: TabsOverflowLayout) =>
  calculateTabsOverflowLayout(layout).visibleUids
