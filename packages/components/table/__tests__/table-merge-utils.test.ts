import { describe, expect, it, vi } from 'vitest'
import { createTableRowspanMerges } from '../src/table-merge'

interface Row {
  id: number
  team: string
  owner?: { group?: string }
}

describe('createTableRowspanMerges', () => {
  it('creates vertical ranges only for consecutive equal values', () => {
    const rows: Row[] = [
      { id: 1, team: 'Design' },
      { id: 2, team: 'Design' },
      { id: 3, team: 'Engineering' },
      { id: 4, team: 'Design' },
      { id: 5, team: 'Design' },
      { id: 6, team: 'Design' },
      { id: 7, team: 'Operations' },
    ]

    expect(createTableRowspanMerges(rows, { field: 'team', col: 2 })).toEqual([
      { row: 0, col: 2, rowspan: 2, colspan: 1 },
      { row: 3, col: 2, rowspan: 3, colspan: 1 },
    ])
    expect(rows.map((row) => row.id)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('supports nested JSON fields and custom equality', () => {
    const equals = vi.fn(
      (left: string | undefined, right: string | undefined) =>
        left?.toLocaleLowerCase() === right?.toLocaleLowerCase(),
    )
    const rows: Row[] = [
      { id: 1, team: 'A', owner: { group: 'Core' } },
      { id: 2, team: 'B', owner: { group: 'core' } },
      { id: 3, team: 'C', owner: { group: 'Docs' } },
    ]

    expect(
      createTableRowspanMerges(rows, {
        field: 'owner.group',
        col: 1,
        equals,
      }),
    ).toEqual([{ row: 0, col: 1, rowspan: 2, colspan: 1 }])
    expect(equals).toHaveBeenCalledTimes(2)
    expect(equals.mock.calls[0]?.slice(0, 2)).toEqual(['Core', 'core'])
  })

  it('omits single rows and validates the target column', () => {
    expect(
      createTableRowspanMerges([{ id: 1, team: 'Design' }], {
        field: 'team',
        col: 0,
      }),
    ).toEqual([])
    expect(() =>
      createTableRowspanMerges([], { field: 'team', col: -1 }),
    ).toThrow(RangeError)
    expect(() =>
      createTableRowspanMerges([], { field: 'team', col: 0.5 }),
    ).toThrow(RangeError)
  })
})
