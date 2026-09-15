import { cloneDeep } from 'lodash-unified'
import { aggregateTableRows } from './composables/table-aggregation'
import type { TableAggregate } from './table-group'
import type { TableRow } from './table'

export type TableFooterScope = 'data' | 'filtered' | 'page'

export interface TableFooterRow<Row extends object = TableRow> {
  /** Fixed cells such as the row label, status or explanatory text. */
  values?: Readonly<TableRow>
  /** Aggregate key is the output column field; field reads the source value. */
  aggregates: readonly TableAggregate<Row>[]
}

export interface TableFooterConfig<Row extends object = TableRow> {
  enabled?: boolean
  /** data includes all supplied rows; filtered precedes pagination; page is current. */
  scope?: TableFooterScope
  rows?: readonly TableFooterRow<Row>[]
}

const unsafePath = new Set(['__proto__', 'prototype', 'constructor'])
const setFooterValue = (
  target: Record<string, unknown>,
  field: string,
  value: unknown,
) => {
  const path = field.split('.')
  if (!path.length || path.some((part) => !part || unsafePath.has(part)))
    throw new TypeError(`Invalid footer output field: ${field}`)
  let current = target
  path.forEach((part, index) => {
    if (index === path.length - 1) {
      current[part] = value
      return
    }
    const child = current[part]
    if (!child || typeof child !== 'object' || Array.isArray(child))
      current[part] = Object.create(null)
    current = current[part] as Record<string, unknown>
  })
}

export const buildTableFooterRows = <Row extends object>(
  rows: readonly Row[],
  config: TableFooterConfig<Row>,
): TableRow[] =>
  (config.rows ?? []).map((definition) => {
    const result = cloneDeep(definition.values ?? {}) as Record<string, unknown>
    const aggregates = aggregateTableRows(rows, definition.aggregates, {
      decimalStrings: true,
      resultType: 'string',
    })
    Object.entries(aggregates).forEach(([field, value]) =>
      setFooterValue(result, field, value),
    )
    return result
  })
