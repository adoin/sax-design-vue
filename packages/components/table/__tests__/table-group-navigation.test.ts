import { describe, expect, it } from 'vitest'
import { createTableGroupLayout } from '../src/composables/table-group-layout'
import { resolveRemoteTableGroups } from '../src/composables/table-group-model'
import { createTableMergeIndex } from '../src/composables/table-merge-regions'
import { useTableMergeCoordinates } from '../src/composables/use-table-merge-coordinates'
import type { TableCellCoordinate } from '../src/composables/use-table-keyboard'
import type { TableMergeRange } from '../src/table-merge'

const setup = (ranges: TableMergeRange[] = []) => {
  const groups = resolveRemoteTableGroups(
    ['first', 'hidden', 'last'].map((key, index) => ({
      key,
      field: 'team',
      value: key,
      rowStart: index * 2,
      rowCount: 2,
    })),
    6,
  )
  const layout = createTableGroupLayout(
    groups,
    6,
    (group) => group.key !== 'hidden',
  )
  const merges = createTableMergeIndex(ranges, 6, 3)
  const at = (row: number, col: number): TableCellCoordinate | undefined => {
    const source = layout.rowIndexAt(row)
    if (source === undefined || col < 0 || col >= 3) return
    return {
      row,
      column: col,
      position: col,
      address: { rowKey: source, columnKey: String(col) },
    }
  }
  return useTableMergeCoordinates({
    base: {
      at,
      resolve: (address) => {
        const row = layout.dataIndexOf(Number(address.rowKey))
        return row === undefined
          ? undefined
          : at(row, Number(address.columnKey))
      },
      keyAt: String,
      columnAt: (index) => (index >= 0 && index < 3 ? index : -1),
      positionOf: (index) => index,
      countColumns: () => 3,
    },
    at: (row, col) => merges.at(row, col),
    rowAt: (index) => ({
      row: { id: index },
      key: index,
      index,
      depth: 0,
      hasChildren: false,
      expanded: false,
      loading: false,
    }),
    offset: () => 0,
    count: () => layout.dataCount,
    rowSourceIndex: (index) => layout.rowIndexAt(index) ?? -1,
    rowViewIndex: (index, backwards) =>
      layout.dataIndexNear(index, backwards ? 'backward' : 'forward'),
  })
}

describe('grouped source keyboard coordinates', () => {
  it('skips collapsed ranges in both arrow and tab directions', () => {
    const coordinates = setup()
    expect(
      coordinates.move(coordinates.at(1, 0)!, 'ArrowDown', false)?.address,
    ).toEqual({ rowKey: 4, columnKey: '0' })
    expect(
      coordinates.move(coordinates.at(2, 0)!, 'ArrowUp', false)?.address,
    ).toEqual({ rowKey: 1, columnKey: '0' })
    expect(
      coordinates.move(coordinates.at(1, 2)!, 'Tab', false)?.address,
    ).toEqual({ rowKey: 4, columnKey: '0' })
    expect(
      coordinates.move(coordinates.at(2, 0)!, 'Tab', true)?.address,
    ).toEqual({ rowKey: 1, columnKey: '2' })
  })

  it('preserves merged owners and exits spans crossing collapsed groups', () => {
    const coordinates = setup([{ row: 1, col: 0, rowspan: 4, colspan: 2 }])
    const continuation = coordinates.at(2, 1)!
    expect(continuation.address).toEqual({ rowKey: 1, columnKey: '0' })
    expect(coordinates.move(continuation, 'ArrowDown', false)?.address).toEqual(
      { rowKey: 5, columnKey: '0' },
    )
    expect(
      coordinates.move(continuation, 'ArrowRight', false)?.address,
    ).toEqual({ rowKey: 1, columnKey: '2' })
  })

  it('projects a hidden merge owner onto its first visible continuation', () => {
    const coordinates = setup([{ row: 2, col: 0, rowspan: 3, colspan: 2 }])
    const continuation = coordinates.at(2, 1)!
    expect(continuation).toMatchObject({
      row: 2,
      address: { rowKey: 2, columnKey: '0' },
    })
    expect(coordinates.resolve(continuation.address, continuation)).toEqual(
      continuation,
    )
    expect(coordinates.move(continuation, 'ArrowUp', false)?.address).toEqual({
      rowKey: 1,
      columnKey: '0',
    })
    expect(coordinates.move(continuation, 'ArrowDown', false)?.address).toEqual(
      { rowKey: 5, columnKey: '0' },
    )
  })
})
