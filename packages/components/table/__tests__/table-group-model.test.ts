import { describe, expect, it } from 'vitest'
import {
  buildTableGroupModel,
  resolveRemoteTableGroups,
  tableGroupValueKey,
} from '../src/composables/table-group-model'
import { createTableGroupLayout } from '../src/composables/table-group-layout'
import type { TableFlatRow, TableRow } from '../src/table'
import type { TableGroupDisplayItem } from '../src/composables/table-group-layout'
import type { TableGroupNode, TableRemoteGroup } from '../src/table-group'

const flat = (row: TableRow, index: number, depth = 0): TableFlatRow => ({
  row,
  index,
  key:
    typeof row.id === 'string' || typeof row.id === 'number' ? row.id : index,
  depth,
  hasChildren: false,
  expanded: false,
  loading: false,
})
const input = [
  { id: 0, team: 'Design', city: 'A', hours: 3 },
  { id: 1, team: 'Engineering', city: 'B', hours: 8 },
  { id: 2, team: 'Design', city: 'B', hours: 4 },
  { id: 3, team: 'Design', city: 'A', hours: 2 },
].map((row, index) => flat(Object.freeze(row), index))
const model = () =>
  buildTableGroupModel(
    input,
    ['team', 'city'],
    [
      { key: 'hours', field: 'hours', method: 'sum' },
      { key: 'count', method: 'count' },
    ],
  )

describe('Table local row groups', () => {
  it('creates nested, stable first-seen groups and independent summaries', () => {
    const result = model()
    expect(result.rows.map((row) => row.key)).toEqual([0, 3, 2, 1])
    expect(
      result.groups.map((group) => [
        group.value,
        group.rowStart,
        group.rowCount,
      ]),
    ).toEqual([
      ['Design', 0, 3],
      ['Engineering', 3, 1],
    ])
    expect(
      result.groups[0].children.map((group) => [
        group.value,
        group.rowStart,
        group.rowCount,
      ]),
    ).toEqual([
      ['A', 0, 2],
      ['B', 2, 1],
    ])
    expect(result.groups[0].aggregates).toEqual({ hours: 9, count: 3 })
    expect(result.groups[0].children[0].aggregates).toEqual({
      hours: 5,
      count: 2,
    })
    expect(result.summary).toEqual({ hours: 17, count: 4 })
    expect(result.rows[1]).toBe(input[3])
    expect(input.map((row) => row.key)).toEqual([0, 1, 2, 3])
    expect(Object.isFrozen(result.groups[0].path)).toBe(true)
  })

  it('keeps expanded tree branches together and aggregates their supplied visible members', () => {
    const rows = [
      flat({ id: 'a', team: 'A', hours: 1 }, 0),
      flat({ id: 'child', team: 'B', hours: 2 }, 1, 1),
      flat({ id: 'grandchild', team: 'C', hours: 3 }, 2, 2),
      flat({ id: 'b', team: 'B', hours: 4 }, 3),
      flat({ id: 'a2', team: 'A', hours: 5 }, 4),
    ]
    const result = buildTableGroupModel(
      rows,
      ['team'],
      [{ key: 'hours', field: 'hours', method: 'sum' }],
    )
    expect(result.rows.map((row) => row.key)).toEqual([
      'a',
      'child',
      'grandchild',
      'a2',
      'b',
    ])
    expect(result.groups[0].rowCount).toBe(4)
    expect(result.groups[0].aggregates.hours).toBe(11)
    expect(result.rows[2].depth).toBe(2)
  })

  it('keeps keys stable across ordering changes and distinguishes typed/escaped values', () => {
    const values = [
      undefined,
      null,
      'null',
      1,
      '1',
      true,
      'true',
      BigInt(1),
      'a:b|c',
      '__proto__',
    ]
    const rows = values.map((value, index) => flat({ value }, index))
    const a = buildTableGroupModel(rows, ['value'])
    const b = buildTableGroupModel([...rows].reverse(), ['value'])
    expect(new Set(a.groups.map((group) => group.key)).size).toBe(values.length)
    expect(a.groups.map((group) => group.key)).toEqual(
      b.groups.map((group) => group.key).reverse(),
    )
    expect(tableGroupValueKey(-0)).toBe(tableGroupValueKey(0))
  })

  it('uses date values by time, copies the supplied date and accepts custom normalization', () => {
    const date = new Date('2026-09-01')
    const result = buildTableGroupModel(
      [
        flat({ date, owner: { id: 2 } }, 0),
        flat({ date: new Date(date), owner: { id: 2 } }, 1),
      ],
      [
        { field: 'date' },
        {
          field: 'owner',
          value: (row) => (row.owner as { id: number }).id,
          label: (value) => `Owner ${value}`,
        },
      ],
    )
    expect(result.groups).toHaveLength(1)
    expect(result.groups[0].value).not.toBe(date)
    expect(result.groups[0].children[0].label).toBe('Owner 2')
    date.setFullYear(2000)
    expect((result.groups[0].value as Date).getFullYear()).toBe(2026)
  })

  it('rejects duplicate fields and object-valued keys without a resolver', () => {
    expect(() => buildTableGroupModel(input, ['team', 'team'])).toThrow(
      'unique',
    )
    expect(() => buildTableGroupModel(input, [''])).toThrow('unique')
    expect(() =>
      buildTableGroupModel([flat({ value: {} }, 0)], ['value']),
    ).toThrow('value resolver')
  })

  it('supports aggregation without grouping, including a large flat array', () => {
    const rows = Array.from({ length: 150_000 }, (_, index) =>
      flat({ id: index }, index),
    )
    const result = buildTableGroupModel(
      rows,
      [],
      [{ key: 'count', method: 'count' }],
    )
    expect(result.groups).toEqual([])
    expect(result.rows).toHaveLength(rows.length)
    expect(result.rows[149_999]).toBe(rows[149_999])
    expect(result.summary.count).toBe(150_000)
  })
})

describe('Table remote group ranges', () => {
  it('accepts sparse group metadata and supplied server aggregates without fetching rows', () => {
    const result = resolveRemoteTableGroups(
      [
        {
          key: 'last',
          field: 'team',
          value: 'A',
          rowStart: 999_000_000,
          rowCount: 1_000_000,
          aggregates: { count: 1_000_000 },
          children: [
            {
              key: 'last-child',
              field: 'city',
              value: 'B',
              rowStart: 999_999_900,
              rowCount: 100,
            },
          ],
        },
      ],
      1_000_000_000,
    )
    expect(result[0].aggregates.count).toBe(1_000_000)
    expect(result[0].children[0].path).toEqual([
      { field: 'team', value: 'A' },
      { field: 'city', value: 'B' },
    ])
    const layout = createTableGroupLayout(result, 1_000_000_000, () => true, {
      subtotal: true,
    })
    expect(layout.count).toBe(1_000_000_004)
    expect(layout.segmentCount).toBeLessThan(10)
    expect(layout.rowIndexAt(999_999_999)).toBe(999_999_999)
  })

  it('uses absolute source offsets for remote pages', () => {
    const groups = resolveRemoteTableGroups(
      [{ key: 'p', field: 'team', value: 'A', rowStart: 105, rowCount: 5 }],
      10,
      100,
    )
    const layout = createTableGroupLayout(groups, 10, () => true, {
      rowOffset: 100,
    })
    expect(layout.itemAt(0)).toEqual({
      kind: 'data',
      rowIndex: 100,
      dataIndex: 0,
    })
    expect(layout.itemAt(5)?.kind).toBe('group')
    expect(layout.itemAt(6)).toEqual({
      kind: 'data',
      rowIndex: 105,
      dataIndex: 5,
    })
    expect(layout.dataIndexOf(109)).toBe(9)
  })

  it('rejects overlapping, out-of-parent, unordered and duplicate ranges', () => {
    const group = (
      key: string,
      rowStart: number,
      rowCount: number,
    ): TableRemoteGroup => ({
      key,
      rowStart,
      rowCount,
      field: 'team',
      value: key,
    })
    expect(() =>
      resolveRemoteTableGroups([group('a', 0, 5), group('b', 4, 2)], 10),
    ).toThrow('ordered')
    expect(() => resolveRemoteTableGroups([group('a', 8, 5)], 10)).toThrow(
      'inside',
    )
    expect(() => resolveRemoteTableGroups([group('a', -1, 5)], 10)).toThrow(
      'ordered',
    )
    expect(() => resolveRemoteTableGroups([group('a', 0, 1.5)], 10)).toThrow(
      'ordered',
    )
    expect(() =>
      resolveRemoteTableGroups([group('a', 0, 1), group('a', 1, 1)], 10),
    ).toThrow('unique')
    expect(() =>
      resolveRemoteTableGroups(
        [{ ...group('a', 0, 5), children: [group('b', 4, 2)] }],
        10,
      ),
    ).toThrow('inside')
    expect(() =>
      resolveRemoteTableGroups([], Number.MAX_SAFE_INTEGER, 1),
    ).toThrow('bounds')
  })

  it('rejects cycles and copies the aggregate record', () => {
    const group: TableRemoteGroup = {
      key: 'a',
      field: 'team',
      value: 'A',
      rowStart: 0,
      rowCount: 10,
    }
    group.children = [group]
    expect(() => resolveRemoteTableGroups([group], 10)).toThrow('acyclic')
    delete group.children
    const aggregates = { count: 10 }
    group.aggregates = aggregates
    const groups = resolveRemoteTableGroups([group], 10)
    aggregates.count = 0
    expect(groups[0].aggregates.count).toBe(10)
  })
})

describe('Table group display layout', () => {
  it('finds the next and previous visible data row across collapsed ranges', () => {
    const groups = resolveRemoteTableGroups(
      [
        {
          key: 'hidden',
          field: 'team',
          value: 'A',
          rowStart: 102,
          rowCount: 5,
        },
      ],
      10,
      100,
    )
    const layout = createTableGroupLayout(groups, 10, () => false, {
      rowOffset: 100,
    })
    expect(layout.dataIndexNear(104, 'forward')).toBe(2)
    expect(layout.rowIndexAt(2)).toBe(107)
    expect(layout.dataIndexNear(104, 'backward')).toBe(1)
    expect(layout.rowIndexAt(1)).toBe(101)
    expect(layout.dataIndexNear(99, 'forward')).toBe(0)
    expect(layout.dataIndexNear(99, 'backward')).toBeUndefined()
    expect(layout.dataIndexNear(110, 'forward')).toBeUndefined()
    expect(layout.dataIndexNear(110, 'backward')).toBe(4)
    expect(layout.dataIndexNear(Number.NaN, 'forward')).toBeUndefined()
  })
  it('separates group bands from data indices and hides collapsed descendants', () => {
    const result = model()
    const layout = createTableGroupLayout(
      result.groups,
      result.rows.length,
      (group) => group.value !== 'Design',
      { subtotal: true },
    )
    expect(layout.dataCount).toBe(1)
    expect(layout.count).toBe(6)
    expect(layout.itemAt(0)?.kind).toBe('group')
    expect(layout.itemAt(3)).toEqual({
      kind: 'data',
      rowIndex: 3,
      dataIndex: 0,
    })
    expect(layout.renderIndexAt(0)).toBe(3)
    expect(layout.rowIndexAt(0)).toBe(3)
    expect(layout.dataIndexOf(0)).toBeUndefined()
    expect(layout.dataIndexOf(3)).toBe(0)
    expect(result.summary.count).toBe(4)
  })

  it('allows a fully collapsed table and empty groups', () => {
    const groups = resolveRemoteTableGroups(
      [{ key: 'a', field: 'x', value: 1, rowStart: 0, rowCount: 0 }],
      0,
    )
    expect(
      createTableGroupLayout(groups, 0, () => true, { subtotal: true }).count,
    ).toBe(2)
    const layout = createTableGroupLayout(model().groups, 4, () => false)
    expect(layout.count).toBe(2)
    expect(layout.dataCount).toBe(0)
    expect(layout.rowIndexAt(0)).toBeUndefined()
  })

  it('matches an expanded reference stream under every group expansion combination', () => {
    const groups = model().groups
    const keys = groups.flatMap((group) => [
      group.key,
      ...group.children.map((child) => child.key),
    ])
    for (let mask = 0; mask < 2 ** keys.length; mask++) {
      const open = (group: TableGroupNode) =>
        Boolean(mask & (1 << keys.indexOf(group.key)))
      for (const subtotal of [false, true]) {
        const expected: TableGroupDisplayItem[] = []
        let dataIndex = 0
        const walk = (
          nodes: readonly TableGroupNode[],
          start: number,
          end: number,
        ) => {
          let cursor = start
          const rows = (stop: number) => {
            while (cursor < stop)
              expected.push({
                kind: 'data',
                rowIndex: cursor++,
                dataIndex: dataIndex++,
              })
          }
          for (const group of nodes) {
            rows(group.rowStart)
            expected.push({ kind: 'group', group, expanded: open(group) })
            if (open(group)) {
              walk(
                group.children,
                group.rowStart,
                group.rowStart + group.rowCount,
              )
              if (subtotal)
                expected.push({ kind: 'subtotal', group, expanded: true })
            }
            cursor = group.rowStart + group.rowCount
          }
          rows(end)
        }
        walk(groups, 0, 4)
        const layout = createTableGroupLayout(groups, 4, open, { subtotal })
        expect(layout.count).toBe(expected.length)
        expected.forEach((item, index) => {
          expect(layout.itemAt(index)).toEqual(item)
          if (item.kind === 'data') {
            expect(layout.renderIndexAt(item.dataIndex)).toBe(index)
            expect(layout.rowIndexAt(item.dataIndex)).toBe(item.rowIndex)
            expect(layout.dataIndexOf(item.rowIndex)).toBe(item.dataIndex)
          }
        })
        for (const index of [-1, 0.5, Number.NaN, Infinity, layout.count])
          expect(layout.itemAt(index)).toBeUndefined()
      }
    }
  })
})
