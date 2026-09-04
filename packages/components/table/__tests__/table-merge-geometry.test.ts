import { describe, expect, it } from 'vitest'
import { createTableMergeIndex } from '../src/composables/table-merge-regions'
import { layoutTableMergeBoxes } from '../src/composables/table-merge-geometry'

describe('merged table cell geometry', () => {
  it('uses measured dynamic row heights and clips overscan at the viewport', () => {
    const index = createTableMergeIndex(
      [{ row: 0, col: 0, rowspan: 6, colspan: 4 }],
      6,
      4,
    )
    const boxes = layoutTableMergeBoxes(
      index,
      [
        { index: 2, top: -20, height: 50 },
        { index: 3, top: 30, height: 80 },
        { index: 4, top: 110, height: 44 },
      ],
      [
        { position: 1, left: -100, width: 160 },
        { position: 2, left: 60, width: 180 },
        { position: 3, left: 240, width: 120 },
      ],
      { left: 0, right: 300, top: 0, bottom: 140 },
    )
    expect(boxes).toHaveLength(1)
    expect(boxes[0]).toMatchObject({
      left: 0,
      top: 0,
      width: 300,
      height: 140,
      rowStart: 2,
      rowEnd: 5,
      colStart: 1,
      colEnd: 4,
    })
    expect(boxes[0].region).toMatchObject({ row: 0, col: 0 })
  })

  it('splits at fixed-column boundaries and prevents scrolling content from covering fixed panes', () => {
    const index = createTableMergeIndex(
      [{ row: 0, col: 0, rowspan: 2, colspan: 5 }],
      2,
      5,
    )
    const boxes = layoutTableMergeBoxes(
      index,
      [
        { index: 0, top: 0, height: 44 },
        { index: 1, top: 44, height: 56 },
      ],
      [
        { position: 0, left: 0, width: 100, fixed: 'left' },
        { position: 1, left: 20, width: 150 },
        { position: 2, left: 170, width: 150 },
        { position: 3, left: 320, width: 150 },
        { position: 4, left: 400, width: 100, fixed: 'right' },
      ],
      { left: 0, right: 500, top: 0, bottom: 200 },
    )
    expect(
      boxes.map(({ left, width, height, primary }) => ({
        left,
        width,
        height,
        primary,
      })),
    ).toEqual([
      { left: 0, width: 100, height: 100, primary: true },
      { left: 100, width: 300, height: 100, primary: false },
      { left: 400, width: 100, height: 100, primary: false },
    ])
  })

  it('does not cover expanded detail panels between merged data rows', () => {
    const index = createTableMergeIndex(
      [{ row: 0, col: 0, rowspan: 3, colspan: 1 }],
      3,
      1,
    )
    const boxes = layoutTableMergeBoxes(
      index,
      [
        { index: 0, top: 0, height: 44 },
        { index: 1, top: 244, height: 44 },
        { index: 2, top: 288, height: 44 },
      ],
      [{ position: 0, left: 0, width: 200 }],
      { left: 0, right: 200, top: 0, bottom: 400 },
    )
    expect(
      boxes.map(({ top, height, primary }) => ({ top, height, primary })),
    ).toEqual([
      { top: 0, height: 44, primary: true },
      { top: 244, height: 88, primary: false },
    ])
  })

  it('keeps offscreen-origin giant merges bounded to visible physical coordinates', () => {
    const index = createTableMergeIndex(
      [{ row: 0, col: 0, rowspan: 1_000_000, colspan: 100_000 }],
      1_000_000,
      100_000,
    )
    const boxes = layoutTableMergeBoxes(
      index,
      [
        { index: 999998, top: 0, height: 44 },
        { index: 999999, top: 44, height: 44 },
      ],
      [{ position: 99998, left: 0, width: 150 }],
      { left: 0, right: 150, top: 0, bottom: 88 },
    )
    expect(boxes).toHaveLength(1)
    expect(boxes[0]).toMatchObject({
      top: 0,
      left: 0,
      width: 150,
      height: 88,
      primary: true,
    })
    expect(boxes[0].region.row).toBe(0)
  })
})
