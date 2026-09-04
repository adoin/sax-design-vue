import { describe, expect, it, vi } from 'vitest'
import {
  aggregateTableRows,
  createTableAggregation,
} from '../src/composables/table-aggregation'
import type { TableAggregate, TableAggregateMethod } from '../src/table-group'

const definitions: TableAggregate[] = (
  ['count', 'sum', 'average', 'min', 'max'] as const
).map((method) => ({ key: method, field: 'metrics.amount', method }))

describe('Table streaming aggregates', () => {
  it('counts rows and aggregates finite numeric values without coercion', () => {
    const rows = [
      2,
      0,
      -5,
      '8',
      null,
      undefined,
      Number.NaN,
      Infinity,
      -Infinity,
    ].map((amount) => ({ metrics: { amount } }))
    expect(aggregateTableRows(rows, definitions)).toEqual({
      count: 9,
      sum: -3,
      average: -1,
      min: -5,
      max: 2,
    })
    expect(rows[3].metrics.amount).toBe('8')
  })

  it('defines empty results independently of the method', () => {
    expect(aggregateTableRows([], definitions)).toEqual({
      count: 0,
      sum: 0,
      average: null,
      min: null,
      max: null,
    })
  })

  it('retains small values amid cancelling large numbers', () => {
    expect(
      aggregateTableRows(
        [1e16, 1, -1e16].map((amount) => ({ metrics: { amount } })),
        definitions,
      ).sum,
    ).toBe(1)
  })

  it('returns null for numeric overflow rather than publishing NaN', () => {
    const result = aggregateTableRows(
      [Number.MAX_VALUE, Number.MAX_VALUE].map((amount) => ({
        metrics: { amount },
      })),
      definitions,
    )
    expect(result.sum).toBeNull()
    expect(result.average).toBeNull()
    expect(result.max).toBe(Number.MAX_VALUE)
  })

  it('streams custom accumulators with row context and independent instances', () => {
    const step = vi.fn(
      (
        state: unknown,
        cell: { row: Record<string, any>; rowIndex: number; value: unknown },
      ) => Number(state) + Number(cell.value) * cell.row.weight + cell.rowIndex,
    )
    const aggregate: TableAggregate = {
      key: 'weighted',
      field: 'amount',
      method: {
        initial: () => 0,
        step,
        finish: (state, count) => ({ value: state, count }),
      },
    }
    const a = createTableAggregation([aggregate])
    const b = createTableAggregation([aggregate])
    a.add({ amount: 3, weight: 2 }, 10)
    a.add({ amount: 4, weight: 3 }, 20)
    b.add({ amount: 5, weight: 1 }, 0)
    expect(a.result().weighted).toEqual({ value: 48, count: 2 })
    expect(b.result().weighted).toEqual({ value: 5, count: 1 })
    expect(step).toHaveBeenCalledTimes(3)
  })

  it('does not enumerate fields or retain a rows/values matrix', () => {
    let reads = 0
    function* source() {
      for (let index = 0; index < 1000; index++)
        yield new Proxy(
          {},
          {
            get: (_, key) => {
              if (key === 'amount') {
                reads++
                return index
              }
              return undefined
            },
            ownKeys: () => {
              throw new Error('Do not enumerate generated rows')
            },
          },
        )
    }
    expect(
      aggregateTableRows(source(), [
        { key: 'total', field: 'amount', method: 'sum' },
      ]).total,
    ).toBe(499500)
    expect(reads).toBe(1000)
  })

  it('does not read a field to count records and handles arbitrary output keys', () => {
    const row = Object.defineProperty({}, 'value', {
      get: () => {
        throw new Error('not needed')
      },
    })
    const result = aggregateTableRows(
      [row],
      [{ key: '__proto__', field: 'value', method: 'count' }],
    )
    expect(Object.getPrototypeOf(result)).toBeNull()
    expect(result.__proto__).toBe(1)
    expect(Object.isFrozen(result)).toBe(true)
  })

  it('rejects ambiguous or invalid definitions', () => {
    expect(() =>
      createTableAggregation([{ key: '', method: 'count' }]),
    ).toThrow('unique')
    expect(() =>
      createTableAggregation([
        { key: 'a', method: 'count' },
        { key: 'a', method: 'sum', field: 'a' },
      ]),
    ).toThrow('unique')
    expect(() =>
      createTableAggregation([
        { key: 'a', method: 'invalid' as TableAggregateMethod },
      ]),
    ).toThrow('Unknown')
    expect(() => createTableAggregation([{ key: 'a', method: 'sum' }])).toThrow(
      'requires a field',
    )
  })

  it('surfaces custom reducer errors without mutating row data', () => {
    const row = Object.freeze({ amount: 3 })
    expect(() =>
      aggregateTableRows(
        [row],
        [
          {
            key: 'a',
            method: {
              initial: () => 0,
              step: () => {
                throw new Error('Invalid aggregate')
              },
            },
          },
        ],
      ),
    ).toThrow('Invalid aggregate')
    expect(row.amount).toBe(3)
  })
})
