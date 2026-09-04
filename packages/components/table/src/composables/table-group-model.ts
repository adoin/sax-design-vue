import { get } from 'lodash-unified'
import { createTableAggregation } from './table-aggregation'
import type { TableFlatRow, TableRow } from '../table'
import type {
  TableAggregate,
  TableGroupField,
  TableGroupNode,
  TableGroupPathEntry,
  TableGroupValue,
  TableRemoteGroup,
} from '../table-group'

export const tableGroupValueKey = (value: unknown): string => {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (value instanceof Date) return `date:${value.getTime()}`
  if (typeof value === 'string') return `string:${value}`
  if (typeof value === 'number') return `number:${value}`
  if (typeof value === 'boolean') return `boolean:${value}`
  if (typeof value === 'bigint') return `bigint:${value}`
  throw new TypeError(
    'Group values must be primitive values or dates; provide a value resolver for objects',
  )
}

const copyValue = (value: TableGroupValue): TableGroupValue =>
  value instanceof Date ? new Date(value.getTime()) : value
const labelFor = (value: TableGroupValue) =>
  value == null
    ? ''
    : value instanceof Date
      ? Number.isNaN(value.getTime())
        ? ''
        : value.toISOString()
      : String(value)

interface Draft<Row extends TableRow> {
  field: TableGroupField<Row>
  value: TableGroupValue
  children: Map<string, Draft<Row>>
  members: TableFlatRow<Row>[]
  aggregate: ReturnType<typeof createTableAggregation<Row>>
}

/** Group root branches without mutating rows, separating parent/child rows, or storing member arrays per ancestor. */
export function buildTableGroupModel<Row extends TableRow>(
  input: readonly TableFlatRow<Row>[],
  fields: readonly (string | TableGroupField<Row>)[],
  aggregates: readonly TableAggregate<Row>[] = [],
) {
  const normalized = fields.map((field) =>
    typeof field === 'string' ? { field } : field,
  )
  if (
    normalized.some((field) => !field.field) ||
    new Set(normalized.map((field) => field.field)).size !== normalized.length
  )
    throw new TypeError('Group fields must be nonempty and unique')
  const roots = new Map<string, Draft<Row>>()
  const summary = createTableAggregation(aggregates)
  for (let start = 0; start < input.length;) {
    let end = start + 1
    while (end < input.length && input[end].depth > input[start].depth) end++
    const first = input[start]
    let children = roots
    const ancestors: Draft<Row>[] = []
    for (const field of normalized) {
      const value = field.value
        ? field.value(first.row, first.index)
        : get(first.row, field.field)
      const key = tableGroupValueKey(value)
      let node = children.get(key)
      if (!node) {
        node = {
          field,
          value: copyValue(value as TableGroupValue),
          children: new Map(),
          members: [],
          aggregate: createTableAggregation(aggregates),
        }
        children.set(key, node)
      }
      ancestors.push(node)
      children = node.children
    }
    for (let index = start; index < end; index++) {
      const flat = input[index]
      summary.add(flat.row, flat.index)
      for (const node of ancestors) node.aggregate.add(flat.row, flat.index)
      ancestors[ancestors.length - 1]?.members.push(flat)
    }
    start = end
  }
  const rows: TableFlatRow<Row>[] = []
  const finish = (
    drafts: Map<string, Draft<Row>>,
    path: readonly TableGroupPathEntry[],
    keyPath: readonly string[],
  ): readonly TableGroupNode[] =>
    Object.freeze(
      [...drafts].map(([valueKey, draft]) => {
        const nextPath = Object.freeze([
          ...path,
          Object.freeze({ field: draft.field.field, value: draft.value }),
        ])
        const nextKeyPath = [...keyPath, draft.field.field, valueKey]
        const rowStart = rows.length
        const children = finish(draft.children, nextPath, nextKeyPath)
        for (const row of draft.members) rows.push(row)
        return Object.freeze({
          key: JSON.stringify(nextKeyPath),
          field: draft.field.field,
          value: draft.value,
          label: draft.field.label?.(draft.value) ?? labelFor(draft.value),
          depth: path.length,
          path: nextPath,
          rowStart,
          rowCount: rows.length - rowStart,
          aggregates: draft.aggregate.result(),
          children,
        })
      }),
    )
  const groups = finish(roots, [], [])
  if (!normalized.length) for (const row of input) rows.push(row)
  return { rows: Object.freeze(rows), groups, summary: summary.result() }
}

/** Validate remote range metadata without reading or enumerating any source rows. */
export function resolveRemoteTableGroups(
  input: readonly TableRemoteGroup[],
  rowCount: number,
  rowOffset = 0,
): readonly TableGroupNode[] {
  if (
    !Number.isSafeInteger(rowOffset) ||
    rowOffset < 0 ||
    !Number.isSafeInteger(rowCount) ||
    rowCount < 0 ||
    !Number.isSafeInteger(rowOffset + rowCount)
  )
    throw new RangeError('Invalid remote grouping bounds')
  const keys = new Set<string>()
  const seen = new Set<TableRemoteGroup>()
  const walk = (
    groups: readonly TableRemoteGroup[],
    start: number,
    end: number,
    path: readonly TableGroupPathEntry[],
  ): readonly TableGroupNode[] => {
    let previousEnd = start
    return Object.freeze(
      groups.map((group) => {
        if (seen.has(group))
          throw new TypeError('Remote groups must form an acyclic tree')
        seen.add(group)
        if (!group.key || keys.has(group.key))
          throw new TypeError('Remote group keys must be nonempty and unique')
        keys.add(group.key)
        const stop = group.rowStart + group.rowCount
        if (
          !Number.isSafeInteger(group.rowStart) ||
          !Number.isSafeInteger(group.rowCount) ||
          group.rowCount < 0 ||
          !Number.isSafeInteger(stop) ||
          group.rowStart < previousEnd ||
          stop > end
        )
          throw new RangeError(
            'Remote group ranges must be ordered, disjoint and inside their parent',
          )
        previousEnd = stop
        tableGroupValueKey(group.value)
        const value = copyValue(group.value)
        const nextPath = Object.freeze([
          ...path,
          Object.freeze({ field: group.field, value }),
        ])
        return Object.freeze({
          key: group.key,
          field: group.field,
          value,
          label: group.label ?? labelFor(value),
          depth: path.length,
          path: nextPath,
          rowStart: group.rowStart,
          rowCount: group.rowCount,
          aggregates: Object.freeze(
            Object.assign(Object.create(null), group.aggregates),
          ),
          children: walk(group.children ?? [], group.rowStart, stop, nextPath),
        })
      }),
    )
  }
  return walk(input, rowOffset, rowOffset + rowCount, [])
}
