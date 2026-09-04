/** Sparse prefix sums over resized columns only, independent of the generated column count. */
export function createSparseColumnMetrics(
  count: number,
  baseWidth: number,
  overrides: ReadonlyMap<number, number>,
) {
  const entries = [...overrides]
    .filter(
      ([index, width]) =>
        Number.isInteger(index) &&
        index >= 0 &&
        index < count &&
        Number.isFinite(width) &&
        width > 0,
    )
    .sort((a, b) => a[0] - b[0])
  const deltas = [0]
  for (const [, width] of entries)
    deltas.push(deltas[deltas.length - 1] + width - baseWidth)
  const offsetAt = (index: number) => {
    let low = 0
    let high = entries.length
    while (low < high) {
      const middle = Math.floor((low + high) / 2)
      if (entries[middle][0] < index) low = middle + 1
      else high = middle
    }
    return index * baseWidth + deltas[low]
  }
  const widthAt = (index: number) => overrides.get(index) ?? baseWidth
  const totalWidth = offsetAt(count)
  const range = (left: number, viewport: number, overscan: number) => {
    const find = (target: number) => {
      let low = 0
      let high = count
      while (low < high) {
        const middle = Math.floor((low + high) / 2)
        if (offsetAt(middle + 1) <= target) low = middle + 1
        else high = middle
      }
      return Math.min(count - 1, low)
    }
    const start = Math.max(0, find(Math.max(0, left)) - overscan)
    const end = Math.min(
      count,
      find(Math.max(0, left) + Math.max(0, viewport)) + 1 + overscan,
    )
    return {
      start,
      end,
      before: offsetAt(start),
      after: Math.max(0, totalWidth - offsetAt(end)),
    }
  }
  return { offsetAt, widthAt, totalWidth, range }
}
