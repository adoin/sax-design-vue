import { describe, expect, it } from 'vitest'
import { calculateVisibleTagCount } from '../src/tag-overflow'

describe('Select tag overflow', () => {
  it('keeps every tag when they fit', () => {
    expect(
      calculateVisibleTagCount({
        availableWidth: 240,
        tagWidths: [60, 70, 50],
        overflowWidth: 36,
        reservedWidth: 30,
      }),
    ).toBe(3)
  })

  it('reserves room for the input and +N counter', () => {
    expect(
      calculateVisibleTagCount({
        availableWidth: 200,
        tagWidths: [72, 64, 58, 80],
        overflowWidth: 34,
        reservedWidth: 30,
      }),
    ).toBe(2)
  })

  it('recalculates the visible count as space grows', () => {
    const tagWidths = [72, 64, 58, 80]
    const compact = calculateVisibleTagCount({
      availableWidth: 200,
      tagWidths,
      overflowWidth: 34,
      reservedWidth: 30,
    })
    const wide = calculateVisibleTagCount({
      availableWidth: 330,
      tagWidths,
      overflowWidth: 34,
      reservedWidth: 30,
    })

    expect(compact).toBe(2)
    expect(wide).toBe(4)
  })

  it('treats maxVisible as an optional upper bound', () => {
    expect(
      calculateVisibleTagCount({
        availableWidth: 500,
        tagWidths: [60, 60, 60, 60],
        overflowWidth: 34,
        maxVisible: 2,
      }),
    ).toBe(2)
  })
})
