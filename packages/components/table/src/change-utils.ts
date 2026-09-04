import { cloneTableDataValue, equalTableDataValue } from './change-snapshot'
import { editableField } from './edit-utils'
import type { TableRow } from './table'
import type { TableDataFieldChange, TableDataFieldPatch } from './table-changes'

const objectLike = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object'

export function readTableDataField(row: unknown, field: string) {
  let value: unknown = row
  for (const part of field.split('.')) {
    if (!objectLike(value)) return { exists: false, value: undefined }
    // Getter-only generated rows can expose fields without own properties.
    const next: unknown = value[part]
    if (!(part in value) && next === undefined)
      return { exists: false, value: undefined }
    value = next
  }
  return { exists: true, value }
}

/** Track replaced/missing containers too, so a revert restores their shape. */
export function tableTrackingPath(row: TableRow, field: string): string {
  if (!editableField(field)) throw new TypeError('Invalid table field path')
  const parts = field.split('.')
  let value: unknown = row
  for (let index = 0; index < parts.length; index++) {
    if (!objectLike(value)) return parts.slice(0, index).join('.') || field
    const part = parts[index]
    if (
      Array.isArray(value) &&
      (part === 'length' ||
        (/^(0|[1-9]\d*)$/.test(part) &&
          Number(part) < 4_294_967_295 &&
          Number(part) >= value.length))
    )
      return parts.slice(0, index).join('.') || field
    const next: unknown = value[part]
    if (!(part in value) && next === undefined)
      return parts.slice(0, index + 1).join('.')
    value = next
  }
  return field
}

/** Immutable path updates for ordinary rows; generated sources can apply patches directly. */
export function applyTableDataPatches<Row extends TableRow>(
  row: Row,
  patches: TableDataFieldPatch[],
): Row {
  if (!patches.length) return row
  const result = { ...row }
  for (const { field, value, exists } of patches) {
    if (!editableField(field)) throw new TypeError('Invalid table field path')
    const parts = field.split('.')
    let target: Record<string, unknown> = result
    for (const part of parts.slice(0, -1)) {
      const current = target[part]
      const next = Array.isArray(current)
        ? current.slice()
        : objectLike(current)
          ? { ...current }
          : {}
      target[part] = next
      target = next as Record<string, unknown>
    }
    const last = parts[parts.length - 1]
    if (exists) target[last] = cloneTableDataValue(value)
    else Reflect.deleteProperty(target, last)
  }
  return result
}

/** Generated rows expose untouched values lazily instead of spreading all fields. */
export function projectTableDataPatches<Row extends TableRow>(
  row: Row,
  patches: TableDataFieldPatch[],
): Row {
  const values = new Map<string, { value: unknown; exists: boolean }>()
  for (const patch of patches) {
    if (!editableField(patch.field))
      throw new TypeError('Invalid table field path')
    const [root, ...path] = patch.field.split('.')
    if (!path.length)
      values.set(root, {
        value: cloneTableDataValue(patch.value),
        exists: patch.exists,
      })
    else {
      const previous = values.get(root) ?? readTableDataField(row, root)
      const next = applyTableDataPatches({ value: previous.value }, [
        { ...patch, field: `value.${path.join('.')}` },
      ])
      values.set(root, { value: next.value, exists: true })
    }
  }
  // A separate empty target also supports frozen/generated consumer records.
  return new Proxy({} as Row, {
    get: (_, key) =>
      typeof key === 'string' && values.has(key)
        ? values.get(key)!.value
        : Reflect.get(row, key),
    has: (_, key) =>
      typeof key === 'string' && values.has(key)
        ? values.get(key)!.exists
        : key in row,
  })
}

const coveredBy = (field: string, parent: string) =>
  field === parent || field.startsWith(`${parent}.`)

/** Reconstruct only the requested original field, never a whole row matrix. */
const originalField = (
  row: TableRow,
  field: string,
  previous: TableDataFieldChange[],
) => {
  const ancestor = previous.find((change) => coveredBy(field, change.field))
  if (ancestor) {
    if (ancestor.field === field)
      return { exists: ancestor.oldExists, value: ancestor.oldValue }
    return ancestor.oldExists
      ? readTableDataField(
          ancestor.oldValue,
          field.slice(ancestor.field.length + 1),
        )
      : { exists: false, value: undefined }
  }
  const original = readTableDataField(row, field)
  const children = previous.filter((change) => coveredBy(change.field, field))
  if (!children.length) return original
  const wrapped = applyTableDataPatches(
    { value: original.value },
    children.map((change) => ({
      field: `value.${change.field.slice(field.length + 1)}`,
      exists: change.oldExists,
      value: change.oldValue,
    })),
  )
  return { exists: original.exists, value: wrapped.value }
}

export function mergeTableDataChanges(
  before: TableRow,
  after: TableRow,
  fields: string[],
  previous: TableDataFieldChange[],
): TableDataFieldChange[] {
  const candidates = new Set([
    ...previous.map((change) => change.field),
    ...fields.map((field) => tableTrackingPath(before, field)),
  ])
  const paths = [...candidates].filter(
    (field) =>
      ![...candidates].some(
        (parent) => parent !== field && coveredBy(field, parent),
      ),
  )
  const result: TableDataFieldChange[] = []
  for (const field of paths) {
    const original = originalField(before, field, previous)
    const current = readTableDataField(after, field)
    if (
      original.exists === current.exists &&
      equalTableDataValue(original.value, current.value)
    )
      continue
    result.push({
      field,
      oldExists: original.exists,
      oldValue: cloneTableDataValue(original.value),
      exists: current.exists,
      value: cloneTableDataValue(current.value),
    })
  }
  return result
}
