import { get } from 'lodash-unified'
import type {
  TableAggregate,
  TableAggregateCell,
  TableAggregateMethod,
} from '../table-group'
import type { TableRow } from '../table'

interface NumericState {
  count: number
  sum: number
  correction: number
  min: number
  max: number
}

const methods = new Set<TableAggregateMethod>([
  'count',
  'sum',
  'average',
  'min',
  'max',
])

/** Finite numbers only: missing values, numeric strings and infinities are not coerced. */
export function createTableAggregation<Row extends TableRow>(
  definitions: readonly TableAggregate<Row>[],
) {
  const keys = new Set<string>()
  const reducers = definitions.map((definition) => {
    if (!definition.key || keys.has(definition.key))
      throw new TypeError('Aggregate keys must be nonempty and unique')
    keys.add(definition.key)
    const { method, field, key } = definition
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
      sum: 0,
      correction: 0,
      min: Infinity,
      max: -Infinity,
    }
    return {
      key,
      add(row: Row) {
        if (method === 'count') return
        const value = field == null ? undefined : get(row, field)
        if (typeof value !== 'number' || !Number.isFinite(value)) return
        state.count++
        // Neumaier summation limits cancellation error without retaining values.
        const next = state.sum + value
        state.correction +=
          Math.abs(state.sum) >= Math.abs(value)
            ? state.sum - next + value
            : value - next + state.sum
        state.sum = next
        state.min = Math.min(state.min, value)
        state.max = Math.max(state.max, value)
      },
      result(count: number) {
        if (method === 'count') return count
        if (method === 'min') return state.count ? state.min : null
        if (method === 'max') return state.count ? state.max : null
        const sum = state.sum + state.correction
        if (!Number.isFinite(sum)) return null
        if (method === 'average') return state.count ? sum / state.count : null
        return sum
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

export function aggregateTableRows<Row extends TableRow>(
  rows: Iterable<Row>,
  definitions: readonly TableAggregate<Row>[],
): Readonly<Record<string, unknown>> {
  const aggregate = createTableAggregation(definitions)
  let index = 0
  for (const row of rows) aggregate.add(row, index++)
  return aggregate.result()
}
