import {
  stepTableMergeArrow,
  stepTableMergeTab,
} from './table-merge-navigation'
import type { TableCellCoordinate } from './use-table-keyboard'
import type { useTableKeyboardCoordinates } from './use-table-keyboard-coordinates'
import type { TableMergeRegion } from './table-merge-regions'
import type { TableFlatRow } from '../table'
import type { TableActiveCell } from '../table-keyboard'

interface MergeCoordinateOptions {
  base: ReturnType<typeof useTableKeyboardCoordinates>
  at: (row: number, col: number) => TableMergeRegion | undefined
  rowAt: (absolute: number) => TableFlatRow | undefined
  offset: () => number
  count: () => number
  rowSourceIndex?: (index: number) => number
  rowViewIndex?: (index: number, backward: boolean) => number | undefined
}
const sameAddress = (a: TableActiveCell, b: TableActiveCell) =>
  a.rowKey === b.rowKey && a.columnKey === b.columnKey

/** Project merged owners onto the current page while preserving their source address. */
export function useTableMergeCoordinates(options: MergeCoordinateOptions) {
  const sourceIndex = (row: number) =>
    options.rowSourceIndex?.(row) ?? row + options.offset()
  const viewIndex = (row: number, backward = false) =>
    options.rowViewIndex
      ? options.rowViewIndex(row, backward)
      : Math.max(0, row - options.offset())
  const at = (row: number, col: number): TableCellCoordinate | undefined => {
    const original = options.base.at(row, col)
    if (!original) return
    const region = options.at(sourceIndex(row), col)
    if (!region) return original
    const owner = options.rowAt(region.row)
    const column = options.base.columnAt(region.col)
    if (!owner || column < 0) return
    return {
      row: viewIndex(region.row) ?? row,
      position: region.col,
      column,
      viewRow: row,
      viewColumn: original.column,
      address: { rowKey: owner.key, columnKey: options.base.keyAt(column) },
    }
  }
  const resolve = (address: TableActiveCell, hint?: TableCellCoordinate) => {
    if (hint && sameAddress(address, hint.address)) {
      const visible = at(
        hint.viewRow ?? hint.row,
        options.base.positionOf(hint.viewColumn ?? hint.column),
      )
      if (visible && sameAddress(visible.address, address)) return visible
    }
    const original = options.base.resolve(address, hint)
    if (original) return at(original.row, original.position)
    if (hint && sameAddress(address, hint.address)) {
      const result = at(hint.row, hint.position)
      if (result && sameAddress(result.address, address)) return result
    }
    return undefined
  }
  const move = (
    current: TableCellCoordinate,
    key: string,
    backwards: boolean,
  ) => {
    if (!options.count()) return
    const offset = sourceIndex(0)
    const position = { row: sourceIndex(current.row), col: current.position }
    const rowEnd = sourceIndex(options.count() - 1) + 1
    const lookup = {
      at: (row: number, col: number) => {
        const region = options.at(row, col)
        if (!region) return undefined
        const start = Math.max(region.row, offset)
        const end = Math.min(region.rowEnd, rowEnd)
        return { ...region, row: start, rowEnd: end, rowspan: end - start }
      },
    }
    const columns = options.base.countColumns()
    const directions: Record<string, 'up' | 'down' | 'left' | 'right'> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
    }
    const direction = directions[key]
    const next =
      key === 'Tab'
        ? stepTableMergeTab(lookup, position, backwards, rowEnd, columns)
        : direction
          ? stepTableMergeArrow(lookup, position, direction, rowEnd, columns)
          : undefined
    if (!next) return
    const row = Math.max(next.row, offset)
    if (next.row < offset && options.at(row, next.col)?.row !== next.row) return
    const projected = viewIndex(
      row,
      direction === 'up' || (key === 'Tab' && backwards),
    )
    return projected == null ? undefined : at(projected, next.col)
  }
  return { at, resolve, move }
}
