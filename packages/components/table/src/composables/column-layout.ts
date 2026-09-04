import type { TableColumnState } from '../table'

const lowerBound = (values: number[], target: number) => {
  let low = 0
  let high = values.length
  while (low < high) {
    const mid = low + Math.floor((high - low) / 2)
    if (values[mid] < target) low = mid + 1
    else high = mid
  }
  return low
}

/** Select a rank without allocating every position in a generated source. */
function availableAt(rank: number, count: number, excluded: number[]) {
  if (rank < 0 || rank >= count - excluded.length) return -1
  let low = 0
  let high = count - 1
  while (low < high) {
    const mid = low + Math.floor((high - low) / 2)
    const available = mid + 1 - lowerBound(excluded, mid + 1)
    if (available <= rank) low = mid + 1
    else high = mid
  }
  return low
}

export interface ColumnLayoutOptions {
  count: number
  state: TableColumnState[]
  indexForKey: (key: string) => number
  left: number[]
  right: number[]
}

export function createColumnLayout(options: ColumnLayoutOptions) {
  const count = Math.max(0, Math.floor(options.count))
  const states = new Map<number, TableColumnState>()
  for (const state of options.state) {
    const index = options.indexForKey(state.key)
    if (Number.isInteger(index) && index >= 0 && index < count)
      states.set(index, state)
  }
  const nextFree = new Map<number, number>()
  const freeAt = (start: number) => {
    let position = start
    const path: number[] = []
    while (nextFree.has(position)) {
      path.push(position)
      position = nextFree.get(position)!
    }
    for (const entry of path) nextFree.set(entry, position)
    return position
  }
  const moved = [...states.entries()]
    .filter(
      ([, state]) =>
        Number.isInteger(state.order) &&
        state.order! >= 0 &&
        state.order! < count,
    )
    .sort((a, b) => a[1].order! - b[1].order! || a[0] - b[0])
  const byPosition = new Map<number, number>()
  const bySource = new Map<number, number>()
  for (const [index, state] of moved) {
    let position = freeAt(state.order!)
    if (position >= count) position = freeAt(0)
    nextFree.set(position, freeAt(position + 1))
    byPosition.set(position, index)
    bySource.set(index, position)
  }
  const movedIndices = [...bySource.keys()].sort((a, b) => a - b)
  const movedPositions = [...byPosition.keys()].sort((a, b) => a - b)
  const sourceAt = (position: number) => {
    if (position < 0 || position >= count) return -1
    return (
      byPosition.get(position) ??
      availableAt(
        position - lowerBound(movedPositions, position),
        count,
        movedIndices,
      )
    )
  }
  const positionOf = (index: number) => {
    if (index < 0 || index >= count) return -1
    return (
      bySource.get(index) ??
      availableAt(
        index - lowerBound(movedIndices, index),
        count,
        movedPositions,
      )
    )
  }
  const hidden = new Set(
    [...states.entries()]
      .filter(([, state]) => state.hidden)
      .map(([index]) => index),
  )
  const left = new Set(options.left)
  const right = new Set(options.right)
  for (const [index, state] of states) {
    if (state.fixed !== undefined) {
      left.delete(index)
      right.delete(index)
      if (state.fixed === true || state.fixed === 'left') left.add(index)
      if (state.fixed === 'right') right.add(index)
    }
  }
  const ordered = (indices: Set<number>) =>
    [...indices]
      .filter((index) => index >= 0 && index < count && !hidden.has(index))
      .sort((a, b) => positionOf(a) - positionOf(b))
  const leftIndices = ordered(left)
  const rightIndices = ordered(right)
  const excluded = [...new Set([...hidden, ...leftIndices, ...rightIndices])]
    .map(positionOf)
    .sort((a, b) => a - b)
  const centerAt = (index: number) =>
    sourceAt(availableAt(index, count, excluded))
  const centerIndexOf = (index: number) => {
    const position = positionOf(index)
    if (
      position < 0 ||
      hidden.has(index) ||
      left.has(index) ||
      right.has(index)
    )
      return -1
    return position - lowerBound(excluded, position)
  }
  return {
    sourceAt,
    positionOf,
    centerAt,
    centerIndexOf,
    left: leftIndices,
    right: rightIndices,
    visibleCount: count - hidden.size,
    centerCount: count - excluded.length,
    hidden,
    fixedOf: (index: number): false | 'left' | 'right' =>
      left.has(index) ? 'left' : right.has(index) ? 'right' : false,
  }
}
