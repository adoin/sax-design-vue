import { get } from 'lodash-unified'
import Decimal from 'decimal.js'
import type {
  TableAggregate,
  TableAggregateCell,
  TableAggregateMethod,
} from '../table-group'

interface NumericState {
  count: number
  sum: Decimal
  min?: Decimal
  max?: Decimal
}

export interface TableAggregationOptions {
  /** Accept exact decimal strings in addition to finite numbers. */
  decimalStrings?: boolean
  /** String preserves the exact decimal result; number preserves legacy APIs. */
  resultType?: 'number' | 'string'
}

const methods = new Set<TableAggregateMethod>([
  'count',
  'sum',
  'average',
  'min',
  'max',
])

/** Finite numbers only: missing values, numeric strings and infinities are not coerced. */
export function createTableAggregation<Row extends object>(
  definitions: readonly TableAggregate<Row>[],
  options: TableAggregationOptions = {},
) {
  const keys = new Set<string>()
  const reducers = definitions.map((definition) => {
    if (!definition.key || keys.has(definition.key))
      throw new TypeError('Aggregate keys must be nonempty and unique')
    keys.add(definition.key)
    const { method, field, key } = definition
    if (typeof method === 'function') {
      const cells: TableAggregateCell<Row>[] = []
      return {
        key,
        add(row: Row, rowIndex: number) {
          cells.push({
            row,
            rowIndex,
            value: field == null ? undefined : get(row, field),
          })
        },
        result: () => method(cells),
      }
    }
    if (typeof method === 'object') {
      if (
        !method ||
        typeof method.initial !== 'function' ||
        typeof method.step !== 'function'
      )
        throw new TypeError(`Invalid aggregate reducer: ${key}`)
      let state = method.initial()
      return {
        key,
        add(row: Row, rowIndex: number) {
          const cell: TableAggregateCell<Row> = {
            row,
            rowIndex,
            value: field == null ? undefined : get(row, field),
          }
          state = method.step(state, cell)
        },
        result: (count: number) =>
          method.finish ? method.finish(state, count) : state,
      }
    }
    if (!methods.has(method))
      throw new TypeError(`Unknown aggregate method: ${String(method)}`)
    if (method !== 'count' && !field)
      throw new TypeError(`A numeric aggregate requires a field: ${key}`)
    const state: NumericState = {
      count: 0,
      sum: new Decimal(0),
    }
    const decimalValue = (value: unknown) => {
      if (typeof value === 'number' && !Number.isFinite(value)) return
      if (
        typeof value !== 'number' &&
        !(options.decimalStrings && typeof value === 'string' && value.trim())
      )
        return
      try {
        const decimal = new Decimal(value as Decimal.Value)
        return decimal.isFinite() ? decimal : undefined
      } catch {
        return
      }
    }
    const output = (value: Decimal) => {
      if (options.resultType === 'string') return value.toString()
      const number = value.toNumber()
      return Number.isFinite(number) ? number : null
    }
    return {
      key,
      add(row: Row) {
        if (method === 'count') return
        const value = field == null ? undefined : get(row, field)
        const decimal = decimalValue(value)
        if (!decimal) return
        state.count++
        state.sum = state.sum.plus(decimal)
        if (!state.min || decimal.lessThan(state.min)) state.min = decimal
        if (!state.max || decimal.greaterThan(state.max)) state.max = decimal
      },
      result(count: number) {
        if (method === 'count') return count
        if (method === 'min') return state.min ? output(state.min) : null
        if (method === 'max') return state.max ? output(state.max) : null
        if (method === 'average')
          return state.count ? output(state.sum.dividedBy(state.count)) : null
        return output(state.sum)
      },
    }
  })
  let count = 0
  return {
    add(row: Row, rowIndex: number) {
      for (const reducer of reducers) reducer.add(row, rowIndex)
      count++
    },
    result(): Readonly<Record<string, unknown>> {
      const result: Record<string, unknown> = Object.create(null)
      for (const reducer of reducers)
        result[reducer.key] = reducer.result(count)
      return Object.freeze(result)
    },
    get count() {
      return count
    },
  }
}

export function aggregateTableRows<Row extends object>(
  rows: Iterable<Row>,
  definitions: readonly TableAggregate<Row>[],
  options?: TableAggregationOptions,
): Readonly<Record<string, unknown>> {
  const aggregate = createTableAggregation(definitions, options)
  let index = 0
  for (const row of rows) aggregate.add(row, index++)
  return aggregate.result()
}
