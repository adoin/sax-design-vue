import { describe, expect, it, vi } from 'vitest'
import { createTableMergeIndex } from '../src/composables/table-merge-regions'
import {
  stepTableMergeArrow,
  stepTableMergeTab,
  tableMergeOwner,
} from '../src/composables/table-merge-navigation'

describe('merged table cell navigation', () => {
  const index = createTableMergeIndex(
    [
      { row: 1, col: 1, rowspan: 3, colspan: 2 },
      { row: 1, col: 3, rowspan: 2, colspan: 2 },
    ],
    5,
    5,
  )
  it('resolves covered coordinates and exits the entire merge with arrows', () => {
    expect(tableMergeOwner(index, 3, 2)).toEqual({ row: 1, col: 1 })
    expect(
      stepTableMergeArrow(index, { row: 3, col: 2 }, 'down', 5, 5),
    ).toEqual({ row: 4, col: 1 })
    expect(
      stepTableMergeArrow(index, { row: 1, col: 1 }, 'right', 5, 5),
    ).toEqual({ row: 1, col: 3 })
    expect(
      stepTableMergeArrow(index, { row: 2, col: 4 }, 'left', 5, 5),
    ).toEqual({ row: 1, col: 1 })
    expect(
      stepTableMergeArrow(index, { row: 0, col: 0 }, 'up', 5, 5),
    ).toBeUndefined()
  })
  it('traverses anchors in row order and preserves native traversal at the table edge', () => {
    const expected = [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [1, 0],
      [1, 1],
      [1, 3],
      [2, 0],
      [3, 0],
      [3, 3],
      [3, 4],
      [4, 0],
      [4, 1],
      [4, 2],
      [4, 3],
      [4, 4],
    ].map(([row, col]) => ({ row, col }))
    for (let position = 0; position < expected.length; position++) {
      expect(stepTableMergeTab(index, expected[position], false, 5, 5)).toEqual(
        expected[position + 1],
      )
      expect(stepTableMergeTab(index, expected[position], true, 5, 5)).toEqual(
        expected[position - 1],
      )
    }
  })
  it('skips millions of covered rows when several rectangles fill the row together', () => {
    const giant = createTableMergeIndex(
      [
        { row: 0, col: 0, rowspan: 999999, colspan: 50000 },
        { row: 0, col: 50000, rowspan: 999999, colspan: 50000 },
      ],
      1_000_000,
      100_000,
    )
    const at = vi.spyOn(giant, 'at')
    expect(
      stepTableMergeTab(
        giant,
        { row: 0, col: 50000 },
        false,
        1_000_000,
        100_000,
      ),
    ).toEqual({ row: 999999, col: 0 })
    expect(at.mock.calls.length).toBeLessThan(10)
    at.mockClear()
    expect(
      stepTableMergeTab(
        giant,
        { row: 999999, col: 0 },
        true,
        1_000_000,
        100_000,
      ),
    ).toEqual({ row: 0, col: 50000 })
    expect(at.mock.calls.length).toBeLessThan(10)
  })
  it('does not skip the next available row when leaving a partially scanned row', () => {
    const merges = createTableMergeIndex(
      [{ row: 0, col: 2, rowspan: 10, colspan: 2 }],
      10,
      4,
    )
    expect(stepTableMergeTab(merges, { row: 2, col: 1 }, false, 10, 4)).toEqual(
      { row: 3, col: 0 },
    )
    expect(stepTableMergeTab(merges, { row: 3, col: 0 }, true, 10, 4)).toEqual({
      row: 2,
      col: 1,
    })
  })
})
