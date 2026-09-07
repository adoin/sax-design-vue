import type { TableGroupNode } from '../table-group'
import type { TableHierarchyState } from '../table-hierarchy'

interface DataSegment {
  kind: 'data'
  start: number
  end: number
  rowStart: number
  dataStart: number
  hierarchy?: Omit<TableHierarchyState, 'isLastChild'>
  continuesAfter: boolean
}
interface GroupSegment {
  kind: 'group' | 'subtotal'
  start: number
  end: number
  group: TableGroupNode
  expanded: boolean
  hierarchy: TableHierarchyState
}
type Segment = DataSegment | GroupSegment

export type TableGroupDisplayItem =
  | {
      kind: 'data'
      rowIndex: number
      dataIndex: number
      hierarchy?: TableHierarchyState
    }
  | {
      kind: 'group' | 'subtotal'
      group: TableGroupNode
      expanded: boolean
      hierarchy: TableHierarchyState
    }

const findSegment = <T>(
  items: readonly T[],
  index: number,
  end: (item: T) => number,
): T | undefined => {
  let low = 0
  let high = items.length
  while (low < high) {
    const middle = Math.floor((low + high) / 2)
    if (end(items[middle]) <= index) low = middle + 1
    else high = middle
  }
  return items[low]
}

/** Compact data runs keep layout and lookups proportional to group count, even for generated sources. */
export function createTableGroupLayout(
  groups: readonly TableGroupNode[],
  rowCount: number,
  expanded: (group: TableGroupNode) => boolean,
  options: { rowOffset?: number; subtotal?: boolean } = {},
) {
  const rowOffset = options.rowOffset ?? 0
  if (
    !Number.isSafeInteger(rowCount) ||
    rowCount < 0 ||
    !Number.isSafeInteger(rowOffset) ||
    rowOffset < 0 ||
    !Number.isSafeInteger(rowOffset + rowCount)
  )
    throw new RangeError('Invalid group layout bounds')
  const segments: Segment[] = []
  const data: DataSegment[] = []
  const groupRenderIndexes = new Map<string, number>()
  let count = 0
  let dataCount = 0
  const appendData = (
    start: number,
    end: number,
    ancestorHasNext: readonly boolean[],
    continuesAfter: boolean,
  ) => {
    if (end <= start) return
    const length = end - start
    const segment: DataSegment = {
      kind: 'data',
      start: count,
      end: count + length,
      rowStart: start,
      dataStart: dataCount,
      hierarchy: ancestorHasNext.length
        ? {
            depth: ancestorHasNext.length,
            ancestorHasNext,
            continues: false,
            indent: 28,
            origin: 30,
            target: 'first',
          }
        : undefined,
      continuesAfter,
    }
    segments.push(segment)
    data.push(segment)
    count += length
    dataCount += length
  }
  const appendGroup = (
    group: TableGroupNode,
    kind: GroupSegment['kind'],
    open: boolean,
    hierarchy: TableHierarchyState,
  ) => {
    if (kind === 'group') groupRenderIndexes.set(group.key, count)
    segments.push({
      kind,
      start: count,
      end: count + 1,
      group,
      expanded: open,
      hierarchy,
    })
    count++
  }
  const walk = (
    nodes: readonly TableGroupNode[],
    start: number,
    end: number,
    ancestorHasNext: readonly boolean[] = [],
    continuesAfter = false,
  ) => {
    let cursor = start
    nodes.forEach((group, groupIndex) => {
      const stop = group.rowStart + group.rowCount
      if (group.rowStart < cursor || stop > end)
        throw new RangeError('Groups must have ordered, non-overlapping ranges')
      appendData(cursor, group.rowStart, ancestorHasNext, true)
      const hasNextSibling = groupIndex < nodes.length - 1 || stop < end
      const open = expanded(group)
      appendGroup(group, 'group', open, {
        depth: ancestorHasNext.length,
        ancestorHasNext,
        isLastChild: !hasNextSibling,
        continues: open && (group.rowCount > 0 || Boolean(options.subtotal)),
        indent: 28,
        origin: 30,
        target: 'first',
      })
      if (open) {
        const childAncestors = [...ancestorHasNext, hasNextSibling]
        walk(
          group.children,
          group.rowStart,
          stop,
          childAncestors,
          Boolean(options.subtotal),
        )
        if (options.subtotal)
          appendGroup(group, 'subtotal', true, {
            depth: childAncestors.length,
            ancestorHasNext: childAncestors,
            isLastChild: true,
            continues: false,
            indent: 28,
            origin: 30,
            target: 'first',
          })
      }
      cursor = stop
    })
    appendData(cursor, end, ancestorHasNext, continuesAfter)
  }
  walk(groups, rowOffset, rowOffset + rowCount)
  if (!Number.isSafeInteger(count))
    throw new RangeError('Group display count exceeds safe integer bounds')
  const dataAt = (index: number) => {
    if (!Number.isSafeInteger(index) || index < 0 || index >= dataCount)
      return undefined
    return findSegment(
      data,
      index,
      (segment) => segment.dataStart + segment.end - segment.start,
    )
  }
  return {
    count,
    dataCount,
    segmentCount: segments.length,
    itemAt(index: number): TableGroupDisplayItem | undefined {
      if (!Number.isSafeInteger(index) || index < 0 || index >= count)
        return undefined
      const segment = findSegment(segments, index, (item) => item.end)!
      return segment.kind === 'data'
        ? {
            kind: 'data',
            rowIndex: segment.rowStart + index - segment.start,
            dataIndex: segment.dataStart + index - segment.start,
            hierarchy: segment.hierarchy
              ? {
                  ...segment.hierarchy,
                  isLastChild:
                    index === segment.end - 1 && !segment.continuesAfter,
                }
              : undefined,
          }
        : {
            kind: segment.kind,
            group: segment.group,
            expanded: segment.expanded,
            hierarchy: segment.hierarchy,
          }
    },
    /** Visible data index -> source/group-ordered data index. */
    rowIndexAt(index: number): number | undefined {
      const segment = dataAt(index)
      return segment ? segment.rowStart + index - segment.dataStart : undefined
    },
    /** Group key -> virtual-list item index for its visible header band. */
    groupIndexOf(key: string): number | undefined {
      return groupRenderIndexes.get(key)
    },
    /** Visible data index -> virtual-list item index (including group bands). */
    renderIndexAt(index: number): number | undefined {
      const segment = dataAt(index)
      return segment ? segment.start + index - segment.dataStart : undefined
    },
    /** Hidden members have no visible data address. */
    dataIndexOf(rowIndex: number): number | undefined {
      if (
        !Number.isSafeInteger(rowIndex) ||
        rowIndex < rowOffset ||
        rowIndex >= rowOffset + rowCount
      )
        return undefined
      const segment = findSegment(
        data,
        rowIndex,
        (item) => item.rowStart + item.end - item.start,
      )
      return segment && rowIndex >= segment.rowStart
        ? segment.dataStart + rowIndex - segment.rowStart
        : undefined
    },
    /** Find the closest visible member in a navigation direction, skipping collapsed ranges. */
    dataIndexNear(
      rowIndex: number,
      direction: 'forward' | 'backward',
    ): number | undefined {
      if (!Number.isSafeInteger(rowIndex) || !data.length) return undefined
      if (direction === 'forward') {
        const segment = findSegment(
          data,
          rowIndex,
          (item) => item.rowStart + item.end - item.start,
        )
        return segment
          ? segment.dataStart + Math.max(0, rowIndex - segment.rowStart)
          : undefined
      }
      let low = 0
      let high = data.length
      while (low < high) {
        const middle = Math.floor((low + high) / 2)
        if (data[middle].rowStart <= rowIndex) low = middle + 1
        else high = middle
      }
      const segment = data[low - 1]
      return segment
        ? segment.dataStart +
            Math.min(
              rowIndex - segment.rowStart,
              segment.end - segment.start - 1,
            )
        : undefined
    },
  }
}
