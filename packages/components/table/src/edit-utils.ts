import { cloneDeep } from 'lodash-unified'
import type { TableRow } from './table'
import type { TableEditChange } from './table-edit'

export const editableField = (field?: string): field is string =>
  Boolean(
    field &&
    field
      .split('.')
      .every(
        (key) =>
          key && !['__proto__', 'prototype', 'constructor'].includes(key),
      ),
  )

/** Copy only changed paths; untouched branches and the consumer record stay intact. */
export function applyTableEditChanges<Row extends TableRow>(
  row: Row,
  changes: TableEditChange[],
): Row {
  const result = { ...row }
  for (const { field, value } of changes) {
    if (!editableField(field)) continue
    const path = field.split('.')
    let target: Record<string, unknown> = result
    for (const key of path.slice(0, -1)) {
      const current = target[key]
      const next = Array.isArray(current)
        ? [...current]
        : current && typeof current === 'object'
          ? { ...current }
          : {}
      target[key] = next
      target = next as Record<string, unknown>
    }
    target[path[path.length - 1]] = cloneDeep(value)
  }
  return result
}
